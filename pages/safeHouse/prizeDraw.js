var app = getApp()
const api = require('../../js/api.js')
const util = require('../../utils/util.js')

Page({
  //奖品配置
  awardsConfig: {
    chance: true,
    awards: []
  },
  /**
   * 页面的初始数据
   */
  data: {
    isiOSApp: false,
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    userMoney: 0, // 自已的娇币
    planid: null, // 抽奖者
    cost: 0, //抽奖费用----修改为下次抽奖费用，费用为每次查询时返回  
    img: {
      smile: '../../images/prizedraw/smile.png',
      qk: '../../images/prizedraw/qk.png',
      man: '../../images/prizedraw/prize.png',
      woman: '../../images/prizedraw/man.png'
    },
    remarks: null, // 规则
    showRule: false,
    showErr: false,
    message: [],
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    vertical: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "" //页面标题为路由参数
    })

    const _this = this;
    let info = wx.getStorageSync("userInfo");
    _this.setData({
      userInfo: info,
      userMoney: info.userMoney
    })
    _this.recordAllList();
    _this.drawAwardRoundel();
  },
  //画抽奖圆盘
  drawAwardRoundel: function() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/prize/prePrize', {}, (res) => {
      let data = res.data;
      if (data) {
        let list = data.items.map((v, index) => {
          let icon;
          if ((v.type == 0 || v.type == 3) && _this.data.userInfo.sex == 1) {
            icon = this.data.img.man
          } else if ((v.type == 0 || v.type == 3) && _this.data.userInfo.sex == 2) {
            icon = this.data.img.woman
          }
          return {
            name: v.type == 1 ? v.objId + "乾坤币" : v.objId,
            index: index,
            id: v.id,
            icon: v.type == 0 ? icon : v.type == 3 ? icon : v.type == 1 ? this.data.img.qk : v.type == 99 ? this.data.img.smile : util.getFullPath(v.icon, 120)
          };
        })
        this.awardsConfig.awards = list;
        var awards = this.awardsConfig.awards;
        var awardsList = [];
        var turnNum = 1 / awards.length; // 文字旋转 turn 值

        // 奖项列表
        for (var i = 0; i < awards.length; i++) {
          awardsList.push({
            turn: i * turnNum + 'turn',
            lineTurn: i * turnNum + turnNum / 2 + 'turn',
            award: awards[i].name,
            icon: awards[i].icon
          });
        }

        this.setData({
          planid: data.id,
          cost: data.nextCost,
          remarks: data.remarks,
          btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
          awardsList: awardsList
        });
      }
    });
  },
  //发起抽奖
  playReward: function() {
    const _this = this;
    try {
      app.appRequest('POST', 'json', '/api/prize/prizeNew', {
        id: _this.data.planid
      }, (res) => {
        if (res.data) { 
          // 中奖index
          // 0是被子、1是谢谢、2是120乾坤币、3是10乾坤币、4是谢谢、5是20乾坤币、6是10乾坤币、7是60乾坤币、8是谢谢、9是240乾坤币
          // 0-2的概率为15%，3-6概率为75%，7-9概率为20%
          var awardIndex = 1;
          var random = Math.ceil(Math.random() * 100); //概率  
          if (random < 15) {
            awardIndex = Math.floor(Math.random() * (2 - 0) + 0)    //取7-9个数里面的值
          } else if (5 < random < 80) {
            awardIndex = Math.ceil(Math.random() * (6 - 3) + 3)    //取3-6个数里面的值
          } else if (80 < random < 100) {
            awardIndex = Math.floor(Math.random() * (9 - 7) + 7)    //取7-9个数里面的值
          }
          var runNum = 8; //旋转8周
          var duration = 4000; //时长

          // 旋转角度
          _this.runDeg = _this.runDeg || 0;
          var awardsConfig = _this.awardsConfig;
          _this.runDeg = _this.runDeg - 18 + (360 - _this.runDeg % 360) + (360 * runNum - awardIndex * (360 / awardsConfig.awards.length))
          //创建动画
          var animationRun = wx.createAnimation({
            duration: duration,
            timingFunction: 'ease'
          })
          animationRun.rotate(_this.runDeg).step();
          _this.setData({
            animationData: animationRun.export(),
            btnDisabled: 'disabled'
          });
          // 个人信息 
          var info = wx.getStorageSync("userInfo");
          app.appRequest('GET', 'json', '/api/user/profile', {
            userId: info.id
          }, (res) => {
            _this.setData({
              userMoney: res.data.userMoney
            })
          });

          // 中奖提示
          setTimeout(function() {
            if (awardsConfig.awards[awardIndex].name == "谢谢") {
              wx.showModal({
                content: awardsConfig.awards[awardIndex].name,
                showCancel: false
              });
            } else {
              wx.showModal({
                title: '恭喜',
                content: '恭喜获得' + (awardsConfig.awards[awardIndex].name),
                showCancel: false
              });
            }
            _this.setData({
              btnDisabled: ''
            });
          }.bind(_this), duration);
        } else {
          if (res.status == 230002) {
            wx: wx.showToast({
              title: res.message,
              image: '../../images/warn-icon.png',
            })
          }
          if (res.status == 110029) {
            _this.setData({
              showErr: true
            });
          } 
        }
      })

    } catch (e) {
      if (e.status == 110029) {
        _this.setData({
          showErr: true
        });
      }
    }
  },
  closeModal() {
    this.setData({
      showRule: false
    })
  },
  showRule() {
    this.setData({
      showRule: !this.data.showRule
    })
  },
  recordAllList() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/prize/recordAllList', {}, (res) => {
      if (res.list) {
        _this.setData({
          message: res.list
        })
      }
    })
  }
})
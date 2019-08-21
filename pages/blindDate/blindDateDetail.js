var app = getApp();
const util = require('../../utils/util.js')
const api = require('../../js/api.js')
const wxparse = require('../../utils/wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    userInfo: null,
    specialType: null, //专场类型
    arrImg: [],
    blindDateSingle: {},
    showPayWin: false,
    showPay: false,
    lineType: {
      "1": "线上",
      "2": "线下"
    },
    showMb: false,
    isManage: false,
    isAdmin: false,
    isLogin: false, //是否已经登录
    canEnroll: false, //是否能报名
    showShare: false, //分享弹出层
    shareTitle: '',
    shareDesc: '',
    shareImg: '',
    shareUrl: '',
    manCount: -1, //男性人数
    channel: { //报名费
      money: 0,
    },
    enrollPepple: {}, //报名人数
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "相亲详情" //页面标题为路由参数
    })
    const _this = this;
    _this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      id: options.id,
      isLogin: options.id ? true : false
    })
    _this.getManCount();
    _this.getSpecialType();
    _this.loadData();
  },
  getSpecialType() {
    const _this = this;
    try {
      //获取专场类型字典
      app.appRequest('GET', 'json', '/api/apiDict', {
        type: "blind_dating_special_type"
      }, (res) => {
        var item = res.data;
        if (item) {
          for (let i = item.length; i--;) {
            if (!_this.data.specialType) {
              _this.data.specialType = {};
            }
            _this.data.specialType[item[i].value] = item[i].label;
          }
        }
        _this.setData({
          specialType: _this.data.specialType
        });
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  },
  getManCount() { //活动男的数量
    const _this = this;
    app.appRequest('GET', 'json', '/api/blindDating/getDatingCandidateList', {
      datingId: _this.data.id,
      candidateSex: 2,
      page: 1,
      rows: 1,
    }, (res) => {
      _this.setData({
        manCount: res.count
      });
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  loadData: function() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/blindDating/getSingle', {
      datingDetailsId: _this.data.id,
      isUnion: app.globalData.channel.isUnion && app.globalData.channel.jyNumber ? app.globalData.channel.jyNumber : app.globalData.channel.isUnion,
    }, (res) => {
      if (res.data) {
        if (_this.data.userInfo.dataPerfect != 1 && _this.data.userInfo.identity != 1) {
          _this.data.showMb = true;
        } 
        res.data.datingDetailsExt.extString = util.getFullPath(res.data.datingDetailsExt.extString, 120);
        if (res.data.candidateList) {
          for (var i = 0; i < res.data.candidateList.length; i++) {
            res.data.candidateList[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(res.data.candidateList[i].jiaoyouUser.headimgAttachmentId, 240);
          }
        }
        res.data.enrollFee = api.Fn.toFixed(res.data.enrollFee);
        res.data.datingDetailsExt.extDatetime = res.data.datingDetailsExt.extDatetime.substring(0, 10);
        res.data.datingDetailsExt.extDatetime2 = res.data.datingDetailsExt.extDatetime2.substring(0, 10);
        if (res.data.hostPartyList) {
          for (var i = 0; i < res.data.hostPartyList.length; i++) {
            res.data.hostPartyList[i].company.logoUrl = util.getFullPath(res.data.hostPartyList[i].company.logoUrl, 120)
          }
        }
        if (res.data.assistingPartyList) {
          for (var i = 0; i < res.data.assistingPartyList.length; i++) {
            res.data.assistingPartyList[i].company.logoUrl = util.getFullPath(res.data.assistingPartyList[i].company.logoUrl, 120)
          }
        }

        _this.setData({
          blindDateSingle: res.data
        })

        //报名费用统计
        let channelInfo = {};
        if (_this.data.blindDateSingle.datingDetailsExt && _this.data.blindDateSingle.datingDetailsExt.extString6) { //有渠道信息
          let channel = null,
            channelObj = {};
          try {
            let d = _this.data.blindDateSingle.datingDetailsExt.extString6.replace(/(?:\s*['"]*)?([a-zA-Z0-9]+)(?:['"]*\s*)?:/g, '"$1":');
            channelObj = JSON.parse(d || {});
            channel = channelObj[_this.data.blindDateSingle.isUnionCorrect]; //用合伙人专属渠道
          } catch (e) {
            console.log("渠道格式错误:" + JSON.stringify(e));
          }

          function getChannel(ch, flag) {
            if (ch) { //有合伙人专属渠道
              if (_this.data.userInfo.sex == 1 && ch.girlFee != undefined) { //女
                channelInfo.money = ch.girlFee;
              } else if (_this.data.userInfo.sex == 2 && ch.boyFee != undefined) { //男
                channelInfo.money = ch.boyFee;
              } else if (ch.fee != undefined) {
                channelInfo.money = ch.fee;
              } else if (!app.globalData.isLogin) {
                channelInfo.money = ch.girlFee != undefined ? ch.girlFee : ch.boyFee
              }
              channelInfo.name = ch.name;
            }
            if (channelInfo.money == undefined) {
              if (flag == 0 && _this.data.blindDateSingle.isUnionCorrect) {
                getChannel(channelObj["a9fyas8f"], 1); //合伙人共享渠道
              } else if (flag != 2) {
                getChannel(channelObj["a9fDfoS"], 2); //默认渠道
              } else {
                channelInfo.money = _this.data.blindDateSingle.enrollFee;
              }
            }
          };
          getChannel(channel, 0);
        } else {
          channelInfo.money = _this.data.blindDateSingle.enrollFee;
        }
        channelInfo.name = _this.data.blindDateSingle.isUnionCorrectName || channelInfo.name || '';
        _this.data.channel = channelInfo;
        if (app.globalData.channel.isUnion && channelInfo.name) {
          let changeStore = {
            name: 'channel',
            value: {
              isUnion: app.globalData.channel.isUnion,
              jyNumber: app.globalData.channel.jyNumber,
              name: channelInfo.name
            }
          }
          app.globalData.CHANGESTORE = changeStor;
        }
        //报名人数统计
        let enrollPepple = {};
        if (_this.data.blindDateSingle.datingDetailsExt) {
          if (_this.data.blindDateSingle.datingDetailsExt.extInt8 != undefined && _this.data.blindDateSingle.datingDetailsExt.extInt9 != undefined) { //限制男/女
            enrollPepple = {
              maxBoy: _this.data.blindDateSingle.datingDetailsExt.extInt8,
              maxGirl: _this.data.blindDateSingle.datingDetailsExt.extInt9,
              boy: 0,
              girl: 0
            }
            if (_this.data.manCount != -1) {
              enrollPepple = {
                maxBoy: _this.data.blindDateSingle.datingDetailsExt.extInt8,
                maxGirl: _this.data.blindDateSingle.datingDetailsExt.extInt9,
                boy: _this.data.manCount,
                girl: _this.data.blindDateSingle.enrollCount - _this.data.manCount,
              }
            }
          } else if (_this.data.blindDateSingle.datingDetailsExt.extInt8 != undefined) { //限制男
            enrollPepple = {
              maxBoy: _this.data.blindDateSingle.datingDetailsExt.extInt8,
              maxGirl: _this.data.blindDateSingle.datingDetailsExt.extInt4,
              boy: 0,
              girl: 0
            }
            if (_this.data.manCount != -1) {
              let girlNum = _this.data.blindDateSingle.enrollCount - _this.data.manCount; //女生已报名人数
              let canBoyNum = _this.data.blindDateSingle.datingDetailsExt.extInt4 - girlNum; //男生最大可报名人数
              let maxBoy = Math.min(_this.data.blindDateSingle.datingDetailsExt.extInt8, canBoyNum); //男生实际可报名人数
              let maxGirl = _this.data.blindDateSingle.datingDetailsExt.extInt4 - _this.data.manCount; //女生实际可报名人数
              enrollPepple = {
                maxBoy: maxBoy,
                maxGirl: maxGirl,
                boy: _this.data.manCount,
                girl: _this.data.blindDateSingle.enrollCount - _this.data.manCount,
              }
            }
          } else if (_this.data.blindDateSingle.datingDetailsExt.extInt9 != undefined) { //限制女
            enrollPepple = {
              maxBoy: _this.data.blindDateSingle.datingDetailsExt.extInt4,
              maxGirl: _this.data.blindDateSingle.datingDetailsExt.extInt9,
              boy: 0,
              girl: 0
            }
            if (_this.data.manCount != -1) {
              let girlNum = _this.data.blindDateSingle.enrollCount - _this.data.manCount; //女生已报名人数
              let canGirlNum = _this.data.blindDateSingle.datingDetailsExt.extInt4 - _this.data.manCount; //女生最大可报名人数
              let maxGirl = Math.min(_this.data.blindDateSingle.datingDetailsExt.extInt9, canGirlNum); //女生实际可报名人数
              let maxBoy = _this.data.blindDateSingle.datingDetailsExt.extInt4 - _this.data.girlNum; //男生实际可报名人数
              enrollPepple = {
                maxBoy: maxBoy,
                maxGirl: maxGirl,
                boy: _this.data.manCount,
                girl: _this.data.blindDateSingle.enrollCount - _this.data.manCount,
              }
            }
          } else { //都不限
            enrollPepple = {
              boy: _this.data.manCount,
              girl: _this.data.blindDateSingle.enrollCount - _this.data.manCount,
            }
          }
        }
        _this.setData({
          enrollPepple: enrollPepple
        })

        if (_this.data.blindDateSingle.isStartEnroll == 1 && _this.data.blindDateSingle.isStopEnroll == 0) {
          _this.setData({
            canEnroll: true
          })
          //是否能报名
        }
        if (_this.data.isLogin) { //是否主持人登录
          _this.data.isManage = _this.data.blindDateSingle.jiaoyouUser.id == _this.data.userInfo.id ? true : false;
          if (_this.data.blindDateSingle.adminList && _this.data.blindDateSingle.adminList.length > 0) {
            let isAdmin = _this.data.blindDateSingle.adminList.filter((val) => {
              return val.userId == _this.data.userInfo.id;
            });
            if (isAdmin.length > 0) {
              _this.setData({
                isAdmin: true
              })
            }
          }
        }
        _this.contentCpt();
        _this.activityProcessHtml();
        _this.tipsHtml();
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  contentCpt: function() {
    const _this = this;
    // 获取导航信息
    if (_this.data.blindDateSingle.datingDetailsExt) {
      let content = _this.data.blindDateSingle.datingDetailsExt.extString2;
      const imgReg = /<img.*?(?:>|\/>)/gi;
      const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      const arr = _this.data.blindDateSingle.datingDetailsExt.extString2.match(imgReg);
      if (arr) {
        let arrImg = [];
        arr.forEach((v, i) => {
          let match = v.match(srcReg);
          const src = match && match[1];
          arrImg.push({
            id: i,
            src
          });
          let reg = new RegExp('<img src=\"' + src + '\"', 'g');
          content = content.replace(reg, '<img data-id="' + i + '" src="' + util.getFullPath(src) + '"');
        });
        _this.data.arrImg = arrImg;
      }
      wxparse.wxParse('contentCpt', 'html', content, _this, 5); // 实例化对象 
    }
  },
  activityProcessHtml() {
    const _this = this;
    if (_this.data.blindDateSingle.datingDetailsExt) {
      let content = _this.data.blindDateSingle.datingDetailsExt.extString3;
      const imgReg = /<img.*?(?:>|\/>)/gi;
      const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      const arr = _this.data.blindDateSingle.datingDetailsExt.extString3.match(imgReg);
      if (arr) {
        let arrImg = [];
        arr.forEach((v, i) => {
          let match = v.match(srcReg);
          const src = match && match[1];
          arrImg.push({
            id: i,
            src
          });
          let reg = new RegExp('<img src=\"' + src + '\"', 'g');
          content = content.replace(reg, '<img data-id="' + i + '" src="' + util.getFullPath(src) + '"');
        });
        _this.data.arrImg = arrImg;
      }
      wxparse.wxParse('activityProcessHtml', 'html', content, _this, 5); // 实例化对象
      // return content;
    }
  },
  tipsHtml() {
    const _this = this;
    if (_this.data.blindDateSingle.datingDetailsExt) {
      let content = _this.data.blindDateSingle.datingDetailsExt.extString5;
      const imgReg = /<img.*?(?:>|\/>)/gi;
      const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      const arr = _this.data.blindDateSingle.datingDetailsExt.extString5.match(imgReg);
      if (arr) {
        let arrImg = [];
        arr.forEach((v, i) => {
          let match = v.match(srcReg);
          const src = match && match[1];
          arrImg.push({
            id: i,
            src
          });
          let reg = new RegExp('<img src=\"' + src + '\"', 'g');
          content = content.replace(reg, '<img data-id="' + i + '" src="' + util.getFullPath(src) + '"');
        });
        _this.data.arrImg = arrImg;
      }
      wxparse.wxParse('tipsHtml', 'html', content, _this, 5); // 实例化对象
      // return content;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    var that = this;
    var shareObj = {
      title: "转发的标题", // 默认是小程序的名称(可以写slogan等)
      path: '/pages/share/share', // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function(res) { // 转发成功之后的回调 
        // if (res.errMsg == 'shareAppMessage:ok') {

        // }
      },
      // 转发失败之后的回调
      // fail: function() {
        // 用户取消转发
        // if (res.errMsg == 'shareAppMessage:fail cancel') {　　　　　

        // } else if (res.errMsg == 'shareAppMessage:fail') {　
        //   // 转发失败，其中 detail message 为详细失败信息
        // }
      // },
      // 转发结束之后的回调（转发成不成功都会执行）
      // complete: fucntion() {　　　　　　 
      // }
    } 
    // 来自页面内的按钮的转发
    if (options.from == 'button') {
      var eData = options.target.dataset;
      console.log(eData.name); // shareBtn 
      shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    }　　 // 返回shareObj

    return shareObj;
    
  },
  followBlindDating: function(e) { //关注活动接口
  const _this = this;
    wx.showLoading({
      title: '',
    })
    app.appRequest('PUT', 'json', '/api/blindDating/follow/' + _this.data.id, {}, (res) => {
      wx.hideLoading();
      wx.showToast({
        title: '关注成功',
      }) 
      _this.setData({
        'blindDateSingle.isFollow': 1
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  unfollowBlindDating: function(e) { //取消关注活动接口 
    const _this = this;
    wx.showLoading({
      title: '',
    })
    app.appRequest('PUT', 'json', '/api/blindDating/unfollow/' + _this.data.id, {}, (res) => {
      wx.hideLoading();
      wx.showToast({
        title: '取消关注成功',
      }) 
      _this.setData({
        'blindDateSingle.isFollow': 0, 
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  toLink: function(event) {
    let url = event.currentTarget.dataset.url;
    let userid = 0;
    let silentState = 0;
    if (event.currentTarget.dataset.userid) {
      userid = event.currentTarget.dataset.userid;
      silentState = event.currentTarget.dataset.state;
    }
    let activeId = event.currentTarget.dataset.id;
    if (url == 'userInfo') {
      let link = '?id=' + userid + '&activityId=' + activeId + '&silentState=' + silentState;
      wx.navigateTo({
        url: '/pages/user/userInfo' + link,
      })
    } else {
      wx.navigateTo({
        url: '/pages/blindDate/registrationStaff?id' + activeId,
      })
    }
  },
  addGood: function(event) {
    wx.showLoading({
      title: '',
    })
    let userId = event.currentTarget.dataset.userid;
    let index = event.currentTarget.dataset.index;
    app.appRequest('POST', 'json', '/api/scene/marriage2/add_good', {
      likingUserId: userId,
    }, (res) => {
      wx.hideLoading();
      var isGood = 'blindDateSingle.candidateList[' + index + '].jiaoyouUser.isGood';
      this.setData({
        [isGood]: 1
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  delGood: function(event) {
    wx.showLoading({
      title: '',
    })
    let userId = event.currentTarget.dataset.userid;
    let index = event.currentTarget.dataset.index;
    app.appRequest('POST', 'json', '/api/scene/marriage2/delete_good', {
      likingUserId: userId,
    }, (res) => {
      wx.hideLoading();
      var isGood = 'blindDateSingle.candidateList[' + index + '].jiaoyouUser.isGood';
      this.setData({
        [isGood]: 0
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  bmBlindDating: function() { //参加活动接口
    const _this = this; 
    wx.navigateTo({
      url: '/component/common/blindDatePay?actDatingId=' + _this.data.id + '&enrollFee=' + _this.data.channel.money, 
    })
  },
  unbmBlindDating: function(event) {
    const _this = this;
    wx.showModal({
      content: '登记缺席报名费无法退回,并且不能再参与本活动',
      confirmText: "确认",
      cancelText: "取消",
      success: function(sm) {
        if (sm.confirm) {
          app.appRequest('POST', 'json', '/api/blindDating/unCandidate', {
            id: _this.data.id,
          }, (res) => {
            if (res.data) {
              let candidateList = _this.data.blindDateSingle.candidateList.filter(v => {
                return v.jiaoyouUser.id != userInfo.id;
              })
              wx.hideLoading(); 
              wx.showToast({
                content: "缺席登记成功"
              })
              let enrollCount = parseInt(_this.data.blindDateSingle.enrollCount) - 1; //实时更新报名人数 
              _this.setData({
                'blindDateSingle.candidateList': candidateList,
                'blindDateSingle.isCandidate': 0,
                'blindDateSingle.isAbsent': 1,
                'blindDateSingle.enrollCount': enrollCount < 0 ? 0 : enrollCount
              })
            }
          }, (err) => {
            console.log('请求错误信息：  ' + err.errMsg);
          });
        } else if (sm.cancel) {}
      }
    })
  },
  blindDateNew: function(){

  },
})
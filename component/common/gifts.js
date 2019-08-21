
var app = getApp();
const util = require('../../utils/util.js')
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: { 
    // 用户ID
    candidateId: {
      type: String,
      value: ''
    },
    // 用户名称
    aliasName: {
      type: String,
      value: ''
    },
    // 业务ID，从什么途径打赏的填写什么id，通过动态打赏填写动态ID，通过文章打赏填写文
    objectId: {
      type: String,
      value: ''
    },
    // 用户余额
    userMoney: {
      type: String,
      value: ''
    },
    // 礼物价格
    amount: {
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    showGift: false,
    indicatorDots: false,
    autoplay: false,
    giftIndex: 0, //封面图index 
    giftId: null, //礼物Id
    giftName: null, //礼物名称
  },
  ready(){ 
    this.getGiftList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getGiftList() {
      const _this = this;
      app.appRequest('GET', 'json', '/api/gift/list', {}, (result) => {
        if (result.data) {
          _this.data.giftList = [];
          let list = [];
          let data = result.data;
          let page = Math.ceil(data.length / 8)
          for (let k = 0; k < data.length; k++) {
            data[k].giftImage = util.getFullPath(data[k].giftImage, 120)
          }
          for (let i = 0; i < page; i++) {
            let arr = [];
            for (let j = 0; j < 8; j++) {
              if (8 * i + j == data.length) {
                break;
              }
              arr.push(data[8 * i + j])
            }
            list.push(arr);
          }
          _this.setData({
            giftList: list
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    },
    hideGift() { 
      const that = this;
      var animation = wx.createAnimation({
        duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease', //动画的效果 默认值是linear
      })
      that.animation = animation
      that.animation.translateY(700).step()
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(), 
      })
      setTimeout(function() {
        animation.translateY(0).step()
        that.setData({
          showGift: false
        })
      }, 720) //先执行下滑动画，再隐藏模块 
    },
    showGift() {
      const that = this;
      // 创建一个动画实例
      var animation = wx.createAnimation({
        // 动画持续时间
        duration: 500,
        // 定义动画效果，当前是匀速
        timingFunction: 'linear'
      })
      // 将该变量赋值给当前动画
      that.animation = animation
      // 先在y轴偏移，然后用step()完成一个动画
      animation.translateY(700).step()
      // 用setData改变当前动画
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
        // 改变view里面的Wx：if
        showGift: true
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function() {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 200)
    },
    onIndexChange: function(e) {
      this.setData({
        giftIndex: e.detail.current
      })
    },
    clickSelGift: function(event) {
      console.log(event);
      let giftId = event.currentTarget.dataset.giftid;
      let giftName = event.currentTarget.dataset.giftname;
      let jiaobi = event.currentTarget.dataset.jiaobi;
      this.setData({
        giftId: giftId,
        giftName: giftName,
        amount: jiaobi
      })
    },
    reward: function(event) {
      let uId = event.currentTarget.dataset.uid;
      let gId = event.currentTarget.dataset.gid;
      let objId = event.currentTarget.dataset.objid;
      let rewardVal = {
        candidateId: uId,
        giftId: gId,
        objectId: objId
      }
      this.setData({
        userMoney: this.data.userMoney - this.data.amount
      }) 
      this.triggerEvent("reward", rewardVal);
      this.hideGift();
    },
  }
})
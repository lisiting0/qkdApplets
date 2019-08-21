const util = require('../../utils/util.js')
const api = require('../../js/api.js')
const safeHouse = require('./safeHouseData.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyBg: '../../images/earnCoin/mbg.jpg',
    qkbBg: '../../images/earnCoin/qbg.jpg',
    safeHouse: safeHouse.user,
    dayCount: 0,
    userIncome: 0,
    nearArr: [],
    userInfo: {},
    purse: {},
    eventList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: "乾坤金屋" //页面标题为路由参数
    })

    var info = wx.getStorageSync("userInfo");
    _this.setData({
      userInfo: info
    })
    // (代理)查询今日收益
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/agent/lowerAgent', {}, (result) => {
      if (result) {
        result.income = api.Fn.toFixed(result.income);
        result.userMoney = api.Fn.toFixed(result.userMoney ? result.userMoney : 0);
        if (result.consumption) {
          result.consumption.incomeAmountCountDay = api.Fn.toFixed(result.consumption.incomeAmountCountDay ? result.consumption.incomeAmountCountDay : 0);
          result.consumption.consumeAmountCountDay = api.Fn.toFixed(result.consumption.consumeAmountCountDay ? result.consumption.consumeAmountCountDay : 0);
        }
      }
      _this.setData({
        purse: result
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    //查询任务列表
    app.appRequest('GET', 'json', '/api/rewardEvent/myList', {
      enable: 1,
      finished: 0,
    }, (result) => {
      let arr = [];
      let list = result.list
      if (list && list.length > 0) {
        if (list.length > 4) {
          list.length = 4;
        }
        list.forEach(v => {
          v.icon = util.getFullPath(v.icon, 240)
          if (v.finished != 1) {
            arr.push(v)
          }
        })
      }
      _this.setData({
        eventList: arr
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    // 查询用户可提现的余额
    app.appRequest('GET', 'json', '/api/user/getUserIncome', {}, (result) => {
      _this.setData({
        userIncome: api.Fn.toFixed(result.data)
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  linkTo: function (event) {
    var url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/' + url
    })
  },
  toLink: function(event) {
    var url = event.currentTarget.dataset.url;
    if (url == "registrationActivity") {
      wx.navigateTo({
        url: '/pages/blindDate/' + url
      })
    } else if (url == "certificationCenter") {
      wx.navigateTo({
        url: '/pages/user/' + url
      })
    } else {
      if (url == "sendGift/main") {
        url = "sendGift";
      }
      wx.navigateTo({
        url: '/pages/safeHouse/' + url
      })
    }
  }
})
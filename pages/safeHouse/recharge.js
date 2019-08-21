const util = require('../../utils/util.js')
const api = require('../../js/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    jbList: [],
    jbIndex: 0,
    payType: { wxpay: "微信支付", alipay: "支付宝支付" },
    payIndex: "wxpay",
    time: -1,
    topay: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: "乾坤币充值"//页面标题为路由参数
    })

    var info = wx.getStorageSync("userInfo");
    _this.setData({
      userInfo: info
    })

    // 查询今日收益
    app.appRequest('GET', 'json', '/api/rechargePackage/list', {}, (result) => {
      _this.setData({
        jbList: result.data
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  bindIndex: function(event){
    this.setData({
      jbIndex: event.currentTarget.dataset.index
    })
  },
  bindPayIndex: function (event) {
    console.log(event.currentTarget.dataset.payindex);
    this.setData({
      payIndex: event.currentTarget.dataset.payindex
    })
  },
  recharge: function(){ 
    wx.showToast({
      title: '当前环境不支持该支付方式',
      icon: 'none'
    })
  }
})
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasAli: false,
    money: 0,
    userIncome: 0,
    link: "#"
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: "乾坤金屋"//页面标题为路由参数
    })
    var info = wx.getStorageSync("userInfo");
    _this.setData({
      userInfo: info
    }) 
  }, 
  installAli: function(event){ 
    wx.showToast({ 
      title: '此环境不支持提现\r\n没有检测到支付宝',
      icon: 'none'
    })
  }
})
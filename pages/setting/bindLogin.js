// pages/setting/bindLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    isFlag: false,
    typeId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "第三方登录" //页面标题为路由参数
    })

    const _this = this;  
    let userinfo = wx.getStorageSync("userInfo");
    let type = options.type; 
    let typeIdStr = String(options.type + 'Id'); 
    _this.setData({
      type: type,
      typeId: userinfo[typeIdStr]
    })
  },
  toUnbind: function(){
    wx.showToast({
      icon: 'none',
      title: '当前环境不支持该解绑方式',
    })
  },
  bind:function(){
    wx.showToast({
      icon: 'none',
      title: '当前环境不支持该绑定方式',
    })
  }
})
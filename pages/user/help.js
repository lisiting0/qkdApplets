const help = require('../../js/help.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    help: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "帮助与反馈" //页面标题为路由参数
    })
    const _this = this;
    _this.setData({
      help: help.help
    })
  },
  linkTo: function(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/user/QA?id=' + id
    })
  }
})
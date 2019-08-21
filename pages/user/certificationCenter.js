var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "认证中心" //页面标题为路由参数
    })
    this.viewProfile();
  },
  viewProfile() {
    const _this = this;
    var info = wx.getStorageSync("userInfo");
    app.appRequest('GET', 'json', '/api/user/profile', {
      userId: info.id
    }, (res) => {
      if (res.data) {
        _this.setData({
          userInfo: res.data
        })
      }
    })
  },
  linkTo: function(event) {
    var status = event.currentTarget.dataset.status;
    var url = event.currentTarget.dataset.url;
    if (status != 1) {
      wx.navigateTo({
        url: '../../pages/' + url
      })
    }
  }
})
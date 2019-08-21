
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    xswitch: {
      all: false,
      activity: true,
      engagement: true,
      auditing: true,
      message: true,
      fans: true,
      follow: true
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onReady: function () {
    const _this = this;
    _this.setData({
      disabled: _this.data.disabled
    })
  },
  switchClick: function(e) {
    const _this = this;
    let val = e.detail.value; 
    if (val) {
      _this.setData({
        disabled: true
      })
    } else {
      _this.setData({
        disabled: false
      })
    }
    _this.setData({
      "xswitch.all": val
    });
    console.log(_this.data.disabled);
  }
})
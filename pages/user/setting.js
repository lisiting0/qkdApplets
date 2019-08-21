var app = getApp()
Page({
  onReady: function() {
    //获得popup组件
    this.androidConfirmModal = this.selectComponent("#confrimModal");
  },
  /**
   * 页面的初始数据
   */
  data: {
    onOff: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "设置" //页面标题为路由参数
    })
    const _this = this;
    let userInfo = wx.getStorageSync("userInfo");
    _this.setData({
      onOff: userInfo.silentState == 0 ? false : true
    })
  },
  onClick(e) {
    const _this = this;
    let val = e.detail.value;
    if (val) {
      _this.androidConfirmModal.showModal();
    } else {
      _this.setData({
        onOff: false
      })
      _this.updateSilentState();
    }
  },
  clearCache() {
    const _this = this;
    try {
      wx.showModal({
        title: '清除缓存',
        content: '确定清除本地缓存和数据缓存吗?',
        success: function(sm) {
          if (sm.confirm) {
            _this.toClear();
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } catch (e) {

    }
  },
  toClear: function() {
    try {
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
      wx.clearStorageSync();
      wx.clearStorage();
      app.globalData.publishBlindDate = {
        addressIndex: [0, 0],
        addressDetailText: '',
        addressId: [0, 0],
        navigation: '',
        activityProcess: '',
        activityTips: '',
        checkOrganizerList: [],
        checkCoOrganizerList: [],
        extString6: {},
        settingExtString6Key: {},
        settingExtString6: [],
      }
      wx.showToast({
        title: "清除成功",
        icon: "success"
      }) 
      wx.reLaunch({
        url: '../../pages/login/login',
      })
    } catch (e) {

    }
  },
  logout: function() {
    try {
      wx.removeStorageSync('userInfo');
      wx.removeStorageSync('token');
      console.log("token"+wx.getStorageSync('token'))
      wx.clearStorageSync();
      wx.clearStorage();
      app.globalData.publishBlindDate = {
        addressIndex: [0, 0],
        addressDetailText: '',
        addressId: [0, 0],
        navigation: '',
        activityProcess: '',
        activityTips: '',
        checkOrganizerList: [],
        checkCoOrganizerList: [],
        extString6: {},
        settingExtString6Key: {},
        settingExtString6: [],
      } 
      wx.reLaunch({
        url: '../../pages/login/login',
      })
    } catch (e) {

    }
  },
  //取消事件
  _cancel: function() {
    console.log('你点击了取消');
    const _this = this;
    _this.updateSilentState();
    _this.androidConfirmModal.hideModal();
    _this.setData({
      onOff: false
    })
  },
  //确认事件
  _confirm: function() {
    console.log('你点击了确定');
    const _this = this;
    _this.updateSilentState();
    _this.androidConfirmModal.hideModal();
    _this.setData({
      onOff: true
    })
  },
  updateSilentState() {
    const _this = this;
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/user/updateSilentState', {}, (result) => {
      wx.clearStorageSync("userInfo");
      wx.setStorageSync("userInfo", result.data)
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  }
})
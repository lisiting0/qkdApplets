const util = require('../../../utils/util.js')
var app = getApp()
var regNum = new RegExp('[0-9]', 'g');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    settingExtString6: {}, //当前设置的渠道内容 
    settingExtString6Key: {}, //当前设置的渠道内容 
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    let pubData = app.globalData.publishBlindDate;
    let chanelStorage = pubData.channel;
    // 第一个是某个合伙人渠道进来的
    if (chanelStorage) {
      _this.data.settingExtString6 = {
        share: '',
        needVerify: 0,
        boyFee: '',
        girlFee: '',
        boyLimit: '',
        girlLimit: '',
        name: chanelStorage.agentName
      }
      _this.data.settingExtString6.key = chanelStorage.user.jyNumber + "";
      _this.setData({
        settingExtString6: _this.data.settingExtString6
      })
      wx.setNavigationBarTitle({
        title: _this.data.settingExtString6.name
      })
    } else {
      wx.setNavigationBarTitle({
        title: "默认渠道" //页面标题为路由参数
      }) 
      _this.setData({
        settingExtString6Key: pubData.settingExtString6Key,
        settingExtString6: pubData.settingExtString6Key,
      })
    }
  },
  bindNumberInput: function(e) {
    const _this = this;
    let val = e.detail.value;
    if (regNum.exec(val) == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入正整数',
      })
      return;
    }
    let input = e.currentTarget.dataset.input;
    _this.setData({
      'settingExtString6.boyLimit': input == "boyLimit" ? val : _this.data.settingExtString6.boyLimit,
      'settingExtString6.girlLimit': input == "girlLimit" ? val : _this.data.settingExtString6.girlLimit,
    })
  },
  bindDoubleInput: function(e) {
    const _this = this;
    let val = e.detail.value;
    var reg = /^[0-9,.]*$/ //^[-\+]?\d+(\.\d+)?$/;
    if (reg.exec(val) == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入数字',
      })
      return;
    }
    let input = e.currentTarget.dataset.input;
    _this.setData({
      'settingExtString6.boyFee': input == "boyFee" ? val : _this.data.settingExtString6.boyFee,
      'settingExtString6.girlFee': input == "girlFee" ? val : _this.data.settingExtString6.girlFee,
      'settingExtString6.share': input == "share" ? val : _this.data.settingExtString6.share,
    })
  },
  onClick: function(e) {
    const _this = this;
    let val = e.detail.value;
    _this.setData({
      'settingExtString6.needVerify': val ? 1 : 0
    })
  },
  makeSureExtString6: function(event) {
    const _this = this;
    if (_this.data.settingExtString6.key) {
      if (_this.data.settingExtString6.share == '' && _this.data.settingExtString6.needVerify == 0 && _this.data.settingExtString6.boyFee == '' && _this.data.settingExtString6.girlFee == '' && _this.data.settingExtString6.boyLimit == '' && _this.data.settingExtString6.girlLimit == '') {

      } else {
        let obj = {
          key: _this.data.settingExtString6.key,
          item: _this.data.settingExtString6
        }

        let pubData = app.globalData.publishBlindDate;
        pubData.extString6 = obj;
        pubData.settingExtString6Key = _this.data.settingExtString6Key;
        pubData.settingExtString6 = _this.data.settingExtString6;
      }
    }
    let pubData = app.globalData.publishBlindDate;
    let chanelStorage = pubData.channel;
    if (chanelStorage) {
      wx.navigateBack({
        delta: 2
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
  },
})
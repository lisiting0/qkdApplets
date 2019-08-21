var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    scroll_height: 0,
    checkOrganizerList: [], //选择的主办单位 
    checkCoOrganizerList: [], //选择的协办单位 
  },
  onShow: function() {
    const _this = this; 
    let pubData = app.globalData.publishBlindDate; 
    _this.setData({
      checkOrganizerList: pubData.checkOrganizerList,
      checkCoOrganizerList: pubData.checkCoOrganizerList
    })
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "选择举办单位" //页面标题为路由参数
    })
    let _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度 
    _this.setData({
      scroll_height: windowHeight - 80
    })
    let pubData = app.globalData.publishBlindDate;
    console.log(pubData)
    _this.setData({
      checkOrganizerList: pubData.checkOrganizerList,
      checkCoOrganizerList: pubData.checkCoOrganizerList
    })
  },
  select: function(event) {
    const _this = this;
    let index = event.currentTarget.dataset.index;
    let append = ''; 
    wx.navigateTo({
      url: '/pages/blindDate/publish/unit?isOrganizer=' + index,
    })
  },
  removeOrganizer: function(event) { //移除主办单位 
    const _this = this;
    let index = event.target.dataset.index;
    let id = event.target.dataset.id;
    _this.data.checkOrganizerList.splice(index, 1);
    _this.setData({
      checkOrganizerList: _this.data.checkOrganizerList
    })
  },
  removeCoOrganizer: function(event) { //移除协办单位
    const _this = this;
    let index = event.target.dataset.index;
    let id = event.target.dataset.id;
    _this.data.checkCoOrganizerList.splice(index, 1);
    _this.setData({
      checkCoOrganizerList: _this.data.checkCoOrganizerList
    })
  },
  confirmSelect: function() {
    const _this = this; 
    let hostPartys = [];
    let assistingPartys = [];
    if (_this.data.checkOrganizerList.length > 0) {
      for (let k in _this.data.checkOrganizerList) { 
        hostPartys.push(_this.data.checkOrganizerList[k].id);
      }
    }else{
      wx.showToast({
        icon:"none",
        title: '请选择单位',
      })
    }
    if (_this.data.checkCoOrganizerList.length > 0) {
      for (let k in _this.data.checkCoOrganizerList) {
        assistingPartys.push(_this.data.checkCoOrganizerList[k].id);
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请选择单位',
      })
    } 
    let pubData = app.globalData.publishBlindDate;
    pubData.checkOrganizerList = _this.data.checkOrganizerList;
    pubData.checkCoOrganizerList = _this.data.checkCoOrganizerList;
    pubData.hostPartys = hostPartys;
    pubData.assistingPartys = assistingPartys;
    wx.navigateBack({
      delta: 1
    })
  }
})
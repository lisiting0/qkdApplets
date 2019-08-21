const util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    indicatorDots: false,
    autoplay: false,
    adList: null, //广告列表
    nearArr: [], //附近邀约
    nearPeopleArr: [], //附近的人
    registrationActivity: [], //相亲活动
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "首页" //页面标题为路由参数
    })
    var _this = this;
    //获取首页轮播图列表
    wx.request({
      header: {
        'content-type': 'application/json' // 默认值
      },
      url: app.globalData.baseURL + '/api/ad/indexAdList',
      method: 'GET',
      data: {},
      success: function(res) {
        if (res.data.data) {
          //获取首页广告列表
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i]['adImg'] = util.getFullPath(res.data.data[i]['adImg'], 720);
          }
          _this.setData({
            adList: res.data.data
          })
        }
      },
      fail: function(res) {}
    })

    //获取附近邀约列表
    wx.request({
      header: {
        'content-type': 'application/json' // 默认值
      },
      url: app.globalData.baseURL + '/api/dating/searchDatingList',
      method: 'GET',
      data: {
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        page: 1,
        rows: 4
      },
      success: function(res) {
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i]['coverimgImages']) {
              res.data.list[i]['coverimgImages'] = util.getFullPath(res.data.list[i]['coverimgImages'], 120);
            } else {
              res.data.list[i]['jiaoyouUser']['headimgAttachmentId'] = util.getFullPath(res.data.list[i]['jiaoyouUser']['headimgAttachmentId'], 120);
            }
            if (res.data.list[i]['datingStarttime']) {
              res.data.list[i]['datingStarttime'] = util.format(new Date(Date.parse(res.data.list[i]['datingStarttime'].replace(/-/g, "/"))), 'MM.dd hh:mm');
            }
            if (res.data.list[i]['activityStarttime']) {
              res.data.list[i]['activityStarttime'] = util.format(new Date(Date.parse(res.data.list[i]['activityStarttime'].replace(/-/g, "/"))), 'yyyy.MM.dd hh:mm:ss');
            }
          }
          _this.setData({
            nearArr: res.data.list
          })
        }
      },
      fail: function(res) {}
    })

    //获取附近的人列表
    wx.request({
      header: {
        'content-type': 'application/json' // 默认值
      },
      url: app.globalData.baseURL + '/api/user/nearUser',
      method: 'GET',
      data: {
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        page: 1,
        rows: 8
      },
      success: function(res) {
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i]['headimgAttachmentId'] = util.getFullPath(res.data.list[i]['headimgAttachmentId'], 120);
          }
          _this.setData({
            nearPeopleArr: res.data.list
          })
        }
      },
      fail: function(res) {}
    })

    //获取相亲列表
    wx.request({
      header: {
        'content-type': 'application/json' // 默认值
      },
      url: app.globalData.baseURL + '/api/blindDating/searchDatingList',
      method: 'GET',
      data: {
        page: 1,
        rows: 8
      },
      success: function(res) {
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i]['coverimgImages']) {
              res.data.list[i]['coverimgImages'] = util.getFullPath(res.data.list[i]['coverimgImages'], 360);
            } else {
              res.data.list[i]['jiaoyouUser']['headimgAttachmentId'] = util.getFullPath(res.data.list[i]['jiaoyouUser']['headimgAttachmentId'], 360);
            }
            res.data.list[i]['activityStarttime'] = util.format(new Date(Date.parse(res.data.list[i]['activityStarttime'].replace(/-/g, "/"))), 'yyyy.MM.dd');
          }
          _this.setData({
            registrationActivity: res.data.list.filter((v, i) => {
              return i < 4
            })
          })
        }
      },
      fail: function(res) {}
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})
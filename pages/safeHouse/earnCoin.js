const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eventList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "任务中心" //页面标题为路由参数
    })
    const _this = this;
    let arr = [];
    app.appRequest('GET', 'json', '/api/apiDict', {
      type: "reward_events_type"
    }, (result) => {
      arr = result.data;
      console.log(arr);
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

    app.appRequest('GET', 'json', '/api/rewardEvent/myList', {
      enable: 1
    }, (newsResult) => {
      if (newsResult.list) {
        newsResult.list.forEach(v => {
          v.icon = util.getFullPath(v.icon, 360);
          arr.forEach(item => {
            if (item.value == v.type) {
              if (item.arr) {
                item.arr.push(v)
              } else {
                item.arr = [v]
              }
            }
          })
        })
        _this.setData({
          eventList: arr
        })
        console.log(_this.eventList);
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  toLink: function(event) {
    var url = event.currentTarget.dataset.url;
    if (url == "registrationActivity") {
      wx.navigateTo({
        url: '../../pages/blindDate/' + url
      })
    } else if (url == "certificationCenter") {
      wx.navigateTo({
        url: '../../pages/user/' + url
      })
    } else {
      if (url == "sendGift/main") {
        url = "sendGift";
      }
      wx.navigateTo({
        url: '../../pages/safeHouse/' + url
      })
    }
  }
})
const util = require('../../utils/util.js')
const api = require('../../js/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayCount: 0,
    userIncome: 0,
    nearArr: [],
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: "乾坤金屋" //页面标题为路由参数
    })

    var info = wx.getStorageSync("userInfo");
    _this.setData({
      userInfo: info
    })
    // 查询今日收益
    app.appRequest('GET', 'json', '/api/cashRecord/dayCount', {}, (result) => {
      _this.setData({
        dayCount: result.data
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    // 查询用户可提现的余额
    app.appRequest('GET', 'json', '/api/user/getUserIncome', {}, (result) => {
      _this.setData({
        userIncome: api.Fn.toFixed(result.data)
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

    //获取相亲列表
    app.appRequest('GET', 'json', '/api/dating/searchDatingList', {
      page: 1,
      rows: 4,
      orderBy: '1'
    }, (res) => {
      console.log(res);
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
          if (item[i].activityStarttime) {
            item[i].activityStarttime = item[i].activityStarttime.substring(0, 10);
          }
          if (item[i].datingStarttime) {
            item[i].datingStarttime = util.format(new Date(Date.parse(item[i].datingStarttime.replace(/-/g, "/"))), 'MM.dd hh:mm');
          }
        }
        _this.setData({
          nearArr: []
        })
        _this.setData({
          nearArr: res.list
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
})
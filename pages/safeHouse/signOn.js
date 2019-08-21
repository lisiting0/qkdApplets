var app = getApp();
const api = require('../../js/api.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImg: '../../images/signon.jpg',
    riliImg: '../../images/rili.png',
    signOnList: [],
    signOnWidth: 0,
    title: '',
    MaxDayOfDate: 0,
    showSigned: false,
    showRules: false,
    userTop: false,
    currentDate: null,
    signedRank: 0,
    addCoins: 0,
    totalCoins: 0,
    dateArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    app.appRequest('GET', 'json', '/api/server/sysdate', {}, (res) => {
      let date = util.format(new Date(Date.parse(res.data.replace(/-/g, "/"))), 'yyyy-MM-dd')
      _this.data.currentDate = new Date(Date.parse(date.replace(/-/g, "/")))
      _this.setData({
        currentDate: _this.data.currentDate,
        MaxDayOfDate: util.maxDayOfDate(_this.data.currentDate),
        title: (_this.data.currentDate.getMonth() + 1) + '月签到日历'
      })
    });
    app.appRequest('GET', 'json', '/api/signin/recordList', {}, (result) => {
      if (result.data && result.data.reward) {
        _this.setData({
          totalCoins: result.data.reward
        })
      }
      if (result.list) {
        _this.data.showSign = result.list.some(item => {
          return item.signDate == util.format(_this.data.currentDate, 'yyyy-MM-dd')
        })
        _this.setData({
          signOnWidth: (result.list.length / 5) * 20,
          signOnList: result.list
        })
      }
      _this.getDay();
    });
  },
  getDay: function() {
    const _this = this;
    console.log(_this.data.currentDate)
    if (_this.data.currentDate) {
      let ary = util.toArray(_this.data.currentDate);
      let relativeDate = (new Date(ary[0], ary[1], 1));
      let arr = [];
      for (let i = 0; i < relativeDate.getDay(); i++) {
        arr.push({
          type: 0,
          value: null
        })
      }
      let arr2 = _this.data.signOnList.map(item => {
        return new Date(Date.parse(item.signDate.replace(/-/g, "/")));
      })
      for (let i = 1; i < _this.data.MaxDayOfDate + 1; i++) {
        let result = arr2.some(value => {
          return value.getTime() == new Date(ary[0], ary[1], i).getTime()
        })
        if (result) {
          arr.push({
            type: 1,
            value: i
          })
        } else {
          arr.push({
            type: 0,
            value: i
          })
        }
      }
      console.log(arr)
      _this.setData({
        dateArr: arr
      })
    } else {
      _this.setData({
        dateArr: []
      })
    }
  },
  showSign: function(event) {
    wx.showLoading({
      title: '',
    })
    const _this = this;
    app.appRequest('POST', 'json', '/api/signin/signin', {}, (result) => {
      if (result.data.records) {
        _this.setData({
          signOnWidth: (result.data.records.length / 5) * 20,
          signOnList: result.data.records,
          signedRank: result.data.ranking,
          addCoins: result.data.reward,
          totalCoins: parseInt(_this.data.totalCoins) + parseInt(_this.data.addCoins),
          showSigned: true
        })
      }
      wx.hideLoading();
    });
  }
})
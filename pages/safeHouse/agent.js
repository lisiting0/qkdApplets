var app = getApp();
const api = require('../../js/api.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showLinkData: false,
    consumption: {},
    accumulatedConsumptionintQkb: 0, //累积娇币消费
    accumulatedIncomeQkb: 0, //累积娇币收入
    accumulatedCashConsumption: 0, //累积的现金消费
    accumulatedCashIncome: 0, //累计的现金收入
    scroll_height: 0,
    listArr: [],
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "我的代理" //页面标题为路由参数
    })
    const _this = this;
    _this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
    // 微信小程序获取某个元素的高度
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    if (_this.data.showLinkData) {
      let query = wx.createSelectorQuery();
      query.select('.my_agent').boundingClientRect(function (rect) {
        _this.setData({
          scroll_height: windowHeight - rect.height
        })
      }).exec();
    }else{
      let query = wx.createSelectorQuery();
      query.select('.agent_top').boundingClientRect(function (rect) {
        _this.setData({
          scroll_height: windowHeight - rect.height
        })
      }).exec();
    }
    app.appRequest('GET', 'json', '/api/apiDict', {
      type: 'sys_consts'
    }, (res) => {
      if (res.data) {
        res.data.forEach(v => {
          if (v.label == 'hide_partner_entrance' && v.value != 1) {
            _this.setData({
              showLinkData: res.data
            })
          }
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    _this.loadData();
  },
  watch: {
    showLink: function() {
      return !userInfo.ordAgent && this.data.showLinkData;
    }
  },
  loadData: function() {
    const _this = this;
    var pageIndex = _this.data.currentPage;
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/agent/lowerAgent', {
      page: 1,
      rows: app.globalData.pageSize,
    }, (res) => { 
      if (res.consumption) { 
        for (let index in res.consumption) { 
          res.consumption[index] = api.Fn.toFixed(res.consumption[index]) 
        }
        _this.setData({
          consumption: res.consumption,
          accumulatedConsumptionintQkb: api.Fn.toFixed(res.accumulatedConsumptionintQkb),
          accumulatedIncomeQkb: api.Fn.toFixed(res.accumulatedIncomeQkb),
          accumulatedCashConsumption: api.Fn.toFixed(res.accumulatedCashConsumption),
          accumulatedCashIncome: api.Fn.toFixed(res.accumulatedCashIncome)
        })
      }

      if (res.agents.count > 0) {
        for (let index in res.agents.list) {
          res.agents.list[index].headimgAttachmentId = util.getFullPath(res.agents.list[index].headimgAttachmentId, 240)
        }
        if (pageIndex == 1) {
          _this.setData({
            listArr: []
          })
          _this.setData({
            totalPage: res.agents.totalPage,
            listArr: res.agents.list,
            hideHeader: true
          })
        } else {
          var array = _this.data.listArr;
          array = array.concat(res.agents.list);
          _this.setData({
            totalPage: res.agents.totalPage,
            listArr: array,
            hideBottom: true
          })
        }
        if (_this.data.currentPage == _this.data.totalPage) {
          _this.setData({
            loadMoreData: '已加载全部数据',
            hideBottom: false
          })
        }
      } else {
        _this.setData({
          hideBottom: false
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  linkTo: function (event){
    var url = event.currentTarget.dataset.url;
    var id = event.currentTarget.dataset.id;
    var name = event.currentTarget.dataset.name;
    if (util.isBlank(name)) {
      name = '';
      wx.navigateTo({
        url: '../../pages/' + url + '?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '../../pages/' + url + '?id=' + id + '&name=' + name
      })
    }
  }
})
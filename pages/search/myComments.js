var app = getApp();
const api = require('../../js/api.js')
const util = require('../../utils/util.js')
Page({
  onReady: function() {
    //获得发布动态
    this.addMoment = this.selectComponent("#addMoment");
  },
  /**
   * 页面的初始数据
   */
  data: {
    userId: null,
    userInfo: null,
    scroll_height: 0,
    list: null,
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',

    showHideMoment: true, //显示发布按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "我的动态" //页面标题为路由参数
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 微信小程序获取某个元素的高度
    _this.setData({
      scroll_height: windowHeight
    })
    _this.setData({
      userId: options.userId ? options.userId : null,
      userInfo: wx.getStorageSync("userInfo")
    })
    _this.loadData();
  },
  loadData: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    if (_this.data.userId == _this.data.userInfo.id || !_this.data.userId) {
      //获取我的动态
      app.appRequest('GET', 'json', '/api/feed/getMyList', {
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          let artObj = {};
          for (let i = item.length; i--;) { //递归统计评论数量
            item[i].commentLegth = 0;
            if (item[i].comments) {
              (function getCount(comments, index) {
                for (let i = comments.length; i--;) {
                  if (comments[i].comments) {
                    getCount(comments[i].comments, index);
                  }
                }
                item[index].commentLegth += comments.length;
              }(item[i].comments, i));
            }
            if (item[i].feedAttachment) {
              let str = item[i].feedAttachment.split(',');
              let images = [];
              for (var j = 0; j < str.length; j++) {
                images.push(util.getFullPath(str[j], 120));
              }
              item[i].images = images;
            }
          }
          let nowYear = api.Fn.timeFormat(new Date(), "yyyy") + "年";
          let nowDay = api.Fn.timeFormat(new Date(), "MM-dd");
          for (let i = 0; i < item.length; i++) {
            let year = api.Fn.timeFormat(item[i].createDate, "yyyy") + "年";
            let day = api.Fn.timeFormat(item[i].createDate, "MM-dd");
            item[i].createDate = api.Fn.timeFormat(item[i].createDate, "hh:mm")
            if (year == nowYear) {
              year = "今年"
            }
            if (day == nowDay) {
              day = "今天"
            }
            if (!artObj[year]) {
              artObj[year] = {}
            }
            if (!artObj[year][day]) {
              artObj[year][day] = [];
            }
            artObj[year][day].push(item[i]);
          }
          if (pageIndex == 1) {
            _this.setData({
              list: null,
            })
            _this.setData({
              totalPage: res.totalPage,
              list: artObj,
              hideHeader: true
            })
          } else {
            let array = _this.data.billObj;
            array = array.concat(billObj);
            _this.setData({
              totalPage: res.totalPage,
              billObj: array,
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
    } else {
      //获取别人的动态
      app.appRequest('GET', 'json', '/api/feed/getList', {
        userId: _this.data.userId,
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          let artObj = {};
          for (let i = item.length; i--;) { //递归统计评论数量
            item[i].commentLegth = 0;
            if (item[i].comments) {
              (function getCount(comments, index) {
                for (let i = comments.length; i--;) {
                  if (comments[i].comments) {
                    getCount(comments[i].comments, index);
                  }
                }
                item[index].commentLegth += comments.length;
              }(item[i].comments, i));
            }
          }
          let nowYear = api.Fn.timeFormat(new Date(), "yyyy") + "年";
          let nowDay = api.Fn.timeFormat(new Date(), "MM-dd");
          item[i].createDate = api.Fn.timeFormat(item[i].createDate, "hh:mm")
          for (let i = 0; i < item.length; i++) {
            let year = api.Fn.timeFormat(item[i].createDate, "yyyy") + "年";
            let day = api.Fn.timeFormat(item[i].createDate, "MM-dd");
            if (year == nowYear) {
              year = "今年"
            }
            if (day == nowDay) {
              day = "今天"
            }
            if (!artObj[year]) {
              artObj[year] = {}
            }
            if (!artObj[year][day]) {
              artObj[year][day] = [];
            }
            artObj[year][day].push(item[i]);
          }
          if (pageIndex == 1) {
            _this.setData({
              list: null,
            })

            _this.setData({
              totalPage: res.totalPage,
              list: artObj,
              hideHeader: true
            })
          } else {
            let array = _this.data.billObj;
            array = array.concat(billObj);
            _this.setData({
              totalPage: res.totalPage,
              billObj: array,
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
    }
    // 隐藏加载框
    wx.hideLoading();
  },
  loadMore() {
    var _this = this;
    if (_this.data.currentPage == _this.data.totalPage) {
      _this.setData({
        loadMoreData: '已加载全部数据',
        hideBottom: false
      })
      return;
    }
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      console.log('上拉加载更多');
      var tempCurrentPage = _this.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      _this.setData({
        currentPage: tempCurrentPage
      })
      _this.loadData();

    }, 1000);
    // 隐藏加载框
    wx.hideLoading();
  },
  refresh() {
    var _this = this;
    setTimeout(function() {
      console.log('下拉刷新');
      _this.setData({
        currentPage: 1,
        hideHeader: false
      })
      _this.loadData();
    }, 1000);
  }, 
  publishmoment: function(event) {
    const _this = this;
    _this.addMoment.showMoment();
    _this.setData({
      showHideMoment: false
    })
  },
  publishEvent: function(event) {
    wx.showLoading({
      title: '',
    })
    const _this = this;
    let data = {
      feedContent: event.detail.feedContent,
      feedType: event.detail.feedType,
      feedAttachment: event.detail.feedAttachment,
      viewRoleType: event.detail.viewRoleType,
      isTransferredUrl: 0,
    }
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/feed/publish', data, (result) => {
      if (result.status == 1) {
        wx.hideLoading();
        _this.loadData();
        _this.setData({ 
          showHideMoment: true
        })
      }
      wx.showToast({
        title: result.message,
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  }
})
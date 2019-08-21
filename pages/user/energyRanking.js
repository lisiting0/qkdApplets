const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: '',
    month: '',
    rankingList: null,
    scroll_height: 0,
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "人脉能量排行" //页面标题为路由参数
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度 
    _this.setData({
      scroll_height: windowHeight
    })
    _this.loadData();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  loadData: function() {
    const _this = this;
    // 加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    if (!_this.data.year && !_this.data.month) {
      let myDate = new Date();
      _this.setData({
        year: myDate.getFullYear(), //获取当前年
        month: myDate.getMonth() + 1, //获取当前月
      })
    }
    //获取列表
    app.appRequest('GET', 'json', '/api/task/monthlyTaskRewardRanking', {
      year: _this.data.year,
      month: _this.data.month,
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      if (res.data) {
        for (var i = 0; i < res.data.length; i++) {
          var item = res.data[i];
          item.headimgAttachmentId = util.getFullPath(item.headimgAttachmentId, 240);
        }
        if (pageIndex == 1) {
          _this.setData({
            rankingList: []
          })
          _this.setData({
            totalPage: res.data.length,
            rankingList: res.data,
            hideHeader: true
          })
        } else {
          var array = _this.data.rankingList;
          array = array.concat(res.data);
          _this.setData({
            totalPage: array.length,
            rankingList: array,
            hideBottom: true
          })
        }
        if (_this.data.totalPage < app.globalData.pageSize) {
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
    // 隐藏加载框
    wx.hideLoading();
  },
  loadMore() {
    var _this = this;
    if (_this.data.totalPage < app.globalData.pageSize) {
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
  openHideModal: function(event) {
    let showhide = event.currentTarget.dataset.showhide;
    this.setData({
      showModal: !showhide
    })
  },
})
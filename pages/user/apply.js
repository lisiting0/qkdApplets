const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      title: "私密资料请求通知" //页面标题为路由参数
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
    //获取列表
    app.appRequest('GET', 'json', '/api/user/findApply', {
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      if (res.list) {
        for (var i = 0; i < res.list.length; i++) {
          var item = res.list[i];
          item.user.headimgAttachmentId = util.getFullPath(item.user.headimgAttachmentId, 240);
        }
        if (pageIndex == 1) {
          _this.setData({
            listArr: []
          })
          _this.setData({
            totalPage: res.totalPage,
            listArr: res.list,
            hideHeader: true
          })
        } else {
          var array = _this.data.listArr;
          array = array.concat(res.list);
          _this.setData({
            totalPage: res.totalPage,
            listArr: array,
            hideBottom: true
          })
        }
        if (_this.data.currentPage == _this.data.totalPage || _this.data.totalPage < app.globalData.pageSize) {
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
    if (_this.data.currentPage == _this.data.totalPage || _this.data.totalPage < app.globalData.pageSize) {
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
  accept: function(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    wx.showLoading({
      title: '',
    })
    app.appRequest('PUT', 'json', '/api/user/acceptUserApply/' + id, {}, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: '接受成功',
          icon: 'success'
        })
        var status = 'listArr[' + index + '].status';
        this.setData({
          [status]: 2
        })
        wx.hideLoading();
      }
      wx.hideLoading();
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  reject: function(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    app.appRequest('PUT', 'json', '/api/user/refuseUserApply/' + id, {}, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: '忽略成功',
          icon: 'success'
        })
        var status = 'listArr[' + index + '].status';
        this.setData({
          [status]: 0
        })
        wx.hideLoading();
      }
      wx.hideLoading();
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  linkTo: function(e) {
    let id = e.currentTarget.dataset.id;
    let state = e.currentTarget.dataset.state;
    wx.navigateTo({
      url: '/pages/user/userInfo?id=' + id + '&silentState=' + state,
    })
  }
})
var app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_height: 0,
    blacklist: null,
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',
    btnWidth: 180,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "黑名单" //页面标题为路由参数
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    _this.setData({
      scroll_height: windowHeight
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
    //获取好友列表
    app.appRequest('GET', 'json', '/api/myFriends/getUserBlacklist', {
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      console.log(res);
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
          item[i].right = 0;
        }
        if (pageIndex == 1) {
          _this.setData({
            blacklist: []
          })
          _this.setData({
            totalPage: res.totalPage,
            blacklist: res.list,
            hideHeader: true
          })
        } else {
          var array = _this.data.blacklist;
          array = array.concat(res.list);
          _this.setData({
            totalPage: res.totalPage,
            blacklist: array,
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
  // 左滑动
  drawStart: function(e) {
    var touch = e.touches[0];
    console.log(touch);
    for (var index in this.data.blacklist) {
      var item = this.data.blacklist[index]
      item.right = 0
    }
    this.setData({
      blacklist: this.data.blacklist,
      startX: touch.clientX,
    })

  },
  drawMove: function(e) {
    var touch = e.touches[0]
    var item = this.data.blacklist[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.btnWidth) {
        disX = this.data.btnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        blacklist: this.data.blacklist
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        blacklist: this.data.blacklist
      })
    }
  },
  drawEnd: function(e) {
    var item = this.data.blacklist[e.currentTarget.dataset.index]
    if (item.right >= this.data.btnWidth / 2) {
      item.right = this.data.btnWidth
      this.setData({
        isScroll: true,
        blacklist: this.data.blacklist,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        blacklist: this.data.blacklist,
      })
    }
  },
  outBlack: function(event) {
    const _this = this;
    let id = event.currentTarget.dataset.id;
    app.appRequest('POST', 'json', '/api/myFriends/unBlacklist/'+ id, { }, (res) => {}, (err) => {
      _this.loadData();
      wx.showToast({
        title: '移除成功',
        icon: 'success'
      })
    });
   
  },
})
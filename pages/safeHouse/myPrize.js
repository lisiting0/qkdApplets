var app = getApp();
const api = require('../../js/api.js')
const util = require('../../utils/util.js')
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
    loadMoreData: '加载更多……'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "我的奖品" //页面标题为路由参数
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 微信小程序获取某个元素的高度
    let query = wx.createSelectorQuery();
    query.select('.top-bottom-gray').boundingClientRect(function (rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height
      })
    }).exec();
    _this.loadData();
  },
  loadData: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    app.appRequest('GET', 'json', '/api/prize/recordList', {
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      if (res.list) {
        let item = res.list;

        for (let i = 0; i < item.length; i++) {
          item[i].createDate = api.Fn.timeFormat(item[i].createDate, 'yyyy-MM-dd');
          if (item[i].dating && item[i].dating.jiaoyouUser) {
            item[i].dating.jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].dating.jiaoyouUser.headimgAttachmentId, 120);
          }
        }
        if (pageIndex == 1) {
          _this.setData({
            listArr: null,
          })

          _this.setData({
            totalPage: res.totalPage,
            listArr: item,
            hideHeader: true
          })
        } else {
          let array = _this.data.listArr;
          array = array.concat(item);
          _this.setData({
            totalPage: res.totalPage,
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
})
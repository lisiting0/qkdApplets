// 我的关注
var app = getApp();
const util = require('../../utils/util.js')
var sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置(下划线宽度)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    tabs: ["待评价", "已评价", "我的评价"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scroll_height: 0,
    list: null,
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',

    showTextarea: false,
    commentObjIndex: 0,
    commentObj: {
      momentId: null,
      parentId: null,
      userId: null,
      comment: null
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "我的评价" //页面标题为路由参数
    })
    const _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          sliderLeft: (res.windowWidth / _this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 微信小程序获取某个元素的高度
    let query = wx.createSelectorQuery();
    query.select('.menu-top').boundingClientRect(function(rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height
      })
    }).exec();

    _this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })

    _this.loadData();
  },
  tabClick: function(e) {
    console.log(e)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      hideHeader: true,
      hideBottom: true,
      list: null,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
    });
    this.loadData();
  },
  loadData: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    if (_this.data.activeIndex == 0) {
      //获取待评价
      app.appRequest('GET', 'json', '/api/dating/get2CommentDating', {
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        console.log(res);
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
          }
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: res.list,
              hideHeader: true
            })
          } else {
            var array = _this.data.list;
            array = array.concat(res.list);
            _this.setData({
              totalPage: res.totalPage,
              list: array,
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
    } else if (_this.data.activeIndex == 1) {
      //获取已评价
      app.appRequest('GET', 'json', '/api/comment/list', {
        businessType: 5,
        userId: _this.data.userInfo.id,
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        console.log(res);
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            item[i].rUser.headimgAttachmentId = util.getFullPath(item[i].rUser.headimgAttachmentId, 120);
          }
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: res.list,
              hideHeader: true
            })
          } else {
            var array = _this.data.list;
            array = array.concat(res.list);
            _this.setData({
              totalPage: res.totalPage,
              list: array,
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
      //获取我的评价
      app.appRequest('GET', 'json', '/api/comment/list', {
        businessType: 5,
        rid: _this.data.userInfo.id,
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        console.log(res);
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            item[i].user.headimgAttachmentId = util.getFullPath(item[i].user.headimgAttachmentId, 120);
          }
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: res.list,
              hideHeader: true
            })
          } else {
            var array = _this.data.list;
            array = array.concat(res.list);
            _this.setData({
              totalPage: res.totalPage,
              list: array,
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
  linkToUserInfo: function(event) {
    var userId = event.currentTarget.dataset.id;
    var silentState = event.currentTarget.dataset.silentState;
    wx.navigateTo({
      url: '../../pages/user/userInfo?id=' + userId + '&silentState=' + silentState
    })
  },
  toActiveDetail: function(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/affinity/act?id=' + id
    })
  },
  showComment: function(event) {
    let id = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;
    let obj = {
      momentId: null,
      parentId: null,
      userId: null,
      comment: null
    }
    obj.momentId = id
    this.setData({
      commentObjIndex: index,
      commentObj: obj,
      showTextarea: true
    })
  },
  handletouchtart: function() {
    this.setData({
      showTextarea: false
    })
  },
  sendComment: function(event) { 
    const _this = this;
    var form = event.detail.value;     
    if (form.comment == "") {
      wx.showToast({
        icon: 'none',
        title: '评论内容不能为空', 
      })
      return;
    } 
    app.appRequest('POST', 'json', '/api/comment/create', {
      businessType: 5,
      objectId: _this.data.commentObj.momentId,
      content: form.comment
    }, (result) => {
      if (result.status == 1) {
        wx.showToast({
          title: '评论成功',
        })
        var oldList = _this.data.list; //循环内容
        oldList.splice(_this.data.commentObjIndex, 1);
        _this.setData({
          list: oldList,
          showTextarea: false
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  }
})
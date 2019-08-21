// 最近来访
var app = getApp();
const util = require('../../utils/util.js')
var sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置(下划线宽度)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,
    inputVal: "",
    tabs: ["最近来访", "最近足迹"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scroll_height: 0,
    list: null,
    hideHeader: true,
    hideBottom: true,
    currentPage: 1,//页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……' 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "最近来访"//页面标题为路由参数
    })
    const _this =this;
    wx.getSystemInfo({
      // (320/2-96)/2
      success: function (res) {
        _this.setData({
          sliderLeft: (res.windowWidth / _this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 微信小程序获取某个元素的高度
    let query = wx.createSelectorQuery();   
    query.select('.menu-top').boundingClientRect(function (rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height
      })
    }).exec();

    _this.loadData();
  },
  tabClick: function (e) {
    console.log(e)
    this.setData({ 
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      list: null,
      hideHeader: true,
      hideBottom: true,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
    });
    this.loadData();
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.loadData();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.loadData();
  },
  loadData: function () {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    if(_this.data.activeIndex==0){
      //获取最近来访
      app.appRequest('GET', 'json', '/api/user/visitor', {
        searchKey: _this.data.inputVal,
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
    } else {
      //获取最近足迹
      app.appRequest('GET', 'json', '/api/user/footprint', {
        searchKey: _this.data.inputVal,
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
    setTimeout(function () {
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
    setTimeout(function () {
      console.log('下拉刷新');
      _this.setData({
        currentPage: 1,
        hideHeader: false
      })
      _this.loadData();
    }, 1000);
  },
  followFriend: function(event){
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/myFriends/follow/' + id, { 
    }, (res) => {
      console.log(res);
      if (res.status==1){
        wx.showToast({
          title: res.message,
          icon: 'success'
        })
        var isFollow = 'list[' + index + '].jiaoyouUser.isFollow';
        this.setData({ 
          [isFollow]: 1
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  unfollowFriend: function (event) {
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/myFriends/unfollow/' + id, {
    }, (res) => {
      console.log(res);
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'success'
        })
        var isFollow = 'list[' + index + '].jiaoyouUser.isFollow';
        this.setData({
          [isFollow]: 0
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    }); 
  }
})
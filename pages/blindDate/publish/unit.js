// 我的关注
var app = getApp();
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scroll_height: 0,
    isOrganizer: 1, //1代表选择主办单位，2代表协办单位
    inputShowed: false, //是否显示搜索
    searchKey: '',
    organizerList: [], //单位列表
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',

    checkOrganizerList: [], //选中的主办单位 
    checkCoOrganizerList: [], //选中的协办单位  
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "举办单位" //页面标题为路由参数
    })

    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 微信小程序获取某个元素的高度
    let query = wx.createSelectorQuery();
    query.select('.menu-top').boundingClientRect(function(rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height
      })
    }).exec();

    // 显示协办还是主办参数
    _this.setData({
      isOrganizer: options.isOrganizer
    })  
    let pubData = app.globalData.publishBlindDate;
    _this.setData({
      checkOrganizerList: pubData.checkOrganizerList,
      checkCoOrganizerList: pubData.checkCoOrganizerList
    }) 
    _this.loadData();
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      searchKey: "",
      inputShowed: false
    });
    this.loadData();
  },
  clearInput: function() {
    this.setData({
      searchKey: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      searchKey: e.detail.value
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
    //获取举办单位列表
    app.appRequest('GET', 'json', '/api/host/list', {
      unitName: _this.data.searchKey,
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          item[i].logoUrl = util.getFullPath(item[i].logoUrl, 120);
          item[i].checked = false;
          if (_this.data.isOrganizer == 1) {
            if (_this.data.checkOrganizerList.length > 0) {
              for (var j in _this.data.checkOrganizerList) { 
                if (_this.data.checkOrganizerList[j].id == item[i].id) { 
                  item[i].checked = _this.data.checkOrganizerList[j].checked;
                }
              }
            }
          } else {
            if (_this.data.checkCoOrganizerList.length > 0) {
              for (var j in _this.data.checkCoOrganizerList) {
                if (_this.data.checkCoOrganizerList[j].id == item[i].id) {
                  item[i].checked = _this.data.checkCoOrganizerList[j].checked;
                }
              }
            }
          }
        } 
        if (pageIndex == 1) {
          _this.setData({
            organizerList: []
          })
          _this.setData({
            totalPage: res.totalPage,
            organizerList: item,
            hideHeader: true
          })
        } else {
          var array = _this.data.list;
          array = array.concat(res.list);
          _this.setData({
            totalPage: res.totalPage,
            organizerList: array,
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
  checkboxChange: function(e) {
    const _this = this;
    var idx = e.target.dataset.index;
    _this.data.organizerList[idx].checked = !_this.data.organizerList[idx].checked;
    _this.setData({
      organizerList: _this.data.organizerList
    })
  },
  confirmOranizer: function() {
    const _this = this;
    if (_this.data.isOrganizer == 1) {
      let arr = [];
      for (var i in _this.data.organizerList) {
        if (_this.data.organizerList[i].checked) {
          arr.push(_this.data.organizerList[i]);
        }
      }
      _this.setData({
        checkOrganizerList: arr
      })
      if (_this.data.checkOrganizerList.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '请选择主办单位',
        })
        return false;
      }
    } else {
      let arr = [];
      for (var i in _this.data.organizerList) {
        if (_this.data.organizerList[i].checked) {
          arr.push(_this.data.organizerList[i]);
        }
      }
      _this.setData({
        checkCoOrganizerList: arr
      })
      if (_this.data.checkCoOrganizerList.length <= 0) {
        wx.showToast({
          icon: 'none',
          title: '请选择协办单位',
        })
        return false;
      }
    } 
    // 传递数据给上一个界面【选中的数据】 
    let pubData = app.globalData.publishBlindDate;  
    pubData.checkOrganizerList = _this.data.checkOrganizerList;
    pubData.checkCoOrganizerList = _this.data.checkCoOrganizerList;  
    wx.navigateBack({
      delta: 1
    })
  },

})
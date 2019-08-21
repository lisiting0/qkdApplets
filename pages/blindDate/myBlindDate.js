var app = getApp();
const util = require('../../utils/util.js')
var sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置(下划线宽度)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    tabs: ["已报名", "已关注"],
    specialTypeList: [{
        "specialTypeText": "不限"
      },
      {
        "specialTypeText": "普通"
      },
      {
        "specialTypeText": "大龄"
      },
      {
        "specialTypeText": "硕博"
      },
      {
        "specialTypeText": "公务员"
      },
      {
        "specialTypeText": "白领"
      },
      {
        "specialTypeText": "it从业人员"
      },
      {
        "specialTypeText": "高精尖人才"
      },
    ],
    lineType: {
      "1": "线上",
      "2": "线下"
    },
    specialType: null, //专场类型
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scroll_height: 0,
    list: null,
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
      title: "我的相亲" //页面标题为路由参数
    })
    const _this = this;
    _this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })

    wx.getSystemInfo({
      // (320/2-96)/2
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

    //获取专场类型字典
    app.appRequest('GET', 'json', '/api/apiDict', {
      type: "blind_dating_special_type"
    }, (res) => {
      var item = res.data;
      if (item) {
        for (let i = item.length; i--;) {
          if (!_this.data.specialType) {
            _this.data.specialType = {};
          }
          _this.data.specialType[item[i].value] = item[i].label;
        }
      }
      _this.setData({
        specialType: _this.data.specialType
      });
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    _this.loadData();
  },
  tabClick: function(e) {
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
  getClassStatus: function(item) {
    let result = {
      text: '',
      type: null, //1表示主持人编辑2表示主持人进入现场3表示用户进入现场4表示用户活动结束5表示未报名的报名已结束6表示未报名的立即报名7报名未开始8未登录立即报名
    }

    if (this.data.userInfo.identity == 1) { //主持人
      if (item.state == 2 && this.data.userInfo.identity == 1) {
        result.text = '编辑'
        result.type = 1
      } else {
        result.text = '进入现场'
        result.type = 2
      }
    } else { //用户
      if (item.isCandidate == 1) { //已报名
        if (item.state == 5) {
          result.text = '活动结束'
          result.type = 4
        } else {
          result.text = '进入现场'
          result.type = 3
        }
      } else { //未报名
        if (item.isStartEnroll == 0) { //未开始报名
          result.text = '即将开始'
          result.type = 7
        } else { //开始报名
          if (item.isStopEnroll == 1) {
            result.text = '报名结束'
            result.type = 5
          } else {
            result.text = '立即报名'
            result.type = 6
          }
        }
      }
    }
    return result;
  },
  loadData: function() {
    const _this = this;
    // 加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    if (_this.data.activeIndex == 0) {
      //获取已报名列表
      app.appRequest('GET', 'json', '/api/blindDating/searchDatingList', {
        isCandidate: _this.data.userInfo.identity == 1 ? '' : 1,
        isUnion: app.globalData.channel.isUnion,
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        console.log(res);
        if (res.list) {
          for (var i = 0; i < res.list.length; i++) {
            var item = res.list[i];
            item.coverimgImages = util.getFullPath(item.coverimgImages,720);
            item.datingDetailsExt.extDatetime = item.datingDetailsExt.extDatetime.substring(0, 10);
            item.followCount = item.followCount ? parseInt(item.followCount) + (item.id == '44a8772d3a33475dbf0f9cc67447cde9' ? 188 : (item.id == '333a3f3f6b944b5ca271e72ebd7efdf5' || item.id == '0fe7d9dbc1414c58850e97ccd9d806db' || item.id == '604a7e0fbc12413faf5e98633df0c1a5' || item.id == 'b00420d0ed98404994dcd3a94e20299a' || item.id == '15f5b21d72a0476cbae97cdd71273ccd' || item.id == '67cc0fbc61064013a05159a7a13cc5e3' || item.id == '7dcf7c14ec24431298a3d92b266b5f9f' || item.id == '0900644ac0c14f68b436be3a893ecd58') ? 180 : 0) : 0;
            item.type = _this.getClassStatus(item).type;
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
      //已关注列表
      app.appRequest('GET', 'json', '/api/blindDating/searchDatingList', {
        isFollow: 1,
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        console.log(res);
        if (res.list) {
          for (var i = 0; i < res.list.length; i++) {
            var item = res.list[i];
            res.list[i].coverimgImages = util.getFullPath(res.list[i].coverimgImages, 720);
            res.list[i].datingDetailsExt.extDatetime = res.list[i].datingDetailsExt.extDatetime.substring(0, 10);
            res.list[i].followCount = item.followCount ? parseInt(item.followCount) + (item.id == '44a8772d3a33475dbf0f9cc67447cde9' ? 188 : (item.id == '333a3f3f6b944b5ca271e72ebd7efdf5' || item.id == '0fe7d9dbc1414c58850e97ccd9d806db' || item.id == '604a7e0fbc12413faf5e98633df0c1a5' || item.id == 'b00420d0ed98404994dcd3a94e20299a' || item.id == '15f5b21d72a0476cbae97cdd71273ccd' || item.id == '67cc0fbc61064013a05159a7a13cc5e3' || item.id == '7dcf7c14ec24431298a3d92b266b5f9f' || item.id == '0900644ac0c14f68b436be3a893ecd58') ? 180 : 0) : 0;
            res.list[i].type = _this.getClassStatus(item).type;
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
  }
})
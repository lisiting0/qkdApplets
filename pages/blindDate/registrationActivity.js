const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHidePublishBtn: true,
    userInfo: null,
    searchValue: null,
    animate: 'myfirst',
    yesorno: 'none',
    flag: true,
    test: 'test1',
    location: 0,
    cityName: '',
    cityId: 0,
    region: ['广东省', '广州市', '海珠区'],
    locationText: '选择地点',
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
    specialTypeVal: '',
    datingTime: '',
    startDate: '',
    endDate: '',
    specialType: null, //专场类型
    lineType: {
      "1": "线上",
      "2": "线下"
    },
    scroll_height: 0,
    listArr: null,
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……'
  },
  onUnload: function() {

  },
  onShow: function() {
    var that = this
    that.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "相亲广场" //页面标题为路由参数
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 微信小程序获取某个元素的高度
    let query = wx.createSelectorQuery();
    query.select('.search').boundingClientRect(function(rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height - 10
      })
    }).exec();

    var info = wx.getStorageSync("userInfo");
    _this.setData({
      startDate: util.getToday(new Date()),
      endDate: util.getToday(new Date()),
      userInfo: info,
      showHidePublishBtn: info.identity != 1 ? false : true,
    })
    //获取专场类型字典
    app.appRequest('GET', 'json', '/api/apiDict', {
      type: "blind_dating_special_type"
    }, (res) => {
      console.log(res);
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

    //加载相亲活动列表
    _this.loadData();
  },
  getIsAdmin(item) {
    const t = this;
    if (item.adminList && item.adminList.length > 0) {
      let isAdmin = item.adminList.filter((val) => {
        return val.userId == this.data.userInfo.id;
      });
      if (isAdmin.length > 0) {
        return true;
      }
    }
    return false;
  },
  getClassStatus: function(item) {
    const _this = this;
    let result = {
      text: '',
      type: null, //1表示主持人编辑2表示主持人进入现场3表示用户进入现场4表示用户活动结束5表示未报名的报名已结束6表示未报名的立即报名7报名未开始8未登录立即报名
    }
    if (!_this.data.userInfo.id) {
      if (item.isStartEnroll == 0) { //未开始报名
        result.text = '即将开始'
        result.type = 7
      } else { //开始报名
        if (item.isStartEnroll == 1 && item.isStopEnroll == 0) {
          result.text = '立即报名'
          result.type = 6
        } else if (item.state == 5) {
          result.text = '活动结束'
          result.type = 4
        } else {
          result.text = '报名截止'
          result.type = 5
        }
      }
    } else {
      if (_this.data.userInfo.id == item.jiaoyouUser.id || _this.getIsAdmin(item)) { //主持人 
        if (item.state == 2 && _this.data.userInfo.id == item.jiaoyouUser.id) {
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
            if (item.state == 5) {
              result.text = '活动结束'
              result.type = 4
            } else if (item.isStopEnroll == 1) {
              result.text = '报名截止'
              result.type = 5
            } else {
              result.text = '立即报名'
              result.type = 6
            }
          }
        }
      }
    }
    return result;
  },
  // 加载数据
  loadData: function() {
    const _this = this;
    // 加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    //获取相亲列表
    app.appRequest('GET', 'json', '/api/blindDating/searchDatingList', {
      areaId: _this.data.location == 1 ? _this.data.cityId : '',
      beginActivityStarttime: _this.data.datingTime == 1 ? _this.data.startDate + " 00:00:01" : "",
      endActivityStarttime: _this.data.datingTime == 1 ? _this.data.endDate + " 23:59:59" : "",
      'datingDetailsExt.extInt5': _this.data.specialTypeVal,
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      console.log(res);
      if (res.list) {
        for (var i = 0; i < res.list.length; i++) {
          var item = res.list[i];
          item.coverimgImages = util.getFullPath(item.coverimgImages, 720);
          item.datingDetailsExt.extDatetime = item.datingDetailsExt.extDatetime.substring(0, 10);
          item.followCount = item.followCount ? parseInt(item.followCount) + (item.id == '44a8772d3a33475dbf0f9cc67447cde9' ? 188 : (item.id == '333a3f3f6b944b5ca271e72ebd7efdf5' || item.id == '0fe7d9dbc1414c58850e97ccd9d806db' || item.id == '604a7e0fbc12413faf5e98633df0c1a5' || item.id == 'b00420d0ed98404994dcd3a94e20299a' || item.id == '15f5b21d72a0476cbae97cdd71273ccd' || item.id == '67cc0fbc61064013a05159a7a13cc5e3' || item.id == '7dcf7c14ec24431298a3d92b266b5f9f' || item.id == '0900644ac0c14f68b436be3a893ecd58') ? 180 : 0) : 0;
          item.type = _this.getClassStatus(item).type;
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
  filter: function() {
    this.setData({
      yesorno: 'block',
      test: 'test1',
      flag: false
    })

  },
  closeFilter() {
    this.setData({
      yesorno: 'none',
      test: 'test2',
      flag: true
    })
  },
  confirm: function() {
    const _this = this;
    _this.setData({
      test: 'test2',
      yesorno: 'none',
      flag: true,
      currentPage: 1
    })
    if (_this.data.locationText) {
      _this.setData({
        searchValue: _this.data.locationText
      })
    }
    if (_this.data.specialTypeVal) {
      _this.setData({
        searchValue: _this.data.specialType[_this.data.specialTypeVal] + '专场'
      })
    }

    if (_this.data.locationText && _this.data.specialTypeVal) {
      _this.setData({
        searchValue: _this.data.locationText + "·" + _this.data.specialType[_this.data.specialTypeVal] + '专场'
      })
    }

    if (_this.data.location == 1) {
      app.appRequest('GET', 'json', '/api/district/all', {}, (res) => {
        var item = res.data;
        if (item) {
          for (var i in item) {
            if (item[i].name == _this.data.cityName) {
              var cityId = item[i].value;
              _this.setData({
                cityId: cityId
              })
              break;
            }
          }
          _this.loadData();
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    }
  },
  locationClick: function(e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      location: num
    })
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    if (this.data.locationText) {
      this.setData({
        cityName: e.detail.value[1].substring(0, 2),
        locationText: e.detail.value[0].substring(0, 2) + "·" + e.detail.value[1].substring(0, 2) + "·" + e.detail.value[2].substring(0, 2)
      })
    }
  },
  datingTimeClick: function(e) {
    var time = e.currentTarget.dataset.time;
    this.setData({
      datingTime: time
    })
  },
  bindStartDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value
    })
  },
  bindEndDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  specialTypeClick: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      specialTypeVal: index
    })
  },
  publish: function() {
    const _this = this;
    _this.setData({
      showHidePublishBtn: false
    })
    wx.navigateTo({
      url: '/pages/blindDate/publishBlindDate'
    })
  },
  linkTo: function(event) {
    const _this = this;
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/blindDate/publishBlindDate?id=' + id
    })
  }
})
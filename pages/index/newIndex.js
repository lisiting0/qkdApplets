const util = require('../../utils/util.js')
const api = require('../../js/api.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_height: 0, //滚动高度
    isLogin: false, //是否登录
    userInfo: null, //个人信息
    layoutType: 2, //模式2 
    yesorno: 'none',
    flag: true,
    test: 'test1',

    sex: -1, //性别

    location: -1, //地区-1不限
    areaName: '',
    areaId: '', //市Id
    region: ['广东省', '广州市', '海珠区'],
    locationText: '请选择地区',

    minIncome: -1, //最低收入
    maxIncome: -1, //最高收入
    incomeVal: -1, //不限，如果为1则是选择了范围 
    incomeIndex: [0, 0], //选中索引 
    incomeLVal: null, //联动显示的值
    incomeRVal: null, //联动显示的值
    incomeRArr: [], //右边数组 
    incomeArr: [{
      name: '不限',
      value: 0
    },
    {
      name: '2千元',
      value: 2000
    },
    {
      name: '4千元',
      value: 4000
    },
    {
      name: '6千元',
      value: 6000
    },
    {
      name: '1万元',
      value: 10000
    },
    {
      name: '2万元',
      value: 20000
    },
    {
      name: '5万元',
      value: 50000
    },
    ],
    //选中的数组
    incomeList: [],

    // 认证
    certification: {
      none: 1,
      idStatus: 0,
      videoStatus: 0,
      carStatus: 0,
      houseStatus: 0,
    }, // ["不限""身份认证", "视频认证", "车辆认证", "房产认证"],


    education: -1, //学历 
    educationList: [], //学历集合

    minHeight: -1, //身高-1表示无要求

    minAge: -1, //最小年龄
    maxAge: -1, //最大年龄


    distance: -1,
    distanceArr: [{
      text: "不限",
      val: -1
    }, {
      text: "10km以内",
      val: 10000
    }, {
      text: "20km以内",
      val: 20000
    }, {
      text: "40km以内",
      val: 40000
    }, {
      text: "60km以内",
      val: 60000
    }, {
      text: "80km以内",
      val: 80000
    }],

    //模式2 
    imgWidth: 0,
    loadingCount: 0,
    col1: [],
    col2: [],

    // 模式4需要用的参数
    scrollindex: 0, //当前页面的索引值
    totalnum: 1000, //总共页面数
    starty: 0, //开始的位置x
    endy: 0, //结束的位置y
    critical: 80, //触发翻页的临界值
    margintop: 0, //滑动下拉距离  

    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    pageSize: 30,
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '附近的人',
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度 
    let imgWidth = windowWidth * 0.48;
    // 微信小程序获取某个元素的高度宽度
    // let query = wx.createSelectorQuery();
    // query.select('.search').boundingClientRect(function(rect) {
    //   _this.setData({
    //     scroll_height: windowHeight - rect.height
    //   })
    // }).exec();

    _this.setData({
      scroll_height: windowHeight,
      imgWidth: imgWidth,
      isLogin: app.globalData.isLogin,
      userInfo: wx.getStorageSync('userInfo'),
    })
    // 加载数据
    _this.loadData();
    _this.getIncome();
    _this.getEducation();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  loadData: function () {
    const _this = this;
    var pageIndex = _this.data.currentPage;
    //获取相亲列表
    app.appRequest('GET', 'json', '/api/user/nearUser', {
      sex: _this.data.sex > 0 ? _this.data.sex : '',
      idStatus: _this.data.certification.idStatus > 0 ? _this.data.certification.idStatus : '',
      houseStatus: _this.data.certification.houseStatus > 0 ? _this.data.certification.houseStatus : '',
      carStatus: _this.data.certification.carStatus > 0 ? _this.data.certification.carStatus : '',
      healthyStatus: _this.data.certification.healthyStatus > 0 ? _this.data.certification.healthyStatus : '',
      videoStatus: _this.data.certification.videoStatus > 0 ? _this.data.certification.videoStatus : '',
      minAge: _this.data.minAge > 0 ? _this.data.minAge : '',
      maxAge: _this.data.maxAge > 0 ? _this.data.maxAge : '',
      minIncome: _this.data.minIncome > 0 ? _this.data.minIncome : '',
      maxIncome: _this.data.maxIncome > 0 ? _this.data.maxIncome : '',
      maxDistance: _this.data.distance > 0 ? _this.data.distance : '',
      'userExt.liveAreaId': _this.data.areaId,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      page: pageIndex,
      rows: _this.data.pageSize
    }, (res) => {
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          item[i].headimgAttachmentId = util.getFullPath(item[i].headimgAttachmentId, 720);
          if (item[i].distance) {
            item[i].distance = api.Fn.toRound(item[i].distance / 1000, 2);
          }
          if (item[i].coverimgAttachementId) {
            let img = item[i].coverimgAttachementId.split(",");
            for (var j = 0; j < img.length; j++) {
              if (img[j] != "") {
                item[i].coverimgAttachementId = util.getFullPath(img[0], 720);
              }
            }
          }
        }
        if (pageIndex == 1) {
          _this.setData({
            nearArr: []
          })
          _this.setData({
            loadingCount: item.length, //模式2
            totalPage: res.totalPage,
            nearArr: item,
            hideHeader: true
          })
        } else {
          var array = _this.data.nearArr;
          array = array.concat(item);
          _this.setData({
            loadingCount: item.length, //模式2
            totalPage: res.totalPage,
            nearArr: array,
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
          loadMoreData: '已加载全部数据',
          hideBottom: false
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  loadAllData: function () {
    const _this = this;
    var pageIndex = _this.data.currentPage;
    //获取相亲列表
    app.appRequest('GET', 'json', '/api/user/nearUser', {
      sex: _this.data.sex > 0 ? _this.data.sex : '',
      idStatus: _this.data.certification.idStatus > 0 ? _this.data.certification.idStatus : '',
      houseStatus: _this.data.certification.houseStatus > 0 ? _this.data.certification.houseStatus : '',
      carStatus: _this.data.certification.carStatus > 0 ? _this.data.certification.carStatus : '',
      healthyStatus: _this.data.certification.healthyStatus > 0 ? _this.data.certification.healthyStatus : '',
      videoStatus: _this.data.certification.videoStatus > 0 ? _this.data.certification.videoStatus : '',
      minAge: _this.data.minAge > 0 ? _this.data.minAge : '',
      maxAge: _this.data.maxAge > 0 ? _this.data.maxAge : '',
      minIncome: _this.data.minIncome > 0 ? _this.data.minIncome : '',
      maxIncome: _this.data.maxIncome > 0 ? _this.data.maxIncome : '',
      maxDistance: _this.data.distance > 0 ? _this.data.distance : '',
      'userExt.liveAreaId': _this.data.areaId,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      page: 1,
      rows: 100000
    }, (res) => {
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          item[i].headimgAttachmentId = util.getFullPath(item[i].headimgAttachmentId, 240);
          if (item[i].distance) {
            item[i].distance = api.Fn.toRound(item[i].distance / 1000, 2);
          }
          if (item[i].coverimgAttachementId) {
            let img = item[i].coverimgAttachementId.split(",");
            for (var j = 0; j < img.length; j++) {
              if (img[j] != "") {
                item[i].coverimgAttachementId = util.getFullPath(img[0], 240);
              }
            }
          }
        }
        _this.setData({
          nearArr: []
        })
        _this.setData({
          totalnum: res.count, //模式4
          totalPage: res.totalPage,
          nearArr: item,
          hideHeader: true
        })
        if (_this.data.currentPage == _this.data.totalPage) {
          _this.setData({
            loadMoreData: '已加载全部数据',
            hideBottom: false
          })
        }
        if (_this.data.layoutType == 2) {
          _this.setDataNear();
        }
      } else {
        _this.setData({
          loadMoreData: '已加载全部数据',
          hideBottom: false
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  loadMore() {
    var _this = this;
    if (_this.data.currentPage == _this.data.totalPage) {
      _this.setData({
        hideBottom: false,
        loadMoreData: '已加载全部数据'
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
        currentPage: tempCurrentPage,
        hideBottom: false
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
  // 打开筛选条件
  filter: function () {
    this.setData({
      yesorno: 'block',
      test: 'test1',
      flag: false
    })

  },
  // 关闭筛选条件
  closeFilter() {
    this.setData({
      yesorno: 'none',
      test: 'test2',
      flag: true
    })
  },
  // 选择性别
  sexClick: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      sex: num
    })
  },
  // 选择地区
  locationClick: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      location: num
    })
  },
  // 改变选择地区
  bindRegionChange(e) {
    this.setData({
      location: 0,
      region: e.detail.value
    })
    if (this.data.locationText) {
      this.setData({
        areaName: e.detail.value[1].substring(0, 2),
        locationText: e.detail.value[0].substring(0, 2) + "·" + e.detail.value[1].substring(0, 2) + "·" + e.detail.value[2].substring(0, 2)
      })
    }
  },
  // 收入范围
  incomeClick: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      incomeVal: num
    })
  },
  // 获取收入范围
  getIncome() {
    const _this = this;
    let incomeAll = _this.data.incomeArr;
    let incomeL = [];
    let incomeR = [];
    for (let i = 0; i < incomeAll.length; i++) {
      incomeL.push(incomeAll[i].name);
      incomeR.push(incomeAll[i].name);
    }
    _this.setData({
      incomeList: [incomeL, incomeR],
    })
  },
  bindIncomeChange: function (e) {
    const _this = this;
    let incomeLVal = _this.data.incomeArr[e.detail.value[0]].value;
    let incomeRVal = _this.data.incomeArr[e.detail.value[1]].value;
    if (incomeLVal == 0 && incomeRVal == 0) {
      _this.setData({
        incomeVal: -1,
        incomeRVal: 0,
        "incomeIndex[0]": 0,
        "incomeIndex[1]": 0
      })
    } else {
      _this.setData({
        incomeVal: 0,
        incomeRVal: incomeRVal,
        "incomeIndex[0]": e.detail.value[0],
        "incomeIndex[1]": e.detail.value[1]
      })
    }
  },
  bindIncomeColumnChange: function (e) {
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.incomeArr;
        var incomeLVal = _this.data.incomeArr[e.detail.value]['value'];
        let incomR = []; //第二列名字数组
        let incomeRArr = []; //第二列数据(名字+value)  
        if (e.detail.value != 0) {
          for (var i = 0; i < all.length; i++) {
            if (all[i].value > incomeLVal || all[i].value == 0) {
              incomR.push(all[i].name);
              incomeRArr.push({
                name: all[i].name,
                value: all[i].value
              })
            }
          }
        } else {
          for (var i = 0; i < all.length; i++) {
            incomR.push(all[i].name);
            incomeRArr.push({
              name: all[i].name,
              value: all[i].value
            })
          }
        }
        _this.setData({
          "incomeList[1]": incomR,
          "incomeIndex[0]": e.detail.value,
          "incomeIndex[1]": 0,
          incomeLVal: incomeLVal,
          incomeRArr: incomeRArr,
        })
        break;
    }
  },
  // 认证
  certificationClick: function (event) {
    let val = event.currentTarget.dataset.certification;
    const _this = this;
    if (val != 0) {
      _this.setData({
        'certification.none': 0
      })
    }
    if (val == 0) {
      let none = _this.data.certification.none == 0 ? _this.data.certification.none = 1 : _this.data.certification.none = 0;
      _this.setData({
        'certification.none': none,
        'certification.idStatus': 0,
        'certification.videoStatus': 0,
        'certification.carStatus': 0,
        'certification.houseStatus': 0,
      })
    } else if (val == 1) {
      let idStatus = _this.data.certification.idStatus == 0 ? _this.data.certification.idStatus = 1 : _this.certification.data.idStatus = 0
      _this.setData({
        'certification.idStatus': idStatus,
      })
    } else if (val == 2) {
      let videoStatus = _this.data.certification.videoStatus == 0 ? _this.data.certification.videoStatus = 1 : _this.certification.data.videoStatus = 0
      _this.setData({
        'certification.videoStatus': videoStatus,
      })
    } else if (val == 3) {
      let carStatus = _this.data.certification.carStatus == 0 ? _this.data.certification.carStatus = 1 : _this.certification.data.carStatus = 0
      _this.setData({
        'certification.carStatus': carStatus,
      })
    } else if (val == 4) {
      let houseStatus = _this.data.certification.houseStatus == 0 ? _this.data.certification.houseStatus = 1 : _this.certification.data.houseStatus = 0
      _this.setData({
        'certification.houseStatus': houseStatus,
      })
    }
  },
  // 获取学历
  getEducation() {
    const _this = this;
    //获取专场类型字典
    app.appRequest('GET', 'json', '/api/apiDict/enum', {
      type: "ExpEducationEnum"
    }, (res) => {
      _this.setData({
        educationList: res.data
      });
      console.log(_this.data.educationList);
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  educationClick: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      education: num
    })
  },
  // 身高
  heightClick: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      minHeight: num
    })
  },
  //年龄
  ageClick: function (e) {
    var min = e.currentTarget.dataset.min;
    var max = e.currentTarget.dataset.max;
    this.setData({
      minAge: min,
      maxAge: max
    })
  },
  //距离
  distanceClick: function (e) {
    var num = e.currentTarget.dataset.num;
    this.setData({
      distance: num,
    })
  },

  // 筛选确定
  confirm: function () {
    const _this = this;
    _this.setData({
      test: 'test2',
      flag: true,
      yesorno: 'none',
      hideHeader: true,
      hideBottom: true,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
      nearArr: null,
      col1: null,
      col2: null,
    })
    if (_this.data.location == 0) {
      app.appRequest('GET', 'json', '/api/district/all', {}, (res) => {
        var item = res.data;
        if (item) {
          for (var i in item) {
            if (item[i].name == _this.data.areaName) {
              var areaId = item[i].value;
              _this.setData({
                areaId: areaId
              })
              break;
            }
          }
        }
        if (_this.data.layoutType == 4) {
          _this.loadAllData();
        } else {
          _this.loadData();
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    }
  },
  changeLayout: function () {
    const _this = this.data;
    _this.layoutType++;
    if (_this.layoutType > 4) {
      _this.layoutType = 1;
    }
    this.setData({
      hideHeader: true,
      hideBottom: true,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
      nearArr: null,
      col1: null,
      col2: null,
      layoutType: _this.layoutType
    })
    if (_this.layoutType == 4) {
      this.loadAllData();
    } else {
      this.loadData();
    }
  },
  scrollTouchstart: function (e) {
    let py = e.touches[0].pageY;
    // console.log(py);
    this.setData({
      starty: py
    })
  },
  scrollTouchend: function (e) {
    let py = e.changedTouches[0].pageY;
    let d = this.data;
    this.setData({
      endy: py,
    })
    if (py - d.starty > d.critical && d.scrollindex > 0) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    } else if (py - d.starty < -(d.critical) && d.scrollindex < this.data.totalnum - 1) {
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({
      starty: 0,
      endy: 0,
      margintop: 0
    })
  },
  // 模式2加载
  onUsersLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度 
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度

    let nearArr = this.data.nearArr;
    let obj = null;

    for (let i = 0; i < nearArr.length; i++) {
      let arr = nearArr[i];
      if (arr.id === imageId) {
        obj = arr;
        break;
      }
    }

    obj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    //判断当前图片添加到左列还是右列
    if (col1.length <= col2.length) {
      col1.push(obj);
    } else {
      col2.push(obj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };
    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.nearArr = [];
    }
    this.setData(data);
  },
  toUserInfo: function (event) {
    const _this = this;
    var id = event.currentTarget.dataset.id;
    var silentState = event.currentTarget.dataset.state;
    if (silentState) {
      wx.navigateTo({
        url: '/pages/user/userInfo?id=' + id + "&silentState=" + silentState,
      })
    } else {
      wx.navigateTo({
        url: '/pages/user/userInfo?id=' + id,
      })
    }
  },
  // 左滑动 
  drawMove: function (e) {
    var touch = e.touches[0],
      touchMoveX = e.touches[0].clientX, //滑动变化坐标 
      id = e.currentTarget.dataset.id;
    console.log(touchMoveX);
    if (touchMoveX < 0) {
      wx.navigateTo({
        url: '/pages/user/userInfo?id=' + id,
      })
    }
  },
  changeFollow: function (event) {
    const _this = this;
    let item = event.currentTarget.dataset.item;
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    console.log(item.isFollow)
    if (item.isFollow == 0) {
      app.appRequest('POST', 'x-www-form-urlencoded', '/api/myFriends/follow/' + id, {}, (res) => {
        if (res.status == 1) {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
          var isFollow = 'nearArr[' + index + '].isFollow';
          this.setData({
            [isFollow]: 1
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    } else {
      app.appRequest('POST', 'x-www-form-urlencoded', '/api/myFriends/unfollow/' + id, {}, (res) => {
        if (res.status == 1) {
          wx.showToast({
            title: res.message,
            icon: 'success'
          })
          var isFollow = 'nearArr[' + index + '].isFollow';
          this.setData({
            [isFollow]: 0
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    }
  },
  followFriend: function (event) { //关注好友接口 
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    var col = event.currentTarget.dataset.col;
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/myFriends/follow/' + id, {}, (res) => {
      console.log(res);
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
        var isFollow = null;
        if (col == 1) {
          isFollow = 'col1[' + index + '].isFollow';
        } else {
          isFollow = 'col2[' + index + '].isFollow';
        }
        this.setData({
          [isFollow]: 1
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  unfollowFriend: function (event) { //取消关注好友接口
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    var col = event.currentTarget.dataset.col;
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/myFriends/unfollow/' + id, {}, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'success'
        })
        var isFollow = null;
        if (col == 1) {
          isFollow = 'col1[' + index + '].isFollow';
        } else {
          isFollow = 'col2[' + index + '].isFollow';
        }
        this.setData({
          [isFollow]: 0
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
})
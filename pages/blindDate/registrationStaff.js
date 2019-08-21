const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    animate: 'myfirst',
    yesorno: 'none',
    flag: true,
    test: 'test1',

    id: null,
    showFilter: false,
    placeholder: '',
    sex: ["不限", "女", "男"],
    sexVal: 0,


    ageVal: "",
    ageIndex: [0, 0], //选中的数组
    ageLArr: [], //第一列18-60岁数据
    ageRArr: [], //第二列18-60岁数据(临时保存，会改变)
    ageList: [], //列表
    ageLVal: null, //联动显示的值
    ageRVal: null, //联动显示的值

    minHeight: -1, //最小身高
    maxHeight: -1, //最大身高
    heightVal: -1,
    heightIndex: 0, //选中索引
    heightArr: [{
        name: '150cm及以上',
        value: '150'
      },
      {
        name: '155cm及以上',
        value: '155'
      },
      {
        name: '160cm及以上',
        value: '160'
      },
      {
        name: '165cm及以上',
        value: '165'
      },
      {
        name: '170cm及以上',
        value: '170'
      },
      {
        name: '175cm及以上',
        value: '175'
      },
      {
        name: '180cm及以上',
        value: '180'
      },
      {
        name: '185cm及以上',
        value: '185'
      },
      {
        name: '190cm及以上',
        value: '190'
      },
      {
        name: '195cm及以上',
        value: '195'
      },
      {
        name: '200cm及以上',
        value: '200'
      },
      {
        name: '205cm及以上',
        value: '205'
      },
      {
        name: '210cm及以上',
        value: '210'
      },
    ],
    heightList: [], //列表

    minIncome: -1, //最低收入
    maxIncome: -1, //最高收入
    incomeVal: -1, //获取值相应的文字
    incomeIndex: 0, //选中索引
    incomeArr: [{
        name: '2千以下',
        value: '1'
      },
      {
        name: '2-4千元',
        value: '2'
      },
      {
        name: '4-6千元',
        value: '3'
      },
      {
        name: '6千-1万元',
        value: '4'
      },
      {
        name: '1-1.5万元',
        value: '5'
      },
      {
        name: '1.5-2万元',
        value: '6'
      },
      {
        name: '2-2.5万元',
        value: '7'
      },
      {
        name: '5万以上',
        value: '8'
      },
    ],
    //选中的数组
    incomeList: [],

    educationVal: "",
    educationTextArr: {
      0: '大专以下',
      10: '大专',
      11: '本科',
      12: '硕士',
      13: '博士',
      14: '出国留学'
    },

    userMoney: 0,
    candidateId: '',
    aliasName: '',

    scroll_height: 0,
    listArr: null,
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
      title: "报名人员" //页面标题为路由参数
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
      id: options.id,
      userInfo: info,
      userMoney: info.userMoney
    })
    //加载相亲活动列表
    _this.loadData();
    // 获取年龄组
    _this.getAge();
    // 获取身高组
    _this.getHeight();
    // 获取收入组
    _this.getIncome();
  },
  onReady: function() {
    //获得礼物组件
    this.gifts = this.selectComponent("#gifts");
  },
  getAge() {
    const _this = this;
    let ageAll = [];
    let ageLName = [];
    let ageRName = [];
    for (let i = 18; i <= 60; i++) {
      if (i == 18) {
        ageAll.push({
          name: '不限',
          value: '不限',
        })
        ageLName.push('不限');
        for (let k = i + 1; k <= 60; k++) {
          ageAll.push({
            name: k + '岁',
            value: k,
          })
          ageLName.push(k + '岁')
          ageRName.push(k + '岁')
        }

      }
    }
    _this.setData({
      ageLArr: ageAll,
      ageList: [ageLName, ageRName],
    })
  },
  getHeight() {
    const _this = this;
    let list = [];
    for (let i = 0; i < _this.data.heightArr.length; i++) {
      list.push(_this.data.heightArr[i].name)
    }
    _this.setData({
      heightList: list,
    })
  },
  getIncome() {
    const _this = this;
    let list = [];
    for (let i = 0; i < _this.data.incomeArr.length; i++) {
      list.push(_this.data.incomeArr[i].name)
    }
    _this.setData({
      incomeList: list,
    })
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
    app.appRequest('GET', 'json', '/api/blindDating/getDatingCandidateList', {
      datingId: _this.data.id,
      minAge: _this.data.ageVal == 1 ? _this.data.ageLVal : "",
      maxAge: _this.data.ageVal == 1 ? _this.data.ageRVal : "",
      education: _this.data.educationVal,
      minHeight: _this.data.minHeight,
      maxHeight: _this.data.maxHeight,
      minIncome: _this.data.minIncome,
      maxIncome: _this.data.maxIncome,
      candidateSex: _this.data.sex,
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      if (res.list) {
        for (var i = 0; i < res.list.length; i++) {
          var item = res.list[i];
          item.jiaoyouUser.headimgAttachmentId = util.getFullPath(item.jiaoyouUser.headimgAttachmentId,240);
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
  sexClick: function(e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      sexVal: index
    })
  },
  ageClick: function(e) {
    var val = e.currentTarget.dataset.val;
    this.setData({
      ageVal: val
    })
  },
  // 默认数据添加之后需要在每次滚动选择的时候，请求加载对应的数据，监听picker滚动函数
  bindMultiPickerColumnChange: function(e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.ageLArr;
        var ageLVal = _this.data.ageLArr[e.detail.value]['value'];
        let ageRName = []; //第二列名字数组
        let ageRArr = []; //第二列数据(名字+value)  
        if (e.detail.value != 0) {
          for (var i = 0; i < all.length; i++) {
            if (all[i].value > ageLVal) {
              ageRName.push(all[i].name);
              ageRArr.push({
                name: all[i].name,
                value: all[i].value
              })
            }
          }
          // 将参数添加到原数组开头，并返回数组的长度 
          if (ageRName[0] != "不限") {
            ageRName.unshift('不限');
            ageRArr.unshift('不限');
          }
        } else {
          for (var i = 0; i < all.length; i++) {
            ageRName.push(all[i].name);
            ageRArr.push({
              name: all[i].name,
              value: all[i].value
            })
          }
          // 删除原数组第一项
          if (ageRName[0] == "不限") {
            ageRName.shift();
            ageRArr.shift();
          }
        }
        _this.setData({
          "ageList[1]": ageRName,
          "ageIndex[0]": e.detail.value,
          "ageIndex[1]": 0,
          ageLVal: ageLVal,
          ageRArr: ageRArr,
        })
        break;
    }
  },
  bindAgeChange: function(e) {
    const _this = this;
    let ageRVal = _this.data.ageRArr[e.detail.value[1]].value;
    _this.setData({
      ageVal: 1,
      ageRVal: ageRVal,
      "ageIndex[0]": e.detail.value[0],
      "ageIndex[1]": e.detail.value[1]
    })
  },
  heightClick: function(e) {
    var val = e.currentTarget.dataset.val;
    this.setData({
      heightVal: val
    })
  },
  bindHeightChange: function(e) {
    const _this = this;
    let minHeight = _this.data.heightArr[e.detail.value].value;
    _this.setData({
      heightVal: 0,
      minHeight: minHeight,
      maxHeight: -1,
      heightIndex: e.detail.value,
    })
  },
  incomeClick: function(e) {
    var val = e.currentTarget.dataset.val;
    this.setData({
      incomeVal: val
    })
  },
  bindIncomeChange: function(e) {
    const _this = this;
    let minIncome = _this.data.incomeArr[e.detail.value].value;
    if (minIncome == '1') {
      _this.data.minIncome = -1;
      _this.data.maxIncome = 2000;
    } else if (minIncome == '2') {
      _this.data.minIncome = 2000;
      _this.data.maxIncome = 4000;
    } else if (minIncome == '3') {
      _this.data.minIncome = 4000;
      _this.data.maxIncome = 6000;
    } else if (minIncome == '4') {
      _this.data.minIncome = 6000;
      _this.data.maxIncome = 10000;
    } else if (minIncome == '5') {
      _this.data.minIncome = 10000;
      _this.data.maxIncome = 15000;
    } else if (minIncome == '6') {
      _this.data.minIncome = 15000;
      _this.data.maxIncome = 20000;
    } else if (minIncome == '7') {
      _this.data.minIncome = 20000;
      _this.data.maxIncome = 25000;
    } else if (minIncome == '8') {
      _this.data.minIncome = 50000;
      _this.data.maxIncome = -1;
    }
    _this.setData({
      incomeVal: 0,
      minIncome: _this.data.minIncome,
      maxIncome: _this.data.maxIncome,
      incomeIndex: e.detail.value,
    })
  },
  educationClick: function(e) {
    var val = e.currentTarget.dataset.val;
    this.setData({
      educationVal: val
    })
  },
  addGood: function(event) {
    wx.showLoading({
      title: '',
    })
    let userId = event.currentTarget.dataset.userid;
    let index = event.currentTarget.dataset.index;
    app.appRequest('POST', 'json', '/api/scene/marriage2/add_good', {
      likingUserId: userId,
    }, (res) => {
      wx.hideLoading();
      var isGood = 'listArr[' + index + '].jiaoyouUser.isGood';
      this.setData({
        [isGood]: 1
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  delGood: function(event) {
    wx.showLoading({
      title: '',
    })
    let userId = event.currentTarget.dataset.userid;
    let index = event.currentTarget.dataset.index;
    app.appRequest('POST', 'json', '/api/scene/marriage2/delete_good', {
      likingUserId: userId,
    }, (res) => {
      wx.hideLoading();
      var isGood = 'listArr[' + index + '].jiaoyouUser.isGood';
      this.setData({
        [isGood]: 0
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  clickShowGift: function(event) {
    console.log("进来了")
    const _this = this;
    let username = event.currentTarget.dataset.username;
    let userid = event.currentTarget.dataset.userid;
    let id = _this.data.id;
    if (_this.data.userInfo.id == userid) {
      wx.showToast({
        icon: 'none',
        title: "不能给自已打赏",
      })
      return false;
    }
    _this.setData({
      aliasName: username,
      candidateId: userid,
    })
    _this.gifts.showGift();
  },
  reward: function(event) {
    wx.showLoading({
      title: '',
    })
    const _this = this;
    let data = {
      "receiverUser.id": event.detail.candidateId,
      "objectId": '',
      "giftId": event.detail.giftId,
      "amount": 1, //打赏数，默认是1
    }
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/userGift/give', data, (result) => {
      if (result.status == 1) {
        wx.hideLoading();
        wx.showToast({
          title: result.message,
        })
        let userInfo = wx.getStorageSync("userInfo");
        userInfo.userMoney = _this.data.userMoney;
        wx.setStorageSync("userInfo", userInfo)
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  confirm: function() {
    const _this = this;
    _this.setData({
      test: 'test2',
      flag: true,
      currentPage: 1
    })
    if (_this.data.locationText) {
      _this.setData({
        searchValue: _this.data.locationText
      })
    } 
    _this.loadData();
  },
})
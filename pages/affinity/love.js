const util = require('../../utils/util.js') 
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    yesorno: 'none',
    scroll_height: 0,
    love: 0,
    type: 0,
    nearArr: [],
    datingType: {
      "1": "选",
      "2": "抢",
      "3": "竞",
      "4": "中",
      "5": "配"
    },
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',

    twice_appoint: "",
    appointment: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "约会" //页面标题为路由参数
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度 
    // 微信小程序获取某个元素的高度宽度
    let query = wx.createSelectorQuery();
    query.select('.menu-top').boundingClientRect(function(rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height
      })
    }).exec();
    _this.getAppointmentDesc();
    // 加载数据
    _this.loadData();
  },
  onUnload: function () {

  },
  getAppointmentDesc() {
    const _this = this;
    //获取专场类型字典
    app.appRequest('GET', 'json', '/api/apiDict', {
      type: "appointment_desc"
    }, (res) => {
      var item = res.data;
      let twice_appoint = '';
      let appointment = '';
      if (item) {
        for (let i = 0; i < item.length; i++) {
          if (item[i].value == "twice_appoint") {
            twice_appoint = item[i].remarks;
          }
          if (item[i].value == "appointment") {
            appointment = item[i].remarks;
          }
        }
        _this.setData({
          twice_appoint: twice_appoint,
          appointment: appointment
        });
      }

    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  loadData: function() {
    const _this = this;
    var pageIndex = _this.data.currentPage;
    //获取相亲列表
    app.appRequest('GET', 'json', '/api/dating/searchDatingList', {
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      console.log(res);
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120); 
          if (item[i].activityStarttime) {
            item[i].activityStarttime = item[i].activityStarttime.substring(0, 10);
          }
          if (item[i].datingStarttime) {
            item[i].datingStarttime = item[i].datingStarttime.substring(0, 10);
          } 
          if (item[i].showPic) {
            let showPic = item[i].showPic.split(",");
            for (var j = 0; j < showPic.length; j++) {
              if (showPic[j] != "") {
                item[i].showPic = util.getFullPath(showPic[j], 240);
                console.log(item[i].showPic);
              }
            }
          }
        }
        if (pageIndex == 1) {
          _this.setData({
            nearArr: []
          })
          _this.setData({
            totalPage: res.totalPage,
            nearArr: res.list,
            hideHeader: true
          })
        } else {
          var array = _this.data.nearArr;
          array = array.concat(res.list);
          _this.setData({
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
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  loadMore() {
    var _this = this;
    if (_this.data.currentPage == _this.data.totalPage) {
      _this.setData({
        loadMoreData: '已加载全部数据'
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
    setTimeout(function() {
      console.log('下拉刷新');
      _this.setData({
        currentPage: 1,
        hideHeader: false
      })
      _this.loadData();
    }, 1000);
  },
  changeImage: function(event) {
    var _this = this;
    _this.setData({
      love: event.currentTarget.dataset.love,
      nearArr: null,
      hideHeader: true,
      hideBottom: true,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
    })
    _this.loadData();
  },
  changeType: function(event) {
    var _this = this;
    _this.setData({
      type: event.currentTarget.dataset.type,
      nearArr: null,
      hideHeader: true,
      hideBottom: true,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
    })
    _this.loadData();
  },
  openChooseThemes: function(event) {
    var _this = this;
    _this.setData({
      yesorno: 'block',
      flag: false,
    })
  },
  closeChooseThemes: function(event) {
    var _this = this;
    _this.setData({
      yesorno: 'none',
      flag: true,
    })
  },
  chooseThemes: function(event) {
    const _this = this;
    _this.setData({
      yesorno: 'none',
      flag: true,
    })
    let index = event.currentTarget.dataset.index;
    if (index == 1) {
      wx.navigateTo({
        url: 'publishAppointment'
      })
    } else {
      wx.navigateTo({
        url: 'publishDate'
      })
    }
  }
})
var app = getApp();
const api = require('../../js/api.js')
const util = require('../../utils/util.js')
const sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置(下划线宽度)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["乾坤币", "收益", "支出"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scroll_height: 0,
    animate: 'myfirst',
    yesorno: 'none',
    flag: true,
    test: 'test1',

    showSel: false, 
    billObj: null,
    typeList: {
      "0": "全部",
      "1": "打赏",
      "2": "签到",
      "3": "推广",
      "4": "充值",
      "5": "中奖",
      "6": "活动消耗",
      "7": "购物",
      "8": "活动置顶",
      "9": "活动报名",
      "10": "抽奖",
      "11": "任务"
    },
    objList: {
      "2": "每日签到",
      "11": "每日首充",
      "16": "每日商城首购",
      "32": "每日首次送礼",
      "25": "完善资料",
      "20": "第一次充值奖励",
      "17": "缴纳保证金",
      "31": "认证资料",
      "33": "分享乾坤岛介绍",
      "34": "分享相亲广场",
      "35": "邀请好友注册",
      "36": "分享乾坤有爱,玲珑相约",
      "37": "分享乾坤有爱,旅途有情",
      "38": "分享合伙人介绍",
      "39": "分享区域合伙人招募",
      "40": "分享用户赚钱攻略",
      "41": "分享乾坤有爱•月老在线（青年专场）",
      "42": "分享乾坤有爱--月老在线（大龄专场）",
      "43": "分享乾坤有爱--月老在线（二度缘专场）",
      "44": "分享乾坤有爱•情牵常春藤",
      "45": "分享乾坤有爱•眉目传情（三高专场）",
      "46": "分享乾坤有爱•眉目传情（二度缘专场）",
      "47": "分享普通合伙人招募"
    },
    typeIndex: 0,
    month: new Date().getMonth() + 1 + "月", //本月
    minPrice: '',
    curMinPrice: '',
    maxPrice: '',
    curMaxPrice: '', 
    transObj: null,
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
      title: "账单" //页面标题为路由参数
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
        scroll_height: windowHeight - rect.height - 38
      })
    }).exec();

    _this.loadData();
  },
  tabClick: function(e) {
    this.setData({ 
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      billObj: null,
      transObj: null,
      hideHeader: true,
      hideBottom: true,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
    });
    this.loadData();
  },
  showSel: function(e) {
    this.setData({
      showSel: !e.currentTarget.dataset.showHide,
      yesorno: 'block',
      test: 'test1',
      flag: false
    });
  },
  closeFilter() {
    this.setData({
      showSel: false,
      yesorno: 'none',
      test: 'test2',
      flag: true
    })
  },
  finish() {
    this.setData({
      yesorno: 'none',
      test: 'test2',
      flag: true,
      showSel: false,
    })
    this.loadData();
  },
  changeType: function(e) {
    var typeIndex = e.currentTarget.dataset.index
    this.setData({
      typeIndex: typeIndex
    })
  },
  inputMinPrice: function(event) {
    const _this = this;
    var val = event.detail.value;
    if (val && typeof val == 'string') {
      if (val.match(/^0\d+/) && val.match(/^0\d+/)[0]) { //先排除0开头不跟小数点的 
        _this.setData({
          minPrice: val.match(/^0\d*/)[0].split("")[1]
        })
      } else {
        _this.setData({
          minPrice: val.match(/^\d+\.?\d*/) && val.match(/^\d+\.?\d*/)[0]
        })
      }
    }
  },
  inputMaxPrice: function(event) {
    const _this = this;
    var val = event.detail.value;
    if (val && typeof val == 'string') {
      if (val.match(/^0\d+/) && val.match(/^0\d+/)[0]) { //先排除0开头不跟小数点的
        _this.setData({
          maxPrice: val.match(/^0\d*/)[0].split("")[1]
        })
      } else {
        _this.setData({
          maxPrice: val.match(/^\d+\.?\d*/) && val.match(/^\d+\.?\d*/)[0]
        })
      }
    }
  },
  loadData: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    _this.setData({
      curMinPrice: _this.data.minPrice,
      curMaxPrice: _this.data.maxPrice
    }) 
    let price = {};
    if (!_this.data.curMinPrice) { //最低
      price["beginJiaobiAmount"] = _this.data.curMinPrice;
    }
    if (!_this.data.curMaxPrice) { //最高
      price["endJiaobiAmount"] = _this.data.curMaxPrice;
    }
    if (_this.data.activeIndex == 0) {
      //获取最近来访
      app.appRequest('GET', 'json', '/api/record/myList', {
        channel: _this.data.activeIndex != 0 ? _this.data.activeIndex : '',
        beginJiaobiAmount: price ? price["beginJiaobiAmount"] : '',
        endJiaobiAmount: price ? price["endJiaobiAmount"] : '',
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {  
        if (res.list) {
          let item = res.list; 
          

          let billObj = {};
          for (let i = 0; i < item.length; i++) {
            let month = api.Fn.timeFormat(item[i].createDate, "MM") + "月";
            var billObjMonth = 'billObj[month]';
            var billObjList = 'billObj[month][list]';
            if (!_this.data.billObj || !_this.data.billObj[month]) {
              _this.setData({
                billObj: {},
                month: {
                  list: []
                },
                billObjList: item
              })
            }
            if (!billObj[month]) {
              billObj[month] = {
                list: [],
                in: _this.data.billObj && _this.data.billObj[month] ? api.Fn.toFixed(_this.data.billObj[month]["in"]) : null,
                out: _this.data.billObj && _this.data.billObj[month] ? api.Fn.toFixed(_this.data.billObj[month]["out"]) : null
              };
            }
            if (billObj[month]["in"] == null || billObj[month]["out"] == null) {
              try {
                billObj[month]["in"] = 0;
                billObj[month]["out"] = 0;
                app.appRequest('GET', 'json', '/api/record/count', {
                  date: api.Fn.timeFormat(item[i].createDate, "yyyy-MM-dd"),
                  page: pageIndex,
                  rows: app.globalData.pageSize
                }, (res) => {
                  billObj[month]["in"] = api.Fn.toFixed(res.data.incomeCount) || 0;
                  billObj[month]["out"] = api.Fn.toFixed(res.data.payCount) || 0;
                })
              } catch (e) {
                console.log(e);
              }
            }
            billObj[month].list.push(item[i]);
          }
          if (pageIndex == 1) {
            _this.setData({
              transList: null,
              transObj: null,
            })

            _this.setData({
              totalPage: res.totalPage,
              billObj: billObj,
              hideHeader: true
            }) 
          } else {
            let array = _this.data.billObj; 
            array = array.concat(billObj);
            _this.setData({
              totalPage: res.totalPage,
              billObj: array,
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
      let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
      // 微信小程序获取某个元素的高度
      let query = wx.createSelectorQuery();
      query.select('.menu-top').boundingClientRect(function(rect) {
        _this.setData({
          scroll_height: windowHeight - rect.height
        })
      }).exec();  

      if (_this.data.pageIndex == 1) {
        _this.setData({
          transObj: null,
          billObj: null
        }) 
      }

      if (_this.data.activeIndex == 1) {
        // 充值套餐或者保证金的记录
        app.appRequest('GET', 'json', '/api/cashRecord/myList', {
          page: pageIndex,
          rows: app.globalData.pageSize
        }, (res) => { 
          if (res.list) {
            let item = res.list;
            let transObj = _this.data.transObj || {};
            item.forEach((v, i) => {
              let month = api.Fn.timeFormat(v.createDate, "yyyy年MM月");
              if (!transObj[month]) {
                transObj[month] = {
                  list: []
                };
              }
              transObj[month].list.push(v);
            });

            if (pageIndex == 1) {
              _this.setData({
                totalPage: res.totalPage,
                transObj: transObj,
                hideHeader: true
              })
            } else {
              var array = _this.data.transObj;
              array = array.concat(transObj);
              _this.setData({
                totalPage: res.totalPage,
                transObj: array,
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
        //  可提现余额的 收支明细
        app.appRequest('GET', 'json', '/api/recharge/myList', {
          page: pageIndex,
          rows: app.globalData.pageSize
        }, (res) => { 
          if (res.list) {
            let item = res.list;
            let transObj = {};
            item.forEach((v, i) => {
              let month = api.Fn.timeFormat(v.createDate, "yyyy年MM月");
              if (!transObj[month]) {
                transObj[month] = {
                  list: []
                };
              }
              transObj[month].list.push(v);
            }); 

            if (pageIndex == 1) {  
              _this.setData({
                totalPage: res.totalPage,
                transObj: transObj,
                hideHeader: true
              })
              console.log(_this.data.transObj);
            } else {
              var array = _this.data.transObj;
              array = array.concat(transObj);
              _this.setData({
                totalPage: res.totalPage,
                transObj: array,
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
})
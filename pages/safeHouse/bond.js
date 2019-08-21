var app = getApp()
var sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置(下划线宽度)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    tabs: ["特权说明", "缴纳记录"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    animate: 'myfirst',
    yesorno: 'none',
    flag: true,
    test: 'test1',
    bondList: null,//保证金等级
    bondReList: null,//保证金充值记录
    payType: { wxpay: "微信支付", alipay: "支付宝支付" },
    payIndex: "wxpay",
    typeIndex: 0,
    time: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "保证金" //页面标题为路由参数
    })
    const _this = this; 
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          sliderLeft: (res.windowWidth / _this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
    _this.setData({
      userInfo: wx.getStorageSync("userInfo")
    }) 

    app.appRequest('GET', 'json', '/api/bond/list', { }, (res) => {
      if (res.data) {         
        _this.setData({
          bondList: res.data
        }) 
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
      });

    app.appRequest('GET', 'json', '/api/recharge/myList', {
      page: 1,
      rows: app.globalData.pageSize,
      payType: 1,
    }, (res) => {
      if (res.list) {
        _this.setData({
          bondReList: res.list
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  tabClick: function (e) { 
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,   
    }); 
  },
  jf: function(event){
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
  changeDeposit: function(event){ 
    let index = event.currentTarget.dataset.index;
    this.setData({
      typeIndex: index
    })
  },
  bindPayIndex: function (event) { 
    this.setData({
      payIndex: event.currentTarget.dataset.payindex
    })
  },
  submit:function(){
    wx.showToast({
      title: '当前环境不支持该支付方式',
      icon: 'none'
    })
  }
})
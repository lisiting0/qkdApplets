var app = getApp();
const util = require('../../utils/util.js')
const apiJS = require('../../js/api.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    actDatingId: '',
    enrollFee: '',

    orderInfo: null,
    payType: {
      wxpay: "微信支付",
      alipay: "支付宝支付"
    },
    payIndex: "wxpay",
    time: -1,
    topay: false,
    isUnion: '',
    unionFrom: '',
    userInfo: null,
    channel: null
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
      enrollFee: options.enrollFee,
      actDatingId: options.actDatingId,
    }) 
    _this.getRechargePackage();
  },  
  onUnload: function () {
    clearInterval();
  },
  getRechargePackage() {
    const t = this;
    try {
      // if (sessionStorage) {
      //   t.data.isUnion = sessionStorage.getItem('isUnion');
      //   t.data.unionFrom = sessionStorage.getItem('unionFrom');
      // } 
      let data = {
        id: t.data.actDatingId || t.data.id,
        isUnion: (app.globalData.channel.isUnion && app.globalData.channel.jyNumber ? app.globalData.channel.jyNumber : app.globalData.channel.isUnion) || t.data.isUnion,
      }
      app.appRequest('POST', 'json', '/api/blindDating/candidate', data, (res) => {
        if (res.data) {
          if (res.data.price) {
            res.data.price = apiJS.Fn.toFixed(res.data.price);
          } else {
            res.data.price = '0.00';
          }
          if (res.data.money) {
            res.data.money = apiJS.Fn.toFixed(res.data.money);
          } else {
            res.data.money = '0.00';
          }
          t.setData({
            orderInfo: res.data
          }) 
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    } catch (e) {
      wx.navigateBack({
        delta: 1,
      })
      wx.showToast({
        title: e.message,
        icon: 'none',
      })
    }
  },
  bindPayIndex: function(event) { 
    this.setData({
      payIndex: event.currentTarget.dataset.payindex
    })
  },
  recharge() { //充值
    const t = this; 
    if (t.data.topay) {
      return false;
    }
    t.data.topay = true;
    wx.showLoading({
      title: '',
    })
    // let api = window.api || "";

    let payIndex = 'publicWxPay';
    app.appRequest('GET', 'json', '/api/pay/payOrder', {
      oderId: t.data.orderInfo.id,
      payid: t.data.payIndex
    }, (res) => {
      if (res.data.paySuccess) {
        t.data.time = 5;
        let timeout = setInterval(() => {
          t.data.time--;
          t.data.time = t.data.time < 0 ? -1 : t.data.time;
          if (t.data.time < 0) {
            wx.hideLoading();
            clearInterval(timeout);
            t.data.topay = false;
            t.data.hiddenPayWin(true);
          }
        }, 1000);
        return false;
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    // if (api || t.$store.state.isWeixin) {
    //   if (payResult.data.status == 1) {
    //     if (payIndex == 'publicWxPay') {
    //       let onBridgeReady = () => {
    //         WeixinJSBridge.invoke(
    //           'getBrandWCPayRequest', {
    //             ...payResult.data.data
    //           },
    //           function(res) {
    //             //alert("支付信息:"+JSON.stringify(res));
    //             if (res.err_msg == "get_brand_wcpay_request:ok") {
    //               // 使用以上方式判断前端返回,微信团队郑重提示：
    //               //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
    //               t.data.time = 5;
    //               // t.isloading = true;
    //               let timeout = setInterval(() => {
    //                 t.data.time--;
    //                 t.data.time = t.data.time < 0 ? -1 : t.data.time;
    //                 if (t.data.time < 0) {
    //                   t.isloading = false;
    //                   clearInterval(timeout);
    //                   t.data.topay = false;
    //                   t.data.hiddenPayWin(true);
    //                 }
    //               }, 1000);
    //             } else {
    //               wx.hideLoading();
    //               t.data.topay = false;
    //             }
    //           });
    //       }
    //       if (typeof WeixinJSBridge == "undefined") {
    //         if (document.addEventListener) {
    //           document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    //         } else if (document.attachEvent) {
    //           document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
    //           document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    //         }
    //       } else {
    //         onBridgeReady();
    //       }
    //     } else if (payIndex == "wxpay") {
    //       let wxPay = api.require('wxPay');
    //       let wxSetting = {};
    //       wxSetting["apiKey"] = payResult.data.data.appid;
    //       wxSetting["orderId"] = payResult.data.data.prepayid;
    //       wxSetting["mchId"] = payResult.data.data.partnerid;
    //       wxSetting["nonceStr"] = payResult.data.data.noncestr;
    //       wxSetting["timeStamp"] = payResult.data.data.timestamp;
    //       wxSetting["package"] = payResult.data.data.package;
    //       wxSetting["sign"] = payResult.data.data.sign;
    //       wxPay.payOrder(wxSetting, function(ret, err) {
    //         if (ret.status) {
    //           t.data.time = 5;
    //           t.data.isloading = true;
    //           let timeout = setInterval(() => {
    //             t.data.time--;
    //             t.data.time = t.data.time < 0 ? -1 : t.data.time;
    //             if (t.data.time < 0) {
    //               t.data.isloading = false;
    //               clearInterval(timeout);
    //               t.data.topay = false;
    //               t.data.hiddenPayWin(true);
    //             }
    //           }, 1000);
    //         } else {
    //           wx.hideLoading();
    //           wx.showToast({
    //             title: "支付失败:" + err.code,
    //             icon: 'none'
    //           })
    //           t.setData({
    //             topay: false
    //           })
    //         }
    //       });
    //     } else if (payIndex == "alipay") {
    //       //alert("alipay.data:"+JSON.stringify(payResult.data.data));
    //       let aliPayPlus = api.require('aliPayPlus');
    //       aliPayPlus.payOrder({
    //         orderInfo: payResult.data.data
    //       }, function(ret, err) {
    //         //alert("alipay.code:"+JSON.stringify(ret));
    //         //9000：支付成功
    //         //8000：正在处理中，支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
    //         //4000：订单支付失败
    //         //5000：重复请求
    //         //6001：用户中途取消支付操作
    //         //6002：网络连接出错
    //         //6004：支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
    //         //0001：缺少商户配置信息（商户id，支付公钥，支付密钥）
    //         //0002：缺少参数（subject、body、amount、tradeNO）
    //         //0003：签名错误（公钥私钥错误）
    //         if (ret.code == 9000) { //成功
    //           t.data.time = 5;
    //           // t.isloading = true;
    //           let timeout = setInterval(() => {
    //             t.data.time--;
    //             t.data.time = t.data.time < 0 ? -1 : t.data.time;
    //             if (t.data.time < 0) {
    //               // t.isloading = false;
    //               clearInterval(timeout);
    //               t.topay = false;
    //               t.hiddenPayWin(true);
    //             }
    //           }, 1000);
    //         } else {
    //           wx.hideLoading();
    //           wx.showToast({
    //             title: '支付失败',
    //             icon: 'none',
    //           })
    //         }
    //       });
    //     }
    //   } else {
    //     wx.hideLoading();
    //     wx.showToast({
    //       title: payResult.data.message,
    //       icon: 'none',
    //     })
    //   }

    // } else {
      wx.hideLoading();
      wx.showToast({
        title: '当前环境不支持该支付方式',
        icon: 'none',
      })
    // }
  }
})
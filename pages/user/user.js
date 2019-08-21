var QR = require("../../utils/qrcode.js");
const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: '../../images/user_top.jpg',
    visitorCount: 0,
    city: '',
    flag: true,
    yesorno: 'none',
    userInfo: null,
    qrcodeValue: "",
    imagePath: '',
    canvasHidden: false,
    news: {},
    closeTime: '',
    applyList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: "" //页面标题为路由参数
    })

    wx.enablePullDownRefresh = false

    var info = wx.getStorageSync("userInfo");
    var headimgAttachmentId = '';
    //头像
    if (info.headimgAttachmentId) {
      headimgAttachmentId = util.getFullPath(info.headimgAttachmentId, 240);
    }
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res)
        if (res.latitude && res.longitude) {
          wx.request({ // ②百度地图API，将微信获得的经纬度传给百度，获得城市等信息
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + app.globalData.baiduKey + '&location=' + res.latitude + ',' + res.longitude + '&output=json&coordtype=wgs84ll',
            header: {
              'Content-Type': 'application/json'
            },
            success: function(res) {
              // console.log(res.data.result);
              // console.log(res.data.result.addressComponent.city + res.data.result.addressComponent.district);
              //③.我们将微信得到的位置名称“故宫博物馆”与百度地图API得到的“北京市东城区”合并显示在页面上。
              _this.setData({
                city: res.data.result.addressComponent.city,
              })
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
        }
      }
    })

    app.appRequest('GET', 'json', '/api/user/userUnreadVisitNumer', {}, (newsResult) => {
      _this.setData({
        userInfo: info,
        qrcodeValue: app.globalData.baseURL + '/api/account/publicAddressLoginUrl?&state=user' + (app.globalData.isLogin ? '__pid_' + info.jyNumber + "_id_" + info.id : ''),
        'userInfo.headimgAttachmentId': headimgAttachmentId,
        news: newsResult.data || {
          newFanCount: 0,
          newFriendCount: 0,
          vistorCount: 0
        }
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
      });
      
    var size = this.setCanvasSize(); //动态设置画布大小 
    this.createQrCode(this.data.qrcodeValue, "mycanvas", size.w, size.h);

    // 获取最近开始的活动时间
    _this.closestActivityTime();
    _this.getVisitor();
    _this.getApplyList();

  },
  onUnload: function() {
    clearInterval();
  },
  getVisitor() {
    const _this = this;
    let visitor = 0;
    try {
      app.appRequest('GET', 'json', '/api/user/visitor', {
        page: 1,
        rows: 1,
      }, (result) => {}, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
        _this.setData({
          visitorCount: res.count || 0
        })
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 420; //不同屏幕下canvas的适配比例；设计稿是750宽 686是因为样式wxss文件中设置的大小
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },
  /**
   * 绘制二维码图片
   */
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },
  /**
   * 获取临时缓存照片路径，存入data中
   */
  canvasToTempImage: function() {
    var that = this;
    //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },
  openQrcodeModal: function() {
    this.setData({
      yesorno: 'block',
      flag: false
    })
  },
  closeQrcodeModal: function() {
    this.setData({
      yesorno: 'none',
      flag: true
    })
  },
  linkToUserInfo: function() {
    wx.navigateTo({
      url: '../../pages/user/userInfo?id=' + wx.getStorageSync('userId')
    })
  },
  linkTo: function(event) {
    var url = event.currentTarget.dataset.url;
    var active = event.currentTarget.dataset.active;
    if (util.isBlank(active)) {
      active = '';
      wx.navigateTo({
        url: '/pages/' + url
      })
    } else {
      wx.navigateTo({
        url: '/pages/' + url + '?active=' + active
      })
    }
  },
  closestActivityTime: function() {
    app.appRequest('GET', 'json', '/api/dating/closestActivityTime', {}, (result) => {
      console.log("消息数：" + result.data);
      if (result.data) {
        setInterval(() => {
          let date1 = result.data;
          let date2 = new Date(); //当前时间
          let date3 = new Date(date1).getTime() - date2.getTime(); //时间差的毫秒数
          if (date3 > 0) {
            //计算出相差天数
            let days = Math.floor(date3 / (24 * 3600 * 1000))
            //计算出小时数
            let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000))
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000);
            if (hours < 10) {
              hours = "0" + hours;
            }
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            if (hours <= 0 && minutes <= 0 && seconds <= 0) {
              hours = "00";
              minutes = "00";
              seconds = "00";
            }
            if (days <= 1 && hours <= 1) {
              this.setData({
                closeTime: minutes + ":" + seconds
              })
              return this.data.closeTime;
            }
          } else {
            clearInterval();
          }
        }, 1000);
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  linkToShop: function() {
    wx.navigateTo({
      url: '/pages/other/shop'
    })
  },
  getApplyList() {
    const _this = this;
    try {
      app.appRequest('GET', 'json', '/api/user/findApply', {
        status: 1,
        page: 1,
        rows: 3
      }, (res) => {
        if (res.list) {
          for (var index in res.list) {
            res.list[index].user.headimgAttachmentId = util.getFullPath(res.list[index].user.headimgAttachmentId, 120);
          }
          _this.setData({
            applyList: res.list
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  },
})
var QR = require("../../utils/qrcode.js");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    userInfo: {},
    qrcodeValue: "",
    imagePath: '',
    canvasHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    wx.setNavigationBarTitle({
      title: "邀请好友"//页面标题为路由参数
    })

    var info = wx.getStorageSync("userInfo");
    _this.setData({ 
      userInfo: info,
      qrcodeValue: app.globalData.baseURL + '/api/account/publicAddressLoginUrl?&state=user' + (app.globalData.isLogin ? '__pid_' + info.jyNumber + "_id_" + info.id : '')
    })
    var size = this.setCanvasSize(); //动态设置画布大小 
    this.createQrCode(this.data.qrcodeValue, "mycanvas", size.w, size.h);  
  }, 
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
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
  createQrCode: function (url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage();
    }, 1000);
  },
  /**
   * 获取临时缓存照片路径，存入data中
   */
  canvasToTempImage: function () {
    var that = this;
    //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  }, 
})
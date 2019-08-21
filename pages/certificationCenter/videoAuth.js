var app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    id: "",
    device: false,
    tempImagePath: "", // 拍照的临时图片地址
    tempThumbPath: "", // 录制视频的临时缩略图地址
    tempVideoPath: "", // 录制视频的临时视频地址
    camera: false,
    ctx: {},
    startRecord: false,
    time: 0,
    timeLoop: "",
    userInfo: null,
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '视频认证',
    })
    var info = wx.getStorageSync("userInfo");
    this.setData({
      ctx: wx.createCameraContext(),
      userInfo: info
    })
    this.viewCertification();
  },
  onUnload: function () {
    clearInterval();
  },
  viewCertification(){
    const _this = this;
    app.appRequest('GET', 'json', '/api/user/certificationInfo/'+6, {}, (res) => {
      console.log("获取认证信息:" + res.data);
      if (res.data) {
        if (res.data.result != "0") {
          _this.setData({
            tempVideoPath: util.getFullPath(res.data.attachment1, 240),
            id: res.data.id
          })
        } 
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 切换相机前后置摄像头
  devicePosition() {
    this.setData({
      device: !this.data.device,
    })
    console.log("当前相机摄像头为:", this.data.device ? "后置" : "前置");
  },
  camera() {
    let { ctx, startRecord } = this.data;
    if (!startRecord) {
      console.log("开始录视频");
      this.setData({
        startRecord: true
      });
      // 30秒倒计时
      let t1 = 0;
      let timeLoop = setInterval(() => {
        t1++;
        this.setData({
          time: t1,
        })
        // 最长录制30秒
        if (t1 == 30) {
          clearInterval(timeLoop);
          this.stopRecord(ctx);
        }
      }, 1000);
      this.setData({
        timeLoop
      })
      // 开始录制
      ctx.startRecord({
        success: (res) => {
          console.log(res);
        },
        fail: (e) => {
          console.log(e);
        }
      })
    }
    else {
      this.stopRecord(ctx);
    }
  },
  // 停止录制
  stopRecord(ctx) {
    const _this = this;
    console.log("停止录视频");
    clearInterval(_this.data.timeLoop);
    ctx.stopRecord({
      success: (res) => {
        _this.setData({
          tempThumbPath: res.tempThumbPath,
          tempVideoPath: res.tempVideoPath,
          camera: false,
          startRecord: false,
          time: 0
        });
        wx.uploadFile({
          url: app.globalData.imageUploadUrl + '/api/user/upload_pic',
          filePath: _this.data.tempVideoPath,
          name: 'image',
          header: {
            "Content-Type": "multipart/form-data",
            'Authorization': 'Bearer ' + wx.getStorageSync('token')
          },
          success: function (upload) { 
            //注意：wx.uploadFile获取的结果要用解析json--JSON.parse
            var data = JSON.parse(upload.data);  
            app.appRequest('POST', 'json', '/api/user/userCertification', {
              id: _this.data.id,
              type: 6,//视频认证
              attachment1: data.data.path
            }, (result) => {
              console.log(result);
              if (result.status == 1) {
                wx.showToast({
                  title: "上传视频成功",
                  icon: 'success'
                })
              } else {
                wx.showToast({
                  title: '上传视频失败',
                  image: '../../images/warn-icon.png'
                })
              }
            }, (err) => {
              console.log('请求错误信息：  ' + err.errMsg);
            });
          },
          fail: function (fail) {
            var resData = fail;
          },
          complete: function () {
            // complete
          }
        }) 
      },
      fail: (e) => {
        console.log(e);
      }
    }) 
  },
  // 打开模拟的相机界面
  open() {
    this.setData({
      camera: true
    })
  },
  // 关闭模拟的相机界面
  close() {
    console.log("关闭相机");
    this.setData({
      camera: false
    })
  }
})
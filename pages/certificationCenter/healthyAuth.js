var app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    id: "",
    attachment1: "", // 拍照的临时图片地址 
    userInfo: null,
    certificationResult: {}, //获取认证信息
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: '健康认证',
    })
    var info = wx.getStorageSync("userInfo");
    this.setData({
      ctx: wx.createCameraContext(),
      userInfo: info
    })
    this.viewCertification();
  },
  viewCertification() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/user/certificationInfo/' + 5, {}, (res) => {
      console.log("获取认证信息:" + res.data);
      if (res.data) {
        if (res.status == 1) {
          _this.setData({
            certificationResult: res.data,
            attachment1: util.getFullPath(res.data.attachment1, 240),
            id: res.data.id
          })
        }
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  uploadImage: function(options) {
    const _this = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        _this.upload(tempFilePaths);
      }
    })
  },
  upload: function(path) {
    const _this = this;
    wx.showToast({
        icon: "loading",
        title: "正在上传"
      }),

      wx.uploadFile({
        url: app.globalData.imageUploadUrl + '/api/user/upload_pic',
        filePath: path[0],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        // formData: {
        //   //和服务器约定的token, 一般也可以放在header中
        //   'session_token': wx.getStorageSync('session_token')
        // },
        success: function(res) { //上传成功返回数据
          console.log('上传成功返回的数据', JSON.parse(res.data).data)
          var data = JSON.parse(res.data);
          if (data.status == 1) {
            _this.setData({
              attachment1: util.getFullPath(data.data.path, 240)
            })
          } else {
            wx.showToast({
              title: '提示',
              content: '上传失败'
            })
            return;
          }
        },
        fail: function(e) {
          console.log(e);
          wx.showToast({
            title: '提示',
            content: '上传失败'
          })
        },
        complete: function() {
          wx.hideToast(); //隐藏Toast
        }
      })
  },
  submit() {
    const _this = this;
    if (!_this.data.attachment1) {
      wx.showToast({
        title: '请上传图片',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    })
    app.appRequest('POST', 'json', '/api/user/userCertification', {
      id: _this.data.id,
      type: 5, //健康认证
      attachment1: _this.data.attachment1,
    }, (result) => {
      console.log(result);
      if (result.status == 1) {
        wx.showToast({
          title: "上传成功",
          icon: 'success'
        })
        setTimeout(() => {
          wx.switchTab({
            url: "../../pages/user/user"
          })
        }, 500)
      } else {
        wx.showToast({
          title: '上传失败',
          image: '../../images/warn-icon.png'
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
})
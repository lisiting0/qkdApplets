var app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    id: "",
    userInfo: null,
    attachment1: "", // 正面
    attachment2: "", // 反面
    inputName: "",
    inputIdNo: "",
    certificationResult: {}
  },
  onLoad() {
    const _this = this;
    wx.setNavigationBarTitle({
      title: '身份认证',
    })
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度 
    _this.setData({
      scroll_height: windowHeight - 48
    })

    // 获取用户信息
    var info = wx.getStorageSync("userInfo");
    _this.setData({
      userInfo: info
    })
    _this.viewCertification();
  },
  viewCertification() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/user/certificationInfo/' + 1, {}, (res) => {
      console.log("获取认证信息:" + res.data);
      if (res.data) {
        if (res.status == 1) {
          _this.setData({
            certificationResult: res.data,
            id: res.data.id,
            attachment1: util.getFullPath(res.data.attachment1),
            attachment2: util.getFullPath(res.data.attachment2),
            inputName: res.data.attachment3,
            inputIdNo: res.data.attachment4
          })
        }
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  inputName: function(e) {
    this.setData({
      inputName: e.detail.value
    });
  },
  inputIdNo: function(e) {
    this.setData({
      inputIdNo: e.detail.value
    });
  },
  uploadImage: function(options) {
    console.log(options)
    const _this = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (options.currentTarget.dataset.id == '0') { //正面
          _this.setData({
            isAttachment1: true
          })
        } else {
          _this.setData({
            isAttachment1: false
          })
        }
        _this.upload(tempFilePaths);
      }
    })
  },
  upload: function(path) {
    const _this = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });

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
        console.log('上传成功返回的数据', JSON.parse(res.data));
        var data = JSON.parse(res.data);
        if (data.status == 1) {
          if (_this.data.isAttachment1) {
            _this.setData({
              attachment1: util.getFullPath(data.data.path, 240)
            })
          } else {
            _this.setData({
              attachment2: util.getFullPath(data.data.path, 240)
            })
          }
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
        title: '请上传身份证正面照',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (!_this.data.attachment2) {
      wx.showToast({
        title: '请上传身份证反面照',
        image: '../../images/warn-icon.png'
      })
      return;
    }

    if (!_this.data.inputName) {
      wx.showToast({
        title: '请输入您的真实姓名',
        image: '../../images/warn-icon.png'
      })
      return;
    }

    if (!_this.data.inputIdNo) {
      wx.showToast({
        title: '请输入您的身份证号码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    wx.showToast({
      icon: "loading",
      title: "正在提交"
    })
    app.appRequest('POST', 'json', '/api/user/userCertification', {
      id: _this.data.id,
      type: 1, //车产认证 
      attachment1: _this.data.attachment1,
      attachment2: _this.data.attachment2,
      attachment3: _this.data.inputName,
      attachment4: _this.data.inputIdNo
    }, (result) => {
      console.log(result);
      if (result.status == 1) {
        wx.showToast({
          title: "提交成功",
          icon: 'success'
        })
        setTimeout(() => {
          wx.switchTab({
            url: "../../pages/user/user"
          })
        }, 500)
      } else {
        wx.showToast({
          title: '提交失败',
          image: '../../images/warn-icon.png'
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
})
var app = getApp();
const util = require('../../utils/util.js')
Page({
  data: {
    id: "",
    carSystemId: "",
    carSystemName: "选择品牌",
    userInfo: null,
    chooseCarTye: false,
    carTypeList: [], // 车品牌列表
    brandId: "", // 车品牌ID
    brandName: "", // 车品牌名称
    infoArr: [], // 车型
    animationData: {},
    inputShowed: false,
    inputVal: "",
    scroll_height: 0,
    isAttachment1: true,
    attachment1: "", // 正面
    attachment2: "", // 反面
    certificationResult: {}
  },
  onLoad() {
    const _this = this;
    wx.setNavigationBarTitle({
      title: '车产认证',
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
    _this.getCarBrandInfo();
  },
  viewCertification() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/user/certificationInfo/' + 3, {}, (res) => {
      console.log("获取认证信息:" + res.data);
      if (res.data) {
        if (res.status == 1) {
          _this.setData({
            certificationResult: res.data,
            id: res.data.id,
            carSystemName: res.data.appendInfo1,
            attachment1: util.getFullPath(res.data.attachment1, 240),
            attachment2: util.getFullPath(res.data.attachment2, 240),
          })
        }
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 展开选择品牌
  chooseCarBrand: function(e) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(200).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseCarTye: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  // 隐藏选择品牌
  hideModal() {
    const that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseCarTye: false
      })
    }, 200)
  },
  // 搜索框
  showInput: function(event) {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  getCarBrandInfo: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    //获取车系
    app.appRequest('GET', 'json', '/api/user/getCarBrandInfo', {}, (result) => {
      console.log(result);
      if (result.data) {
        _this.setData({
          carTypeList: result.data,
          brandId: result.data[0].id,
          brandName: result.data[0].name
        })
        _this.getCarTypeInfo();
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    // 隐藏加载框
    wx.hideLoading();
  },
  getCarTypeInfo: function(event) {
    console.log(event);
    const _this = this; 
    var id = "";
    var name = "";
    if (event == undefined) {
      id = _this.data.brandId;
      name = _this.data.brandName;
    } else {
      id = event.currentTarget.dataset.id;
      name = event.currentTarget.dataset.name;
    }
    // 加载框
    wx.showLoading({
      title: '加载中',
      icon: 'loading'
    });
    //获取车型号
    app.appRequest('GET', 'json', '/api/user/getCarTypeInfo/' + id, {}, (result) => {
      console.log(result);
      if (_this.data.brandId != id) {
        _this.setData({
          infoArr: [],
          carSystemId: null
        })
      }
      _this.setData({
        brandId: id,
        brandName: name
      })
      console.log("获取车型号"); 
      if (result.data) {
        _this.setData({
          infoArr: result.data
        })
      }
      console.log(_this.data.infoArr);
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    // 隐藏加载框
    wx.hideLoading();
  },
  selCarSystem: function(event) {
    const _this = this;
    _this.setData({
      carSystemId: event.currentTarget.dataset.id,
      carSystemName: event.currentTarget.dataset.name
    })
    _this.hideModal();
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
    if (_this.data.carSystemName == "选择品牌") {
      wx.showToast({
        title: '请选择车辆品牌',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (!_this.data.attachment1) {
      wx.showToast({
        title: '请上传行驶证主页',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (!_this.data.attachment2) {
      wx.showToast({
        title: '请上传行驶证副页',
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
      type: 3, //车产认证
      appendInfo1: _this.data.carSystemName,
      attachment1: _this.data.attachment1,
      attachment2: _this.data.attachment2
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
const util = require('../../utils/util.js')
const md5 = require('../../utils/md5.js')
var app = getApp()
Page({
  data: {
    showPwdImg: '../../images/login_showepwd_icon.png',
    hidePwdImg: '../../images/login_hidepwd_icon.png',
    showPassword: false,
    phone: '',
    code: '',
    password: '',
    loginType: 'code',
    showSend: true,
    logined: false,
    verificationCodeUse: true,
    verificationCodeTime: 60,
    verificationCodeContent: '发送',
    loginText: '快捷登录',
    agreement: '<<乾坤岛用户协议>>',
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "" //页面标题为路由参数
    })

    if (wx.getStorageSync('token')) {
      this.running();
    }
  },
  onUnload: function () {
    clearInterval();
  },
  watchPhone: function(event) {
    const _this = this;
    var val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../images/warn-icon.png'
      })
      _this.setData({
        logined: false
      })
      return;
    }
    _this.setData({
      phone: val
    })
    _this.validate();
  },
  watchCode: function(event) {
    const _this = this;
    var val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请输入验证码',
        image: '../../images/warn-icon.png'
      })
      _this.setData({
        logined: false
      })
      return;
    }
    var length = parseInt(val.length);
    if (length > 6) {
      return;
    }
    var regNum = new RegExp('[0-9]', 'g');
    if (!regNum.exec(val)) {
      wx.showToast({
        title: '请输入数字',
        image: '../../images/warn-icon.png'
      })
      _this.setData({
        code: ''
      })
      return;
    }
    _this.setData({
      code: val
    })
    _this.validate();
  },
  watchPwd: function(event) { 
    const _this = this;
    var val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请输入密码',
        image: '../../images/warn-icon.png'
      })
      _this.setData({
        logined: false
      })
      return;
    }
    _this.setData({
      password: val
    })
    _this.validate();
  },
  validate: function() {
    const _this = this;
    if (_this.data.loginType == 'code') {
      if (_this.data.phone && _this.data.code) {
        _this.setData({
          logined: true
        })
      }
    } else {
      if (_this.data.phone && _this.data.password != "") {
        _this.setData({
          logined: true
        })
      }
    }
  },
  getVerificationCode: function() {
    const _this = this;
    if (!_this.data.verificationCodeUse) {
      return false;
    } 
    if (!_this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../images/warn-icon.png'
      })
      return false;
    } 
    if (!util.isPhoneNum(_this.data.phone)) {
      wx.showToast({ 
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }
    _this.setData({
      verificationCodeUse: false
    })
    wx.showLoading({
      title: '等待'
    })

    //获取验证码
    wx.request({
      header: {
        'content-type': app.globalData.contentTypeJson // 默认值
      },
      url: app.globalData.baseURL + '/api/account/get_code',
      method: 'POST',
      data: {
        phoneNumber: _this.data.phone
      },
      success: function(res) {
        let interval = setInterval(() => {
          _this.data.verificationCodeTime--;
          if (_this.data.verificationCodeTime == -1) {
            clearInterval(interval);
            _this.setData({
              verificationCodeUse: true,
              verificationCodeTime: 60,
              showSend: true,
              verificationCodeContent: '发送'
            }) 
            wx.hideLoading();
          } else {
            _this.setData({
              showSend: false,
              verificationCodeContent: _this.data.verificationCodeTime + "(s)"
            })
          }
        }, 1000)
        _this.setData({
          showSend: false,
          verificationCodeContent: _this.data.verificationCodeTime + "(s)"
        })
      },
      fail: function(res) {
        _this.setData({
          verificationCodeUse: true
        })
      }
    })
    return;
  },
  loginTypeClick: function(event) {
    var _this = this;
    _this.setData({
      loginType: event.currentTarget.dataset.type
    })
    _this.setData({
      logined: false,
      password: '',
      code: ''
    })
  },
  running: function(){
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/account/smallRoutineLogin', {
      code: app.globalData.code 
    }, (result) => {
      console.log(result);
        
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

    //获取个人信息
    app.appRequest('GET', 'json', '/api/user/profile', {
      userId: wx.getStorageSync('userId')
    }, (profile) => {
      console.log(profile);
      wx.setStorageSync('userInfo', profile.data);
      app.globalData.userInfo = profile.data;
      app.globalData.isLogin = true;
      console.log('本地缓存userInfo:  ' + profile.data);
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    wx.switchTab({
      url: "../../pages/index/newIndex"
    })
  },
  login() {
    const _this = this;
    if (!_this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (_this.data.password == "" && _this.data.loginType == 'pwd') {
      wx.showToast({
        title: '请输入密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (!_this.data.code && _this.data.loginType == 'code') {
      wx.showToast({
        title: '请填写验证码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    let data = {
      loginName: _this.data.phone,
      password: _this.data.password ? md5.hex_md5(_this.data.password) : null,
      code: _this.data.code,
      // source:window.api.systemType=='ios'?4:3,
      source: 4,
      longitude: app.globalData.longitude,
      latitude: app.globalData.latitude,
      unionkey: null,
    }
    
    if (wx.getStorageSync('token')) {
      console.log("进入登录");
      _this.running();
    }else{
      //登录
      app.appRequest('POST', 'json', '/api/account/loginAndRegister', data, (res) => {
        if (res.status == 1) {
          if (res.data.token) {
            wx.clearStorageSync();
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
          wx.setStorageSync('token', res.data.token);
          wx.setStorageSync('userId', res.data.userId);
          app.globalData.isLogin = true;
          app.appRequest('POST', 'x-www-form-urlencoded', '/api/user/bindingSmallRoutine', {
            code: app.globalData.code
          }, (result) => {
            console.log(result)
          }, (err) => {
            console.log('请求错误信息：  ' + err.errMsg);
          }); 
          // 如果在app.json页面中配置了tabBar, 并且要跳转的目标页面也在tabBar的设置当中时，那么在响应页面中设置的url会存在问题（常用的几种页面跳转方式便失效了），就是说不能跳转到tabBar中定义的页面。
          wx.switchTab({
            url: "../../pages/index/newIndex"
          })
        } else {
          wx.showToast({
            title: res.message,
            image: '../../images/warn-icon.png'
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    }
  },
  linkTo: function(event){

  },
  showHidePassword:function(){ 
    const _this = this;
    _this.setData({
      showPassword: !_this.data.showPassword
    })
  }
})
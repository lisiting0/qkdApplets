const util = require('../../utils/util.js')
const md5 = require('../../utils/md5.js')
var app = getApp()
Page({
  data: {
    phone: '',
    code: '',
    password: '',
    againPassword: '',
    showPassword: false,
    showSend: true,
    logined: false,
    verificationCodeUse: true,
    verificationCodeTime: 60,
    verificationCodeContent: '发送',
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: "忘记密码" //页面标题为路由参数
    })
  },
  onUnload: function () {
    clearInterval();
  },
  watchPhone: function (event) { 
    const _this = this;
    let val = event.detail.value;
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
  },
  watchCode: function (event) { 
    const _this = this;
    let val = event.detail.value;
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
  },
  changeShow: function() {
    const _this = this;
    _this.setData({
      showPassword: !_this.data.showPassword
    })
  },
  watchPwd: function (event) { 
    const _this = this;
    let val = event.detail.value;
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
  },
  watchAgainPwd: function(event) { 
    const _this = this;
    let val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请再次输入密码',
        image: '../../images/warn-icon.png'
      })
      _this.setData({
        logined: false
      })
      return;
    }
    if (_this.data.password != val) {
      wx.showToast({
        icon: 'none',
        title: '新密码和确认密码输入不一致',
      })
      return;
    }
    _this.setData({
      againPassword: val
    }) 
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
  forgetPwd: function() {
    const _this = this;
    if (!_this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (!util.isPhoneNum(_this.data.phone)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }
    if (!_this.data.code) {
      wx.showToast({
        title: '请填写验证码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (util.isBlank(_this.data.password)) {
      wx.showToast({ 
        title: '请输入新密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (util.isBlank(_this.data.againPassword)) {
      wx.showToast({
        title: '请再次输入密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (_this.data.password != _this.data.againPassword) {
      wx.showToast({
        icon: 'none',
        title: '新密码和确认密码输入不一致',
      })
      return;
    }
    return;
    let data = {
      phoneNumber: this.data.phone,
      code: _this.data.code,
      password: md5.hex_md5(_this.data.password)
    }
    //忘记密码
    app.appRequest('PUT', 'json', '/api/account/forget_pwd', data, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message
        })
        wx.switchTab({
          url: "../../pages/user/user"
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
})
const util = require('../../utils/util.js')
const md5 = require('../../utils/md5.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    showOld: true,
    canCode: true,
    code: '',
    verificationCodeUse: true,
    verificationCodeTime: 60,
    verificationCodeContent: '获取验证码',

    canNewCode: true,
    newPhone: '',
    newCode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "换绑手机" //页面标题为路由参数
    })
    const _this = this;
    _this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
  },
  onUnload: function () {
    clearInterval();
  },
  getCode: function(event) {
    const _this = this;
    let phone = event.currentTarget.dataset.phone;
    _this.setData({
      verificationCodeUse: false
    })
    if (!util.isPhoneNum(phone)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    }

    if (phone == _this.data.userInfo.phoneNumber && !_this.data.showOld) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能与原手机号相同'
      })
      return false;
    }

    wx.showLoading({
      title: '正在发送,请等待'
    })

    //获取验证码
    wx.request({
      header: {
        'content-type': app.globalData.contentTypeJson // 默认值
      },
      url: app.globalData.baseURL + '/api/account/get_code',
      method: 'POST',
      data: {
        phoneNumber: phone
      },
      success: function(res) {
        let interval = setInterval(() => {
          _this.data.verificationCodeTime--;
          if (_this.data.verificationCodeTime == -1) {
            clearInterval(interval);
            if (_this.data.showOld) {
              _this.setData({
                canCode: true,
              })
            } else {
              _this.setData({
                canNewCode: true,
              })
            }
            _this.setData({
              verificationCodeUse: true,
              verificationCodeTime: 60,
              verificationCodeContent: '获取验证码'
            })
            wx.hideLoading();
          } else {
            if (_this.data.showOld) {
              _this.setData({
                canCode: false,
              })
            } else {
              _this.setData({
                canNewCode: false,
              })
            }
            _this.setData({
              verificationCodeContent: _this.data.verificationCodeTime + "(s)"
            })
          }
        }, 1000)
        if (_this.data.showOld) {
          _this.setData({
            canCode: false,
          })
        } else {
          _this.setData({
            canNewCode: false,
          })
        }
        _this.setData({
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
  watchCode: function(event) {
    const _this = this;
    let val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请输入验证码',
        image: '../../images/warn-icon.png'
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
  checkCode() {
    const _this = this;
    if (!_this.data.code) {
      wx.showToast({
        title: '请输入验证码',
        image: '../../images/warn-icon.png'
      })
      return false;
    }
    _this.setData({
      showOld: false
    })
  },
  watchNewPhone: function(event) {
    const _this = this; 
    if (!event.detail.value) {
      wx.showToast({
        title: '请输入手机号',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    _this.setData({
      newPhone: event.detail.value
    })
    console.log(_this.data.newPhone)
  },
  watchNewCode: function(event) {
    const _this = this;
    let val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请输入验证码',
        image: '../../images/warn-icon.png'
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
        newCode: ''
      })
      return;
    }

    _this.setData({
      newCode: val
    })
  },
  editPhone: function() {
    const _this = this;
    if (!_this.data.newPhone) {
      wx.showToast({
        title: '请输入新的手机号',
        image: '../../images/warn-icon.png'
      })
      return false;
    } 
    if (!util.isPhoneNum(_this.data.newPhone)) {
      wx.showToast({
        icon: 'none',
        title: '请输入正确的手机号'
      })
      return false;
    } 
    if (_this.data.newPhone == _this.data.userInfo.phoneNumber) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能与原手机号相同'
      })
      return false;
    }
    if (!_this.data.newCode) {
      wx.showToast({
        title: '请输入验证码',
        image: '../../images/warn-icon.png'
      })
      return false;
    }

    app.appRequest('POST', 'json', '/api/user/updatePhone', {
      phoneNumber: _this.data.newPhone,
      code1: _this.data.code,
      code2: _this.data.newCode
    }, (res) => {
      if (res.status == 1) {
        var _userInfo = wx.getStorageSync('userInfo');
        _userInfo.phoneNumber = _this.data.newPhone;
        wx.setStorageSync('userInfo', _userInfo);
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
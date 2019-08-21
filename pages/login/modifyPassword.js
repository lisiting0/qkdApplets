const md5 = require('../../utils/md5.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPassword: false,
    oldPassword: '',
    newPassword: '',
    againPassword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "密码修改" //页面标题为路由参数
    })
  },
  changeShow: function() {
    const _this = this;
    _this.setData({
      showPassword: !_this.data.showPassword
    })
  },
  watchOldPwd: function(event) {
    const _this = this;
    let val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请输入旧密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    _this.setData({
      oldPassword: val
    })
  },
  watchNewPwd: function(event) {
    const _this = this;
    let val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请输入新密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    _this.setData({
      newPassword: val
    })
  },
  watchConfirmPwd: function(event) { 
    const _this = this;
    let val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '请确认新密码',
        image: '../../images/warn-icon.png'
      })
      return;
    } 
    if (_this.data.newPassword != val) {
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
  modify() {
    const _this = this;
    if (!_this.data.oldPassword) {
      wx.showToast({
        title: '请输入旧密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (!_this.data.newPassword) {
      wx.showToast({
        title: '请输入新密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    if (!_this.data.againPassword) {
      wx.showToast({
        title: '请确认新密码',
        image: '../../images/warn-icon.png'
      })
      return;
    }  
    if (_this.data.newPassword != _this.data.againPassword) {
      wx.showToast({
        icon: 'none',
        title: '新密码和确认密码输入不一致', 
      })
      return;
    }
    let data = {
      password: md5.hex_md5(_this.data.oldPassword),
      newPassword: md5.hex_md5(_this.data.newPassword)
    } 
    app.appRequest('PUT', 'json', '/api/user/changPwd', data, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'success'
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
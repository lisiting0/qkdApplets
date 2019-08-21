var app = getApp();
const util = require('../../utils/util.js')
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    showMoment: false,
    animationRole: {},
    showHideRole: false,
    viewIndex: 0,
    viewRole: ["公开", "私密", "好友"], 

    feedMaxImg: 6,//发布最大图片数量
    feedContent: '',//发布内容
    feedImg: [],//发布图片
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideMoment() {
      const that = this;
      var animation = wx.createAnimation({
        duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease', //动画的效果 默认值是linear
      })
      that.animation = animation
      that.animation.translateY(700).step()
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
      })
      setTimeout(function() {
        animation.translateY(0).step()
        that.setData({
          showMoment: false
        })
      }, 720) //先执行下滑动画，再隐藏模块 
    },
    showMoment() {
      const that = this;
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
      animation.translateY(700).step()
      // 用setData改变当前动画
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
        // 改变view里面的Wx：if
        showMoment: true
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function() {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 200)
    },
    bindinput: function(event) {
      let val = event.detail.value;
      this.setData({
        feedContent: val
      })
    },
    chooseImage: function(options) {
      const _this = this;
      wx.chooseImage({
        count: 6, // 最多可以选择的图片张数，
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          if (tempFilePaths.length > 1) {
            for (var index in tempFilePaths) {
              _this.upload(tempFilePaths[index])
            }
          } else {
            _this.upload(tempFilePaths[0])
          }
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
          filePath: path,
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
              _this.setData({
                feedImg: _this.data.feedImg.concat(util.getFullPath(data.data.path, 240))
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
    previewImage: function(e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.data.files // 需要预览的图片http链接列表
      })
    },
    showRole: function(event) {
      const that = this;
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
      animation.translateY(500).step()
      // 用setData改变当前动画
      that.setData({
        // 通过export()方法导出数据
        animationRole: animation.export(),
        // 改变view里面的Wx：if
        showHideRole: true
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function() {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 200)
    },
    changeRole: function(event) {
      let index = event.currentTarget.dataset.index;
      this.setData({
        viewIndex: index
      })
    },
    confirm: function(event) {
      const that = this;
      var animation = wx.createAnimation({
        duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease', //动画的效果 默认值是linear
      })
      that.animation = animation
      that.animation.translateY(500).step()
      that.setData({
        // 通过export()方法导出数据
        animationRole: animation.export(),
      })
      setTimeout(function() {
        animation.translateY(0).step()
        that.setData({
          showHideRole: false
        })
      }, 720) //先执行下滑动画，再隐藏模块 
    },
    postFeed: function(event) {
      const _this = this;
      console.log(_this.data.feedImg)
      let publishVal = {
        feedContent: _this.data.feedContent,
        feedType: _this.data.feedImg.length > 0 ? 1 : 2,
        feedAttachment: _this.data.feedImg.length > 0 ? this.data.feedImg.join(",") : '',
        viewRoleType: _this.data.viewIndex
      }
      if (!_this.data.feedContent) {
        wx.showToast({
          icon: 'none',
          title: '内容不能为空',
        })
        return;
      }
      _this.triggerEvent("publishEvent", publishVal);
      _this.hideMoment();
    },

  }
})
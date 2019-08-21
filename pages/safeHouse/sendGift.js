var app = getApp();
const api = require('../../js/api.js')
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    animationData: {},
    chooseFriend: false,
    inputShowed: false,
    inputVal: '',
    myselectGiftFriendHeight: 0,
    myScrollerHeight: 0,
    user: {
      aliasName: '',
      headimgAttachmentId: '',
      id: '',
    },
    giftList: [],
    friendList: [],
    friendListOld: [],
    selectUser: {
      aliasName: '',
      headimgAttachmentId: '',
      id: '',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "购买礼物" //页面标题为路由参数
    })

    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 内容块高度
    let query = wx.createSelectorQuery();
    query.select('.content-top').boundingClientRect(function(rect) {
      _this.setData({
        myScrollerHeight: windowHeight - rect.height - 7
      })
    }).exec();

    // 弹出层
    _this.setData({
      myselectGiftFriendHeight: windowHeight - 48
    })
    // 个人信息 
    var info = wx.getStorageSync("userInfo");
    app.appRequest('GET', 'json', '/api/user/profile', {
      userId: info.id
    }, (res) => {
      _this.setData({
        userInfo: res.data
      })
    });

    //好友列表
    app.appRequest('GET', 'json', '/api/myFriends/myFriendsList', {
      page: 1,
      rows: 10000
    }, (res) => {
      if (res.list) {
        _this.setData({
          friendListOld: null,
          friendList: null,
        })
        let item = res.list;
        for (let i = 0; i < item.length; i++) {
          item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
        }
        _this.setData({
          friendListOld: item,
          friendList: item,
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

    _this.getGift();
  },
  getGift: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    //好友列表
    app.appRequest('GET', 'json', '/api/gift/list', {}, (res) => {
      if (res.data) {
        _this.setData({
          giftList: null
        })
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].giftImage = util.getFullPath(res.data[i].giftImage, 120);
        }
        _this.setData({
          giftList: res.data
        })
        console.log(_this.data.giftList);
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
    // 隐藏加载框
    wx.hideLoading();
  },
  // 展开选择品牌
  selectFriend: function(e) {
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
      chooseFriend: true,
      selectUser: this.data.user
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
        chooseFriend: false
      })
    }, 200)
  },
  selectUserM: function(event) {
    let user = event.currentTarget.dataset.item;
    this.setData({
      "selectUser.aliasName": user.jiaoyouUser.aliasName,
      "selectUser.headimgAttachmentId": user.jiaoyouUser.headimgAttachmentId,
      "selectUser.id": user.rid
    })
    this.setData({
      user: this.data.selectUser
    })
    this.hideModal();
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
    let list = util.deepCopy(this.data.friendListOld)
    let filterList = list.filter(item => {
      return item.jiaoyouUser.aliasName.indexOf(this.data.inputVal) != -1
    })

    this.setData({
      friendList: filterList
    })
  },
  sendgift: function(event) {
    const _this = this;
    let giftId = event.currentTarget.dataset.id;
    if (_this.data.user.id == "") {
      wx.showToast({
        image: '../../images/warn-icon.png',
        title: "请先选择好友"
      });
      return;
    }

    wx.showModal({
      content: '确定支付乾坤币送礼吗?',
      success: function(res) {
        if (res.confirm) { //这里是点击了确定以后 
          let data = {
            "receiverUser.id": _this.data.user.id,
            "giftId": giftId,
            "amount": 1
          }
          wx.showToast({
            icon: "loading"
          })
          app.appRequest('GET', 'json', '/api/userGift/give', data, (res) => {
            wx.showToast({
              title: "赠送成功",
              icon: 'success'
            })
          }, (err) => {
            console.log('请求错误信息：  ' + err.errMsg);
          });

        } else { //这里是点击了取消以后 
          _this.hideModal();
        }
      }
    })
  },
})
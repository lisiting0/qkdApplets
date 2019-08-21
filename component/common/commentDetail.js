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
    detailId: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    isMy: { // 属性名
      type: Number, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    dynamic: { // 属性名
      type: null, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    showHideDetail: false,
    userInfo: wx.getStorageSync("userInfo"),
    dynamic: null,

    showHideComment: false,
    tabId: 0, //当前点击的块id

    showTextarea: false,
    commentObjIndex: 0,
    commentObj: {
      momentId: null,
      parentId: null,
      userId: null,
      comment: null
    },

    showGift: false, //打赏礼品弹出层 
    userMoney: 0,
    amount: 0,
    giftIndex: 0,
    giftList: [],
    objectId: null, //业务ID，从什么途径打赏的填写什么id，通过动态打赏填写动态ID，通过文章打赏填写文
    candidateId: null, //被赠送用户的ID
    aliasName: null,
    giftId: null, //礼物Id
    giftName: null, //礼物名称
  },

  /**
   * 组件的方法列表
   */
  methods: { 
    hideDetail() {
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
          showHideDetail: false
        })
      }, 720) //先执行下滑动画，再隐藏模块 
    },
    showDetail() {
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
        showHideDetail: true
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function() {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 200)
    },
    previewImg: function(event) {
      const _this = this;
      var src = event.currentTarget.dataset.src; //获取data-src
      var imgList = event.currentTarget.dataset.list; //获取data-list
      //图片预览
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList, // 需要预览的图片http链接列表
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
    tabIdCick: function(event) {
      const that = this;
      let id = event.currentTarget.dataset.id;
      let showHide = event.currentTarget.dataset.showhide;
      if (!showHide) { //fasle 则需要展开  
        that.setData({
          showHideComment: true,
          tabId: id,
        })
      } else {
        setTimeout(function() {
          that.setData({
            tabId: 0,
          })
        }, 300)
        that.setData({
          showHideComment: false,
          tabId: id,
        })
      }
    },
    showComment: function(event) { //点击别人评论部分 
      const _this = this;
      let id = event.currentTarget.dataset.id;
      let commentItem = event.currentTarget.dataset.item;
      let obj = {
        momentId: null,
        replay: null,
        userId: null,
        comment: null,
      }
      obj.momentId = id;
      obj.replay = commentItem ? commentItem : null;
      _this.setData({
        tabId: id,
        commentObj: obj,
        showTextarea: true,
        showHideComment: false,
        tabId: 0,
      })
    },
    handletouchtart: function() {
      this.setData({
        tabId: 0,
        showTextarea: false
      })
    },
    showCommentEvent: function(event) { //点击回复评论部分 
      console.log(event)
      const _this = this;
      let id = event.currentTarget.dataset.id;
      let commentItem = event.currentTarget.dataset.item;
      let obj = {
        momentId: null,
        replay: null,
        userId: null,
        comment: null,
      }
      obj.momentId = id;
      obj.replay = commentItem ? commentItem : null;
      _this.setData({
        tabId: event.detail.id,
        commentObj: obj,
        showTextarea: true,
        showHideComment: false,
        tabId: 0
      })
    },
    sendComment: function(event) {
      const _this = this;
      var form = event.detail.value;
      if (form.comment == "") {
        wx.showToast({
          icon: 'none',
          title: '评论内容不能为空',
        })
        return;
      }
      app.appRequest('POST', 'json', '/api/comment/create', {
        businessType: _this.data.commentObj.replay ? 9 : 3,
        objectId: _this.data.commentObj.replay ? _this.data.commentObj.replay.id : _this.data.commentObj.momentId,
        content: form.comment
      }, (result) => {
        if (result.status == 1) {
          wx.showToast({
            title: '评论成功',
          })
          if (!result.data.user.aliasName) {
            result.data.user.aliasName = _this.data.userInfo.aliasName;
          }

          if (_this.data.commentObj.replay) { //回复中的回复 
            ;
            (function getComment(comment) {
              let re = null;
              for (let i = comment.length; i--;) {
                if (comment[i].id == _this.data.commentObj.replay.id) {
                  re = comment[i];
                  if (!comment[i].comments) {
                    comment[i].comments = [];
                  }
                  comment[i].comments.push(result.data);
                  break;
                }
                if (comment[i].comments && !re) {
                  getComment(comment[i].comments)
                }
              }
            }(_this.data.dynamic.comments)) 

            // 回复部分递归 
            for (let i = _this.data.dynamic.length; i--;) {
              for (let m = 0; m < _this.data.dynamic.comments.length; m++) {
                let commentObject = {};
                if (_this.data.dynamic.comments[m].comments) { //判断第一级评论有回复的 
                  (function getCommentObj(obj, user) {
                    for (let n = 0; n < obj.length; n++) {
                      if (obj[n].comments) {
                        getCommentObj(obj[n].comments, obj[n].user);
                      }
                      commentObject[obj[n].id] = {
                        id: obj[n].id,
                        user: obj[n].user,
                        replayUser: user,
                        content: obj[n].content,
                        createDate: obj[n].createDate
                      };
                    }
                  }(_this.data.dynamic.comments[m].comments, _this.data.dynamic.comments[m].user));
                  if (!_this.data.dynamic.commentObject) {
                    _this.data.dynamic.commentObject = {}
                  }
                  _this.data.dynamic.commentObject[_this.data.dynamic.comments[m].id] = commentObject;
                }
              } 
            }
          } else { //第一层回复
            if (!_this.data.dynamic.comments) {
              _this.data.dynamic.comments = [];
            }
            _this.data.dynamic.comments.push(result.data);
          }
          _this.data.dynamic.commentLegth = 0;
          if (_this.data.dynamic.comments) {
            (function getCount(comments) {
              for (let i = comments.length; i--;) {
                if (comments[i].comments) {
                  getCount(comments[i].comments);
                }
              }
              _this.data.dynamic.commentLegth += comments.length;
            }(_this.data.dynamic.comments));
          }
          _this.setData({
            dynamic: _this.data.dynamic,
            showTextarea: false
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    },
    deleteFabulous: function(event) {
      const _this = this;
      _this.setData({
        tabId: 0,
        showHideComment: false,
      })
      let fabulous = _this.data.dynamic.fabulous.filter(item => {
        return item.user.id == _this.data.userInfo.id;
      });
      app.appRequest('POST', 'json', '/api/fabulous/delete/' + fabulous[0].id, {}, (result) => {
        wx.showToast({
          title: result.message,
        })

        fabulous = _this.data.dynamic.fabulous.filter(item => {
          return item.user.id != _this.data.userInfo.id;
        });
        _this.data.dynamic.fabulous = fabulous;
        _this.data.dynamic.isFabulous = 0;

        _this.setData({
          dynamic: _this.data.dynamic
        })
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    },
    setFabulous: function(event) {
      const _this = this;
      _this.setData({
        tabId: 0,
        showHideComment: false,
      })
      let val = event.currentTarget.dataset.val;
      if (val == 0) {
        app.appRequest('POST', 'x-www-form-urlencoded', '/api/fabulous/createPublic', {
          commentId: _this.data.dynamic.id
        }, (result) => {
          if (result.status == 1) {
            wx.showToast({
              title: "点赞成功",
            })

            if (!_this.data.dynamic.fabulous) {
              _this.data.dynamic.fabulous = [];
            }
            if (!result.data.user.aliasName) {
              result.data.user.aliasName = _this.data.userInfo.aliasName;
            }
            _this.data.dynamic.fabulous.push(result.data);
            _this.data.dynamic.isFabulous = 1;
            _this.setData({
              dynamic: _this.data.dynamic
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: result.message
            })
          }
        }, (err) => {
          console.log('请求错误信息：  ' + err.errMsg);
        });
      }
    },
    getGiftList() {
      const _this = this;
      app.appRequest('GET', 'json', '/api/gift/list', {}, (result) => {
        if (result.data) {
          _this.data.giftList = [];
          let list = [];
          let data = result.data;
          let page = Math.ceil(data.length / 8)
          for (let k = 0; k < data.length; k++) {
            data[k].giftImage = util.getFullPath(data[k].giftImage, 120)
          }
          for (let i = 0; i < page; i++) {
            let arr = [];
            for (let j = 0; j < 8; j++) {
              if (8 * i + j == data.length) {
                break;
              }
              arr.push(data[8 * i + j])
            }
            list.push(arr);
          }
          _this.setData({
            giftList: list
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    },
    clickShowGift: function(event) {
      const _this = this;
      _this.setData({
        tabId: 0,
        showHideComment: false,
      })
      let username = event.currentTarget.dataset.username;
      let userid = event.currentTarget.dataset.userid;
      let id = event.currentTarget.dataset.id;
      if (_this.data.userInfo.id == userid) {
        wx.showToast({
          icon: 'none',
          title: "不能给自已打赏",
        })
        return false;
      }
      if (_this.data.giftList.length < 1) {
        _this.getGiftList();
      }
      _this.setData({
        showGift: !this.data.showGift,
        aliasName: username,
        candidateId: userid,
        objectId: id
      })
      //获得礼物组件
      _this.gifts = _this.selectComponent("#gifts");
      _this.gifts.showGift();
    },
    reward: function(event) {
      wx.showLoading({
        title: '',
      })
      const _this = this;
      let data = {
        "receiverUser.id": event.detail.candidateId,
        "objectId": event.detail.objectId,
        "giftId": event.detail.giftId,
        "amount": 1, //打赏数，默认是1
      }
      app.appRequest('POST', 'x-www-form-urlencoded', '/api/userGift/give', data, (result) => {
        if (result.status == 1) {
          wx.hideLoading();
          wx.showToast({
            title: result.message,
          })
          let userInfo = wx.getStorageSync("userInfo");
          userInfo.userMoney = _this.data.userMoney;
          wx.setStorageSync("userInfo", userInfo)
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    },
  }
})
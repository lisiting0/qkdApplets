var width = wx.getSystemInfoSync().screenWidth;
var app = getApp();
const util = require('../../utils/util.js')
var sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置(下划线宽度)
Page({
  onReady: function() { 
    //获得礼物组件
    this.gifts = this.selectComponent("#gifts");
    //获得发布动态
    this.addMoment = this.selectComponent("#addMoment");
    //获得动态详情
    this.commentDetail = this.selectComponent("#commentDetail");
  },
  /**
   * 页面的初始数据
   */
  data: {
    animationData: null,
    userInfo: null,
    tabs: ["乾坤广场", "乾坤动态"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    scroll_height: 0,
    list: null,
    hideHeader: true,
    hideBottom: true,
    currentPage: 1, //页数，第一页
    totalPage: 0, //总页数
    loadMoreData: '加载更多……',

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

    showHideMoment: true, //显示发布动态+

    detailId: 0,
    isMy: false,
    dynamicDes: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "最近来访" //页面标题为路由参数
    })
    const _this = this;
    wx.getSystemInfo({
      // (320/2-96)/2
      success: function(res) {
        _this.setData({
          sliderLeft: (res.windowWidth / _this.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / _this.data.tabs.length * _this.data.activeIndex
        });
      }
    });
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    // 微信小程序获取某个元素的高度
    let query = wx.createSelectorQuery();
    query.select('.menu-top').boundingClientRect(function(rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height
      })
    }).exec();
    let userInfo = wx.getStorageSync("userInfo");
    _this.setData({
      userInfo: userInfo,
      userMoney: userInfo.userMoney
    })
    _this.loadData(); 
  },
  tabClick: function(e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      list: null,
      hideHeader: true,
      hideBottom: true,
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
    });
    this.loadData();
  },
  loadData: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    if (_this.data.activeIndex == 0) {
      //获取乾坤广场
      app.appRequest('GET', 'json', '/api/feed/nearby', {
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          for (let i = item.length; i--;) { //递归统计评论数量
            item[i].uploadingPerson.headimgAttachmentId = util.getFullPath(item[i].uploadingPerson.headimgAttachmentId, 120);
            item[i].time = util.getMessageTimeFromNow(item[i].createDate);
            item[i].showMore = false;
            if (item[i].feedAttachment) {
              let str = item[i].feedAttachment.split(',');
              let images = [];
              for (var j = 0; j < str.length; j++) {
                images.push(util.getFullPath(str[j], 360));
              }
              item[i].images = images;
            }
            // 点评人的头像
            if (item[i].fabulous) {
              let fabulous = item[i].fabulous;
              for (var k = 0; k < fabulous.length; k++) {
                fabulous[k].user.headimgAttachmentId = util.getFullPath(fabulous[k].user.headimgAttachmentId, 120);
              }
            }

            item[i].commentLegth = 0;
            if (item[i].comments) {
              (function getCount(comments, index) {
                for (let i = comments.length; i--;) {
                  if (comments[i].comments) {
                    getCount(comments[i].comments, index);
                  }
                }
                item[index].commentLegth += comments.length;
              }(item[i].comments, i));

              // 回复部分递归 
              
              for (let m = 0; m < item[i].comments.length; m++) {
                let commentObject = {};
                if (item[i].comments[m].comments) { //判断第一级评论有回复的 
                  (function getCommentObj(obj, user) {
                    for (let n = 0; n < obj.length; n++) {
                      if (obj[n].comments) {
                        getCommentObj(obj[n].comments, obj[n].user);
                      }
                      obj[n].user.headimgAttachmentId = util.getFullPath(obj[n].user.headimgAttachmentId, 120);
                      user.headimgAttachmentId = util.getFullPath(user.headimgAttachmentId, 120);
                      commentObject[obj[n].id] = {
                        id: obj[n].id,
                        user: obj[n].user,
                        replayUser: user, 
                        content: obj[n].content,
                        createDate: obj[n].createDate
                      }; 
                    }
                  }(item[i].comments[m].comments, item[i].comments[m].user));
                  if (!item[i].commentObject) {
                    item[i].commentObject = {}
                  }
                  item[i].commentObject[item[i].comments[m].id] = commentObject; 
                }
              }
            }
          }
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: res.list,
              hideHeader: true
            })
            console.log(_this.data.list);
          } else {
            var array = _this.data.list;
            array = array.concat(res.list);
            _this.setData({
              totalPage: res.totalPage,
              list: array,
              hideBottom: true
            })
          }
          if (_this.data.currentPage == _this.data.totalPage || _this.data.totalPage < app.globalData.pageSize) {
            _this.setData({
              loadMoreData: '已加载全部数据',
              hideBottom: false
            })
          }
        } else {
          _this.setData({
            hideBottom: false
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    } else {
      //获取乾坤动态
      app.appRequest('GET', 'json', '/api/feed/getDynamic', {
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          for (let i = item.length; i--;) { //递归统计评论数量
            item[i].uploadingPerson.headimgAttachmentId = util.getFullPath(item[i].uploadingPerson.headimgAttachmentId, 120);
            item[i].time = util.getMessageTimeFromNow(item[i].createDate);
            item[i].showMore = false;
            // 动态图片
            if (item[i].feedAttachment) {
              let str = item[i].feedAttachment.split(',');
              let images = [];
              for (var j = 0; j < str.length; j++) {
                images.push(util.getFullPath(str[j], 120));
              }
              item[i].images = images;
            }

            // 点评人的头像
            if (item[i].fabulous) {
              let fabulous = item[i].fabulous;
              for (var k = 0; k < fabulous.length; k++) {
                fabulous[k].user.headimgAttachmentId = util.getFullPath(fabulous[k].user.headimgAttachmentId, 120);
              }
            } 
   
            item[i].commentLegth = 0;
            if (item[i].comments) {
              (function getCount(comments, index) {
                for (let i = comments.length; i--;) {
                  if (comments[i].comments) {
                    getCount(comments[i].comments, index);
                  }
                }
                item[index].commentLegth += comments.length;
              }(item[i].comments, i));

              // 回复部分递归 
              for (let m = 0; m < item[i].comments.length; m++) {
                let commentObject = {};
                if (item[i].comments[m].comments) { //判断第一级评论有回复的
                  console.log(item[i].comments[m].comments);
                  (function getCommentObj(obj, user) {
                    for (let n = 0; n < obj.length; n++) {
                      if (obj[n].comments) {
                        getCommentObj(obj[n].comments, obj[n].user);
                      }
                      obj[n].user.headimgAttachmentId = util.getFullPath(obj[n].user.headimgAttachmentId, 120);
                      user.headimgAttachmentId = util.getFullPath(user.headimgAttachmentId, 120);
                      commentObject[obj[n].id] = {
                        id: obj[n].id,
                        user: obj[n].user,
                        replayUser: user, 
                        content: obj[n].content,
                        createDate: obj[n].createDate
                      }; 
                    }
                  }(item[i].comments[m].comments, item[i].comments[m].user));
                  if (!item[i].commentObject) {
                    item[i].commentObject = {}
                  }
                  item[i].commentObject[item[i].comments[m].id] = commentObject;

                }
              }
            }
          }
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: res.list,
              hideHeader: true
            })
          } else {
            var array = _this.data.list;
            array = array.concat(res.list);
            _this.setData({
              totalPage: res.totalPage,
              list: array,
              hideBottom: true
            })
          }
          if (_this.data.currentPage == _this.data.totalPage || _this.data.totalPage < app.globalData.pageSize) {
            _this.setData({
              loadMoreData: '已加载全部数据',
              hideBottom: false
            })
          }
        } else {
          _this.setData({
            hideBottom: false
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    }
    // 隐藏加载框
    wx.hideLoading();
  },
  loadMore() {
    var _this = this;
    if (_this.data.currentPage == _this.data.totalPage || _this.data.totalPage < app.globalData.pageSize) {
      _this.setData({
        loadMoreData: '已加载全部数据',
        hideBottom: false
      })
      return;
    }
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function() {
      console.log('上拉加载更多');
      var tempCurrentPage = _this.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      _this.setData({
        currentPage: tempCurrentPage
      })
      _this.loadData();

    }, 1000);
    // 隐藏加载框
    wx.hideLoading();
  },
  refresh() {
    var _this = this;
    setTimeout(function() {
      console.log('下拉刷新');
      _this.setData({
        currentPage: 1,
        hideHeader: false
      })
      _this.loadData();
    }, 1000);
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
    let index = event.currentTarget.dataset.index;  
    let obj = {
      momentId: null,
      replay: null,
      userId: null,
      comment: null,
      index: null,
    }
    obj.momentId = id;
    obj.replay = commentItem ? commentItem : null;
    obj.index = index;  
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
      showHideComment: false,
      showTextarea: false
    })
  },
  showCommentEvent: function(event) { //点击回复评论部分 
    const _this = this;
    let id = event.currentTarget.dataset.parentid;
    let commentItem = event.currentTarget.dataset.item; 
    let obj = {
      momentId: null,
      replay: null,
      userId: null,
      comment: null,
      index: null,
    }
    obj.momentId = id;
    obj.replay = commentItem ? commentItem : null;
    obj.index = event.currentTarget.dataset.parentindex ? event.currentTarget.dataset.parentindex: null; 
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
    const index = _this.data.commentObj.index;
    console.log(index);
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
        _this.setData({ 
          showTextarea: false,
        })
        if (!result.data.user.aliasName) {
          result.data.user.aliasName = _this.data.userInfo.aliasName;
        }

        let obj = util.deepCopy(_this.data.list[index]); //循环内容
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
          }(obj.comments))

          // 回复部分递归 
          for (let m = 0; m < obj.comments.length; m++) {
            let commentObject = {};
            if (obj.comments[m].comments) { //判断第一级评论有回复的 
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
              }(obj.comments[m].comments, obj.comments[m].user));
              if (!obj.commentObject) {
                obj.commentObject = {}
              }
              obj.commentObject[obj.comments[m].id] = commentObject; 
            }
          } 
        } else { //第一层回复
          if (!obj.comments) {
            obj.comments = [];
          }
          obj.comments.push(result.data);
        }
        obj.commentLegth = 0;
        if (obj.comments) {
          (function getCount(comments) {
            for (let i = comments.length; i--;) {
              if (comments[i].comments) {
                getCount(comments[i].comments);
              }
            }
            obj.commentLegth += comments.length;
          }(obj.comments));
        }
        let listItem = 'list[' + index + ']';
        _this.setData({
          [listItem]: obj,
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
    let index = event.currentTarget.dataset.index;
    let fabulous = _this.data.list[index].fabulous.filter(item => {
      return item.user.id == _this.data.userInfo.id;
    });
    app.appRequest('POST', 'json', '/api/fabulous/delete/' + fabulous[0].id, {}, (result) => {
      wx.showToast({
        title: result.message,
      })
      let obj = util.deepCopy(_this.data.list[index]);
      fabulous = obj.fabulous.filter(item => {
        return item.user.id != _this.data.userInfo.id;
      });
      obj.fabulous = fabulous;
      obj.isFabulous = 0;

      let listItem = 'list[' + index + ']';
      _this.setData({
        [listItem]: obj
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
    let index = event.currentTarget.dataset.index;
    if (val == 0) {
      console.log(_this.data.list[index].id);
      app.appRequest('POST', 'x-www-form-urlencoded', '/api/fabulous/createPublic', {
        commentId: _this.data.list[index].id
      }, (result) => {
        if (result.status == 1) {
          wx.showToast({
            title: "点赞成功",
          })
          let obj = util.deepCopy(_this.data.list[index]);
          if (!obj.fabulous) {
            obj.fabulous = [];
          }
          if (!result.data.user.aliasName) {
            result.data.user.aliasName = _this.data.userInfo.aliasName;
          }
          obj.fabulous.push(result.data);
          obj.isFabulous = 1;
          let listItem = 'list[' + index + ']';
          _this.setData({
            [listItem]: obj
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
    _this.setData({
      showGift: !this.data.showGift,
      aliasName: username,
      candidateId: userid,
      objectId: id
    })
    this.gifts.showGift();
  },
  showMore: function(event) {
    console.log(event);
    let index = event.currentTarget.dataset.index;
    let showMore = event.currentTarget.dataset.showmore;
    let listItem = 'list[' + index + '].showMore';
    const _this = this;
    _this.setData({
      [listItem]: !showMore
    })
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
  publishmoment: function(event) {
    const _this = this;
    _this.addMoment.showMoment();
    _this.setData({
      tabId: 0,
      showHideComment: false,
      showHideMoment: false
    })
  },
  publishEvent: function(event) {
    wx.showLoading({
      title: '',
    })
    const _this = this;
    let data = {
      feedContent: event.detail.feedContent,
      feedType: event.detail.feedType,
      feedAttachment: event.detail.feedAttachment,
      viewRoleType: event.detail.viewRoleType,
      isTransferredUrl: 0,
    }
    app.appRequest('POST', 'x-www-form-urlencoded', '/api/feed/publish', data, (result) => {
      if (result.status == 1) {
        wx.hideLoading();
        _this.loadData();
        _this.setData({
          tabId: 0,
          showHideComment: false,
          showHideMoment: true
        })
      }
      wx.showToast({
        title: result.message,
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  getDetail: function(event) {
    const _this = this;
    _this.commentDetail.showDetail();
    let index = event.currentTarget.dataset.index;
    let dynamicDes = _this.data.list[index];
    _this.setData({
      tabId: 0,
      showHideComment: false,
      showHideMoment: false,
      isMy: event.currentTarget.dataset.isMy ? event.currentTarget.dataset.isMy : '',
      dynamicDes: dynamicDes
    })
  },
})
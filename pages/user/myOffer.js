var app = getApp();
const util = require('../../utils/util.js')
var sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置(下划线宽度)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["已参加", "已关注", "已发起", "待评价"],
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

    btnWidth: 360,
    showTextarea: false,
    commentObjIndex: 0,
    commentObj: {
      momentId: null,
      parentId: null,
      userId: null,
      comment: null
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "我的约会" //页面标题为路由参数
    })
    const _this = this;
    if (options.active) {
      _this.setData({
        activeIndex: options.active
      })
    }
    wx.getSystemInfo({
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
    _this.loadData();

    setInterval(() => {
      for (let key in _this.data.copyList) {
        if (_this.data.copyList[key]["activityStarttime"]) {
          let date1 = _this.data.copyList[key]["activityStarttime"].replace(/\-/g, "/"); //活动开始时间
          let date2 = new Date(); //当前时间
          let date3 = new Date(date1).getTime() - date2.getTime(); //时间差的毫秒数
          if (date3 > 0) {
            //计算出相差天数
            let days = Math.floor(date3 / (24 * 3600 * 1000))
            //计算出小时数
            let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000))
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000))
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000);
            if (hours < 10) {
              hours = "0" + hours;
            }
            if (minutes < 10) {
              minutes = "0" + minutes;
            }
            if (seconds < 10) {
              seconds = "0" + seconds;
            }
            if (hours <= 0 && minutes <= 0 && seconds <= 0) {
              hours = "00";
              minutes = "00";
              seconds = "00";
            }
            if (days >= 1) {
              let date = new Date(date1);
              let year = date.getFullYear();
              let month = date.getMonth() + 1;
              let day = date.getDate();
              let hour = date.getHours();
              let min = date.getMinutes();
              if (month < 10) {
                month = "0" + month;
              }
              if (day < 10) {
                day = "0" + day;
              }
              if (hour < 10) {
                hour = "0" + hour;
              }
              if (min < 10) {
                min = "0" + min;
              }
              _this.data.copyList[key]["djs"] = month + "-" + day + " " + hour + ":" + min;
              _this.setData({
                copyList: _this.data.copyList
              })
              clearInterval();
            } else {
              _this.data.copyList[key]["djs"] = hours + ":" + minutes + ":" + seconds
              _this.setData({
                copyList: _this.data.copyList
              })
            }
          }

        }
      }
    }, 1000);
  },
  onUnload: function(){
    clearInterval();
  },
  tabClick: function(e) {
    console.log(e)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      hideHeader: true,
      hideBottom: true,
      list: [],
      list2: [],
      endList: [],
      copyList: [],
      currentPage: 1, //页数，第一页
      totalPage: 0, //总页数
    });
    this.loadData();
  },
  compareDate(time) {
    let date1 = time; //活动开始时间
    let date2 = new Date(); //当前时间
    let date3 = new Date(date1).getTime() - date2.getTime(); //时间差的毫秒数
    if (date3 > 0) {
      //计算出相差天数
      let days = Math.floor(date3 / (24 * 3600 * 1000))
      //计算出小时数
      let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000))
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000))
      //计算相差秒数
      let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      if (hours <= 0 && minutes <= 0 && seconds <= 0) {
        hours = "00";
        minutes = "00";
        seconds = "00";
      }
      if (days >= 1) {
        let date = new Date(date1);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        if (hour < 10) {
          hour = "0" + hour;
        }
        if (min < 10) {
          min = "0" + min;
        }
        if (month <= 0 && day <= 0 && hour <= 0 && min <= 0) {
          month = "00";
          day = "00";
          hour = "00";
          min = "00";
        }
        return month + "-" + day + " " + hour + ":" + min;
      } else {
        return hours + ":" + minutes + ":" + seconds;
      }
    }
  },
  loadData: function() {
    const _this = this;
    // 隐藏加载框
    wx.showLoading({
      title: '',
    });
    var pageIndex = _this.data.currentPage;
    if (_this.data.activeIndex == 0) {
      //获取状态为6的数据
      app.appRequest('GET', 'json', '/api/dating/getMyCandidateDating', {
        state: 6
      }, (res) => {
        _this.setData({
          list: [],
        })
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            if (item[i].coverimgImages) {
              item[i].coverimgImages = util.getFullPath(item[i].coverimgImages, 240);
            }
            item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 240);
          }
          _this.setData({
            list: item,
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
      //获取状态为3的数据
      app.appRequest('GET', 'json', '/api/dating/getMyCandidateDating', {
        state: 3
      }, (res) => {
        _this.setData({
          list2: [],
        })
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            if (item[i].coverimgImages) {
              item[i].coverimgImages = util.getFullPath(item[i].coverimgImages, 240);
            }
            item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
          }
          var array = _this.data.list;
          array = array.concat(res.list);
          _this.setData({
            list2: item,
            list: array
          })
          let allList = _this.data.list;
          for (var i = 0; i < allList.length; i++) {
            allList[i].djs = this.compareDate(allList[i].activityStarttime);
          }
          _this.setData({
            copyList: allList
          })
        }
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });


      //获取已结束的活动 
      app.appRequest('GET', 'json', '/api/dating/getMyCandidateDating', {
        state: 5,
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            if (item[i].coverimgImages) {
              item[i].coverimgImages = util.getFullPath(item[i].coverimgImages, 240);
            }
            item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
          }
          if (pageIndex == 1) {
            _this.setData({
              endList: []
            })
            _this.setData({
              totalPage: res.totalPage,
              endList: res.list,
              hideHeader: true
            })
          } else {
            var array = _this.data.endList;
            array = array.concat(res.list);
            _this.setData({
              totalPage: res.totalPage,
              endList: array,
              hideBottom: true
            })
          }
          if (_this.data.currentPage == _this.data.totalPage) {
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
    } else if (_this.data.activeIndex == 1) {
      //获取已关注列表
      app.appRequest('GET', 'json', '/api/dating/getMyFollowDating', {
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            if (item[i].coverimgImages) {
              item[i].coverimgImages = util.getFullPath(item[i].coverimgImages, 240);
            }
            item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
            item[i].right = 0;
          }
          console.log(item)
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: item,
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
          if (_this.data.currentPage == _this.data.totalPage) {
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
    } else if (_this.data.activeIndex == 2) {
      //获取已发起列表
      app.appRequest('GET', 'json', '/api/dating/getMyPublishDating', {
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            if (item[i].coverimgImages) {
              item[i].coverimgImages = util.getFullPath(item[i].coverimgImages, 240);
            }
            item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
            item[i].right = 0;
          }
          console.log(item)
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: item,
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
          if (_this.data.currentPage == _this.data.totalPage) {
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
      //获取待评价列表
      app.appRequest('GET', 'json', '/api/dating/get2CommentDating', {
        page: pageIndex,
        rows: app.globalData.pageSize
      }, (res) => {
        if (res.list) {
          let item = res.list;
          for (var i = 0; i < item.length; i++) {
            if (item[i].coverimgImages) {
              item[i].coverimgImages = util.getFullPath(item[i].coverimgImages, 240);
            }
            item[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(item[i].jiaoyouUser.headimgAttachmentId, 120);
          }
          console.log(item)
          if (pageIndex == 1) {
            _this.setData({
              list: []
            })
            _this.setData({
              totalPage: res.totalPage,
              list: item,
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
          if (_this.data.currentPage == _this.data.totalPage) {
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
    if (_this.data.currentPage == _this.data.totalPage) {
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
  // 左滑动
  drawStart: function(e) {
    var touch = e.touches[0];
    console.log(touch);
    for (var index in this.data.list) {
      var item = this.data.list[index]
      item.right = 0
    }
    this.setData({
      list: this.data.list,
      startX: touch.clientX,
    })

  },
  drawMove: function(e) {
    console.log(e);
    var touch = e.touches[0]
    var item = this.data.list[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.btnWidth) {
        disX = this.data.btnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        list: this.data.list
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        list: this.data.list
      })
    }
  },
  drawEnd: function(e) {
    var item = this.data.list[e.currentTarget.dataset.index]
    if (item.right >= this.data.btnWidth / 2) {
      item.right = this.data.btnWidth
      this.setData({
        isScroll: true,
        list: this.data.list,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        list: this.data.list,
      })
    }
  },
  toUserInfo: function(event) {
    var userId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/user/userInfo?id=' + userId
    })
  },
  toActScene: function(event) {
    var datingId = event.currentTarget.dataset.datingId;
    var activityMethod = event.currentTarget.dataset.activityMethod;
    wx.navigateTo({
      url: '../../pages/affinity/actSceneNew?id=' + activityMethod + "&datingId=" + datingId
    })
  },
  toActiveDetail: function(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../pages/affinity/act?id=' + id
    })
  },
  toTop: function(event) {
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    app.appRequest('PUT', 'json', '/api/dating/toTop/' + id, {}, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'success'
        })
        var toTop = 'list[' + index + '].toTop';
        this.setData({
          [toTop]: 1
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
  },
  unToTop: function(event) {
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    app.appRequest('PUT', 'json', '/api/dating/unToTop/' + id, {}, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'success'
        })
        var toTop = 'list[' + index + '].toTop';
        this.setData({
          [toTop]: 0
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
  },
  unfollowActivity: function(event) {
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    app.appRequest('PUT', 'json', '/api/dating/unfollow/' + id, {}, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'success'
        })
        var arr = this.data.list;
        arr.splice(index, 1);
        this.setData({
          list: arr
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
  },
  unPulish: function(event) {
    var id = event.currentTarget.dataset.id;
    var index = event.currentTarget.dataset.index;
    app.appRequest('PUT', 'json', '/api/dating/unPublish', {
      id: id
    }, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: res.message,
          icon: 'success'
        })
        var arr = this.data.list;
        arr.splice(index, 1);
        this.setData({
          list: arr
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
  },
  showComment: function(event) {
    let id = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;
    let obj = {
      momentId: null,
      parentId: null,
      userId: null,
      comment: null
    }
    obj.momentId = id
    this.setData({
      commentObjIndex: index,
      commentObj: obj,
      showTextarea: true
    })
  },
  handletouchtart: function() {
    this.setData({
      showTextarea: false
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
      businessType: 5,
      objectId: _this.data.commentObj.momentId,
      content: form.comment
    }, (result) => {
      if (result.status == 1) {
        wx.showToast({
          title: '评论成功',
        })
        var oldList = _this.data.list; //循环内容
        oldList.splice(_this.data.commentObjIndex, 1);
        _this.setData({
          list: oldList,
          showTextarea: false
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  }
})
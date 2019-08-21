const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    userId: null,
    indicatorDots: false,
    autoplay: false,
    info: null,
    userInfo: null,
    currIndex: 0, //封面图index
    coverimgAttachement: [], //封面图 
    dynamicList: [], //动态数据
    educationTextArr: {
      0: '大专以下',
      10: '大专',
      11: '本科',
      12: '硕士',
      13: '博士',
      14: '出国留学'
    },
    maritalStatusTextArr: {
      1: '未婚',
      2: '离异',
      3: '其他',
      '-1': '无要求'
    },
    smokingTextArr: {
      1: '从不',
      2: '偶尔吸',
      3: '经常吸',
      '-1': '无要求'
    },
    drinkTextArr: {
      1: '从不',
      2: '偶尔喝',
      3: '经常喝',
      '-1': '无要求'
    },
    childTextArr: {
      1: '无',
      2: '有小孩归自已',
      3: '有小孩归对方',
      '-1': '无要求'
    },
    houseTextArr: {
      1: '已购房',
      2: '租房',
      3: '单位宿舍',
      4: '正打算购房',
      5: '和家人同住',
      '-1': '无要求'
    },
    carTextArr: {
      1: '已购车',
      2: '未购车',
      3: '正打算购车',
      '-1': '无要求'
    },
    rankingTextArr: {
      1: '独生子女',
      2: '老大',
      3: '老二',
      4: '老三',
      5: '老幺'
    },
    educationReTextArr: {
      10: '大专及以上',
      11: '本科及以上',
      12: '硕士及以上',
      13: '博士及以上',
      '-1': '无要求'
    },
    flag: true,
    yesorno: 'none',
    content: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "" //页面标题为路由参数
    })

    wx.enablePullDownRefresh = false
    const _this = this;
    _this.setData({ 
      userId: options.id
    })
    _this.getUserInfo();
  },
  getUserInfo: function() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/user/userHomePage', {
      userId: _this.data.userId ? _this.data.userId : _this.data.storageId
    }, (userInfo) => {
      if (userInfo.data) {
        //封面图 
        if (userInfo.data.coverimgAttachementId) {
          let imageList = userInfo.data.coverimgAttachementId.split(',');
          for (var i = 0; i < imageList.length; i++) {
            if (imageList[i] != "" || imageList[i] != ",") {
              _this.data.coverimgAttachement[i] = util.getFullPath(imageList[i], 720);
            }
          }
          _this.setData({
            coverimgAttachement: _this.data.coverimgAttachement
          })
        }

        //头像
        var headImg = util.getFullPath(userInfo.data.headimgAttachmentId, 720);

        _this.setData({
          userInfo: userInfo.data,
          'userInfo.headimgAttachmentId': headImg,
        })

        //动态
        var item = _this.data.userInfo.dynamicList;
        if (item) {
          for (var j = 0; j < item.length; j++) {
            if (!util.isBlank(item[j].feedAttachment)) {
              var splitFeedAttachment = item[j].feedAttachment.split(',');
              for (var k = j; k < splitFeedAttachment.length; k++) {
                if (!util.isBlank(splitFeedAttachment[k])) {
                  item[j].feedAttachment = util.getFullPath(splitFeedAttachment[0], 120);
                }
              }
            } 
          }
          _this.setData({
            'userInfo.images': item,
          })
        }
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  bindchange: function(e) { //轮播图发生改变
    this.setData({
      currIndex: e.detail.current
    })
  },
  openViewModal: function() {
    this.setData({
      yesorno: 'block',
      flag: false
    })
  },
  closeViewModal: function() {
    this.setData({
      yesorno: 'none',
      flag: true
    })
  },
  watchCentent: function(event) {
    const _this = this;
    var val = event.detail.value;
    if (!val) {
      wx.showToast({
        title: '文本不能为空',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    _this.setData({
      content: val
    })
  },
  send: function() {
    var content = this.data.content;
    if (content == "" || !content) {
      wx.showToast({
        title: '文本不能为空',
        image: '../../images/warn-icon.png'
      })
      return;
    }
    // 显示加载图标
    wx.showLoading({
      title: '',
    })
    app.appRequest('PUT', 'x-www-form-urlencoded', '/api/user/applySeeUserPrivatedata/' + this.data.userId, {
      content: content
    }, (res) => {
      if (res.status == 1) {
        wx.showToast({
          title: '申请成功',
          icon: 'success'
        })
        this.setData({
          shApply: false,
          yesorno: 'none',
          flag: true,
          'userInfo.isSeePrivateInfo': 2
        })
      }
      wx.hideLoading();
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
})
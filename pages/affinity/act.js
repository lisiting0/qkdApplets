const util = require('../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    indicatorDots: false,
    autoplay: false,
    showPayWin: false,
    showPay: false,
    isloading: false,
    id: null,
    datingDetail: null,
    currIndex: 0,
    coverimgAttachement: [],
    payTypeText: ["AA", "我请客", "你买单", "女士免单", "视情况而定"],
    tmp: ["", "xy", "qy", "jy", "zy", "py", "xm"],
    jiaoyouType: ["", "选缘", "抢缘", "竞缘", "中缘", "配缘", "寻觅对象"],
    datingTitles: ['', '旅行', '吃饭', '电影', '唱歌', '运动', '其他'],
    datingIcon: ['', '&#xe66d;', '&#xe66c;', '&#xe669;', '&#xe895;', '&#xee41;', '&#xe66f;'],
    tripTimeLength: ['', '一两天', '三五天', '十天半月'],
    tripMode: ['', '火车', '飞机', '动高铁', '游轮', '自驾', '大巴', '骑行'],
    expectSex: ['', '仅限女性', '仅限男性', '不限男女'],
    showCash: false,
    expGift: null, //我要送
    sendGift: null, //我要收
    expEdu: {
      "e9": "高中及以上",
      "e10": "大专及以上",
      "e11": "本科及以上",
      "e12": "硕士及以上",
      "e13": "博士及以上"
    },
    baomingUser: null,
    opacity: 0,
    opacityTrans: 0,
    showRule: false,
    rule: {
      "xy": "选缘：入场选缘开始后，发起人版主选择约会对象（可以通过聊天、送礼等来博取缘主的关注和好感哦），活动持续30分钟。",
      "qy": "抢缘：入场抢缘开始后，会有3轮抢点的机会，每轮间隔2分钟，三轮累计抢点次数最高者胜出，为了女神，施展你的弹指神通吧！活动持续30分钟。",
      "jy": "竞缘：入场竞缘开始后，通过竞价的方式来竞得本次的邀约，竞价开始后30秒内如果没有加价，则当前竞价者胜出，活动持续到竞价完成为止。",
      "zy": "中缘：入场中缘开始后，通过聊天、送礼等会增加自己的活跃度，每消耗120活跃度可以进行一次抽奖，快来抽走你的女神吧！活动持续30分钟。",
      "py": "配缘：入场配缘开始后，系统会有30分钟内匹配一位伙伴与缘主进行约会，通过聊天、送礼等会增加自己的匹配率哦！",
    },
    enrollCount: 0, //已报名人数
    showShare: false,
    shareTitle: '',
    shareDesc: '',
    shareImg: '',
    shareUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '约会详情',
    })
    const _this = this;
    _this.setData({
      id: options.id,
      userInfo: wx.getStorageSync('userInfo')
    })
    _this.getSingle();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  getSingle: function() {
    const _this = this;
    let postdata = {
      datingDetailsId: _this.data.id,
      latitude: app.globalData.latitude,
      longitude: app.globalData.longitude,
    }
    app.appRequest('GET', 'json', '/api/dating/getSingle', postdata, (res) => {
      let item = res.data;
      if (item) {
        if (item.giftDetail) {
          let giftDetail = JSON.parse(item.giftDetail);
          for (let i = giftDetail.length; i--;) {
            if (giftDetail[i].expGift == 1) {
              _this.data.expGift = giftDetail[i];
            }
            if (giftDetail[i].sendGift == 1) {
              _this.data.sendGift = giftDetail[i];
            }
          }
        }
        item.jiaoyouUser.headimgAttachmentId = util.getFullPath(item.jiaoyouUser.headimgAttachmentId, 240);
        item.distance = util.formarDistance(item.distance);
        item.furtherAction = item.furtherAction.split(',');

        if (item.enrollCount && item.enrollCount > 0) {
          _this.getBaomingUser();
        }
        item.coverimgAttachement = item.showPic && item.showPic.split(",").filter((v, i) => {
          return v != '';
        });
      }
      _this.setData({
        datingDetail: item,
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  getBaomingUser: function() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/dating/getDatingCandidateList', {
      datingId: _this.data.id,
      rows: 7,
      page: 1
    }, (res) => {
      if (res.list) {
        for (var i = 0; i < res.list.length; i++) {
          res.list[i].jiaoyouUser.headimgAttachmentId = util.getFullPath(res.list[i].jiaoyouUser.headimgAttachmentId, 240);
        }
      }
      _this.setData({
        enrollCount: res.count || 0,
        baomingUser: res.list || null,
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  }
})
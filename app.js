 
// login/login 登录
// login/modifyPassword 修改密码
// login/forgetPassword 忘记密码
// login/bindPhone 绑定手机
// index/index 首页 

// blindDate/registrationActivity 相亲广场
// blindDateDetail/blindDateDetail 详情页
// blindDate/publishBlindDate 发布相亲
// blindDate/myBlindDate 我的相亲 
// blindDate/blindDateDetail 相亲详情
// blindDate/registrationStaff 报名人员
// blindDate/publish/address 选择地点
// blindDate/publish/navigation 地址导航
// blindDate/publish/activityProcess 活动流程
// blindDate/publish/organizer 选中后的举办单位
// blindDate/publish/activityTips 活动提示
// blindDate/publish/unit 选择举办单位
// blindDate/publish/channel 单个合伙人
// blindDate/publish/sharingChannel 渠道 

// affinity/love 约会
// search/search 发现
// user/user 我的
// certificationCenter/identityAuth 实名认证
// certificationCenter/carAuth 车产认证
// certificationCenter/houseAuth 房产认证
// certificationCenter/healthyAuth 健康认证
// certificationCenter/videoAuth 视频认证
// user/userInfo 个人主页
// user/recentVisit 最近来访
// user/myFocus 我的关注
// user/safeHouse 金屋
// safeHouse/putforward 乾坤金屋/提现
// safeHouse/recharge 乾坤金屋/乾坤币
// safeHouse/gift 乾坤金屋/今日收入
// safeHouse/bond 乾坤金屋/保证金
// safeHouse/qrcode 乾坤金屋/我的二维码
// safeHouse/agent 乾坤金屋/我的代理
// safeHouse/subAgent 下级代理
// safeHouse/bill 账单 
// safeHouse/earnCoin 任务中心  乾坤金屋/赚乾坤币
// user/certificationCenter 认证中心


// //判断用户输入的是否为小写字母
// var regLowerCase = new RegExp('[a-z]', 'g');
// //判断用户输入的是否为大写字母
// var regCapitalLetter = new RegExp('[A-Z]', 'g');
// //判断用户输入的是否为数字
// var regNum = new RegExp('[0-9]', 'g');
// //测试数据，不为小写字母则返回null
// var rsLowerCase = regLowerCase.exec(e.detail.value);
// //测试数据，不为大写字母则返回null
// var rsCapitalLetter = regCapitalLetter.exec(e.detail.value);
// //测试数据，不为数字则返回null
// var rsNum = regNum.exec(e.detail.value); 
const api = require('./js/api.js')
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    const _this = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("获取用户登录凭证Code：" + res.code);
        // return false;
        if (res.code) {
          _this.globalData.code = res.code;
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId 
              app.globalData.wxUserInfo = res.userInfo; 
              console.log("用户信息：" + res.userInfo); 
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              document.documentElement.style.fontSize = (750 / wx.getSystemInfoSync().windowWidth) + 'rpx';
              console.log("dfa" + document.documentElement.style.fontSize);
            }
          })
        }
      }
    })

    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.globalData.latitude = res.latitude;
        this.globalData.longitude = res.longitude;
      }

    })
  },
  globalData: { 
    version: '0.1.2',//当前应用版本号
    isLogin: false,
    code: '',
    wxUserInfo: null,
    userInfo: null,
    latitude: 0,
    longitude: 0,
    channel: {
      isUnion: '',//渠道
      jyNumber: '',//乾坤号
    }, 
    CHANGESTORE: null,
    publishBlindDate: {
      addressIndex: [0,0],
      addressDetailText:'',
      addressId: [0,0],
      navigation: '',
      activityProcess: '',
      activityTips: '',
      checkOrganizerList: [],
      checkCoOrganizerList: [], 
      hostPartys: [],
      assistingPartys: [],
      channel: {},
      extString6: {},
      settingExtString6Key: {},
      settingExtString6:  [],
    },
    baiduKey: "P5Kx0e4uMbYa4sjQzZ3sfGQbHx4Q4PYv",
    accessToken: null,
    contentTypeForm: 'application/x-www-form-urlencoded',
    contentTypeJson: 'application/json',
    pageSize: 10,

    // baseURL: 'http://192.168.0.177:8080/jiaoyou-web',
    phpURL: 'http://mis.iceinfo.net:86',
    imageUrl: 'http://mis.iceinfo.net/userfiles/',
    imageUploadUrl: 'http://mis.iceinfo.net',
    baseURL: 'http://mis.iceinfo.net', 
    baseFrontEndURL: 'http://mis.iceinfo.net/wx/',
    baseShopMobileURL: 'http://mis.iceinfo.net/mobile/',
    socketUrl: 'http://112.74.160.195:9091', 
  },

  /**
   * methods： 请求方式
   * url: 请求地址
   * data： 要传递的参数
   * callback： 请求成功回调函数
   * errFun： 请求失败回调函数
   */
  appRequest(methods, contentType, url, data, callback, errFun) {
    var token = wx.getStorageSync('token'); 
    wx.request({
      url: this.globalData.baseURL + url,
      method: methods,
      header: { // 1:json   2: x-www-form-urlencoded'
        'content-type': 'application/' + contentType,
        'Authorization': 'Bearer '+ token
      },
      data: data,
      success: function(res) {
        callback(res.data);
      },
      fail: function(err) {
        errFun(err);
      }
    })
  },
})
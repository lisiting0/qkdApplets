const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    yesorno: 'none',
    scroll_height: 0,
    id: null,
    menu: { //选择类型、约会详情、资格要求
      type: 1,
      detail: "",
      require: "",
    },
    panel: 1, //选择类型模块、约会详情模块、资格要求模块
    datingThemes: 2, //约会主题（1、旅行 2、吃饭 3、电影 4、唱歌 5、运动 99、其他）
    datingMethod: 1, //活动方式（1:选缘 ,2:抢缘,3:竞缘,4:中缘,5:配缘）
    datingMethodList: [],
    datingMethodTitle: '',
    datingMethodDesc: '',

    extInt11: null, //最低人数
    extInt12: null, //最高人数
    sex: 9, //性别
    showHideBG: false, //显示男女人数
    extInt8: null, //男生人数限制
    extInt9: null, //女生人数限制
    extInt4: 2, //

    addressSel: 2, //自选地点
    addressText: '', //地点 
    cityName: '', //城市名 
    longitude: null,
    latitude: null,
    datingLocation: '', //约会地点
    fullAddress: "", //详细地址

    //出发时间
    departureTimeMenu: ['不限时间', '平常周末', '指定时间'],
    extInt7: null, //不限时间或者平常周末
    extInt10: 0, //准时或者左右

    tripTimeLengthIndex: 0, //预计时间
    tripTimeLength: '',
    tripTimeLengthArr: [{
      name: '一两天',
      value: '1'
    }, {
      name: '三五天',
      value: '2'
    }, {
      name: '十天半月',
      value: '3'
    }],
    tripTimeLengthList: [],

    // 出行方式
    tripModeArr: [{
      name: '火车',
      value: '1'
    }, {
      name: '飞机',
      value: '2'
    }, {
      name: '动高铁',
      value: '3'
    }, {
      name: '游轮',
      value: '4'
    }, {
      name: '自驾',
      value: '5'
    }, {
      name: '大巴',
      value: '6'
    }, {
      name: '骑行',
      value: '7'
    }],
    tripMode: '',
    tripModeIndex: 0,
    tripModeList: [],

    expShowPic: 1, //使用商家图片 2使用相册
    feedImg: [], //发布图片
    datingDesc: '',

    showFeePopup: false,
    animationData: {},
    doinput: false,
    pay: -1, //设置费用
    paysel: 0,
    feesel: null,
    fee: null,
    extInt: false,

    extInt6__s: false, //多退少补
    extInt__s: false,
    extInt_1__s: false,

    shDatingTime: false,
    datingTimeText: '', //约会时间

    certification: {
      none: 1,
      idStatus: 0,
      videoStatus: 0,
      carStatus: 0,
      houseStatus: 0,
    }, // ["不限""身份认证", "视频认证", "车辆认证", "房产认证"],
    certificationText: '',
    education: -1,
    age: -1,
    height: -1,

    //收入要求
    expIncomeLowerLimit: '', //最低
    expIncomeUpperLimit: '', //最高

    staticPosition: false,
    bail: 0,
    showRule: false,

    datingTitle: '',
    datingTitleCache: '',
    datingTitleOtherType: [],

    objTimeText: '',
    minuteList: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],

    carryingFriends: false,

    expGift: 0,
    sendGift: 0,
    giveItems: {},
    sendItems: {},
    giftDetail: null,

    // 约会后续
    followup: [],
    followupSelect: [],

    isLottery: true,
    visibility1: false, //预计时间 
    visibility2: false,

    BondRule: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "发布约会" //页面标题为路由参数
    })
    const _this = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度 
    // 微信小程序获取某个元素的高度宽度
    let query = wx.createSelectorQuery();
    query.select('.publish-menu').boundingClientRect(function(rect) {
      _this.setData({
        scroll_height: windowHeight - rect.height - 52
      })
    }).exec();

    let dayTime = _this.getToday();
    let objTime = _this.getToday2();
    _this.setData({
      datingTimeText: dayTime + ':00',
      objTimeText: objTime,
    })
    _this.getTripTime();
    _this.getTripMode();
    _this.getApiDict();
  },
  onUnload: function() {
    // wx.showModal({
    //   content: '确定要放弃发布吗?',
    //   cancelText: "再想一想",
    //   success: function(sm) {
    //     if (sm.confirm) {
    //       wx.navigateBack();
    //     } else if (sm.cancel) {
    //       console.log('用户点击取消');
    //       return;
    //     }
    //   }
    // })
  },
  getApiDict() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/apiDict', {
      type: "dating_further_action"
    }, (res) => {
      if (!_this.data.id) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].value == 99) {
            res.data[i].isSelected = true;
          } else {
            res.data[i].isSelected = false;
          }
        }
      }
      _this.setData({
        followup: res.data,
      })
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

    //dating_activity_method
    app.appRequest('GET', 'json', '/api/apiDict', {
      type: "dating_activity_method"
    }, (res) => {
      _this.setData({
        datingMethodList: res.data
      })
      for (let i = _this.data.datingMethodList.length; i--;) {
        if (_this.data.datingMethodList[i].value == _this.data.datingMethod) {
          _this.setData({
            datingMethodTitle: _this.data.datingMethodList[i].label,
            datingMethodDesc: _this.data.datingMethodList[i].remarks
          })
          break;
        }
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });

  },
  // 初始化时间 
  toDouble: function(num) {
    if (num >= 10) { //大于10
      return num;
    } else { //0-9
      return '0' + num
    }
  },
  getToday: function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    return year + '-' + this.toDouble(month) + '-' + this.toDouble(day) + ' ' + this.toDouble(hours)
  },
  getToday2: function() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    return year + '-' + this.toDouble(month) + '-' + this.toDouble(day) + ' ' + this.toDouble(hours) + ':00'
  },
  getTripTime() {
    const _this = this;
    let list = [];
    for (let i = 0; i < _this.data.tripTimeLengthArr.length; i++) {
      list.push(_this.data.tripTimeLengthArr[i].name)
    }
    _this.setData({
      tripTimeLengthList: list,
    })
  },
  getTripMode() {
    const _this = this;
    let list = [];
    for (let i = 0; i < _this.data.tripModeArr.length; i++) {
      list.push(_this.data.tripModeArr[i].name)
    }
    _this.setData({
      tripModeList: list,
    })
  },
  menuClick: function(event) {
    let menuIndex = event.currentTarget.dataset.index;
    const _this = this;
    if (menuIndex == 1) {
      _this.setData({
        'menu.type': 1,
        'menu.detail': '',
        'menu.require': '',
        panel: 1
      })
    } else if (menuIndex == 2) {
      _this.setData({
        'menu.type': 1,
        'menu.detail': 1,
        'menu.require': '',
        panel: 2
      })
      _this.finish();
    } else if (menuIndex == 3) {
      _this.setData({
        'menu.type': 1,
        'menu.detail': 1,
        'menu.require': 1,
        panel: 3
      })
      _this.finish();
    }
  },
  chooseDatingThemes: function(event) {
    let theme = event.currentTarget.dataset.theme;
    const _this = this;
    _this.setData({
      datingThemes: theme
    })
  },
  chooseDatingMethod: function(event) {
    let index = event.currentTarget.dataset.index;
    const _this = this;
    _this.setData({
      datingMethod: _this.data.datingMethodList[index].value,
      datingMethodTitle: _this.data.datingMethodList[index].label,
      datingMethodDesc: _this.data.datingMethodList[index].remarks,
    })
  },
  chooseSex: function(event) {
    let sex = event.currentTarget.dataset.sex;
    const _this = this;
    if (_this.data.datingMethod == 7) {
      _this.data.showHideBG = false;
    } else if (_this.data.datingMethod == 8) {
      if (sex == 9) {
        _this.data.showHideBG = true;
      } else {
        _this.data.showHideBG = false;
      }
    }
    _this.setData({
      sex: sex,
      showHideBG: _this.data.showHideBG
    })
  },
  selectAddress: function(event) {
    const that = this;
    wx.showActionSheet({
      itemList: ['自选地点'],
      itemColor: '#000',
      success(res) {
        wx.chooseLocation({ // ①.利用微信选择位置API，获得经纬度信息  
          success: function(lb) {
            console.log(lb)
            wx.request({ // ②百度地图API，将微信获得的经纬度传给百度，获得城市等信息
              url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + app.globalData.baiduKey + '&location=' + lb.latitude + ',' + lb.longitude + '&output=json&coordtype=wgs84ll',
              data: {},
              header: {
                'Content-Type': 'application/json'
              },
              success: function(res) {
                console.log(res.data.result);
                console.log(res.data.result.addressComponent.city + res.data.result.addressComponent.district);
                //③.我们将微信得到的位置名称“故宫博物馆”与百度地图API得到的“北京市东城区”合并显示在页面上。
                that.setData({
                  fullAddress: lb.address + "·" + lb.name,
                  longitude: lb.longitude,
                  latitude: lb.latitude,
                  cityName: res.data.result.addressComponent.city,
                  datingLocation: lb.name,
                  addressText: lb.name,
                })
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
          },
          cancel: function(lb) {},
          fail: function(lb) {
            console.log(lb)
          }
        })
      }
    })
  },
  // 选择时间  
  onPickerDatingTime: function(event) {
    const _this = this;
    _this.setData({
      datingTimeText: event.detail.dateString,
    })
  },
  // 选择对象时间
  onPickerObjTimeText: function(e) {
    const _this = this;
    _this.setData({
      objTimeText: e.detail.dateString
    })
  },
  bindTripTimeChange: function(event) {
    let val = event.detail.value;
    const _this = this;
    _this.setData({
      tripTimeLengthIndex: val,
      tripTimeLength: _this.data.tripTimeLengthArr[val].value
    })
  },
  bindTripModeChange: function(event) {
    let val = event.detail.value;
    const _this = this;
    _this.setData({
      tripModeIndex: val,
      tripMode: _this.data.tripModeArr[val].value
    })
  },
  // 设置费用
  setFeePopul: function(event) {
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
      showFeePopup: true,
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function() {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)
  },
  hideFreePopup: function(event) {
    const that = this;
    let bool = event.currentTarget.dataset.bool;
    if (bool) {
      if (that.data.paysel == 0 || that.data.paysel == 3) {
        if (that.data.feesel == null || that.data.feesel == "" || that.data.feesel == 0) {
          wx.showToast({
            icon: "none",
            title: '请填写费用',
          })
          return;
        }
        if (that.data.feesel && !that.data.extInt__s && !that.data.extInt_1__s) {
          wx.showToast({
            icon: "none",
            title: '请选择收费方式',
          })
          return;
        }
      }
      that.setData({
        pay: that.data.paysel,
        fee: that.data.feesel,
        extInt6: that.data.extInt6__s,
        extInt: that.data.extInt__s,
        extInt_1: that.data.extInt_1__s
      })
    } else {
      that.setData({
        paysel: that.data.pay,
        feesel: that.data.fee,
        extInt6__s: that.data.extInt6,
        extInt__s: that.data.extInt,
        extInt_1__s: that.data.extInt_1
      })
    }
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
        showFeePopup: false
      })
    }, 720) //先执行下滑动画，再隐藏模块  
  },
  setDoinput: function(event) {
    let type = event.currentTarget.dataset.type;
    let bool = event.currentTarget.dataset.bool;
    let num = event.currentTarget.dataset.num;
    this.setData({
      paysel: type,
      doinput: bool,
    })
    if (num == 0) {
      this.setData({
        feesel: 0
      })
    }
  },
  feeselInput: function(event) {
    const _this = this;
    _this.setData({
      feesel: event.detail.value
    })
  },
  radioChange: function(event) {
    let val = event.currentTarget.dataset.checked;
    if (val) {
      this.setData({
        extInt6__s: false
      })
    } else {
      this.setData({
        extInt6__s: true
      })
    }
  },
  radioPTChange: function(event) {
    let val = event.currentTarget.dataset.checked;
    if (val) {
      this.setData({
        extInt__s: false
      })
    } else {
      this.setData({
        extInt__s: true
      })
    }
  },
  radioFQRChange: function(event) {
    let val = event.currentTarget.dataset.checked;
    if (val) {
      this.setData({
        extInt_1__s: false
      })
    } else {
      this.setData({
        extInt_1__s: true
      })
    }
  },
  bindCarryingFriends: function(event) {
    let val = event.currentTarget.dataset.checked;
    if (val) {
      this.setData({
        carryingFriends: false
      })
    } else {
      this.setData({
        carryingFriends: true
      })
    }
  },
  bindtapPic: function(event) {
    const _this = this;
    let val = event.currentTarget.dataset.checked;
    if (val == 1) {
      this.setData({
        expShowPic: 1
      })
    } else {
      this.setData({
        expShowPic: 2
      })
    }
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
        success: function(res) { //上传成功返回数据
          // console.log('上传成功返回的数据', JSON.parse(res.data));
          var data = JSON.parse(res.data);
          if (data.status == 1) {
            _this.setData({
              feedImg: _this.data.feedImg.concat(util.getFullPath(data.data.path, 240))
            })
            console.log(_this.data.feedImg)
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
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList, // 需要预览的图片http链接列表
    })
  },
  /**
   * 删除图片
   */
  deletedImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.data.feedImg.splice(index, 1);
    that.setData({
      feedImg: that.data.feedImg
    })
  },
  datingDescInput: function(event) {
    const _this = this;
    if (!event.detail.value) {
      wx.showToast({
        icon: "none",
        title: '写点什么会有更多关注哦',
      })
    }
    _this.setData({
      datingDesc: event.detail.value
    })
  },
  followupClick: function(event) {
    console.log(event);
    const _this = this;
    let index = event.currentTarget.dataset.index;
    _this.data.followup[index].isSelected = !_this.data.followup[index].isSelected;
    _this.setData({
      followup: _this.data.followup
    })
  },
  certificationClick: function(event) {
    let val = event.currentTarget.dataset.certification;
    const _this = this;
    if (val != 0) {
      _this.setData({
        'certification.none': 0
      })
    }
    if (val == 0) {
      let none = _this.data.certification.none == 0 ? _this.data.certification.none = 1 : _this.data.certification.none = 0;
      _this.setData({
        'certification.none': none,
        'certification.idStatus': 0,
        'certification.videoStatus': 0,
        'certification.carStatus': 0,
        'certification.houseStatus': 0,
        certificationText: ''
      })
    } else if (val == 1) {
      let idStatus = _this.data.certification.idStatus == 0 ? _this.data.certification.idStatus = 1 : _this.certification.data.idStatus = 0
      _this.setData({
        'certification.idStatus': idStatus,
        certificationText: '身份认证'
      })
    } else if (val == 2) {
      let videoStatus = _this.data.certification.videoStatus == 0 ? _this.data.certification.videoStatus = 1 : _this.certification.data.videoStatus = 0
      _this.setData({
        'certification.videoStatus': videoStatus,
        certificationText: '视频认证'
      })
    } else if (val == 3) {
      let carStatus = _this.data.certification.carStatus == 0 ? _this.data.certification.carStatus = 1 : _this.certification.data.carStatus = 0
      _this.setData({
        'certification.carStatus': carStatus,
        certificationText: '车辆认证'
      })
    } else if (val == 4) {
      let houseStatus = _this.data.certification.houseStatus == 0 ? _this.data.certification.houseStatus = 1 : _this.certification.data.houseStatus = 0
      _this.setData({
        'certification.houseStatus': houseStatus,
        certificationText: '房产认证'
      })
    }
    setTimeout(() => {
      _this.setData({
        certificationText: ""
      })
    }, 500);

  },
  educationClick: function(event) {
    let education = event.currentTarget.dataset.education;
    const _this = this;
    _this.setData({
      education: education,
    })
  },
  ageClick: function(event) {
    let age = event.currentTarget.dataset.age;
    const _this = this;
    _this.setData({
      age: age,
      expAgeLowerLimit: age,
      expAgeUpperLimit: age == -1 ? -1 : age == 18 ? 24 : age == 24 ? 30 : age == 30 ? 36 : age == 36 ? 41 : -1,
    })
  },
  incomeClick: function(event) {
    let incomelower = event.currentTarget.dataset.incomelower;
    let incomeuper = event.currentTarget.dataset.incomeuper;
    const _this = this;
    _this.setData({
      expIncomeLowerLimit: incomelower,
      expIncomeUpperLimit: incomeuper,
    })
  },
  heightClick: function(event) {
    let height = event.currentTarget.dataset.height;
    const _this = this;
    _this.setData({
      height: height,
      expHeightLowerLimit: height,
      expHeightUpperLimit: -1,
    })
  },
  finish: function(event) {
    const _this = this;
    let state = '';
    if (event) {
      state = event.currentTarget.dataset.index;
    } else {
      state = 2;
    }
    //下一步的操作
    if (state == 1) {
      if (_this.data.menu.detail == '' || _this.data.menu.require == 1) {
        _this.setData({
          'menu.detail': 1,
          'menu.require': '',
          panel: 2,
        })
      } else if (_this.data.menu.detail == 1 && _this.data.menu.require == '') {
        _this.setData({
          'menu.require': 1,
          panel: 3,
        })
      }
    }
    if (_this.data.panel == 2) {
      if (_this.data.datingDesc == '') {
        wx.showToast({
          icon: 'none',
          title: '请填写描述说明',
        })
        _this.setData({
          'menu.type': 1,
          'menu.detail': '',
          'menu.require': '',
          panel: 1
        })
        return;
      }
    }
    if (_this.data.panel == 3) {
      if (_this.data.fullAddress == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择地点',
        })
        _this.setData({
          'menu.type': 1,
          'menu.detail': 1,
          'menu.require': '',
          panel: 2
        })
        return;
      }

      if (!_this.data.datingTimeText) {
        wx.showToast({
          icon: 'none',
          title: '请选择约会时间',
        })
        _this.setData({
          'menu.type': 1,
          'menu.detail': 1,
          'menu.require': '',
          panel: 2
        })
        return;
      }

      if (!_this.data.objTimeText) {
        wx.showToast({
          icon: 'none',
          title: '请选择约会对象时间',
        })
        _this.setData({
          'menu.type': 1,
          'menu.detail': 1,
          'menu.require': '',
          panel: 2
        })
        return;
      }
      if (_this.data.pay == -1) {
        wx.showToast({
          icon: 'none',
          title: '请选择费用',
        })
        _this.setData({
          'menu.type': 1,
          'menu.detail': 1,
          'menu.require': '',
          panel: 2
        })
        return;
      }
      if (_this.data.pay == 0 || _this.data.pay == 3) {
        if (!_this.data.fee) {
          wx.showToast({
            icon: 'none',
            title: '请设置费用',
          })
          _this.setData({
            'menu.type': 1,
            'menu.detail': 1,
            'menu.require': '',
            panel: 2
          })
          return;
        }
        if (_this.data.fee && !_this.data.extInt && !_this.data.extInt_1) {
          wx.showToast({
            icon: 'none',
            title: '请选择收费方式',
          })
          _this.setData({
            'menu.type': 1,
            'menu.detail': 1,
            'menu.require': '',
            panel: 2
          })
          return;
        }
      }

      if (_this.data.followupSelect && _this.data.followupSelect.length < 0) {
        wx.showToast({
          icon: 'none',
          title: '请选择约会后续',
        })
        _this.setData({
          'menu.type': 1,
          'menu.detail': 1,
          'menu.require': '',
          panel: 2
        })
        return;
      }
      if (_this.data.addressSel == 2) {
        app.appRequest('GET', 'json', '/api/district/all', {}, (res) => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].name == _this.data.cityName) {
              _this.data.addressAreaId = res.data[i].value;
              break;
            }
          }
        }, (err) => {
          console.log('请求错误信息：  ' + err.errMsg);
        });
      }

      _this.data.giftDetail = [];
      if (_this.data.expGift == 1) {
        _this.data.giftDetail.push(_this.data.giveItems);
      }
      if (_this.data.sendGift == 1) {
        _this.data.giftDetail.push(_this.data.sendItems);
      }
    }

    let data = {
      id: _this.data.id,
      state: state == 1 || state == 2 ? 2 : 3,
      datingThemes: _this.data.datingThemes, //约会类型
      activityMethod: _this.data.datingMethod, //方式
      expectSex: _this.data.sex, //性别
      datingLocation: _this.data.datingLocation, //地点 
      longitude: _this.data.longitude, //纬度
      latitude: _this.data.latitude, //经度
      areaId: _this.data.addressAreaId, //市区Id
      extString: _this.data.fullAddress,
      activityStarttime: _this.data.objTimeText ? _this.data.objTimeText + ":00" : '',
      datingStarttime: _this.data.datingTimeText ? _this.data.datingTimeText + ':00:00' : '',
      tripTimeLength: _this.data.tripTimeLength,
      tripMode: _this.data.tripMode,
      payType: _this.data.pay, //费用
      enrollFee: _this.data.fee,
      expShowPic: _this.data.expShowPic ? 2 : 3, //是否使用相册
      coverimgImages: _this.data.feedImg ? _this.data.feedImg.join(",") : null,
      datingDesc: _this.data.datingDesc || _this.data.datingTitle,
      expGift: _this.data.expGift,
      idStatus: _this.data.certification.idStatus,
      houseStatus: _this.data.certification.houseStatus,
      carStatus: _this.data.certification.carStatus,
      healthyStatus: _this.data.certification.healthyStatus,
      videoStatus: _this.data.certification.videoStatus,
      expEdu: _this.data.education,
      expAgeLowerLimit: _this.data.age,
      expAgeUpperLimit: _this.data.age == -1 ? -1 : _this.data.age == 18 ? 24 : _this.data.age == 24 ? 30 : _this.data.age == 30 ? 36 : _this.data.age == 36 ? 41 : -1,
      expHeightLowerLimit: _this.data.height,
      expHeightUpperLimit: -1,
      expIncomeLowerLimit: _this.expIncomeLowerLimit,
      expIncomeUpperLimit: _this.expIncomeUpperLimit,
      datingDetailsExt: {
        extInt11: _this.data.extInt11, //最低人数
        extInt12: _this.data.extInt12, //最高人数
        extInt8: _this.data.extInt8, //男生人数
        extInt9: _this.data.extInt9, //女生人数
        extInt: _this.data.extInt ? 1 : 0,
        extInt6: _this.data.extInt6 ? 1 : 0,
        extInt4: _this.data.extInt4,
        extInt7: _this.data.extInt7,
        extInt10: _this.data.extInt10, //出发时间 左右准时
      },


      datingTitle: _this.data.datingTitle,
      expDepositMoney: _this.data.bail,
      datingChoseShopId: _this.data.datingChoseShopId,
      allowCompanion: _this.data.carryingFriends ? 1 : 0,
      sendGift: _this.data.sendGift,
      giftDetail: _this.data.giftDetail ? JSON.stringify(_this.data.giftDetail) : null,
      furtherAction: _this.data.followupSelect.map((item) => {
        return item.label;
      }).join(","),
      onlyTheme: 1,
      sysDistribution: _this.data.isLottery ? '1' : '0'
    }
    console.log(JSON.stringify(data));
    app.appRequest('POST', 'json', '/api/dating/publish', data, (res) => {
      if (res.status == 1) {
        _this.setData({
          id: res.data.id
        })
        wx.hideLoading();
        if (state == 2 || state == 3) {
          wx.showToast({
            title: state == 2 ? '保存成功' : '发布成功',
            icon: 'success',
          })
          if (state == 3) {
            wx.switchTab({
              url: '/pages/affinity/love',
            })
          }
        }
      } else {
        wx.showToast({
          icon: "none",
          title: res.message,
        })
        return false;
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
})
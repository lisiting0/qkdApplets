const util = require('../../utils/util.js')
var app = getApp()
var regNum = new RegExp('[0-9]', 'g');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    activityState: 0, //活动状态

    poster: null, //海报 
    cover: '', //封面   

    //相亲类型
    typeList: [{
        id: 0,
        name: '线上',
        value: '1'
      },
      {
        id: 1,
        name: '线下',
        value: '2'
      },
    ],
    typeIndex: 1,

    //专场类型
    specialTypeList: null,
    specialTypeIndex: 0,

    //活动标题 
    shActivityTitle: false,
    activityTitle: '',

    // 活动地点 
    addressList: [], //保存【【省】，【级】】
    addressArr: [], //保存全部（包括省市）
    provinceArray: [], //保存省
    addressIndex: [0, 0],
    addressDetailText: '', //具体地点 
    addressId: [], //省的id和市区的Id

    numberOfPeople: '', // 报名总人数 
    registrationFee: '', // 报名费用 
    extInt8: '', //男生报名人数限制
    extInt9: '', //女生报名人数限制
    extDouble: '', //男生报名费用
    extDouble2: '', //女生报名费用

    // 约会时间
    startTime: '',
    startTimeArr: [],
    minuteList: ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],


    bmStartTime: '', // 活动开始时间

    bmEndTime: '', // 活动结束时间

    theme: '', // 主题 

    navigation: '', // 地址导航 

    activityProcess: '', // 活动流程 

    activityTips: '', // 活动提示 

    hostPartys: [], //提交的主办单位

    assistingPartys: [], //提交的协办单位 

    shExtString7: false,
    extString7: '', //分享标题  

    shExtString8: false,
    extString8: '', //分享描述

    extString6: {
      a9fDfoS: {
        boyFee: '',
        girlFee: '',
        boyLimit: '',
        girlLimit: '',
        name: "默认渠道"
      },
      a9fyas8f: {
        share: null,
        needVerify: 0,
        boyFee: '',
        girlFee: '',
        boyLimit: '',
        girlLimit: '',
        name: "合伙人共享渠道"
      }
    }, //报名渠道信息
    extString6Sort: null,
    allUnit: [],
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.extString6Sort();
  },
  onShow: function() {
    const _this = this;
    let globalData = app.globalData.publishBlindDate;
    if (globalData.extString6) {
      let extString6Key = globalData.extString6.key ? 'extString6.' + globalData.extString6.key : '';
      let ovj = globalData.extString6.item ? globalData.extString6.item : '';
      _this.setData({
        [extString6Key]: ovj,
      })
    }
    _this.setData({
      addressDetailText: globalData.addressDetailText,
      addressId: globalData.addressId,
      navigation: globalData.navigation,
      activityProcess: globalData.activityProcess,
      activityTips: globalData.activityTips,
      checkOrganizerList: globalData.checkOrganizerList,
      checkCoOrganizerList: globalData.checkCoOrganizerList,
      hostPartys: globalData.hostPartys,
      assistingPartys: globalData.assistingPartys
    })
    _this.extString6Sort();
  },
  onUnload: function() {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面 
    prevPage.setData({
      showHidePublishBtn: true,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "发布相亲活动" //页面标题为路由参数
    })
    const _this = this;
    _this.getSpecialType();
    let dayTime = _this.getToday();
    _this.setData({
      startTime: dayTime,
      bmStartTime: dayTime,
      bmEndTime: dayTime,
    })
    if (options.id) {
      _this.setData({
        id: options.id
      })
      _this.getBlindDateSingle();
    }
  },
  chooseImage: function(options) {
    const _this = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let type = options.currentTarget.dataset.type;
        var tempFilePaths = res.tempFilePaths
        _this.upload(tempFilePaths, type);
      }
    })
  },
  upload: function(path, type) {
    const _this = this;
    wx.showToast({
        icon: "loading",
        title: "正在上传"
      }),

      wx.uploadFile({
        url: app.globalData.imageUploadUrl + '/api/user/upload_pic',
        filePath: path[0],
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: function(res) { //上传成功返回数据
          console.log('上传成功返回的数据', JSON.parse(res.data).data)
          var data = JSON.parse(res.data);
          if (data.status == 1) {
            if (type == 'poster') {
              _this.setData({
                poster: util.getFullPath(data.data.path, 240)
              })
            } else {
              _this.setData({
                cover: util.getFullPath(data.data.path, 240)
              })
            }
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
  bindShTypeChange: function(event) {
    this.setData({
      typeIndex: event.detail.value
    })
  },
  getSpecialType() {
    const _this = this;
    try {
      app.appRequest('GET', 'json', '/api/apiDict', {
        type: "blind_dating_special_type"
      }, (res) => {
        let item = res.data;
        let specialType = [];
        if (item) {
          // { id: 1, name: "普通" }
          for (let i = 0; i < item.length; i++) {
            specialType.push({
              id: parseInt(item[i].value),
              name: item[i].label
            })
          }
        }
        if (!_this.data.specialTypeList) {
          _this.data.specialTypeList = {};
        }
        _this.setData({
          specialTypeList: specialType
        });
      }, (err) => {
        console.log('请求错误信息：  ' + err.errMsg);
      });
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  },
  bindSpecialTypeChange: function(event) {
    this.setData({
      specialTypeIndex: event.detail.value
    })
  },
  activityTitleInput: function(event) {
    const _this = this;
    if (event.detail.value.length < 5) {
      wx.showToast({
        icon: "none",
        title: '请输入活动标题，不少于5个字',
      })
    }
    _this.setData({
      activityTitle: event.detail.value
    })
  },
  themeInput: function(event) {
    const _this = this;
    if (event.detail.value.length < 5) {
      wx.showToast({
        icon: "none",
        title: '请输入相亲主题，不少于5个字',
      })
    }
    _this.setData({
      theme: event.detail.value
    })
  },
  extString7Input: function(event) {
    const _this = this;
    if (event.detail.value.length < 5) {
      wx.showToast({
        icon: "none",
        title: '请输入分享标题，不少于5个字',
      })
    }
    _this.setData({
      extString7: event.detail.value
    })
  },
  extString8Input: function(event) {
    const _this = this;
    if (event.detail.value.length < 5) {
      wx.showToast({
        icon: "none",
        title: '请输入分享描述，不少于5个字',
      })
    }
    _this.setData({
      extString8: event.detail.value
    })
  },
  bindPopupChange: function(event) {
    const _this = this;
    let popup = event.currentTarget.dataset.popup;
    let sh = event.currentTarget.dataset.sh; 
    if (popup == "shActivityTitle") {
      _this.setData({
        shActivityTitle: !sh
      })
    } else if (popup == "shTheme") {
      _this.setData({
        shTheme: !sh
      })
    } else if (popup == "shExtString7") {
      _this.setData({
        shExtString7: !sh
      })
    } else if (popup == "shExtString8") {
      _this.setData({
        shExtString8: !sh
      })
    }
  },
  bindPopupConfirm: function(event) {
    const _this = this;
    let popup = event.currentTarget.dataset.popup;
    if (popup == "shActivityTitle") {
      if (!_this.data.activityTitle) {
        wx.showToast({
          icon: 'none',
          title: '活动标题不能为空',
        })
        return;
      }
      if (_this.data.activityTitle.length < 5) {
        wx.showToast({
          icon: 'none',
          title: '活动标题不少于5个字符',
        })
        return;
      }
      _this.setData({
        shActivityTitle: false
      })
    } else if (popup == "shTheme") {
      if (!_this.data.theme) {
        wx.showToast({
          icon: 'none',
          title: '相亲主题不能为空',
        })
        return;
      }
      if (_this.data.theme.length < 5) {
        wx.showToast({
          icon: 'none',
          title: '相亲主题不少于5个字符',
        })
        return false;
      }
      _this.setData({
        shTheme: false
      })
    } else if (popup == "shExtString7") {
      if (!_this.data.extString7) {
        wx.showToast({
          icon: 'none',
          title: '分享主题不能为空',
        })
        return;
      }
      if (_this.data.extString7.length < 5) {
        wx.showToast({
          icon: 'none',
          title: '相亲主题不少于5个字符',
        })
        return false;
      }
      _this.setData({
        shExtString7: false
      })
    } else if (popup == "shExtString8") {
      if (!_this.data.extString8) {
        wx.showToast({
          icon: 'none',
          title: '相亲主题不能为空',
        })
        return;
      }
      if (_this.data.extString8.length < 5) {
        wx.showToast({
          icon: 'none',
          title: '相亲主题不少于5个字符',
        })
        return false;
      }
      _this.setData({
        shExtString8: false
      })
    }
  },
  navigateTo: function(event) {
    const _this = this;
    let url = event.currentTarget.dataset.url;
    let append = '';
    if (_this.data.id) {
      append = '?id=' + _this.data.id;
    }
    wx.navigateTo({
      url: '/pages/blindDate/publish/' + url + append,
    })
  },
  bindNumberInput: function(e) {
    const _this = this;
    let val = e.detail.value;
    if (regNum.exec(val) == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入正整数',
      })
      return;
    }
    let input = e.currentTarget.dataset.input;
    _this.setData({
      numberOfPeople: input == "numberOfPeople" ? val : _this.data.numberOfPeople,
      registrationFee: input == "registrationFee" ? val : _this.data.registrationFee,
      extInt8: input == "extInt8" ? val : _this.data.extInt8,
      extInt9: input == "extInt9" ? val : _this.data.extInt9,
    })
  },
  bindDoubleInput: function(e) {
    const _this = this;
    let val = e.detail.value;
    var reg = /^[0-9,.]*$/ //^[-\+]?\d+(\.\d+)?$/;
    if (reg.exec(val) == null) {
      wx.showToast({
        icon: 'none',
        title: '请输入数字',
      })
      return;
    }
    _this.setData({
      registrationFee: val
    })
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
    return year + '-' + this.toDouble(month) + '-' + this.toDouble(day) + ' ' + this.toDouble(hours) + ':00'
  },
  onPickerStartTime: function(e) {
    this.setData({
      startTime: e.detail.dateString
    })
  },
  onPickerBMStartTime: function(e) {
    this.setData({
      bmStartTime: e.detail.dateString
    })
  },
  onPickerBMEndTime: function(e) {
    this.setData({
      bmEndTime: e.detail.dateString
    })
  },
  extString6Sort: function() {
    const _this = this;
    let obj = util.deepCopy(this.data.extString6);
    let arr = [];
    arr[0] = {
      key: "a9fDfoS",
      ov: obj.a9fDfoS
    }
    arr[1] = {
      key: "a9fyas8f",
      ov: obj.a9fyas8f
    }
    for (let v in obj) {
      if (v != "a9fyas8f" && v != "a9fDfoS") {
        arr.push({
          key: v,
          ov: obj[v]
        })
      }
    }
    this.setData({
      extString6Sort: arr
    })
  },
  addExtString6: function(e) {
    wx.navigateTo({
      url: '/pages/blindDate/publish/channel',
    })
  },
  showExtString6: function(e) {
    let key = e.currentTarget.dataset.key;
    let ov = e.currentTarget.dataset.ov;
    let settingExtString6 = null;
    let pubData = app.globalData.publishBlindDate;
    if (key) {
      console.log("有key")
      settingExtString6 = util.deepCopy(ov);
      settingExtString6.key = key;
      pubData.settingExtString6Key = settingExtString6;
    } else {
      console.log("没有key,有合伙人名字")
      settingExtString6 = {
        fee: _this.data.registrationFee,
        boyFee: _this.data.extDouble,
        girlFee: _this.data.extDouble2,
        limit: _this.data.numberOfPeople,
        boyLimit: _this.data.extInt8,
        girlLimit: _this.data.extInt9,
      }
      pubData.settingExtString6 = settingExtString6;
    }
    wx.navigateTo({
      url: '/pages/blindDate/publish/sharingChannel',
    })
  },
  getUnit: function() {
    const _this = this;
    //获取举办单位列表
    app.appRequest('GET', 'json', '/api/host/list', {
      page: pageIndex,
      rows: app.globalData.pageSize
    }, (res) => {
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          item[i].logoUrl = util.getFullPath(item[i].logoUrl, 120);
          item[i].checked = true;
        }
        _this.setData({
          allUnit: item
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  getBlindDateSingle() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/blindDating/getSingle', {
      datingDetailsId: _this.data.id
    }, (res) => {
      let hostPartysList = [];
      let assistingPartysList = [];
      let checkOrganizerList = [];
      let checkCoOrganizerList = [];
      let data = res.data;
      if (data.hostPartyList && data.hostPartyList.length > 0) {
        for (let i = 0; i < data.hostPartyList.length; i++) {
          hostPartysList.push(data.hostPartyList[i].company.id);
          checkOrganizerList.push({
            id: data.hostPartyList[i].company.id,
            logoUrl: util.getFullPath(data.hostPartyList[i].company.logoUrl, 120),
            unitName: data.hostPartyList[i].company.unitName,
            checked: true
          })
        }
      }
      if (data.assistingPartyList && data.assistingPartyList.length > 0) {
        for (let i = 0; i < data.assistingPartyList.length; i++) {
          assistingPartysList.push(data.assistingPartyList[i].company.id);
          checkCoOrganizerList.push({
            id: data.assistingPartyList[i].company.id,
            logoUrl: util.getFullPath(data.assistingPartyList[i].company.logoUrl, 120),
            unitName: data.assistingPartyList[i].company.unitName,
            checked: true
          })
        }
      }
      _this.setData({
        activityState: data.state, //活动状态 
        poster: data.coverimgImages, //活动宣传图（海报）
        cover: data.datingDetailsExt.extString, //
        typeIndex: data.datingDetailsExt.extInt, //相亲类型：字典组	blind_dating_line_type
        specialTypeIndex: data.datingDetailsExt.extInt5, //专场类型：字典 blind_dating_special_type
        activityTitle: data.datingTitle, //活动标题
        addressDetailText: data.datingLocation, //地点   
        numberOfPeople: data.datingDetailsExt.extInt4, //报名总人数
        registrationFee: data.enrollFee, //报名费用 
        extInt8: data.datingDetailsExt.extInt8, //男报名人数
        extInt9: data.datingDetailsExt.extInt9, //女报名人数 
        extDouble: data.datingDetailsExt.extDouble, //男生报名费用
        extDouble2: data.datingDetailsExt.extDouble2, //女生报名费用
        startTime: data.activityStarttime ? data.activityStarttime.substring(0, 16) : _this.data.startTime, //活动时间
        bmStartTime: data.datingDetailsExt.extDatetime ? data.datingDetailsExt.extDatetime.substring(0, 16) : _this.data.bmStartTime, //报名开始时间
        bmEndTime: data.datingDetailsExt.extDatetime2 ? data.datingDetailsExt.extDatetime2.substring(0, 16) : _this.data.bmEndTime, //报名结束时间
        theme: data.datingDesc, //相亲主题
        navigation: data.datingDetailsExt.extString2, //地址导航
        activityProcess: data.datingDetailsExt.extString3, //活动流程
        hostPartys: hostPartysList, //主办单位
        assistingPartys: assistingPartysList, //协办单位
        activityTips: data.datingDetailsExt.extString5, //活动提示  
        extString7: data.datingDetailsExt.extString7, //分享标题
        extString8: data.datingDetailsExt.extString8, //分享描述
        extString6: JSON.parse(data.datingDetailsExt.extString6), //渠道报名 
      })
      if (data.areaName || data.cityName) {
        _this.setData({
          addressId: [data.cityId, data.areaId]
        })
      }

      app.globalData.publishBlindDate = {
        addressIndex: [0, 0],
        addressDetailText: _this.data.addressDetailText,
        addressId: _this.data.addressId,
        navigation: _this.data.navigation,
        activityProcess: _this.data.activityProcess,
        activityTips: _this.data.activityTips,
        hostPartys: _this.data.hostPartys,
        assistingPartys: _this.data.assistingPartys,
        checkOrganizerList: checkOrganizerList,
        checkCoOrganizerList: checkCoOrganizerList,
        channel: {},
        extString6: {},
        settingExtString6Key: {},
        settingExtString6: [],
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  save: function(event) {
    const _this = this;
    let state = event.currentTarget.dataset.state;

    if (state == 3) {
      if (!_this.data.poster && typeof(_this.data.poster) != "undefined" && _this.data.poster != 0) {
        wx.showToast({
          icon: 'none',
          title: '海报不能为空',
        })
        return;
      }
      if (!_this.data.cover && typeof(_this.data.cover) != "undefined" && _this.data.cover != 0) {
        wx.showToast({
          icon: 'none',
          title: '封面图不能为空',
        })
        return;
      }
      if (_this.data.activityTitle == "") {
        wx.showToast({
          icon: 'none',
          title: '活动标题不能为空',
        })
        return;
      }
      if (_this.data.numberOfPeople == "") {
        wx.showToast({
          icon: 'none',
          title: '报名人数不能为空',
        })
        return;
      }
      if (_this.data.addressId.length < 0) {
        wx.showToast({
          icon: 'none',
          title: '活动地点不能为空',
        })
        return;
      }
      if (_this.data.addressDetailText == "") {
        wx.showToast({
          icon: 'none',
          title: '具体地点不能为空',
        })
        return;
      }
      if (!_this.data.navigation) {
        wx.showToast({
          icon: 'none',
          title: '地址导航不能为空',
        })
        return;
      }
      if (_this.data.activityProcess == "") {
        wx.showToast({
          icon: 'none',
          title: '活动流程不能为空',
        })
        return;
      }
      if (_this.data.activityTips == "") {
        wx.showToast({
          icon: 'none',
          title: '活动提示不能为空',
        })
        return;
      }
      if (_this.data.extString7 == "") {
        wx.showToast({
          icon: 'none',
          title: '分享标题不能为空',
        })
        return;
      }
      if (_this.data.extString8 == "") {
        wx.showToast({
          icon: 'none',
          title: '分享描述不能为空',
        })
        return;
      }
    }
    if (_this.data.theme == "") {
      wx.showToast({
        icon: 'none',
        title: '相亲主题不能为空',
      })
      return;
    }
    if (_this.data.registrationFee < 0) {
      wx.showToast({
        icon: 'none',
        title: '报名费用不能小于0',
      })
      return false;
    }
    let stateNum = state;
    let datingDetailsExt = {
      extString: _this.data.cover,
      extInt: _this.data.typeIndex,
      extInt4: _this.data.numberOfPeople,
      extInt5: _this.data.specialTypeIndex,
      extInt8: _this.data.extInt8,
      extInt9: _this.data.extInt9,
      extDouble: _this.data.extDouble,
      extDouble2: _this.data.extDouble2,
      extString2: _this.data.navigation,
      extString3: _this.data.activityProcess,
      extString5: _this.data.activityTips,
      extString6: JSON.stringify(_this.data.extString6),
      extString7: _this.data.extString7,
      extString8: _this.data.extString8,
      extDatetime: _this.data.bmStartTime && _this.data.bmStartTime + ":00",
      extDatetime2: _this.data.bmEndTime && _this.data.bmEndTime + ":59"
    };
    let postdataobj = {
      id: _this.data.id,
      coverimgImages: _this.data.poster, //活动宣传图
      datingTitle: _this.data.activityTitle,
      activityStarttime: _this.data.startTime && _this.data.startTime + ":00", //相亲开始时间
      state: stateNum, //3发布，2保存
      cityId: _this.data.addressId[0], //城市ID
      areaId: _this.data.addressId[1], //区县ID
      datingLocation: _this.data.addressDetailText, //约会地点
      enrollFee: _this.data.registrationFee, //报名费用
      datingDesc: _this.data.theme, //相亲主题
      datingDetailsExt: datingDetailsExt,
      hostPartys: _this.data.hostPartys && _this.data.hostPartys.join(','),
      assistingPartys: _this.data.assistingPartys && _this.data.assistingPartys.join(','),
      sponsor: 0,
    }
    console.log(postdataobj);
    if (_this.data.activityState == 3 || _this.data.activityState == 6) {
      app.appRequest('POST', 'json', '/api/blindDating/modify', postdataobj, (res) => {
        if (res.status == 1) {
          _this.setData({
            id: res.data.id
          })
          wx.showToast({
            title: '发布成功',
          })

          if (state == 3) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
            app.globalData.publishBlindDate = {
              addressIndex: [0, 0],
              addressDetailText: '',
              addressId: [0, 0],
              navigation: '',
              activityProcess: '',
              activityTips: '',
              checkOrganizerList: [],
              checkCoOrganizerList: [],
              hostPartys: [],
              assistingPartys: [],
              extString6: {},
              settingExtString6Key: {},
              settingExtString6: [],
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
    } else {
      app.appRequest('POST', 'json', '/api/blindDating/publish', postdataobj, (res) => {
        if (res.status == 1) {
          _this.setData({
            id: res.data.id
          })
          wx.showToast({
            title: '保存成功',
          })
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
    }
  }
})
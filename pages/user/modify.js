const util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    id: null,
    isRequired: true, //必填
    isValidate: '', //验证信息
    headimgAttachmentId: [], //头像
    feedImg: [], //封面图

    //昵称
    shAliasName: false,
    aliasName: '',

    //生日
    visibility: false,
    emptyBirthday: false,
    birthday: '',
    startDate: '',
    endDate: '',

    // 个性签名
    shSelfLabel: false,
    selfLabel: '',

    // 身高
    heightVal: '', //值
    heightIndex: 0,
    heightList: [],

    // 学历
    educationVal: '', //值
    educationIndex: 0,
    educationList: [{
        name: '大专以下',
        value: 0
      },
      {
        name: '大专',
        value: 10
      },
      {
        name: '本科',
        value: 11
      },
      {
        name: '硕士',
        value: 12
      },
      {
        name: '博士',
        value: 13
      },
      {

        name: '出国留学',
        value: 14
      }
    ],

    // 居住地
    liveIndex: [0, 0],
    provinceArray: [], //临时保存省 
    cityArray: [], //临时保存市
    liveArr: [], //列表
    liveList: [], //选中的数组
    liveProId: 20, //省Id
    liveCityId: 321, //市Id

    // 毕业院校
    shSchool: false,
    school: '',

    // 职业
    shProfession: false,
    profession: '',

    // 真实姓名
    shName: false,
    name: '',

    // 家乡
    placeIndex: [0, 0],
    placeProvinceArray: [], //临时保存省 
    placeCityArray: [], //临时保存市
    placeArr: [], //列表
    placeList: [], //选中的数组
    placeProId: 20, //省Id
    placeCityId: 321, //市Id

    // 婚姻状况
    emotionalStateList: [{
        name: '未婚',
        value: 1
      },
      {
        name: '离异',
        value: 2
      },
      {
        name: '其他',
        value: 3
      },
    ],
    emotionalIndex: 0, //选中的数组 
    emotion: '', //值 

    // 月收入
    incomeList: [{
        name: '2千以下',
        value: 1
      },
      {
        name: '2-4千元',
        value: 2
      },
      {
        name: '4-6千元',
        value: 3
      },
      {
        name: '6千-1万元',
        value: 4
      },
      {
        name: '1-1.5万元',
        value: 5
      },
      {
        name: '1.5-2万元',
        value: 6
      },
      {
        name: '2-2.5万元',
        value: 7
      },
      {
        name: '5万以上',
        value: 8
      },
    ],
    incomeIndex: 0, //选中的数组
    incomeLVal: 0, //联动显示的值
    incomeRVal: 0, //联动显示的值 

    //是否吸烟
    smokingList: [{
        name: '从不',
        value: 1
      },
      {
        name: '偶尔抽',
        value: 2
      },
      {
        name: '经常抽',
        value: 3
      },
    ], //列表
    smokingIndex: 0, //选中的数组
    smokingVal: '', //联动显示的值

    //是否喝酒
    drinkList: [{
        name: '从不',
        value: 1
      },
      {
        name: '偶尔喝',
        value: 2
      },
      {
        name: '经常喝',
        value: 3
      },
    ],
    drinkIndex: 0, //选中的数组
    drinkVal: '', //联动显示的值

    //子女情况
    childList: [{
        name: '无',
        value: 1
      },
      {
        name: '有小孩归自已',
        value: 2
      },
      {
        name: '有小孩归对方',
        value: 3
      },
    ], //列表
    childIndex: 0, //选中的数组
    childVal: '', //联动显示的值

    // 住房情况
    houseList: [{

        name: '已购房',
        value: 1
      },
      {

        name: '租房',
        value: 2
      },
      {

        name: '单位宿舍',
        value: 3
      },
      {

        name: '正打算购房',
        value: 4
      },
      {

        name: '和家人同住',
        value: 5
      },
    ], //列表
    houseIndex: 3, //选中的数组
    houseVal: '', //联动显示的值

    //购车情况
    carList: [{
        name: '已购车',
        value: 1
      },
      {
        name: '未购车',
        value: 2
      },
      {
        name: '正打算购车',
        value: 3
      },
    ],
    carIndex: 2, //选中的数组
    carVal: '', //联动显示的值

    rankingList: [{
        name: '独生子女',
        value: 1
      },
      {
        name: '老大',
        value: 2
      },
      {
        name: '老二',
        value: 3
      },
      {
        name: '老三',
        value: 4
      },
      {
        name: '老幺',
        value: 5
      }
    ], //列表
    rankingIndex: 0, //选中的数组
    rankingVal: null, //联动显示的值

    //年龄 
    ageLArr: [], //第一列18-60岁数据(临时保存，会改变)
    ageRArr: [], //第二列18-60岁数据(临时保存，会改变) 
    ageList: [], //选中的数组
    ageIndex: [0, 0], //选中的数组
    ageLVal: 0, //联动显示的值
    ageRVal: 0, //联动显示的值

    // 身高
    heightReList: [{
        name: '不限',
        value: -1
      },
      {
        name: '150cm及以上',
        value: 150
      },
      {
        name: '155cm及以上',
        value: 155
      },
      {
        name: '160cm及以上',
        value: 160
      },
      {
        name: '165cm及以上',
        value: 165
      },
      {
        name: '170cm及以上',
        value: 170
      },
      {
        name: '175cm及以上',
        value: 175
      },
      {
        name: '180cm及以上',
        value: 180
      },
      {
        name: '185cm及以上',
        value: 185
      },
      {
        name: '190cm及以上',
        value: 190
      },
      {
        name: '195cm及以上',
        value: 195
      },
      {
        name: '200cm及以上',
        value: 200
      },
      {
        name: '205cm及以上',
        value: 205
      },
      {
        name: '210cm及以上',
        value: 210
      }
    ], //列表
    heightReIndex: 0, //选中的数组
    heightReLVal: 0, //联动显示的值
    heightReRVal: 0, //联动显示的值

    // 学历
    educationReList: [{
        name: '不限',
        value: -1
      },
      {
        name: '大专及以上',
        value: 10
      },
      {
        name: '本科及以上',
        value: 11
      },
      {
        name: '硕士及以上',
        value: 12
      },
      {
        name: '博士及以上',
        value: 13
      },
    ],
    educationReIndex: 0, //选中的数组
    educationReVal: '', //联动显示的值

    // 收入
    incomeReList: [],
    incomeReLArr: [{
        name: '不限',
        value: -1,
      },
      {
        name: '2千元',
        value: 2000,
      },
      {
        name: '4千元',
        value: 4000,
      },
      {
        name: '6千元',
        value: 6000,
      },
      {
        name: '1万元',
        value: 10000,
      },
      {
        name: '2万元',
        value: 20000,
      },
      {
        name: '5万元',
        value: 50000,
      },
    ], //第一列
    incomeReRArr: [],
    incomeReIndex: [0, 0],
    incomeReLVal: 0, //第一列的值
    incomeReRVal: 0, //第二列的值

    //是否吸烟
    smokingReList: [{
        name: '从不',
        value: 1
      },
      {
        name: '偶尔抽',
        value: 2
      },
      {
        name: '经常抽',
        value: 3
      },
      {
        name: '无所谓',
        value: -1
      }
    ], //列表
    smokingReIndex: 0, //选中的数组
    smokingReVal: '', //联动显示的值

    //是否喝酒
    drinkReList: [{
        name: '从不',
        value: 1
      },
      {
        name: '偶尔喝',
        value: 2
      },
      {
        name: '经常喝',
        value: 3
      },
      {
        name: '无所谓',
        value: -1
      },
    ], //列表
    drinkReIndex: 0, //选中的数组
    drinkReVal: '', //联动显示的值 

    houseReList: [{
        name: '已购房',
        value: 1
      },
      {
        name: '租房',
        value: 2
      },
      {
        name: '单位宿舍',
        value: 3
      },
      {
        name: '正打算购房',
        value: 4
      },
      {
        name: '和家人同住',
        value: 5
      },
      {
        name: '无要求',
        value: -1
      },
    ], //列表
    houseReIndex: 5, //选中的数组
    houseReVal: '', //联动显示的值 

    carReList: [{
        name: '已购车',
        value: 1
      },
      {
        name: '未购车',
        value: 2
      },
      {
        name: '正打算购车',
        value: 3
      },
      {
        name: '无要求',
        value: -1
      },
    ], //列表
    carReIndex: 3, //选中的数组
    carReVal: '', //联动显示的值 

    emotionalStateReList: [{
        name: '未婚',
        value: 1
      },
      {
        name: '离异',
        value: 2
      },
      {
        name: '其他',
        value: 3
      },
      {
        name: '无要求',
        value: -1
      }
    ],
    emotionalStateReIndex: 3, //选中的数组
    emotionStateReVal: '', //联动显示的值 

    childReList: [{
        name: '无',
        value: 1
      },
      {
        name: '有小孩归自已',
        value: 2
      },
      {
        name: '有小孩归对方',
        value: 3
      },
      {
        name: '无要求',
        value: -1
      },
    ], //列表
    childReIndex: 3, //选中的数组
    childReVal: null, //联动显示的值 

    liveReProvinceArray: [], //临时保存省 
    liveReCityArray: [], //临时保存市
    liveReArr: [], //列表
    liveReList: [], //列表
    liveReIndex: [0, 0], //选中的数组
    liveReProId: 20, //省Id
    liveReAreaId: 321, //市Id   
  },

  /**
   * 生命周期函数--监听页面加载5
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '修改资料',
    })
    const _this = this;
    this.setData({
      startDate: _this.startDate(),
      endDate: _this.endDate(),
      userInfo: wx.getStorageSync('userInfo')
    })

    // 获取身高、年龄、收入
    _this.init();
    // 获取数据
    _this.getData();
    // 获取省市
    _this.getDistrict();
    _this.getLiveRe(); //获取居住地
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  getData() {
    console.log(this.data.userInfo)
    const _this = this;
    wx.showLoading({
      title: '',
    })
    let headimgAttachmentId = []; //头像
    let feedImg = []; //封面
    if (_this.data.userInfo.coverimgAttachementId) {
      let imageList = _this.data.userInfo.coverimgAttachementId.split(',');
      for (var i = 0; i < imageList.length; i++) {
        if (!util.isBlank(imageList[i])) {
          feedImg.push(util.getFullPath(imageList[i], 360));
        }
      }
    }
    if (_this.data.userInfo.headimgAttachmentId) {
      headimgAttachmentId.push(util.getFullPath(_this.data.userInfo.headimgAttachmentId, 240));
    }
    _this.setData({
      headimgAttachmentId: headimgAttachmentId,
      feedImg: feedImg,
      aliasName: _this.data.userInfo.aliasName,
      birthday: _this.data.userInfo.birthday && _this.data.userInfo.birthday.substring(0, 10) || null,
      selfLabel: _this.data.userInfo.selfLabel ? _this.data.userInfo.selfLabel : '',
      emptyBirthday: _this.data.userInfo.birthday != '' ? false : true,
      //基本资料（身高、学历、居住地、学校、职业）
      school: _this.data.userInfo.userExt.school,
      profession: _this.data.userInfo.userExt.profession,
      //私密资料（真实姓名、家乡、婚姻状况、月收入、是否吸烟、是否喝酒、子女情况、住房情况、购车情况、家中排行）
      name: _this.data.userInfo.userName,

      ageLVal: _this.data.userInfo.userExt.chooseMateAgeStart,
      ageRVal: _this.data.userInfo.userExt.chooseMateAgeEnd,
    })  

    if (_this.data.userInfo.userExt) {
      //基本资料（身高、学历、居住地、学校、职业）
      if (_this.data.userInfo.userExt.height != undefined) {
        var heightVal = _this.data.userInfo.userExt.height;
        for (var heightIndex in _this.data.heightList) {
          if (_this.data.heightList[heightIndex].value == heightVal) {
            _this.setData({
              heightVal: heightVal,
              heightIndex: heightIndex
            })
            break;
          }
        }
      }
      if (_this.data.userInfo.userExt.education != undefined) {
        var educationVal = _this.data.userInfo.userExt.education;
        for (var educationIndex in _this.data.educationList) {
          if (_this.data.educationList[educationIndex].value == educationVal) {
            _this.setData({
              educationVal: educationVal,
              educationIndex: educationIndex
            })
            break;
          }
        }
      }
      if (!_this.data.userInfo.userExt.liveCityName || !_this.data.userInfo.userExt.liveAreaName) {
        _this.setData({
          liveProId: 20, //省Id
          liveCityId: 321, //市Id
        })
      } else {
        _this.setData({
          liveProId: _this.data.userInfo.userExt.liveCityId,
          liveCityId: _this.data.userInfo.userExt.liveAreaId
        })
      }
      //私密资料（真实姓名、家乡、婚姻状况、月收入、是否吸烟、是否喝酒、子女情况、住房情况、购车情况、家中排行） 
      //家乡
      if (!_this.data.userInfo.userExt.cityName && !_this.data.userInfo.userExt.areaName) {

      } else {
        _this.setData({
          placeProId: _this.data.userInfo.userExt.cityId,
          placeCityId: _this.data.userInfo.userExt.areaId
        })
      }
      //婚姻状况
      if (_this.data.userInfo.userExt.married) {
        var emotionVal = _this.data.userInfo.userExt.married;
        for (var emotionalIndex in _this.data.emotionalStateList) {
          if (_this.data.emotionalStateList[emotionalIndex].value == emotionVal) {
            _this.setData({
              emotion: emotionVal,
              emotionalIndex: emotionalIndex
            })
            break;
          }
        }
      }
      //月收入
      if (_this.data.userInfo.userExt.incomeLowerLimit && _this.data.userInfo.userExt.incomeUpperLimit) {
        var incomeLVal = _this.data.userInfo.userExt.incomeLowerLimit;
        var incomeRVal = _this.data.userInfo.userExt.incomeUpperLimit;
        var index = 0;
        if (incomeLVal == -1 && incomeRVal == 2000) {
          index = 0;
        } else if (incomeLVal == 2000 && incomeRVal == 4000) {
          index = 1;
        } else if (incomeLVal == 4000 && incomeRVal == 6000) {
          index = 2;
        } else if (incomeLVal == 6000 && incomeRVal == 10000) {
          index = 3;
        } else if (incomeLVal == 10000 && incomeRVal == 15000) {
          index = 4;
        } else if (incomeLVal == 15000 && incomeRVal == 20000) {
          index = 5;
        } else if (incomeLVal == 20000 && incomeRVal == 25000) {
          index = 6;
        } else if (incomeLVal == 50000 && incomeRVal == -1) {
          index = 7;
        }
        _this.setData({
          incomeIndex: index,
          incomeLVal: incomeLVal,
          incomeRVal: incomeRVal
        })
      }
      //是否吸烟
      if (_this.data.userInfo.userExt.smoke) {
        var smokingVal = _this.data.userInfo.userExt.smoke;
        for (var smokingIndex in _this.data.smokingList) {
          if (_this.data.smokingList[smokingIndex].value == smokingVal) {
            _this.setData({
              smokingVal: smokingVal,
              smokingIndex: smokingIndex
            })
            break;
          }
        }
      }
      //是否喝酒
      if (_this.data.userInfo.userExt.drink) {
        var drinkVal = _this.data.userInfo.userExt.drink;
        for (var drinkIndex in _this.data.drinkList) {
          if (_this.data.drinkList[drinkIndex].value == drinkVal) {
            _this.setData({
              drinkVal: drinkVal,
              drinkIndex: drinkIndex
            })
            break;
          }
        }
      }
      //子女情况
      if (_this.data.userInfo.userExt.children) {
        var childVal = _this.data.userInfo.userExt.children;
        for (var childIndex in _this.data.childList) {
          if (_this.data.childList[childIndex].value == childVal) {
            _this.setData({
              childVal: childVal,
              childIndex: childIndex
            })
            break;
          }
        }
      }
      //住房情况
      if (_this.data.userInfo.userExt.housing) {
        var houseVal = _this.data.userInfo.userExt.housing;
        for (var houseIndex in _this.data.houseList) {
          if (_this.data.houseList[houseIndex].value == houseVal) {
            _this.setData({
              houseVal: houseVal,
              houseIndex: houseIndex
            })
            break;
          }
        }
      }
      //购车情况
      if (_this.data.userInfo.userExt.car) {
        var carVal = _this.data.userInfo.userExt.car;
        for (var carIndex in _this.data.carList) {
          if (_this.data.carList[carIndex].value == carVal) {
            _this.setData({
              carVal: carVal,
              carIndex: carIndex
            })
            break;
          }
        }
      }
      //家中排行
      if (_this.data.userInfo.userExt.ranking) {
        var rankingVal = _this.data.userInfo.userExt.ranking;
        for (var rankingIndex in _this.data.rankingList) {
          if (_this.data.rankingList[rankingIndex].value == rankingVal) {
            _this.setData({
              rankingVal: rankingVal,
              rankingIndex: rankingIndex
            })
            break;
          }
        }
      }

      //择偶意向（年龄、身高、学历、收入情况、是否吸烟、是否喝酒、住房情况、购车情况、子女情况、婚姻情况、居住地）
      //年龄
      if (_this.data.userInfo.userExt.chooseMateAgeStart && _this.data.userInfo.userExt.chooseMateAgeEnd) {
        _this.setData({
          ageLVal: _this.data.userInfo.userExt.chooseMateAgeStart,
          ageRVal: _this.data.userInfo.userExt.chooseMateAgeEnd
        })
        _this.getAge();
      }
      //身高
      if (_this.data.userInfo.userExt.chooseMateHeightLowerLimit && _this.data.userInfo.userExt.chooseMateHeightUpperLimit) {
        var heightReLVal = _this.data.userInfo.userExt.chooseMateHeightLowerLimit;
        var heightReRVal = _this.data.userInfo.userExt.chooseMateHeightUpperLimit;
        var heightReList = _this.data.heightReList;
        var index = 0;
        for (var index in heightReList) {
          if (heightReList[index].value == -1 && heightReRVal == -1) {
            index = 0;
          } else if (heightReList[index].value == heightReLVal && heightReRVal == -1) {
            index = index
          }
        }
        _this.setData({
          heightReIndex: index,
          heightReLVal: heightReLVal,
          heightReRVal: heightReRVal
        })
      }
      //学历
      if (_this.data.userInfo.userExt.chooseMateEducation) {
        var educationReVal = _this.data.userInfo.userExt.chooseMateEducation;
        for (var educationReIndex in _this.data.rankingList) {
          if (_this.data.educationReList[educationReIndex].value == educationReVal) {
            _this.setData({
              educationReVal: educationReVal,
              educationReIndex: educationReIndex
            })
            break;
          }
        }
      }
      if (_this.data.userInfo.userExt.chooseMateIncomeLowerLimit && _this.data.userInfo.userExt.chooseMateIncomeUpperLimit) {
        var incomeReLVal = _this.data.userInfo.userExt.chooseMateIncomeLowerLimit;
        var incomeReRVal = _this.data.userInfo.userExt.chooseMateIncomeUpperLimit;
        _this.setData({
          incomeReLVal: incomeReLVal,
          incomeReRVal: incomeReRVal
        })
        _this.getIncomeRe();
      }
      //是否吸烟
      if (_this.data.userInfo.userExt.chooseMateSmoke) {
        var smokingReVal = _this.data.userInfo.userExt.chooseMateSmoke;
        for (var smokingReIndex in _this.data.smokingReList) {
          if (_this.data.smokingReList[smokingReIndex].value == smokingReVal) {
            _this.setData({
              smokingReVal: smokingReVal,
              smokingReIndex: smokingReIndex
            })
            break;
          }
        }
      }
      //是否喝酒
      if (_this.data.userInfo.userExt.chooseMateDrink) {
        var drinkReVal = _this.data.userInfo.userExt.chooseMateDrink;
        for (var drinkReIndex in _this.data.drinkReList) {
          if (_this.data.drinkReList[drinkReIndex].value == drinkReVal) {
            _this.setData({
              drinkReVal: drinkReVal,
              drinkReIndex: drinkReIndex
            })
            break;
          }
        }
      }
      //住房情况
      if (_this.data.userInfo.userExt.chooseMateHousing) {
        var houseReVal = _this.data.userInfo.userExt.chooseMateHousing;
        for (var houseReIndex in _this.data.houseReList) {
          if (_this.data.houseReList[houseReIndex].value == houseReVal) {
            _this.setData({
              houseReVal: houseReVal,
              houseReIndex: houseReIndex
            })
            break;
          }
        }
      }
      //购车情况
      if (_this.data.userInfo.userExt.chooseMateCar) {
        var carReVal = _this.data.userInfo.userExt.chooseMateCar;
        for (var carReIndex in _this.data.carReList) {
          if (_this.data.carReList[carReIndex].value == carReVal) {
            _this.setData({
              carReVal: carReVal,
              carReIndex: carReIndex
            })
            break;
          }
        }
      }
      //子女情况
      if (_this.data.userInfo.userExt.chooseMateChildren) {
        var childReVal = _this.data.userInfo.userExt.chooseMateChildren;
        for (var childReIndex in _this.data.childReList) {
          if (_this.data.childReList[childReIndex].value == childReVal) {
            _this.setData({
              childReVal: childReVal,
              childReIndex: childReIndex
            })
            break;
          }
        }
      }
      //婚姻状况
      if (_this.data.userInfo.userExt.chooseMateMarried) {
        var emotionStateReVal = _this.data.userInfo.userExt.chooseMateMarried;
        for (var emotionalStateReIndex in _this.data.emotionalStateReList) {
          if (_this.data.emotionalStateReList[emotionalStateReIndex].value == emotionStateReVal) {
            _this.setData({
              emotionStateReVal: emotionStateReVal,
              emotionalStateReIndex: emotionalStateReIndex
            })
            break;
          }
        }
      }

      //居住地 
      if (!_this.data.userInfo.userExt.chooseMateLiveCityId && !_this.data.userInfo.userExt.chooseMateLiveAreaId) {
        _this.setData({
          liveReProId: 20,
          liveReCityId: 321
        })
      } else {
        if (_this.data.userInfo.userExt.chooseMateLiveCityId == -1 && _this.data.userInfo.userExt.chooseMateLiveAreaId == -1) {
          _this.setData({
            liveReProId: -1,
            liveReCityId: -1
          })
        } else if (_this.data.userInfo.userExt.chooseMateLiveCityId >= 0 && _this.data.userInfo.userExt.chooseMateLiveAreaId == -1) {
          _this.setData({
            liveReProId: _this.data.userInfo.userExt.chooseMateLiveCityId,
            liveReCityId: -1
          })
        } else if (_this.data.userInfo.userExt.chooseMateLiveCityId == -1 && _this.data.userInfo.userExt.chooseMateLiveAreaId >=0) {
          _this.setData({
            liveReProId: -1,
            liveReCityId: _this.data.userInfo.userExt.chooseMateLiveAreaId
          })
        } else if (_this.data.userInfo.userExt.chooseMateLiveCityId >= 0 && _this.data.userInfo.userExt.chooseMateLiveAreaId >= 0) {
          _this.setData({
            liveReProId: _this.data.userInfo.userExt.chooseMateLiveCityId,
            liveReCityId: _this.data.userInfo.userExt.chooseMateLiveAreaId
          })
        }
        _this.getLiveRe();
      }
    } 
    wx.hideLoading();
  },
  endDate() {
    let nowYear = util.format(new Date(), 'yyyy')
    return (nowYear - 18) + '-' + util.format(new Date(), 'MM-dd');
  },
  startDate() {
    let nowYear = util.format(new Date(), 'yyyy')
    return (nowYear - 70) + '-' + util.format(new Date(), 'MM-dd');
  },
  init: function() {
    const _this = this;
    // 身高
    let heightArr = [];
    for (var i = 150; i <= 210; i++) {
      heightArr.push({
        id: i - 150,
        name: i + 'cm',
        value: i
      })
    }

    // 年龄
    let ageAll = [];
    let ageLName = [];
    let ageRName = [];
    for (let j = 18; j <= 60; j++) {
      if (j == 18) {
        ageAll.push({
          name: '不限',
          value: '-1',
        })
        ageLName.push('不限');
        ageRName.push('不限');
        for (let k = j + 1; k <= 60; k++) {
          ageAll.push({
            name: k + '岁',
            value: k,
          })
          ageLName.push(k + '岁')
          ageRName.push(k + '岁')
        }
      }
    }

    // 收入
    let incomeAll = _this.data.incomeReLArr;
    let incomeReRArr = [];
    let incomeL = [];
    let incomeR = [];
    for (let l = 0; l < incomeAll.length; l++) {
      incomeL.push(incomeAll[l].name);
      incomeR.push(incomeAll[l].name);
      incomeReRArr.push({
        value: incomeAll[l].value,
        name: incomeAll[l].name
      })
    }
    this.setData({
      heightList: heightArr,

      ageLArr: ageAll,
      ageRArr: ageAll,
      ageList: [ageLName, ageRName],

      incomeReRArr: incomeReRArr,
      incomeReList: [incomeL, incomeR],
    })
  },
  getAge: function() {
    const _this = this;
    //编辑的时候获取年龄对应的索引
    let ageLVal = _this.data.ageLVal;
    let ageRVal = _this.data.ageRVal;
    var ageLArr = _this.data.ageLArr;
    let ageRArr = [];
    for (var ageL in ageLArr) {
      //获取第一列对应的索引
      if (ageLArr[ageL].value == ageLVal) {
        _this.setData({
          'ageIndex[0]': ageL
        })
        break;
      }
      //获取第二列数据
      if (ageLArr[ageL].value > ageLVal || ageLArr[ageL].value == 0) {
        ageRArr.push({
          value: ageLArr[ageL].value
        })
      }
      if (ageRArr.length > 0) {
        for (var ageR in ageRArr) {
          // 获取第二列对应的索引
          if (ageLArr[ageR].value == ageRVal) {
            _this.setData({
              'ageIndex[1]': ageR
            })
            break;
          }
        }
      }
    }

  },
  getIncomeRe: function() {
    const _this = this;
    // 收入
    let incomeReLVal = _this.data.incomeReLVal;
    let incomeReRVal = _this.data.incomeReRVal;
    let incomeReLArr = _this.data.incomeReLArr;
    let incomeReRArr = [];
    for (var incomeL in incomeReLArr) {
      //获取第一列对应的索引
      if (incomeReLArr[incomeL].value == incomeReLVal) {
        _this.setData({
          'incomeReIndex[0]': incomeL
        })
        break;
      }
      //获取第二列数据
      if (incomeReLArr[incomeL].value > incomeReLVal || incomeReLArr[incomeL].value == 0) {
        incomeReRArr.push({
          value: incomeReLArr[incomeL].value
        })
      }
      if (incomeReRArr.length > 0) {
        for (var incomeR in incomeReRArr) {
          // 获取第二列对应的索引
          if (incomeReLArr[incomeR].value == incomeReRVal) {
            _this.setData({
              'incomeReIndex[1]': incomeR
            })
            break;
          }
        }
      }
    }
  },
  chooseHeadImage: function(options) {
    const _this = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        _this.uploadHeadImage(tempFilePaths[0]);
      }
    })
  },
  uploadHeadImage: function(path) {
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
            this.setData({
              headimgAttachmentId: [],
              headimgAttachmentId: _this.data.headimgAttachmentId.concat(util.getFullPath(data.data.path, 240))
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
  previewHeadImage: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src 
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: _this.data.headimgAttachmentId, // 需要预览的图片http链接列表
    })
  },
  /**
   * 删除图片
   */
  deletedHeadImage: function(e) {
    let that = this;
    that.setData({
      headimgAttachmentId: []
    })
  },
  // 选择封面图
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
            this.setData({
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
      current: e.currentTarget.src, // 当前显示图片的http链接
      urls: this.data.feedImg // 需要预览的图片http链接列表
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
  bindPopupChange: function(event) {
    const _this = this;
    let popup = event.currentTarget.dataset.popup;
    let sh = event.currentTarget.dataset.sh;
    if (popup == "shAliasName") {
      this.setData({
        shAliasName: !sh
      })
    } else if (popup == "shSelfLabel") {
      this.setData({
        shSelfLabel: !sh
      })
    } else if (popup == "shSchool") {
      this.setData({
        shSchool: !sh
      })
    } else if (popup == "shProfession") {
      this.setData({
        shProfession: !sh
      })
    }
  },
  bindPopupConfirm: function(event) {
    const _this = this;
    let popup = event.currentTarget.dataset.popup;
    if (popup == "shAliasName") {
      if (!_this.data.aliasName) {
        wx.showToast({
          icon: 'none',
          title: '昵称不能为空',
        })
        return;
      }
      _this.setData({
        shAliasName: false
      })
    } else if (popup == "shSelfLabel") {
      _this.setData({
        shSelfLabel: false
      })
    } else if (popup == "shSchool") {
      _this.setData({
        shSchool: false
      })
    } else if (popup == "shProfession") {
      _this.setData({
        shProfession: false
      })
    }
  },
  aliasNameInput: function(event) {
    const _this = this;
    if (!event.detail.value) {
      wx.showToast({
        icon: "none",
        title: '请输入昵称',
      })
      return;
    }
    this.setData({
      aliasName: event.detail.value
    })
  },
  bindDateChange: function(event) {
    const _this = this;
    if (!event.detail.value) {
      wx.showToast({
        icon: "none",
        title: '请选择出生日期',
      })
      return;
    }
    _this.setData({
      birthday: event.detail.value
    })
  },
  selfLabelInput: function(event) {
    const _this = this;
    _this.setData({
      selfLabel: event.detail.value
    })
  },
  heightChange: function(event) {
    const _this = this;
    this.setData({
      heightIndex: event.detail.value,
      heightVal: _this.data.heightList[event.detail.value].value
    })
  },
  educationChange: function(event) {
    const _this = this;
    this.setData({
      educationIndex: event.detail.value,
      educationVal: _this.data.educationList[event.detail.value].value
    })
  },
  // 获取省市 
  getDistrict() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/district/all', {}, (res) => {
      if (res.data) {
        var provinceNameArray = []; //只保存省级名字
        var provinceArray = []; //保存省级Id、name、parent，目的是为了根据picke多列选择器滚动时获取当前索引找到对应的id，再根据id加载对应的市数据 
        let all = [];
        //省
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].parent == 0) {
            provinceArray.push({
              name: res.data[i].name,
              value: res.data[i].value,
              parent: res.data[i].parent
            })
            provinceNameArray.push(res.data[i].name)
          }
        }

        // 根据省查询对应的市区
        for (let m = 0; m < res.data.length; m++) {
          for (let n = 0; n < provinceArray.length; n++) {
            if (res.data[m].parent == provinceArray[n].value) {
              all.push({
                name: res.data[m].name,
                value: res.data[m].value,
                parent: res.data[m].parent
              })
            }
          }
        }

        // 编辑的时候重新绑定市级数据 
        let newCityArray = []; //第二列数据
        let newCityNameArray = [];
        let proIndex = 0; //获取省市对应的索引
        let cityIndex = 0; //获取省市对应的索引
        let proId = _this.data.liveProId;
        let cityId = _this.data.liveCityId;

        // 省的索引
        for (let s = 0; s < provinceArray.length; s++) {
          if (provinceArray[s].value == proId) {
            proIndex = s;
            break;
          }
        }

        // 第二级市名称列表
        for (let t = 0; t < res.data.length; t++) {
          if (proId == res.data[t].parent) {
            newCityNameArray.push(res.data[t].name);
            newCityArray.push({
              value: res.data[t].value,
              name: res.data[t].name
            });
          }
        }
        // 根据二级市value查找索引
        for (let index = 0; index < newCityArray.length; index++) {
          if (newCityArray[index].value == cityId) {
            cityIndex = index;
            break;
          }
        }

        // 家乡编辑的时候重新绑定市级数据
        let newPlaceCityArray = [];
        let newPlaceCityNameArray = [];
        let placeProIndex = 0; //获取省市对应的索引
        let placeCityIndex = 0; //获取省市对应的索引
        let placeProId = _this.data.placeProId;
        let placeCityId = _this.data.placeCityId;

        // 省的索引
        for (let s = 0; s < provinceArray.length; s++) {
          if (provinceArray[s].value == placeProId) {
            placeProIndex = s;
            break;
          }
        }

        // 第二级市名称列表
        for (let t = 0; t < res.data.length; t++) {
          if (placeProId == res.data[t].parent) {
            newPlaceCityNameArray.push(res.data[t].name);
          }
          if (placeProId == res.data[t].parent) {
            newPlaceCityArray.push({
              value: res.data[t].value,
              name: res.data[t].name
            });
          }
        }
        // 根据二级市value查找索引
        for (let index = 0; index < newPlaceCityArray.length; index++) {
          if (newPlaceCityArray[index] == placeCityId) {
            placeCityIndex = index;
            break;
          }
        }

        this.setData({
          provinceArray: provinceArray,
          cityArray: newCityArray, //第二列数据
          liveArr: all,
          liveIndex: [proIndex, cityIndex],
          liveList: [provinceNameArray, newCityNameArray],

          placeProvinceArray: provinceArray,
          placeArr: all,
          placeCityArray: newPlaceCityArray,
          placeIndex: [placeProIndex, placeCityIndex],
          placeList: [provinceNameArray, newPlaceCityNameArray],
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  getLiveRe() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/district/all', {}, (res) => {
      if (res.data) {
        var liveReArray = []; //所有省市数据
        var liveReProvinceArray = []; //择偶的居住地（首项是选择不限）
        var liveReProvinceNameArray = []; //只保存省级名字
        let liveReCityArr = [];
        liveReArray.push({
          name: '不限',
          value: '-1',
          parent: "0",
        })

        //全部
        for (var j in res.data) {
          liveReArray.push({
            name: res.data[j].name,
            value: res.data[j].value,
            parent: res.data[j].parent
          })
        }

        //省
        for (let i = 0; i < liveReArray.length; i++) {
          if (liveReArray[i].parent == 0) {
            liveReProvinceArray.push({
              name: liveReArray[i].name,
              value: liveReArray[i].value,
              parent: liveReArray[i].parent
            })
            liveReProvinceNameArray.push(liveReArray[i].name)
          }
        }

        for (let i = liveReProvinceArray.length; i--;) {
          liveReArray.unshift({
            name: '不限',
            value: '-1',
            parent: liveReProvinceArray[i].value
          });
        }

        // 根据省查询对应的市区 
        for (let m = 0; m < liveReArray.length; m++) {
          for (let n = 0; n < liveReProvinceArray.length; n++) {
            if (liveReArray[m].parent == liveReProvinceArray[n].value) {
              liveReCityArr.push({
                name: liveReArray[m].name,
                value: liveReArray[m].value,
                parent: liveReArray[m].parent
              })
            }
          }
        }
        // 家乡编辑的时候重新绑定市级数据
        let newLiveReCityArray = [];
        let newLiveReCityNameArray = [];
        let liveReProIndex = 0; //获取省市对应的索引
        let liveReCityIndex = 0; //获取省市对应的索引
        let liveReProId = _this.data.liveReProId;
        let liveReCityId = _this.data.liveReCityId;

        // 省的索引
        for (let s = 0; s < liveReProvinceArray.length; s++) {
          if (liveReProvinceArray[s].value == liveReProId) {
            liveReProIndex = s;
            break;
          }
        } 
        // 第二级市名称列表
        for (let t = 0; t < liveReArray.length; t++) {
          if (liveReProId == liveReArray[t].parent) {
            newLiveReCityNameArray.push(liveReArray[t].name);
            newLiveReCityArray.push({
              name: liveReArray[t].name,
              value: liveReArray[t].value
            });
          }
        } 

        // 根据二级市value查找索引
        for (let index = 0; index < newLiveReCityArray.length; index++) {
          if (newLiveReCityArray[index].value == liveReCityId) {
            liveReCityIndex = index;
            break;
          }
        } 

        _this.setData({
          liveReProvinceArray: liveReProvinceArray,
          liveReArr: liveReCityArr,
          liveReCityArray: newLiveReCityArray,
          liveReIndex: [liveReProIndex, liveReCityIndex],
          liveReList: [liveReProvinceNameArray, newLiveReCityNameArray],
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 选择省市
  bindRegionChange: function(e) {
    const _this = this;
    this.setData({
      "liveIndex[0]": e.detail.value[0],
      "liveIndex[1]": e.detail.value[1],
      cityId: _this.data.cityArray[e.detail.value[1]].value
    })
  },
  // 默认数据添加之后需要在每次滚动选择省的时候，请求加载对应的市数据，监听picker滚动函数
  bindMultiPickerColumnChange: function(e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.liveArr;
        var value = _this.data.provinceArray[e.detail.value]['value'];
        let cityId = '';
        let cityArray = [];
        let cityNameArray = [];
        for (var i = 0; i < all.length; i++) {
          if (all[i].parent == value) {
            cityArray.push({
              value: all[i].value
            })
            cityNameArray.push(all[i].name)
          }
        }
        this.setData({
          "liveList[1]": cityNameArray,
          "liveIndex[0]": e.detail.value,
          "liveIndex[1]": 0,
          proId: value,
          cityArray: cityArray,
        })
        break;
    }
  },
  schoolInput: function(event) {
    const _this = this;
    _this.setData({
      school: event.detail.value
    })
  },
  professionInput: function(event) {
    const _this = this;
    _this.setData({
      profession: event.detail.value
    })
  },
  nameInput: function(event) {
    const _this = this;
    _this.setData({
      name: event.detail.value
    })
  },
  // 选择省市
  bindPlaceChange: function(e) {
    const _this = this;
    this.setData({
      "placeIndex[0]": e.detail.value[0],
      "placeIndex[1]": e.detail.value[1],
      placeCityId: _this.data.placeCityArray[e.detail.value[1]].value
    })
  },
  // 默认数据添加之后需要在每次滚动选择省的时候，请求加载对应的市数据，监听picker滚动函数
  bindPlacePickerColumnChange: function(e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.placeArr;
        var value = _this.data.placeProvinceArray[e.detail.value]['value'];
        let cityId = '';
        let cityArray = [];
        let cityNameArray = [];
        for (var i = 0; i < all.length; i++) {
          if (all[i].parent == value) {
            cityArray.push({
              value: all[i].value
            })
            cityNameArray.push(all[i].name)
          }
        }
        this.setData({
          "placeList[1]": cityNameArray,
          "placeIndex[0]": e.detail.value,
          "placeIndex[1]": 0,
          placeProId: value,
          placeCityArray: cityArray,
        })
        break;
    }
  },
  emotionChange: function(event) {
    const _this = this;
    this.setData({
      emotionalIndex: event.detail.value,
      emotion: _this.data.emotionalStateList[event.detail.value].value
    })
  },
  incomeChange: function(event) {
    const _this = this;
    if (event.detail.value == 0) {
      _this.data.incomeLVal = -1;
      _this.data.incomeRVal = 2000;
    } else if (event.detail.value == 1) {
      _this.data.incomeLVal = 2000;
      _this.data.incomeRVal = 4000;
    } else if (event.detail.value == 2) {
      _this.data.incomeLVal = 4000;
      _this.data.incomeRVal = 6000;
    } else if (event.detail.value == 3) {
      _this.data.incomeLVal = 6000;
      _this.data.incomeRVal = 10000;
    } else if (event.detail.value == 4) {
      _this.data.incomeLVal = 10000;
      _this.data.incomeRVal = 15000;
    } else if (event.detail.value == 5) {
      _this.data.incomeLVal = 15000;
      _this.data.incomeRVal = 20000;
    } else if (event.detail.value == 6) {
      _this.data.incomeLVal = 20000;
      _this.data.incomeRVal = 25000;
    } else if (event.detail.value == 7) {
      _this.data.incomeLVal = 50000;
      _this.data.incomeRVal = -1;
    }
    this.setData({
      incomeIndex: event.detail.value,
      incomeLVal: _this.data.incomeLVal,
      incomeRVal: _this.data.incomeRVal
    })
  },
  smokingChange: function(event) {
    const _this = this;
    this.setData({
      smokingIndex: event.detail.value,
      smokingVal: _this.data.smokingList[event.detail.value].value
    })
  },
  drinkChange: function(event) {
    const _this = this;
    this.setData({
      drinkIndex: event.detail.value,
      drinkVal: _this.data.drinkList[event.detail.value].value
    })
  },
  childChange: function(event) {
    const _this = this;
    this.setData({
      childIndex: event.detail.value,
      childVal: _this.data.childList[event.detail.value].value
    })
  },
  drinkChange: function(event) {
    const _this = this;
    this.setData({
      drinkIndex: event.detail.value,
      drinkVal: _this.data.drinkList[event.detail.value].value
    })
  },
  carChange: function(event) {
    const _this = this;
    this.setData({
      carIndex: event.detail.value,
      carVal: _this.data.carList[event.detail.value].value
    })
  },
  rankingChange: function(event) {
    const _this = this;
    this.setData({
      rankingIndex: event.detail.value,
      rankingVal: _this.data.rankingList[event.detail.value].value
    })
  },
  // 默认数据添加之后需要在每次滚动选择的时候，请求加载对应的数据，监听picker滚动函数
  bindAgePickerColumnChange: function(e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.ageLArr;
        var ageLVal = _this.data.ageLArr[e.detail.value].value;
        let ageRName = []; //第二列名字数组
        let ageRArr = []; //第二列数据(名字+value)  
        if (e.detail.value != 0) {
          for (var i = 0; i < all.length; i++) {
            if (all[i].value > ageLVal || all[i].value == -1) {
              ageRName.push(all[i].name);
              ageRArr.push({
                name: all[i].name,
                value: all[i].value
              })
            }
          }
        } else {
          for (var i = 0; i < all.length; i++) {
            ageRName.push(all[i].name);
            ageRArr.push({
              name: all[i].name,
              value: all[i].value
            })
          }
        }
        this.setData({
          "ageList[1]": ageRName,
          "ageIndex[0]": e.detail.value,
          "ageIndex[1]": 0,
          ageLVal: ageLVal,
          ageRArr: ageRArr,
        })
        break;
    }
  },
  bindAgeChange: function(e) {
    const _this = this;
    let ageRVal = _this.data.ageRArr[e.detail.value[1]].value;
    this.setData({
      ageRVal: ageRVal,
      "ageIndex[0]": e.detail.value[0],
      "ageIndex[1]": e.detail.value[1]
    })
  },
  heightReChange: function(event) {
    const _this = this;
    if (event.detail.value == 0) {
      _this.data.heightReLVal = -1;
      _this.data.heightReRVal = -1;
    } else {
      _this.data.heightReLVal = _this.data.heightList[event.detail.value].value;
      _this.data.heightReRVal = -1;
    }
    this.setData({
      heightReIndex: event.detail.value,
      heightReLVal: _this.data.heightReLVal,
      heightReRVal: _this.data.heightReRVal
    })
  },
  educationReChange: function(event) {
    const _this = this;
    this.setData({
      educationReIndex: event.detail.value,
      educationReVal: _this.data.educationReList[event.detail.value].value
    })
  },
  bindIncomeRePickerColumnChange: function(e) {
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.incomeReLArr;
        var incomeReLVal = _this.data.incomeReLArr[e.detail.value].value;
        let incomeReRName = []; //第二列名字数组
        let incomeReRArr = []; //第二列数据(名字+value)  
        if (e.detail.value != 0) {
          for (var i = 0; i < all.length; i++) {
            if (all[i].value > incomeReLVal || all[i].value == -1) {
              incomeReRName.push(all[i].name);
              incomeReRArr.push({
                name: all[i].name,
                value: all[i].value
              })
            }
          }
        } else {
          for (var i = 0; i < all.length; i++) {
            incomeReRName.push(all[i].name);
            incomeReRArr.push({
              name: all[i].name,
              value: all[i].value
            })
          }
        }
        this.setData({
          "incomeReList[1]": incomeReRName,
          "incomeReIndex[0]": e.detail.value,
          "incomeReIndex[1]": 0,
          incomeReLVal: incomeReLVal,
          incomeReRArr: incomeReRArr,
        })
        break;
    }
  },
  bindIncomeReChange: function(e) {
    const _this = this;
    let incomeReRVal = _this.data.incomeReRArr[e.detail.value[1]].value;
    this.setData({
      incomeReRVal: incomeReRVal,
      "incomeReIndex[0]": e.detail.value[0],
      "incomeReIndex[1]": e.detail.value[1]
    })
  },
  smokingReChange: function(event) {
    const _this = this;
    this.setData({
      smokingReIndex: event.detail.value,
      smokingReVal: _this.data.smokingReList[event.detail.value].value
    })
  },
  drinkReChange: function(event) {
    const _this = this;
    this.setData({
      drinkReIndex: event.detail.value,
      drinkReChange: _this.data.drinkReList[event.detail.value].value
    })
  },
  houseReChange: function(event) {
    const _this = this;
    this.setData({
      houseReIndex: event.detail.value,
      houseReVal: _this.data.houseReList[event.detail.value].value
    })
  },
  carReChange: function(event) {
    const _this = this;
    this.setData({
      carReIndex: event.detail.value,
      carReVal: _this.data.carReList[event.detail.value].value
    })
  },
  childReChange: function(event) {
    const _this = this;
    this.setData({
      childReIndex: event.detail.value,
      childReVal: _this.data.childReList[event.detail.value].value
    })
  },
  emotionalStateReChange: function(event) {
    const _this = this;
    this.setData({
      emotionalStateReIndex: event.detail.value,
      emotionStateReVal: _this.data.emotionalStateReList[event.detail.value].value
    })
  },
  childReChange: function(event) {
    const _this = this;
    this.setData({
      childReIndex: event.detail.value,
      childReVal: _this.data.childReList[event.detail.value].value
    })
  },
  // 选择省市
  bindLiveReChange: function(e) {
    const _this = this;
    this.setData({
      "liveReIndex[0]": e.detail.value[0],
      "liveReIndex[1]": e.detail.value[1],
      liveReCityId: _this.data.liveReCityArray[e.detail.value[1]].value
    })
  },
  // 默认数据添加之后需要在每次滚动选择省的时候，请求加载对应的市数据，监听picker滚动函数
  bindLiveRePickerColumnChange: function(e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.liveReArr;
        var value = _this.data.liveReProvinceArray[e.detail.value]['value'];
        let cityId = '';
        let cityArray = [];
        let cityNameArray = [];
        for (var i = 0; i < all.length; i++) {
          if (all[i].parent == value) {
            cityArray.push({
              value: all[i].value
            })
            cityNameArray.push(all[i].name)
          }
        }
        this.setData({
          "liveReList[1]": cityNameArray,
          "liveReIndex[0]": e.detail.value,
          "liveReIndex[1]": 0,
          liveReProId: value,
          liveReCityArray: cityArray,
        })
        break;
    }
  },
  save() {
    const _this = this;
    _this.setData({
      isValidate: ''
    })
    if (!_this.data.headimgAttachmentId) {
      wx.showToast({
        icon: "none",
        title: '头像不能为空',
      })
      return;
    }
    if (!_this.data.aliasName) {
      wx.showToast({
        icon: "none",
        title: '请填写昵称',
      })
      _this.setData({
        isValidate: 'aliasName'
      })
      return;
    }
    if (!_this.data.birthday) {
      wx.showToast({
        icon: "none",
        title: '请选择出生日期',
      })
      _this.setData({
        isValidate: 'birthday'
      })
      return;
    } //从报名人员列表、支付跳过来的提示必填（封面、个性签名、学校、职业、子女情况、家中排行；择偶：子女情况、居住地不是必填）
    if (_this.data.isRequired) {
      if (!_this.data.heightVal) {
        wx.showToast({
          icon: "none",
          title: '请选择身高',
        })
        _this.setData({
          isValidate: 'heightVal'
        })
        wx.pageScrollTo({
          scrollTop: 400,
          duration: 1000
        })
        return;
      }
      if (!_this.data.educationVal) {
        wx.showToast({
          icon: "none",
          title: '请选择学历',
        })
        _this.setData({
          isValidate: 'educationVal'
        })
        wx.pageScrollTo({
          scrollTop: 400,
          duration: 1000
        })
        return;
      }
      if (!_this.data.liveProId || !_this.data.liveCityId) {
        wx.showToast({
          icon: "none",
          title: '请选择居住地',
        })
        _this.setData({
          isValidate: 'liveCityId'
        })
        wx.pageScrollTo({
          scrollTop: 400,
          duration: 1000
        })
        return;
      }
      if (!_this.data.profession) {
        wx.showToast({
          icon: "none",
          title: '请填写职业',
        })
        _this.setData({
          isValidate: 'profession'
        })
        wx.pageScrollTo({
          scrollTop: 450,
          duration: 1000
        })
        return;
      }
      if (!_this.data.name) {
        wx.showToast({
          icon: "none",
          title: '请填写真实姓名',
        })
        _this.setData({
          isValidate: 'name'
        })
        wx.pageScrollTo({
          scrollTop: 450,
          duration: 1000
        })
        return;
      }
      if (!_this.data.placeProId || !_this.data.placeCityId) {
        wx.showToast({
          icon: "none",
          title: '请选择家乡',
        })
        _this.setData({
          isValidate: 'cityId'
        })
        wx.pageScrollTo({
          scrollTop: 500,
          duration: 1000
        })
        return;
      }
      if (!_this.data.emotion) {
        wx.showToast({
          icon: "none",
          title: '请选择您的婚姻状况',
        })
        _this.setData({
          isValidate: 'emotion'
        })
        wx.pageScrollTo({
          scrollTop: 600,
          duration: 1000
        })
        return;
      }
      if (!_this.data.incomeLVal || !_this.data.incomeRVal) {
        wx.showToast({
          icon: "none",
          title: '请选择您的月收入',
        })
        _this.setData({
          isValidate: 'incomeLVal'
        })
        wx.pageScrollTo({
          scrollTop: 700,
          duration: 1000
        })
        return;
      }
      if (!_this.data.smokingVal) {
        wx.showToast({
          icon: "none",
          title: '请选择是否吸烟',
        })
        _this.setData({
          isValidate: 'smokingVal'
        })
        wx.pageScrollTo({
          scrollTop: 800,
          duration: 1000
        })
        return;
      }
      if (!_this.data.drinkVal) {
        wx.showToast({
          icon: "none",
          title: '请选择是否喝酒',
        })
        _this.setData({
          isValidate: 'drinkVal'
        })
        return;
      }
      if (!_this.data.houseVal) {
        wx.showToast({
          icon: "none",
          title: '请选择您的住房情况',
        })
        _this.setData({
          isValidate: 'houseVal'
        })
        return;
      }
      if (!_this.data.carVal) {
        wx.showToast({
          icon: "none",
          title: '请选择您的购车情况',
        })
        _this.setData({
          isValidate: 'carVal'
        })
        return;
      }

      if (!_this.data.ageLVal || !_this.data.ageRVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶年龄',
        })
        _this.setData({
          isValidate: 'ageLVal'
        })
        return;
      }
      if (!_this.data.heightReLVal || !_this.data.heightReRVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶身高',
        })
        _this.setData({
          isValidate: 'heightReLVal'
        })
        return;
      }
      if (!_this.data.educationReVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶学历',
        })
        _this.setData({
          isValidate: 'educationReVal'
        })
        return;
      }
      if (!_this.data.incomeReLVal || !_this.data.incomeReRVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶收入情况',
        })
        _this.setData({
          isValidate: 'incomeReLVal'
        })
        return;
      }
      if (!_this.data.smokingReVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶是否吸烟',
        })
        _this.setData({
          isValidate: 'smokingReVal'
        })
        return;
      }
      if (!_this.data.drinkReVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶是否喝酒',
        })
        _this.setData({
          isValidate: 'drinkReVal'
        })
        return;
      }
      if (!_this.data.houseReVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶住房情况',
        })
        _this.setData({
          isValidate: 'houseReVal'
        })
        return;
      }
      if (!_this.data.carReVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶购车情况',
        })
        _this.setData({
          isValidate: 'carReVal'
        })
        return;
      }
      if (!_this.data.emotionStateReVal) {
        wx.showToast({
          icon: "none",
          title: '请选择择偶婚姻情况',
        })
        _this.setData({
          isValidate: 'emotionStateReVal'
        })
        return;
      }
    }
    if (_this.data.emptyBirthday) {
      wx.showModal({
        content: '出生日期 ' + _this.data.birthday + ' 保存后无法修改，确认保存吗？',
        showCancel: true,
        cancelText: '再想一想',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function(res) {
          _this.subData();
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      _this.subData();
    }
  },
  subData() {
    const _this = this;
    wx.showLoading({
      title: '',
    })

    let postData = { //基本资料（身高、学历、居住地、学校、职业）
      aliasName: _this.data.aliasName,
      birthday: _this.data.birthday,
      img: _this.data.headimgAttachmentId,
      coverimgAttachementId: _this.data.feedImg.join(","),
      autograph: _this.data.selfLabel,
      height: _this.data.heightVal,
      education: _this.data.educationVal,
      liveCityId: _this.data.liveProId,
      liveAreaId: _this.data.liveCityId,
      school: _this.data.school,
      profession: _this.data.profession,
      //私密资料（真实姓名、家乡、婚姻状况、月收入、是否吸烟、是否喝酒、子女情况、住房情况、购车情况、家中排行）
      userName: _this.data.name,
      cityId: _this.data.placeProId,
      areaId: _this.data.placeCityId,
      married: _this.data.emotion,
      income: _this.data.incomeLVal ? 0 : '',
      incomeLowerLimit: _this.data.incomeLVal,
      incomeUpperLimit: _this.data.incomeRVal,
      smoke: _this.data.smokingVal,
      drink: _this.data.drinkVal,
      children: _this.data.childVal,
      housing: _this.data.houseVal,
      car: _this.data.carVal,
      ranking: _this.data.rankingVal,
      //择偶意向（年龄、身高、学历、收入情况、是否吸烟、是否喝酒、住房情况、购车情况、子女情况、婚姻情况、居住地）
      chooseMateAge: _this.data.ageLVal ? 0 : '',
      chooseMateAgeStart: _this.data.ageLVal,
      chooseMateAgeEnd: _this.data.ageRVal,

      chooseMateHeight: _this.data.heightReLVal ? 0 : '',
      chooseMateHeightLowerLimit: _this.data.heightReLVal,
      chooseMateHeightUpperLimit: _this.data.heightReRVal,

      chooseMateEducation: _this.data.educationReVal,

      chooseMateIncome: _this.data.incomeReLVal ? 0 : '',
      chooseMateIncomeLowerLimit: _this.data.incomeReLVal,
      chooseMateIncomeUpperLimit: _this.data.incomeReRVal,

      chooseMateSmoke: _this.data.smokingReVal,
      chooseMateDrink: _this.data.drinkReVal,
      chooseMateHousing: _this.data.houseReVal,
      chooseMateCar: _this.data.carReVal,
      chooseMateChildren: _this.data.childReVal,
      chooseMateMarried: _this.data.emotionStateReVal,
      chooseMateLiveCityId: _this.data.liveReProId,
      chooseMateLiveAreaId: _this.data.liveReCityId,
    }
    console.log(postData);
    app.appRequest('PUT', 'x-www-form-urlencoded', '/api/user/update_profile', postData, (res) => {
      if (res.status == 1) {
        wx.removeStorageSync('userInfo');
        wx.setStorageSync('userInfo', res.data)
        _this.data.feedImg = [];
        wx.showToast({
          title: '修改成功',
          icon: 'none',
        }) 
        wx.navigateBack({
          delta: 1
        })
      }
      wx.hideLoading();
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  }
})
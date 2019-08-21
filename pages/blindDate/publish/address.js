const util = require('../../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [], //保存【【省】，【市】】
    addressArr: [], //保存全部（包括省市）
    provinceArray: [], //保存省
    addressIndex: [0, 0],
    addressDetailText: '', //具体地点 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "添加地址" //页面标题为路由参数
    })
    const _this = this;
    let pubData = app.globalData.publishBlindDate;
    _this.setData({
      addressIndex: pubData.addressIndex,
      addressDetailText: pubData.addressDetailText
    })
    _this.getDistrict();
  },
  getDistrict() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/district/all', {}, (res) => {
      if (res.data) {
        var provinceNameArray = []; //只保存省级名字
        var provinceArray = []; //保存省级Id、name、parent，目的是为了根据picke多列选择器滚动时获取当前索引找到对应的id，再根据id加载对应的市数据
        let cityNameArray = []; //只保存市名字
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

        //市 
        for (let j = 0; j < res.data.length; j++) {
          if (res.data[j].parent == provinceArray[0].value) {
            cityNameArray.push(res.data[j].name);
          }
        }

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

        _this.setData({
          provinceArray: provinceArray,
          addressArr: all,
          addressList: [provinceNameArray, cityNameArray]
        })

        // 编辑的时候重新绑定市级数据
        let newCityArray = [];
        let newCityNameArray = [];
        let proIndex = 0; //获取省市对应的索引
        let cityIndex = 0; //获取省市对应的索引
        let addressId = app.globalData.publishBlindDate.addressId; 
        for (let s = 0; s < _this.data.provinceArray.length; s++) {
          if (_this.data.provinceArray[s].value == addressId[0]) {
            proIndex = s;
            break;
          }
        }
        // 第二级市名称列表
        for (let t = 0; t < res.data.length; t++) {
          if (addressId[0] == res.data[t].parent) {
            newCityNameArray.push(res.data[t].name);
          }
        }
        // 第二级市value列表
        for (let t = 0; t < res.data.length; t++) {
          if (addressId[0] == res.data[t].parent) {
            newCityArray.push(res.data[t].value);
          }
        }  
        // 根据二级市value查找索引
        for (let index = 0; index < newCityArray.length; index++) {
          if (newCityArray[index] == addressId[1]) {
            cityIndex = index;
            break;
          }
        } 
        _this.setData({
          addressIndex: [proIndex, cityIndex],
          addressList: [provinceNameArray, newCityNameArray]
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  // 选择省市
  bindRegionChange: function(e) {
    const _this = this;
    _this.setData({
      "addressIndex[0]": e.detail.value[0],
      "addressIndex[1]": e.detail.value[1]
    })
  },
  // 默认数据添加之后需要在每次滚动选择省的时候，请求加载对应的市数据，监听picker滚动函数
  bindMultiPickerColumnChange: function(e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
    const _this = this;
    switch (e.detail.column) {
      case 0:
        var all = _this.data.addressArr;
        var value = _this.data.provinceArray[e.detail.value]['value'];
        let cityArray = []
        for (var i = 0; i < all.length; i++) {
          if (all[i].parent == value) {
            cityArray.push(all[i].name)
          }
        }
        _this.setData({
          "addressList[1]": cityArray,
          "addressIndex[0]": e.detail.value,
          "addressIndex[1]": 0
        })
        break;
    }
  },
  bindAddressInput: function(e) {
    const _this = this;
    _this.setData({
      addressDetailText: e.detail.value
    })
  },
  bindAddressConfirm: function(event) {
    const that = this;
    if (that.data.addressList.length <= 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择活动城市',
      })
      return;
    }
    if (!that.data.addressDetailText) {
      wx.showToast({
        icon: 'none',
        title: '请填写具体地点',
      })
      return;
    }
    // 显示省市文字（广东广州）
    // let proCity = that.data.addressList[0][that.data.addressIndex[0]] + that.data.addressList[1][that.data.addressIndex[1]]
    let proValue = ''; //省的Id
    let newCityArray = [];
    for (let s = 0; s < that.data.provinceArray.length; s++) {
      if (that.data.provinceArray[s].name == that.data.addressList[0][that.data.addressIndex[0]]) {
        proValue = that.data.provinceArray[s].value;
        break;
      }
    }
    if (proValue) {
      // 根据省查询市组合
      for (let t = 0; t < that.data.addressArr.length; t++) {
        if (proValue == that.data.addressArr[t].parent) {
          newCityArray.push(that.data.addressArr[t].value);
        }
      }
    }
    let pubData = app.globalData.publishBlindDate;
    pubData.addressIndex = that.data.addressIndex;
    pubData.addressDetailText = that.data.addressDetailText;
    pubData.addressId = [proValue, newCityArray[that.data.addressIndex[1]]];
    wx.navigateBack({
      delta: 1
    })
  },
})
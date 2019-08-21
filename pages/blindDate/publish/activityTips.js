var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    autoHeight: false,
    height: '',
    width: 320,
    imgIndex: 0,
    firstCon: '',
    dataList: [],
  }, 
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "活动流程" //页面标题为路由参数
    })
    const _this = this;
    let pubData = app.globalData.publishBlindDate;
    let activityTipsStorage = pubData.activityTips;
    if (activityTipsStorage) {
      //将br替换成empty
      let newStorage = activityTipsStorage.replace("<br/>", "empty");
      // 正则提取数据 
      const pReg = /[^><]+(?=<\/p>)/img; //正则提取过滤img、br的内容
      const imgReg = /<img.*?(?:>|\/>)/gi;
      const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
      const arr = newStorage.match(imgReg);

      // 获取匹配P标签的内容
      const pArr = newStorage.match(pReg); //文字内容  
      console.log(pArr)
      let arrImg = []; //图片集合
      if (arr) {
        arr.forEach((v, i) => {
          const src = (v.match(srcReg)[1]);
          let imgSrc = src.substring(0, src.length - 1);
          arrImg.push({
            imgSrc
          });
        });
      }
      let imgTextArr = []; //图片+文字集合 
      if (pArr) {
        _this.setData({
          firstCon: pArr[0] == "empty" ? '' : pArr[0]
        })
        let pList = pArr.splice(1, pArr.length); //返回没有删除的索引，删除第一个数组
        for (var i = 0; i < arrImg.length; i++) {
          for (var j = 0; j <= pList.length; j++) {
            if (i == j) {
              imgTextArr.push({
                pic: arrImg[i].imgSrc, //存储本地地址
                temp: true, //标记是否是临时图片
                value: pList[j] == "empty" ? '' : pList[j], //存储图片下方相邻的输入框的内容
              });
            }
          }
        }
      }

      _this.setData({
        autoHeight: true,
        dataList: imgTextArr
      })
    }
  },
  onShow: function(e) {
    var that = this;
    //动态获取屏幕尺寸
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
   * 输入监听
   */
  inputCon: function(e) {
    let that = this;
    that.setData({
      autoHeight: true
    })
    if (0 === e.currentTarget.id - 0) { //第一个文本框的输入监听
      that.data.firstCon = e.detail.value;
    } else {
      that.data.dataList[e.currentTarget.id - 1].value = e.detail.value;
    }
  },
  /**
   * 失去焦点监听
   * 根据失去监听的input的位置来判断图片的插入位置
   */
  outBlur: function(e) {
    let that = this;
    that.data.imgIndex = e.currentTarget.id - 0;
  },
  /**
   * 添加图片
   */
  addImg: function() {
    var that = this;
    that.setData({
      autoHeight: true
    })
    //这里考虑到性能，对于图片张数做了限制
    if (that.data.dataList.length >= 10) { //超过四张
      wx.showModal({
        title: '提示',
        content: '最多只能添加10张图片哦',
        confirmText: "我知道了",
        confirmColor: "#ef8383",
        showCancel: false,
        success: function(res) {
          if (res.confirm) {} else if (res.cancel) {}
        }
      })
    } else { //添加图片
      wx.chooseImage({
        count: 1, //每次添加一张
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          that.upload(res.tempFilePaths);
        }
      })
    }
  },
  upload: function(path) {
    const that = this;
    wx.showToast({
      icon: "loading",
      title: "正在上传"
    });

    wx.uploadFile({
      url: app.globalData.imageUploadUrl + '/api/user/upload_pic',
      filePath: path[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: function(res) { //上传成功返回数据    
        var data = JSON.parse(res.data);
        if (data.status == 1) {
          var info = {
            pic: util.getFullPath(data.data.path, 720), //存储本地地址
            temp: true, //标记是否是临时图片
            value: '', //存储图片下方相邻的输入框的内容
          }
          that.data.dataList.splice(that.data.imgIndex, 0, info); //方法自行百度
          that.setData({
            dataList: that.data.dataList,
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
  /**
   * 删除图片
   */
  deletedImg: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showActionSheet({
      itemList: ['删除图片'],
      success: function(res) {
        if (res.tapIndex === 0) { //点击删除图片
          if (index === 0 && that.data.dataList[index].value != null) { //删除第一张，要与最上方的textarea合并
            that.data.firstCon = that.data.firstCon + that.data.dataList[index].value;
          } else if (index > 0 && that.data.dataList[index].value != null) {
            that.data.dataList[index - 1].value = that.data.dataList[index - 1].value + that.data.dataList[index].value;
          }
          that.data.dataList.splice(index, 1);
          that.setData({
            firstCon: that.data.firstCon,
            dataList: that.data.dataList
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  //失败警告
  do_fail: function(a) {
    wx.showToast({
      title: a,
      icon: 'none',
      duration: 1000
    })
  },
  editorConfirm: function() {
    const _this = this;
    if (!_this.data.firstCon && _this.data.dataList.length == 0) {
      wx.showToast({
        icon: "none",
        title: "地址导航不能为空"
      })
      return false;
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    _this.data.dataList.unshift({
      pic: '', //存储本地地址
      temp: true, //标记是否是临时图片
      value: _this.data.firstCon, //存储图片下方相邻的输入框的内容
    });
    var html = '';
    let res = _this.data.dataList;
    if (res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        if (i == 0) {
          if (res[0].pic == "") {
            html += '<p>' + res[0].value + '</p>';
          } else {
            html += '<p><br></p>';
          }
        } else {
          if (res[i].pic != "") {
            let val = res[i].value != "" ? "<p>" + res[i].value + "</p>" : "<p><br/></p>";
            html += "<p><img src=" + res[i].pic + ">" + val + "</p>";
          }
        }
      }
    } 
    app.globalData.publishBlindDate.activityTips = html;
    wx.navigateBack({
      delta: 1
    })
  }
})
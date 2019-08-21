const help = require('../../js/help.js')
const wxparse = require('../../utils/wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "帮助与反馈" //页面标题为路由参数
    })
    const _this = this;
    const id = options.id;
    let helpData = help.help;
    for (let i = 0; i < helpData.length; i++) {
      if (helpData[i].id == id) {
        _this.setData({
          question: helpData[i].list
        })
        break;
      }
    }
    let answerArr = [];
    for (let j = 0; j < _this.data.question.length; j++) {
      answerArr.push(_this.data.question[j].answer)
    }
 
    for (let k = 0; k < answerArr.length; k++) {
      wxparse.wxParse('answer' + k, 'html', answerArr[k], _this);
      if (k === answerArr.length - 1) {
        wxparse.wxParseTemArray('answerTemArray', 'answer', answerArr.length, _this);
      }
    } 
  },
})
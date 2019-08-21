const util = require('../../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false, //是否显示搜索
    searchKey: '',
    hhrList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "选择合伙人" //页面标题为路由参数
    })
    const _this = this;
    _this.loadData();
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      searchKey: "",
      inputShowed: false
    });
    this.loadData();
  },
  clearInput: function() {
    this.setData({
      searchKey: ""
    });
  },
  inputTyping: function(e) {
    this.setData({
      searchKey: e.detail.value
    });
    this.loadData();
  },
  loadData: function() {
    const _this = this;
    app.appRequest('GET', 'json', '/api/ordAgent/list', {
      'user.phoneNumber': _this.data.searchKey
    }, (res) => {
      if (res.list) {
        let item = res.list;
        for (var i = 0; i < item.length; i++) {
          if (item[i].user.headimgAttachmentId) {
            item[i].user.headimgAttachmentId = util.getFullPath(item[i].user.headimgAttachmentId, 120);
          } else {
            item[i].user.headimgAttachmentId = "data:image/gif;base64,R0lGODlhLAHIAJEAAObm5vX19e/v7wAAACH5BAAHAP8ALAAAAAAsAcgAAAL/jI+py+0Po5y02ouz3rz7D4biSJbmiabqyrbuC8fyTNf2jef6zvf+DwwKh8Si8YhMKpfMpvMJjUqn1Kr1is1qt9yu9wsOi8fksvmMTqvX7Lb7DY/L5/S6/Y7P6/f8vv8PGCg4SFhoeIiYqLjI2Oj4CBkpOUlZaXmJmam5ydn5IwAKIDpKCgAK6vl3WsraOoqaehfqSlsrEDsnULvLi/umyxts66sGLHzsSnxmjNzMqkzmLG17C73FPJ3NWm19pf1Ny90tBV7uKj7OhG3Obpru1B5Piv5uJH8vSl8vtI5vrr/PRz9//wIOIUjQYJCBCM0p/NGQIMCHNBhGLEdxx0WJ/xlxWNwIruMNkAlF1iDpb6JJFR9Ralspw2VKmDBk4lNJk0RLm9NyttjJ05lPFkHvDV1RVB7Oox6SxlvKlIPTeFFNAJ0qrGqJq1h7aR3BtWutr2DFYiQbIqzZVlDRTlC7tlRbtxHgxn1F14Pdu+7ycth7d67fBoDjCh68oPDaw4gTKDbbeAPfnpEzTJZW2fLlZpkxbObc2cJjrIxDj55aOvRnYak7rw4W2vPrXbEvnC7auvPtoLkzz6Zdm8Jvr8Eh7Hbae/Bw2MUfLCfePPHzXcnpHkcdncF15NkZTB/WXcF3WuEXjE9WPsH5Vukdr5/XXv17UfHlz6+PYLvN6ojv4/+3/91/5k3Hn27LCQjBbwXW9huCCc7m4AP63RShc6tVKOFnCzb3GYbGXbZhdJOFmB1fHr5l2IkoikVieZCpWEFXMF4w1YyyBWWjZjblqIFMLVY4IVs8dkDSkESCZKRUSCbZ45JM3njRkzpGKSWNTlYp3JVYSlDklllu5OWXVIYZQZdkPgjmmWiOqWYDZrbpnZZwAhjRj0CSZGeELs2pQJDk8WmAn+EAGgBvcwrKS57lIZoVmWYpWhuj00BamaTfwDKjpexQ+pWmFAo4y3uYhhfqfPNwqpCnvKE6jqqkVWrqpXm5CiJZtK7GaiW3KjhUrGmutOt3uS7iq0vDHhKsfwZjJWvqssUmtQ+zxb4j7bPpPNvVsXtgyyI01XILADTgduvLt+MSM+6juJibLi7pLpYKu++m8m5c9NarLify1tsJvvZy4i+8mwScbyb71qutGwfzqwnBaw3ssFgQR4zVxBQ7BUUBADs="
          }
        }
        _this.setData({
          hhrList: item
        })
      }
    }, (err) => {
      console.log('请求错误信息：  ' + err.errMsg);
    });
  },
  setAdd: function(event) {
    let item = event.currentTarget.dataset.item;
    app.globalData.publishBlindDate.channel = item;
    wx.navigateTo({
      url: '/pages/blindDate/publish/sharingChannel',
    })
  }
})
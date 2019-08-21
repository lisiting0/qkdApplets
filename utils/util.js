var app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getToday = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
}

const getFullPath = (path, size) => {
  var append = '';
  if (size) {
    if (size == 120) {
      append = '!w120';
    } else if (size == 240) {
      append = '!w240';
    } else if (size == 360) {
      append = '!w360';
    } else if (size == 720) {
      append = '!w720';
    } else if (size == 1080) {
      append = '!w1080';
    } else {
      append = '!w60';
    }
  }
  if (/^http*/.test(path)) {
    return path;
  } else {
    return app.globalData.imageUrl + path + append;
  }
}

function toArray(date)
{
  let myDate = date;
  let myArray = Array();
  myArray[0] = myDate.getFullYear();
  myArray[1] = myDate.getMonth();
  myArray[2] = myDate.getDate();
  myArray[3] = myDate.getHours();
  myArray[4] = myDate.getMinutes();
  myArray[5] = myDate.getSeconds();
  return myArray;
}

function maxDayOfDate(date) {
  let myDate = date;
  let ary = this.toArray(myDate);
  let relativeDate = (new Date(ary[0], ary[1], 1));
  //获得当前月份0-11
  let relativeMonth = relativeDate.getMonth();
  //获得当前年份4位年
  let relativeYear = relativeDate.getFullYear();

  //当为12月的时候年份需要加1
  //月份需要更新为0 也就是下一年的第一个月
  if (relativeMonth == 11) {
    relativeYear++;
    relativeMonth = 0;
  } else {
    //否则只是月份增加,以便求的下一月的第一天
    relativeMonth++;
  }
  //一天的毫秒数
  let millisecond = 1000 * 60 * 60 * 24;
  //下月的第一天
  let nextMonthDayOne = new Date(relativeYear, relativeMonth, 1);
  //返回得到上月的最后一天,也就是本月总天数
  return new Date(nextMonthDayOne.getTime() - millisecond).getDate();
}

/**
 *
 * @param date 日期对象
 * @param format 格式化目标字符串 yyyy-MM-dd hh:mm:ss
 * @returns {*}
 */
function format(date, format) {
  let o = {
    "M+": date.getMonth() + 1, //month
    "d+": date.getDate(), //day
    "h+": date.getHours(), //hour
    "m+": date.getMinutes(), //minute
    "s+": date.getSeconds(), //second
    "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
    "S": date.getMilliseconds() //millisecond
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (let k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

function isPhoneNum(str) {
  return /^(0|86|17951)?(1[3-9][0-9])[0-9]{8}$/.test(str)
}

function formarDistance(str) {
  let result = '';
  str = parseFloat(str)
  if (str) {
    result = str.length > 3 ? (Math.round(str / 10) / 100) + 'km' : Math.round(str) + 'm'
  }
  return result
}

function deepCopy(o) {
  if (o instanceof Array) {
    let n = [];
    for (let i = 0; i < o.length; ++i) {
      n[i] = this.deepCopy(o[i]);
    }
    return n;
  } else if (o instanceof Function) {
    let n = new Function("return " + o.toString())();
    return n
  } else if (o instanceof Object) {
    let n = {}
    for (let i in o) {
      n[i] = this.deepCopy(o[i]);
    }
    return n;
  } else {
    return o;
  }
}

/**
 * 用于判断空，Undefined String Array Object
 */
function isBlank(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return JSON.stringify(str) == '{}' ? true : false
  } else {
    return true
  }
}

function getMessageTimeFromNow(datetime) {
  let date2 = new Date();
  let date = new Date(Date.parse(datetime.replace(/-/g, "/")));
  let date3 = Date.parse((this.format(date2, "yyyy-MM-dd 00:00:00")).replace(/-/g, "/"));
  let times = Math.floor((date2.getTime() - date.getTime()) / 1000)
  let times2 = Math.floor((date2.getTime() - date3) / 1000)
  let ifthisyear = false;
  if (this.format(date, "yyyy") == this.format(date2, "yyyy")) {
    ifthisyear = true;
  }
  if (times < 0) {
    return "刚刚";
  } else if (times < 60) {
    return "刚刚";
  } else if (times < 60 * 60) {
    return Math.floor(times / 60) + "分钟前";
  } else if (times < times2) {
    return Math.floor(times / 3600) + "小时前";
  } else if (times < (times2 + 86400)) {
    return "昨天";
  } else if (times < (times2 + 86400 * 6)) {
    let show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    return show_day[date.getDay()]
  } else {
    if (ifthisyear) {
      return this.format(date, "MM-dd")
    }
    return this.format(date, "yyyy-MM-dd")
  }
  return '';
}

module.exports = {
  formatTime: formatTime,
  getToday: getToday,
  getFullPath: getFullPath,
  toArray: toArray,
  maxDayOfDate: maxDayOfDate,
  format: format,
  isPhoneNum: isPhoneNum,
  formarDistance: formarDistance,
  deepCopy: deepCopy,
  isBlank: isBlank,
  getMessageTimeFromNow: getMessageTimeFromNow
}
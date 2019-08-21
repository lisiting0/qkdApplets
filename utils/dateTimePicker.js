function withData(param) {
  return param < 10 ? '0' + param : '' + param;
}

function getLoopArray(start, end) { 
  var start = start || 0;
  var end = end || 1;
  var array = [];
  for (var i = start; i <= end; i++) { 
      array.push(withData(i)); 
  } 
  return array;
}

function getMonthDay(year, month, day) {
  var flag = year % 400 == 0 || (year % 4 == 0 && year % 100 != 0),
    array = null;

  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      array = getLoopArray(day, 31)
      break;
    case '04':
    case '06':
    case '09':
    case '11':
      array = getLoopArray(day, 30)
      break;
    case '02':
      array = flag ? getLoopArray(day, 29) : getLoopArray(day, 28)
      break;
    default:
      array = '月份格式不正确，请重新输入！'
  }
  return array;
}

function getNewDateArry() {
  // 当前时间的处理
  var newDate = new Date();
  var year = withData(newDate.getFullYear()),
    mont = withData(newDate.getMonth() + 1),
    date = withData(newDate.getDate()),
    hour = withData(newDate.getHours()),
    minu = withData(newDate.getMinutes()),
    seco = withData(newDate.getSeconds());
  return [year, mont, date, hour, minu, seco];
}

// 开始年份区间
function dateTimePicker(startYear, endYear, day, min) {
  // 返回默认显示的数组和联动数组的声明
  var dateTime = [],
    dateTimeArray = [
      [],
      [],
      [],
      [],
      [],
      []
    ];
  var start = startYear || 2019;
  var end = endYear || 2019;

  // 默认开始显示数据
  var newDate = new Date();
  var defaultDate = getNewDateArry();
  // 处理联动列表数据
  var mont = newDate.getMonth() + 1,
      currmonth = newDate.getMonth() + 1;

  // 月份为1，则是从当月开始  
    if (mont < 10) {
      mont = '0' + mont;
    } 

  /*年月日 时分秒*/
  dateTimeArray[0] = getLoopArray(start, end);
  dateTimeArray[1] = getLoopArray(currmonth, (currmonth+3) > 12? 12: (currmonth+3));

  // date有值开始日期是当天
  if (day) {
    dateTimeArray[2] = getMonthDay(startYear, mont, day);
  } else {
    // 如果day==0,开始日期1号
    dateTimeArray[2] = getMonthDay(startYear, mont, 1);
  }
  dateTimeArray[3] = getLoopArray(0, 23);
  dateTimeArray[4] = min ? min : getLoopArray(0, 59);
  dateTimeArray[5] = getLoopArray(0, 59);

  dateTimeArray.forEach((current, index) => { 
    dateTime.push(current.indexOf(defaultDate[index]));
  });

  return {
    dateTimeArray: dateTimeArray,
    dateTime: dateTime
  }
}
module.exports = {
  dateTimePicker: dateTimePicker,
  getMonthDay: getMonthDay
}
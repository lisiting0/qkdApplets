export const Fn = {
  timeFormat(time, fmt) {
    fmt = fmt || "yyyy-MM-dd hh:mm";
    if (!(time && time != "")) {
      return time;
    }
    if (isNaN(time)) {
      time = time.replace(/\-/g, "/");
    }
    let newDate = new Date(time);
    const o = {
      "M+": newDate.getMonth() + 1, //月份
      "d+": newDate.getDate(), //日
      "h+": newDate.getHours(), //小时
      "m+": newDate.getMinutes(), //分
      "s+": newDate.getSeconds(), //秒
      "q+": Math.floor((newDate.getMonth() + 3) / 3), //季度
      "S": newDate.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  getTimezoneOffset(time, flag, fmt) { //flag:false 把服务器时间换成本地时间 /flag:true 把本地时间换成服务器时间
    const serverTimeZone = 8; //东为正
    const now = new Date();
    let isFlag = true;
    if (isNaN(time)) {
      time = time.replace(/\-/g, "/");
      isFlag = false;
    }
    const nowDate = new Date(time);
    let dis = -1;
    if (flag) {
      dis = 1;
    }
    const timezone = dis * now.getTimezoneOffset() / 60 + serverTimeZone * dis; //本地时间跟格林威治时区差
    let offsetTime = nowDate.getTime() + timezone * 60 * 60 * 1000;
    if (!isFlag) {
      offsetTime = this.timeFormat(offsetTime, fmt);
    }
    if (flag) {
      console.log("本地时区:" + (-dis * now.getTimezoneOffset() / 60) + ",时间:" + time + ",转换为服务器时区:" + serverTimeZone + ",时间:" + offsetTime);
    } else {
      console.log("服务器时区:" + serverTimeZone + ",时间:" + time + ",转换为本地时区:" + (dis * now.getTimezoneOffset() / 60) + ",时间:" + offsetTime);
    }
    return offsetTime;
  },
  isEmojiCharacter(substring) {
    if (substring) {
      let reg = new RegExp("[~#^$@%&!?%*]", 'g');
      if (substring.match(reg)) {
        return true;
      }
      for (let i = 0; i < substring.length; i++) {
        let hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
          if (substring.length > 1) {
            let ls = substring.charCodeAt(i + 1);
            let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
            if (0x1d000 <= uc && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          let ls = substring.charCodeAt(i + 1);
          if (ls == 0x20e3) {
            return true;
          }
        } else {
          if (0x2100 <= hs && hs <= 0x27ff) {
            return true;
          } else if (0x2B05 <= hs && hs <= 0x2b07) {
            return true;
          } else if (0x2934 <= hs && hs <= 0x2935) {
            return true;
          } else if (0x3297 <= hs && hs <= 0x3299) {
            return true;
          } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
            hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
            hs == 0x2b50) {
            return true;
          }
        }
      }
    }
  },
  trim(str) {
    if (!str) {
      return str;
    }
    return (str + "").trim();
  },
  toFixed(number) {
    if (isNaN(number)) {
      return number || "";
    }
    return parseFloat(number).toFixed(2);
  },
  toRound(v, e) {
    let t = 1;
    for (; e > 0; t *= 10, e--);
    for (; e < 0; t /= 10, e++);
    return Math.round(v * t) / t;
  },
  toUrl(str) {
    let params = {};
    let data = str.split("?");
    if (data[0]) {
      if (!/^(\/#\/)/.test(data[0])) {
        return {};
      }
      params.name = data[0].replace("/#/", "");
    }
    if (data[1]) {
      let strs = data[1].split("&"),
        query = {};
      for (let i = strs.length; i--;) {
        let par = strs[i].split("=") || [];
        query[par[0]] = par[1];
      }
      params.query = query;
    }
    return params;
  },
  toWxUrl(str, flag) { //解析微信公众号返回的url的(参数不能包含'#/','_')
    let params = {};
    flag = flag || "_";
    let data = str.split("?"),
      params_str = '';
    if (data[1]) {
      let strs = data[1].split("&"),
        query = {};
      for (let i = strs.length; i--;) { //&参数
        let par = strs[i].split("=") || [];
        if (par[0] == "code") {
          //params.code=par[1];
          query.code = par[1];
        } else if (par[0] == "state") {
          par[1] = par[1].split("#/")[0];
          params.str = par[1];
          let data = par[1].split(flag + "" + flag);
          for (let j = data.length; j--;) {
            if (data[j] != '') {
              if (j == 0) {
                params.name = data[j]; //采用state里的路由名
              } else {
                let c = data[j].split(flag);
                query[c[0]] = c[1].split("#/")[0];
              }
            }
          }
        } else if (par[0] != 'times') { //times排除,times后台添加的
          query[par[0]] = par[1];
          params_str += flag + par[0] + flag + par[1];
        }
      }
      if (!params.name) {
        params.name = data[0].split("#/")[1];
      }
      if (!params.str) {
        params.str = params.name + (params_str ? flag + params_str : '');
      }
      params.query = query;
    } else {
      params.name = data[0].split("#/")[1];
      params.str = data[0].split("#/")[1];
    }
    if (params.name) {
      let p = params.name.split('/');
      if (p.length > 1) {
        params.name = p[0];
        params.params = {
          pagerouter: p[1],
        }
      }
    }
    return params;
  }
}
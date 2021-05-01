/**
 * 字符串转为日期对象
 * @param s
 * @returns {Date}
 */
export function string2date (s) {
  return new Date(Date.parse(s.replace(/-/g, "/")));
}

/**
 * 字符串转为long timeStamp
 * @param s
 * @returns {number}
 */
export function string2timeStamp (s) {
  return Date.parse(s.replace(/-/g, "/"));
}

/**
 日期格式化，第一个参数为日期，第二个参数为日期格式化的格式，返回一个格式化后的字符串
 对Date的扩展，将 Date 转化为指定格式的String
 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 eg:
 (newDate()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
*/

export function dateFormat (date, format) {
  let o = {
    'M+': date.getMonth() + 1, //month
    'd+': date.getDate(), //day
    'h+': date.getHours(), //hour
    'm+': date.getMinutes(), //minute
    's+': date.getSeconds(), //second
    'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
    'S': date.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

export function moveByYear (date, n) {
  let d = new Date(date.getTime())
  d.setFullYear(d.getFullYear() + n)
  return d
}

export function moveByMonth (date, n) {
  let d = new Date(date.getTime())
  d.setMonth(d.getMonth() + n)
  return d
}

export function moveByDay (date, n) {
  let d = new Date(date.getTime())
  d.setDate(d.getDate() + n)
  return d
}

export function moveByHour (date, n) {
  let d = new Date(date.getTime())
  d.setHours(d.getHours() + n)
  return d
}

export function moveByMinute (date, n) {
  let d = new Date(date.getTime())
  d.setMinutes(d.getMinutes() + n)
  return d
}


export function beforeByYear (date, n) {
  let d = new Date(date.getTime())
  d.setFullYear(d.getFullYear() - n)
  return d
}

export function beforeByMonth (date, n) {
  let d = new Date(date.getTime())
  d.setMonth(d.getMonth() - n)
  return d
}

export function beforeByDay (date, n) {
  let d = new Date(date.getTime())
  d.setDate(d.getDate() - n)
  return d
}

export function beforeByHour (date, n) {
  let d = new Date(date.getTime())
  d.setHours(d.getHours() - n)
  return d
}

export function beforeByMinute (date, n) {
  let d = new Date(date.getTime())
  d.setMinutes(d.getMinutes() - n)
  return d
}

//*天之后
export function afterByDay (date, n) {
  let d = new Date(date.getTime())
  d.setDate(d.getDate() + n)
  return d
}

export function round2Year (date) {
  let d = new Date(date.getTime())
  d.setMonth(0)
  d.setDate(1)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export function round2Month (date) {
  let d = new Date(date.getTime())
  d.setDate(1)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export function round2day (date) {
  let d = new Date(date.getTime())
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export function end2Year (date) {
  let d = new Date(date.getTime())
  d.setFullYear(d.getFullYear() + 1)
  d.setMonth(0)
  d.setDate(0)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export function end2Month (date) {
  let d = new Date(date.getTime())
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export function end2day (date) {
  let d = new Date(date.getTime())
  d.setHours(23)
  d.setMinutes(59)
  d.setSeconds(59)
  d.setMilliseconds(999)
  return d
}

export function diffYears (d1, d2) {
  let d = Math.floor((d1.getTime() - d2.getTime()) / 86400000 / 365)
  return d
}

export function diffMonths (d1, d2) {
  let d = Math.floor((d1.getTime() - d2.getTime()) / 86400000 / 30)
  return d
}

export function diffDays (d1, d2) {
  let d = Math.round((d1.getTime() - d2.getTime()) / 86400000)
  return d
}

export function getBtext (date) {
  let d = (new Date().getTime() - date.getTime()) / 60000

  if (d < 1) {
    return '刚刚'
  } else if (d < 60) {
    return Math.round(d) + '分钟之前'
  } else if (d < 1440) {
    return Math.floor(d / 60) + '小时之前'
  } else if (d < 7200) {
    return Math.floor(d / 1440) + '天之前'
  } else {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
  }
}

export let weeks = {
  'zh': {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  },
  'en': {
    '0': 'Sunday',
    '1': 'Monday',
    '2': 'Tuesday',
    '3': 'Wednesday',
    '4': 'Thursday',
    '5': 'Friday',
    '6': 'Saturday'
  }
}

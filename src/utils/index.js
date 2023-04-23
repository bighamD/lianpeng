/**
 * 将时间解析为字符串
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    //  Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 获得星期
export function getWeek(time) {
  const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  var myDate = new Date(Date.parse(time))
  return weekDay[myDate.getDay()]
}

export function dateToStr(date, pattern) {
  if (typeof date === 'string') {
    return date
  }

  pattern = pattern || 'yyyy-MM-dd'

  var o = {
    'M+': date.getMonth() + 1, // month 从 Date 对象返回月份 (0 ~ 11)，加以改成1~12月份
    'd+': date.getDate(), // day 从 Date 对象返回一个月中的某一天 (1 ~ 31)。
    'h+': date.getHours(), // hour 返回 Date 对象的小时 (0 ~ 23)。
    'm+': date.getMinutes(), // minute  返回 Date 对象的分钟 (0 ~ 59)。
    's+': date.getSeconds(), // second 返回 Date 对象的秒数 (0 ~ 59)。
    'w+': '\u65e5\u4e00\u4e8c\u4e09\u56db\u4e94\u516d'.charAt(date.getDay()), // “日一二三四五六”中的某一个
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // Date 对象的毫秒(0 ~ 999)。
  }

  // 将'yyyy-MM-dd'中的'y'替换成具体年份，并根据'y'的数量保留对应的位数
  if (new RegExp('(y+)').test(pattern)) {
    pattern = pattern.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  // 替换剩下的模板，如果有的模板长度大于1，如'yyyy-MM-dd'中的'MM'、'dd'，则定为两位，实际字符串长度不足两位的，前面用0补足
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(pattern)) {
      pattern = pattern.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }

  return pattern
}

export function getUrlKey(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2]); return ''
}

export function timeToMinute(times) {
  let t
  if (times > -1) {
    var hour = Math.floor(times / 3600)
    var min = Math.floor(times / 60) % 60
    var sec = times % 60
    if (hour < 10) {
      t = '0' + hour + ':'
    } else {
      t = hour + ':'
    }

    if (min < 10) { t += '0' }
    t += min + ':'
    if (sec < 10) { t += '0' }
    t += sec.toFixed(2)
  }
  t = t.substring(0, t.length - 3)
  return t
}

// 倒计时
export function timeDown(value) {
  const times = value.replace(/-/g, '/')
  const endTime = new Date(times)
  const nowTime = new Date()
  const leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000)
  const d = parseInt(leftTime / (24 * 60 * 60))
  const h = parseInt(leftTime / (60 * 60) % 24)
  const m = parseInt(leftTime / 60 % 60)
  if (leftTime <= 0) {
    return [0, 0, 0]
  }
  return [d, h, m]
}

// 判断时间是否过期
export function pastDue(value) {
  const times = value.replace(/-/g, '/')
  const endTime = new Date(times)
  const nowTime = new Date()
  const leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000)
  // const d = parseInt(leftTime / (24 * 60 * 60))
  // const h = parseInt(leftTime / (60 * 60) % 24)
  // const m = parseInt(leftTime / 60 % 60)
  return leftTime <= 0
}

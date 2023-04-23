import wx from 'weixin-js-sdk'
import request from '@/utils/request'

function GetJsSign(data) {
  return request({
    url: 'common/shareOption',
    method: 'POST',
    data: data
  })
}

export default {
  init(apiList = [], debug) {
    var url = window.location.href.split('#')[0]
    return new Promise((resolve, reject) => {
      GetJsSign({
        url: url
      }).then(res => {
        if (res.data.code === 1) {
          var data = res.data.data
          wx.config(data)
          wx.ready(() => {
            wx.checkJsApi({
              jsApiList: apiList,
              success: function(res) {
                resolve(wx, res)
              }
            })
          })
        } else {
          reject(res)
        }
      })
    })
  }
}

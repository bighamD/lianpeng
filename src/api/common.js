import request from '@/utils/request'

// 获取token
export function getToken(data) {
  return request({
    url: 'user/wechat',
    method: 'get',
    params: data
  })
}

// 验证码
export function getSms(data) {
  return request({
    url: 'common/sms',
    method: 'post',
    data: data
  })
}

// 上传图片
export function upload(data) {
  return request({
    url: 'common/upload',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data;boundary=' + new Date().getTime()
    }
  })
}

import request from '@/utils/request'

// 开通Vip
export function applyVip(data) {
  return request({
    url: 'user/vip',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

// 会员开通礼包
export function vipCoupon(data) {
  return request({
    url: 'store/vipCoupon',
    method: 'post',
    data: data
  })
}

// 获取商家数据
export function storeDetails(data) {
  return request({
    url: 'store/store',
    method: 'post',
    data: data
  })
}


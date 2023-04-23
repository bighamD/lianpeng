// 条款接口
import request from '@/utils/request'

// 关于我们
export function clauseAboutUs(data) {
  return request({
    url: 'clause/aboutUs',
    method: 'post',
    data: data
  })
}

// 优惠券说明
export function clauseCoupon(data) {
  return request({
    url: 'clause/coupon',
    method: 'post',
    data: data
  })
}

// 费用说明及退款规则
export function clauseCostAndRefund(data) {
  return request({
    url: 'clause/costAndRefund',
    method: 'post',
    data: data
  })
}

// 旅游服务协议
export function clauseTravelService(data) {
  return request({
    url: 'clause/travelService',
    method: 'post',
    data: data
  })
}

// 会员服务协议
export function clauseVipService(data) {
  return request({
    url: 'clause/vipService',
    method: 'post',
    data: data
  })
}

// 会员权益规则
export function clauseVipEquity(data) {
  return request({
    url: 'clause/vipEquity',
    method: 'post',
    data: data
  })
}

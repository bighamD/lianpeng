import request from '@/utils/request'

// 活动详情
export function getActivityDetail(data) {
  return request({
    url: 'activity/detail',
    method: 'post',
    data: data
  })
}

// 活动团期详情
export function getActivityPeriod(data) {
  return request({
    url: 'activity/period',
    method: 'post',
    data: data
  })
}

// 活动评价
export function getActivityComment(data) {
  return request({
    url: 'activity/comment',
    method: 'post',
    data: data
  })
}

// 活动分享
export function getActivityShare(data) {
  return request({
    url: 'activity/share',
    method: 'post',
    data: data
  })
}

// 当前活动可使用的优惠券
export function getActivityCoupon(data) {
  return request({
    url: 'activity/coupon',
    method: 'post',
    data: data
  })
}

// 收藏
export function favorites(data) {
  return request({
    url: 'activity/favorites',
    method: 'post',
    data: data
  })
}

// 检查收藏
export function checkFavorites(data) {
  return request({
    url: 'activity/isFavorites',
    method: 'post',
    data: data
  })
}

// 发起通知
export function notice(data) {
  return request({
    url: 'activity/notice',
    method: 'post',
    data: data
  })
}

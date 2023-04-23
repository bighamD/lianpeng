import request from '@/utils/request'

// banner列表
export function getBannerList(data) {
  return request({
    url: 'common/banner',
    method: 'post',
    data: data
  })
}

// 广告位
export function getAdv(data) {
  return request({
    url: 'common/advertising',
    method: 'post',
    data: data
  })
}

// 活动分类
export function activityCategory(data) {
  return request({
    url: 'common/activityCategory',
    method: 'post',
    data: data
  })
}

// 活动列表列表
export function getActivityList(data) {
  return request({
    url: 'common/activity',
    method: 'post',
    data: data
  })
}

// 搜素
export function activitySearch(data) {
  return request({
    url: 'common/activitySearch',
    method: 'post',
    data: data
  })
}

// 投诉
export function suggest(data) {
  return request({
    url: 'common/suggest',
    method: 'post',
    data: data
  })
}

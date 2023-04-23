import request from '@/utils/request'

// 订单列表
export function getList(data) {
  return request({
    url: 'ActivityOrder/index',
    method: 'post',
    data: data
  })
}

// 订单详情
export function orderDetail(data) {
  return request({
    url: 'ActivityOrder/detail',
    method: 'post',
    data: data
  })
}

// 创建订单
export function createOrder(data) {
  return request({
    url: 'ActivityOrder/create',
    method: 'post',
    data: data
  })
}

// 订单支付
export function createPay(data) {
  return request({
    url: 'ActivityOrder/pay',
    method: 'post',
    data: data
  })
}

// 删除订单
export function deleteOrder(data) {
  return request({
    url: 'ActivityOrder/delete',
    method: 'post',
    data: data
  })
}

// 订单评论
export function createComment(data) {
  return request({
    url: 'ActivityOrder/comment',
    method: 'post',
    data: data
  })
}

// 订单评论内容
export function commentPage(data) {
  return request({
    url: 'ActivityOrder/commentPage',
    method: 'post',
    data: data
  })
}

// 检验
export function checkSing(data) {
  return request({
    url: 'ActivityOption/checkSign',
    method: 'post',
    data: data
  })
}

// 检验是否可替员
export function checkReplace(data) {
  return request({
    url: 'ActivityOption/forMemberPage',
    method: 'post',
    data: data
  })
}

// 检验是否可退出
export function checkExit(data) {
  return request({
    url: 'ActivityOption/quitPage',
    method: 'post',
    data: data
  })
}

// 检验是否可改签
export function checkUpdate(data) {
  return request({
    url: 'ActivityOption/changingPage',
    method: 'post',
    data: data
  })
}

// 活动替员提交
export function forMember(data) {
  return request({
    url: 'ActivityOption/forMember',
    method: 'post',
    data: data
  })
}

// 活动改签提交
export function changing(data) {
  return request({
    url: 'ActivityOption/changing',
    method: 'post',
    data: data
  })
}

// 活动退出-核算金额
export function quitCate(data) {
  return request({
    url: 'ActivityOption/quitCate',
    method: 'post',
    data: data
  })
}

// 活动退出提交
export function activityQuit(data) {
  return request({
    url: 'ActivityOption/quit',
    method: 'post',
    data: data
  })
}

import request from '@/utils/request'

// 用户信息
export function userInfo(data) {
  return request({
    url: 'user/info',
    method: 'post',
    data: data
  })
}

// 收藏
export function getFavorites(data) {
  return request({
    url: 'user/favorites',
    method: 'post',
    data: data
  })
}

// 优惠卷
export function getCoupon(data) {
  return request({
    url: 'user/coupon',
    method: 'post',
    data: data
  })
}

// 新消息
export function isMessage(data) {
  return request({
    url: 'user/isMessage',
    method: 'post',
    data: data
  })
}

// 消息中心
export function getMessage(data) {
  return request({
    url: 'common/message',
    method: 'post',
    dataType: data
  })
}

// 消息详情
export function messageDetails(data) {
  return request({
    url: 'common/messageDetail',
    method: 'post',
    data: data
  })
}

// 修改资料
export function saveInfo(data) {
  return request({
    url: 'user/update',
    method: 'post',
    data: data
  })
}

// 修改手机号
export function savePhone(data) {
  return request({
    url: 'user/phone',
    method: 'post',
    data: data
  })
}

// 常用联系人
export function getContactsList(data) {
  return request({
    url: 'contacts/index',
    method: 'post',
    data: data
  })
}

// 添加联系人
export function createContacts(data) {
  return request({
    url: 'contacts/create',
    method: 'post',
    data: data
  })
}

// 联系人详情
export function getContacts(data) {
  return request({
    url: 'contacts/detail',
    method: 'post',
    data: data
  })
}

// 编辑联系人
export function updateContacts(data) {
  return request({
    url: 'contacts/update',
    method: 'post',
    data: data
  })
}

// 删除联系人
export function deleteContacts(data) {
  return request({
    url: 'contacts/delete',
    method: 'post',
    data: data
  })
}

// 身份证类型
export function identityType(data) {
  return request({
    url: 'contacts/identityType',
    method: 'post',
    data: data
  })
}

// 衣服码数
export function clothesSize(data) {
  return request({
    url: 'contacts/clothesSize',
    method: 'post',
    data: data
  })
}

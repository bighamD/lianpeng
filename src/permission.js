import router from './router'
import store from './store'
import { getToken, removeToken } from '@/utils/auth' // 获取url参数
import wxApi from '@/utils/wxApi'
import { getUrlKey } from '@/utils/index' // 获取url参数

router.beforeEach(async(to, from, next) => {
  if (store.getters.storeData) {
    window.document.title =
            to.meta.title + '-' + store.getters.storeData.store_name
  } else {
    window.document.title = to.meta.title || '户外运动'
  }
  store.dispatch('route/updateRoute', to.name) // 塞入当前路由名称
  if (to.name === 'Invalid') {
    // 无效学期
    next()
  } else {
    // 确定用户是否已登录
    const storeId = to.params.storeId
    const hasToken = getToken() ? getToken().store_id === storeId : false
    if (hasToken) {
      // 已经登录,进入页面
      if (!store.getters.userData) {
        // 获取用户信息
        await store.dispatch('user/getUserData')
        await store.dispatch('index/getStoreData')
      }
      if (to.name !== 'activityDetails') {
        wxApi
          .init(
            [
              'updateAppMessageShareData',
              'updateTimelineShareData'
            ],
            false
          )
          .then((wx, res) => {
            wx.updateAppMessageShareData({
              title:
                                to.name === 'vip'
                                  ? 'VIP会员-' +
                                      store.getters.storeData.store_name
                                  : store.getters.storeData
                                    .wechat_share_title, // 分享标题
              link:
                                to.name === 'vip'
                                  ? 'https://web.lianpenkeji.com/vip/' +
                                      storeId
                                  : 'https://web.lianpenkeji.com/' + storeId,
              imgUrl: store.getters.storeData
                .wechat_share_picture, // 分享图标
              desc:
                                to.name === 'vip'
                                  ? '开通会员享受活动特别优惠价格，还有优惠券礼包...'
                                  : store.getters.storeData
                                    .wechat_share_subtitle
            })
            wx.updateTimelineShareData({
              title:
                                to.name === 'vip'
                                  ? 'VIP会员-' +
                                      store.getters.storeData.store_name
                                  : store.getters.storeData
                                    .wechat_share_title, // 分享标题
              link:
                                to.name === 'vip'
                                  ? 'https://web.lianpenkeji.com/vip/' +
                                      storeId
                                  : 'https://web.lianpenkeji.com/' + storeId,
              imgUrl: store.getters.storeData
                .wechat_share_picture, // 分享图标
              desc:
                                to.name === 'vip'
                                  ? '开通会员享受活动特别优惠价格，还有优惠券礼包...'
                                  : store.getters.storeData
                                    .wechat_share_subtitle
            })
          })
      }
      next()
    } else if (getUrlKey('code')) {
      console.log('href', location.href)
      try {
        // 根据code获取token
        await store.dispatch('user/getSecurityData', {
          store_id: storeId,
          code: getUrlKey('code')
        })
        await store.dispatch('index/getStoreData')
        if (to.name !== 'activityDetails') {
          wxApi
            .init(
              [
                'updateAppMessageShareData',
                'updateTimelineShareData'
              ],
              false
            )
            .then((wx, res) => {
              wx.updateAppMessageShareData({
                title:
                                    to.name === 'vip'
                                      ? 'VIP会员-' +
                                          store.getters.storeData.store_name
                                      : store.getters.storeData
                                        .wechat_share_title, // 分享标题
                link:
                                    to.name === 'vip'
                                      ? 'https://web.lianpenkeji.com/vip/' +
                                          storeId
                                      : 'https://web.lianpenkeji.com/' +
                                          storeId,
                imgUrl: store.getters.storeData
                  .wechat_share_picture, // 分享图标
                desc:
                                    to.name === 'vip'
                                      ? '开通会员享受活动特别优惠价格，还有优惠券礼包...'
                                      : store.getters.storeData
                                        .wechat_share_subtitle
              })
              wx.updateTimelineShareData({
                title:
                                    to.name === 'vip'
                                      ? 'VIP会员-' +
                                          store.getters.storeData.store_name
                                      : store.getters.storeData
                                        .wechat_share_title, // 分享标题
                link:
                                    to.name === 'vip'
                                      ? 'https://web.lianpenkeji.com/vip/' +
                                          storeId
                                      : 'https://web.lianpenkeji.com/' +
                                          storeId,
                imgUrl: store.getters.storeData
                  .wechat_share_picture, // 分享图标
                desc:
                                    to.name === 'vip'
                                      ? '开通会员享受活动特别优惠价格，还有优惠券礼包...'
                                      : store.getters.storeData
                                        .wechat_share_subtitle
              })
            })
        }
        next({ ...to, replace: true })
      } catch (error) {
        // 进入无效页面
        removeToken()
        next({
          name: 'Invalid',
          params: { storeId: storeId },
          replace: true
        })
      }
    } else {
      next()
      // 跳到微信授权
      store.dispatch(
        'user/setAuthUrl',
        window.location.protocol +
                    '//' +
                    window.location.host +
                    window.location.pathname
      )
    }
  }
})

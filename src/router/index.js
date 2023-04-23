import Vue from 'vue'
import Router from 'vue-router'
import { MainFooterView } from '@/components'

Vue.use(Router)

const routes = [
  {
    path: '/invalid/:storeId',
    name: 'Invalid',
    components: {
      default: r => { require(['@/views/invalid'], r) }
    },
    meta: { title: '找不到页面！' }
  },
  {
    path: '/:storeId',
    name: 'index',
    components: {
      default: r => { require(['@/views/index/index'], r) },
      footer: MainFooterView
    },
    meta: { title: '首页' }
  },
  {
    path: '/user/:storeId',
    name: 'user',
    components: {
      default: r => { require(['@/views/user/index'], r) },
      footer: MainFooterView
    },
    meta: { title: '我的' }
  },
  {
    path: '/indexSearch/:storeId',
    name: 'indexSearch',
    components: {
      default: r => { require(['@/views/index/search'], r) }
    },
    meta: { title: '搜索' }
  },
  {
    path: '/complaint/:storeId',
    name: 'complaint',
    components: {
      default: r => { require(['@/views/index/complaint'], r) }
    },
    meta: { title: '投诉反馈' }
  },
  {
    path: '/aboutUs/:storeId',
    name: 'aboutUs',
    components: {
      default: r => { require(['@/views/index/aboutUs'], r) }
    },
    meta: { title: '关于我们' }
  },
  {
    path: '/activityDetails/:storeId/:activityId',
    name: 'activityDetails',
    components: {
      default: r => { require(['@/views/index/activityDetails'], r) }
    },
    meta: { title: '活动详情' }
  },
  {
    path: '/activityEnroll/:storeId/:activityId/:periodId',
    name: 'activityEnroll',
    components: {
      default: r => { require(['@/views/index/activityEnroll'], r) }
    },
    meta: { title: '报名' }
  },
  {
    path: '/activityUserList/:storeId/:periodId',
    name: 'activityUserList',
    components: {
      default: r => { require(['@/views/index/activityUserList'], r) }
    },
    meta: { title: '活动人员' }
  },
  {
    path: '/userInfo/:storeId',
    name: 'userInfo',
    components: {
      default: r => { require(['@/views/user/info'], r) }
    },
    meta: { title: '个人信息' }
  },
  {
    path: '/message/:storeId',
    name: 'message',
    components: {
      default: r => { require(['@/views/user/message'], r) }
    },
    meta: { title: '消息中心' }
  },
  {
    path: '/messageDetails/:storeId/:id',
    name: 'messageDetails',
    components: {
      default: r => { require(['@/views/user/messageDetails'], r) }
    },
    meta: { title: '消息详情' }
  },
  {
    path: '/userActivity/:storeId/:type?',
    name: 'userActivity',
    components: {
      default: r => { require(['@/views/user/activity'], r) }
    },
    meta: { title: '我的活动' }
  },
  {
    path: '/userCollect/:storeId',
    name: 'userCollect',
    components: {
      default: r => { require(['@/views/user/collect'], r) }
    },
    meta: { title: '我的收藏' }
  },
  {
    path: '/contactList/:storeId',
    name: 'contactList',
    components: {
      default: r => { require(['@/views/user/contactList'], r) }
    },
    meta: { title: '常用联系人' }
  },
  {
    path: '/userCoupon/:storeId',
    name: 'userCoupon',
    components: {
      default: r => { require(['@/views/user/coupon'], r) }
    },
    meta: { title: '我的优惠券' }
  },
  {
    path: '/saveContact/:storeId/:id?/:activityId?',
    name: 'saveContact',
    components: {
      default: r => { require(['@/views/user/saveContact'], r) }
    },
    meta: { title: '编辑联系人' }
  },
  {
    path: '/savePhone/:storeId',
    name: 'savePhone',
    components: {
      default: r => { require(['@/views/user/savePhone'], r) }
    },
    meta: { title: '编辑手机号' }
  },
  {
    path: '/vip/:storeId',
    name: 'vip',
    components: {
      default: r => { require(['@/views/vip/index'], r) }
    },
    meta: { title: 'VIP会员' }
  },
  {
    path: '/orderSucceed/:storeId/:orderId/:orderStatus',
    name: 'orderSucceed',
    components: {
      default: r => { require(['@/views/order/succeed'], r) }
    },
    meta: { title: '订单状态' }
  },
  {
    path: '/orderDetails/:storeId/:orderId',
    name: 'orderDetails',
    components: {
      default: r => { require(['@/views/order/details'], r) }
    },
    meta: { title: '订单详情' }
  },
  {
    path: '/orderComment/:storeId/:orderId',
    name: 'orderComment',
    components: {
      default: r => { require(['@/views/order/comment'], r) }
    },
    meta: { title: '发表评论' }
  },
  {
    path: '/orderHandle/:storeId/:orderId',
    name: 'orderHandle',
    components: {
      default: r => { require(['@/views/order/handle'], r) }
    },
    meta: { title: '改签操作' }
  },
  {
    path: '/applyReplace/:storeId/:orderId',
    name: 'applyReplace',
    components: {
      default: r => { require(['@/views/order/applyReplace'], r) }
    },
    meta: { title: '退款/改签' }
  },
  {
    path: '/orderRefund/:storeId/:orderId',
    name: 'orderRefund',
    components: {
      default: r => { require(['@/views/order/refund'], r) }
    },
    meta: { title: '退款操作' }
  },
  {
    path: '/userReplace/:storeId/:orderId',
    name: 'userReplace',
    components: {
      default: r => { require(['@/views/order/replace'], r) }
    },
    meta: { title: '人员替换' }
  },
  {
    path: '/selectContact/:storeId/:periodId/:activityId',
    name: 'selectContact',
    components: {
      default: r => { require(['@/views/order/selectContact'], r) }
    },
    meta: { title: '添加报名人' }
  },
  {
    path: '/selectCoupon/:storeId/:periodId',
    name: 'selectCoupon',
    components: {
      default: r => { require(['@/views/order/selectCoupon'], r) }
    },
    meta: { title: '选择优惠券' }
  }
]

const router = new Router({
  mode: 'history',
  base: '/',
  scrollBehavior(to, from, savePosition) {
    if (savePosition) {
      return savePosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: routes
})

/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})

export default router

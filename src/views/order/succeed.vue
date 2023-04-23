<template>
  <div class="page">
    <div v-if="orderStatus == 1 && orderInfo" class="code-box">
      <div class="code-text">
        报名成功，你报名了{{ orderInfo.member.length }}人
      </div>
      <ActivityCode
        v-if="orderInfo.t_number"
        :code="orderInfo.t_number"
      />
      <p class="group">活动群</p>
      <img class="code-path" :src="orderInfo.qr_code">
      <div class="code-hint">
        识别二维码加入<span class="high">活动讨论群</span>谨慎接受群友的好友添加请求，避免个人信息泄露及被骚扰。
      </div>
    </div>
    <div v-if="false" class="succeed-box">
      <van-icon name="checked" class="succeed-icon" />
      <div class="succeed-text">报名成功，你报名了1人</div>
      <div class="succeed-hint">分享还可以邀请小伙伴们一起参加哦！</div>
    </div>
    <div v-if="orderStatus == 0 && orderInfo" class="succeed-box">
      <van-icon name="checked" class="succeed-icon" />
      <div v-if="orderInfo" class="succeed-text">
        已提交{{ orderInfo.member.length }}人，待审核中...
      </div>
      <div class="succeed-hint">
        审核通过后才算报名成功哦~ <br>
        分享还可以邀请小伙伴们一起参加哦！
      </div>
    </div>
    <div class="column" @click="onJump('user')">
      <span class="column-left">点击查看我报名的活动</span>
      <van-icon name="arrow" class="icon-arrow" />
    </div>
    <div v-if="orderInfo" class="order-box">
      <div class="order-title">订单信息</div>
      <div class="order-info">
        活动：{{ orderInfo.name }}<br>
        时间：{{ orderInfo.start_time }}<br>
        集合：{{ orderInfo.assembling_place }}<br>
        已报：{{ orderInfo.memberName }}<br>
        提示：请仔细阅读行前须知，如需查看订单详情可在报名系
        统我的-已报名-订单详情中查看。<br>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Icon, Toast } from 'vant'
import { orderDetail } from '@/api/order'
import ActivityCode from './activityCode.vue'

export default {
  name: 'Succeed',
  components: {
    ActivityCode,
    [Icon.name]: Icon
  },
  filters: {},
  data() {
    return {
      storeId: undefined,
      orderId: undefined,
      orderInfo: null,
      orderStatus: 0 //  状态(0未审核1审核通过2审核未通过)
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.orderId = this.$route.params.orderId
    this.orderStatus = this.$route.params.orderStatus
    console.log(this.orderId)
    if (this.orderId) {
      this.initData()
    } else {
      // this.$router.go(-1)
    }
  },
  mounted() {},
  methods: {
    initData() {
      orderDetail({ id: this.orderId }).then(res => {
        if (res.data.code === 1) {
          res.data.data.member = res.data.data.member.map(item => {
            return item.real_name
          })
          res.data.data.memberName = res.data.data.member.join('、')
          this.orderInfo = res.data.data
          console.log(res.data.data)
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    onJump(name) {
      this.$router.replace({
        name: name,
        params: { storeId: this.storeId }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.code-box {
    width: 355px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    margin: 8px auto;
    .code-text {
        color: @theme-color;
        font-size: 18px;
        font-weight: bold;
        margin: 30px 0 22px 0px;
        text-align: center;
    }
    .code-path {
        width: 90px;
        height: 90px;
        margin: 0 auto;
    }
    .code-hint {
        font-size: 12px;
        color: rgba(51, 51, 51, 1);
        line-height: 21px;
        width: 300px;
        margin: 31px auto;
        text-align: center;
        font-weight: bold;
        .high {
            color: @theme-color;
        }
    }

    .group {
        text-align: center;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 8px;
    }
}
.succeed-box {
    width: 355px;
    height: 262px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    margin: 8px auto;
    text-align: center;
    .succeed-icon {
        color: @theme-color;
        font-size: 97px;
        margin: 34px auto 25px auto;
    }
    .succeed-text {
        color: @theme-color;
        font-size: 18px;
        font-weight: bold;
    }
    .succeed-hint {
        color: #666666;
        font-size: 12px;
        margin-top: 18px;
        line-height: 21px;
    }
}
.order-box {
    width: 339px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    margin: 7px auto;
    padding: 0 8px;
    .order-title {
        color: @theme-color;
        border-bottom: 1px solid #eee;
        height: 39px;
        line-height: 39px;
        font-size: 14px;
        padding-left: 10px;
    }
    .order-info {
        padding: 11px 10px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 24px;
    }
}
.column {
    width: 335px;
    padding: 10px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
}
</style>

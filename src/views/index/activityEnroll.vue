<template>
  <div v-if="periodData" class="page">
    <!-- 温馨提示-->
    <div class="part">
      <div class="part-title">
        <div class="title-text">温馨提示</div>
      </div>
      <div class="hint-box">
        活动名称：{{ activityName }}<br>
        活动时间：{{ periodData.start_time
        }}<span
          v-if="periodData.end_time !== periodData.start_time"
        >至{{ periodData.end_time }}</span><br>
        <span class="red">{{ activityHint }}</span><br>
        请填写真实信息，我们将为你投保。
      </div>
    </div>
    <!-- 报名信息-->
    <div class="part">
      <div class="part-title">
        <div class="title-text">报名信息</div>
        <div v-if="contacts.length > 0" class="title-count">
          小计：<span
            class="red"
          >{{ contacts.length }}*{{ periodData.money }}</span>
        </div>
      </div>
      <div class="min-join" v-if="periodData.min_join_count > 0">
        活动最低{{ periodData.min_join_count }}人起报名，请添加{{
          periodData.min_join_count 
        }}名以上出行人
      </div>
      <div class="info-box">
        <div
          v-for="(item, index) in contacts"
          :key="index"
          class="info-item"
        >
          <div class="user-info">
            <span class="name">{{ item.real_name }}</span>
            <img
              v-if="item.is_vip == 1"
              src="@/assets/vip-sel.png"
              class="vip"
            >
            <img v-else src="@/assets/vip.png" class="vip">
            <span class="prove">{{ item.identity_type }}</span>
          </div>
          <van-icon
            name="delete"
            class="icon-delete"
            @click.stop="deleteContacts(index)"
          />
        </div>
        <div class="add-user" @click="onJumpSelect('selectContact')">
          ＋添加出行人
        </div>
      </div>
    </div>
    <!-- 优惠信息-->
    <div v-if="contacts.length > 0" class="part">
      <div class="part-title">
        <div class="title-text">优惠信息</div>
        <div v-if="contactsVipCount > 0" class="title-count">
          小计：<span class="red">{{ totalDiscounts }}元</span>
        </div>
      </div>
      <div class="discounts-box">
        <div class="discounts-item">
          <div class="discounts-name">会员优惠</div>
          <div
            v-if="contactsVipCount > 0"
            class="discounts-count red"
          >
            {{ difference }}元（1人）
          </div>
          <div v-else class="discounts-count red">暂无优惠</div>
        </div>
        <div class="discounts-item">
          <div class="discounts-name">优惠券</div>
          <div
            v-if="couponVal"
            class="discounts-count red"
            @click="onJumpSelect('selectCoupon')"
          >
            满{{ couponVal.enough_money }}元减{{
              couponVal.money
            }}元
          </div>
          <div
            v-else-if="couponList.length > 0"
            class="discounts-count red"
            @click="onJumpSelect('selectCoupon')"
          >
            {{ couponList.length }}张<van-icon name="arrow" />
          </div>
          <div v-else class="discounts-count red">暂无可用</div>
        </div>
      </div>
    </div>
    <!-- 支付方式-->
    <div v-if="contacts.length > 0 && model == 0" class="part">
      <div class="part-title">
        <div class="title-text">支付方式</div>
      </div>
      <div class="pay-box">
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell clickable @click="radio = '1'">
              <template #title>
                <div class="custom-title">微信支付</div>
              </template>
              <template #right-icon>
                <van-radio :name="1" checked-color="#13D1B5" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>
    <!-- 协议-->
    <div v-if="contacts.length > 0" class="agreement">
      <van-checkbox
        v-model="checked"
        checked-color="#13D1B5"
        icon-size="14px"
      >我已阅读并同意
        <span
          class="agreement-text"
          @click.stop="getClause('travel')"
        >《旅游服务协议》</span>
        <span
          class="agreement-text"
          @click.stop="getClause('cost')"
        >《费用说明及退款规则》</span>
      </van-checkbox>
    </div>
    <!-- 支付栏目-->
    <div v-if="contacts.length > 0" class="count-box">
      <div class="count-val">
        总费用：<span class="red">{{ totalPrice | priceFilters }}</span>元
      </div>
      <div class="pay-btn" @click="onSubmit">
        {{ model == 0 ? '立即支付' : '立即报名' }}
      </div>
    </div>
    <!-- 协议弹窗组件 -->
    <clause-view :visible.sync="visible" :content="content" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  Cell,
  CellGroup,
  Radio,
  RadioGroup,
  Icon,
  Checkbox,
  Toast,
  Dialog
} from 'vant'
import {
  getActivityPeriod,
  getActivityCoupon,
  getActivityDetail
} from '@/api/activity'
import { createOrder, createPay } from '@/api/order'
import cache from '@/utils/cache'
import wx from 'weixin-js-sdk'
import { ClauseView } from '@/components'
import { clauseTravelService, clauseCostAndRefund } from '@/api/clause'
import NP from 'number-precision'
export default {
  name: 'Enroll',
  components: {
    [Cell.name]: Cell,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [Checkbox.name]: Checkbox,
    ClauseView
  },
  filters: {
    priceFilters(m) {
      return Number(m.toString().match(/^\d+(?:\.\d{0,2})?/))
    }
  },
  data() {
    return {
      storeId: undefined,
      activityId: undefined,
      periodId: undefined,
      orderId: undefined, // 订单ID
      activityName: null,
      periodData: null, // 详情
      model: undefined,
      contacts: [], // 联系人
      contactsVipCount: 0, // vip人数统计
      contactsCount: 0, // 非vip人数统计
      difference: 0, // 差价
      totalDiscounts: 0, // 优惠总价
      totalPrice: 0, // 总价
      radio: 1,
      checked: true,
      activityHint: null,
      // 协议弹窗
      visible: false,
      content: '',
      // 优惠券
      couponList: [],
      couponVal: null,
      coupon_id: undefined,
      couponMoney: 0
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.activityId = this.$route.params.activityId
    this.periodId = this.$route.params.periodId
    if (this.storeId && this.activityId && this.periodId) {
      this.initData()
      this.getActivityDetail()
    } else {
      this.$router.go(-1)
    }
  },
  mounted() {},
  methods: {
    getActivityDetail() {
      getActivityDetail({ id: this.activityId }).then(res => {
        if (res.data.code === 1) {
          this.activityHint = res.data.data.prompt
          this.activityName = res.data.data.name
          this.model = res.data.data.model
          console.log('活动名称', res.data.data)
        }
      })
    },
    initData() {
      getActivityPeriod({
        id: this.periodId
      }).then(res => {
        if (res.data.code === 1) {
          this.periodData = {
            money: parseFloat(res.data.data.money),
            vip_money: parseFloat(res.data.data.vip_money),
            start_time: res.data.data.start_time.substr(0, 10),
            end_time: res.data.data.end_time.substr(0, 10),
            min_join_count: res.data.data.min_join_count
          }
          this.difference = NP.minus(
            this.periodData.money,
            this.periodData.vip_money
          )
          this.getContacts()
          this.getCoupon(res.data.data.money)
          console.log('详情', res.data)
        }
      })
    },
    // 获取代金券
    getCoupon(money) {
      getActivityCoupon({
        id: this.periodId
      }).then(res => {
        if (res.data.code === 1) {
          for (var i = 0; i < res.data.data.list.length; i++) {
            if (!(money < res.data.data.list[i].enough_money)) {
              this.couponList.push(res.data.data.list[i])
            }
          }
          console.log('优惠券', res.data.data.list)
        }
      })
      var data = cache.getItem(
        'store' +
                    this.storeId +
                    '_period' +
                    this.periodId +
                    '_couponList'
      )
      if (data) {
        this.couponVal = data
        this.coupon_id = data.id
        this.couponMoney = data.money
        this.calculateData()
      }
    },
    // 获取选中的联系人
    getContacts() {
      var data = cache.getItem(
        'store' +
                    this.storeId +
                    '_period' +
                    this.periodId +
                    '_contactsList'
      )
      if (data) {
        this.contacts = data
        for (var i = 0; i < data.length; i++) {
          if (data[i].is_vip === 1) {
            this.contactsVipCount = this.contactsVipCount + 1
          } else {
            this.contactsCount = this.contactsCount + 1
          }
        }
        this.calculateData()
      }
    },
    // 计算金额（普通人数价格 + vip人数价格 - 优惠券折扣）
    // 优惠金额小计（会员优惠+优惠券券）
    calculateData() {
      var count =
                this.contactsVipCount * this.periodData.vip_money +
                this.contactsCount * this.periodData.money -
                this.couponMoney
      var totalDiscounts =
                this.difference * this.contactsVipCount + this.couponMoney
      this.totalPrice = parseFloat(count).toFixed(2)
      console.log(this.contactsVipCount, this.difference)
      this.totalDiscounts = totalDiscounts
    },
    validate() {
      const { min_join_count } = this.periodData
      if (this.model === 0) {
        if (this.contacts.length < min_join_count && min_join_count > 0) {
          Toast(
            `活动最低${min_join_count}人起报名，请添加${min_join_count}名以上出行人`
          )
          return Promise.reject(false)
        }
      }
      return Promise.resolve(true)
    },
    // 创建订单
    async onSubmit() {
      await this.validate()
      if (this.orderId) {
        console.log('有ID', this.orderId)
        this.createPay(this.orderId)
      } else {
        var contacts = this.contacts.map(item => {
          return item.id
        })
        createOrder({
          period_id: this.periodId,
          contacts: JSON.stringify(contacts),
          coupon_id: this.coupon_id
        }).then(res => {
          if (res.data.code === 1) {
            // 进入支付
            this.createPay(res.data.data.order_id)
            this.orderId = res.data.data.order_id // 以防重复提交
          } else {
            Toast.fail(res.data.info)
          }
          console.log(res)
        })
      }
    },
    // 订单支付接口
    createPay(order_id) {
      createPay({
        order_id: order_id,
        pay_type: 1
      }).then(res => {
        if (res.data.code === 1) {
          if (res.data.data.pay) {
            // 清空优惠券
            this.couponVal = ''
            this.coupon_id = undefined
            this.couponMoney = 0
            cache.removeItem(
              'store' +
                                this.storeId +
                                '_period' +
                                this.periodId +
                                '_couponList'
            )
            this.openConfig(res.data.data.pay)
          } else {
            // 返回空表示免费活动，直接跳转到报名完成页
            this.$router.replace({
              name: 'orderSucceed',
              params: {
                storeId: this.storeId,
                orderId: order_id,
                orderStatus: 1
              }
            })
          }
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    openConfig(data) {
      var that = this
      wx.ready(() => {
        wx.checkJsApi({
          jsApiList: data.config.jsApiList,
          success: res => {
            that.openWxPay(data.option)
            console.log('checked api:', res)
          },
          fail: err => {
            Dialog.confirm({
              title: '温馨提示',
              message: '订单已创建，打开微信支付失败'
            }).then(() => {
              that.$router.replace({
                name: 'userActivity',
                params: { storeId: that.storeId, type: 1 }
              })
            })
            console.log('check api fail:', err)
          }
        })
      })
    },
    // 打开微信支付
    openWxPay(data) {
      var that = this
      console.log('进入chooseWXPay', data)
      wx.chooseWXPay({
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: res => {
          // 支付成功后的回调函数
          if (res.errMsg === 'chooseWXPay:ok') {
            Toast.success('支付成功')
            that.$router.replace({
              name: 'orderSucceed',
              params: {
                storeId: that.storeId,
                orderId: that.orderId,
                orderStatus: 1
              }
            })
            console.log('支付成功', res)
          }
        },
        cancel: res => {
          console.log('用户取消支付', res)
        },
        // 支付失败回调函数
        fail: res => {
          Toast.fail('订单已创建，支付失败，请到订')
          console.log('支付失败')
        }
      })
    },
    // 删除出行人, 修改缓存 , 刷新数据
    deleteContacts(index) {
      if (this.coupon_id) {
        Toast('人数发生变化，请重新使用优惠券')
      }
      this.totalPrice = 0
      if (this.contacts[index].is_vip === 1) {
        this.contactsVipCount = this.contactsVipCount - 1
      } else {
        this.contactsCount = this.contactsCount - 1
      }
      this.contacts.splice(index, 1)
      cache.setItem({
        name:
                    'store' +
                    this.storeId +
                    '_period' +
                    this.periodId +
                    '_contactsList',
        value: this.contacts,
        expires: 259200 // 3天
      })
      // 清空优惠券信息
      this.couponVal = ''
      this.coupon_id = undefined
      this.couponMoney = 0
      cache.removeItem(
        'store' +
                    this.storeId +
                    '_period' +
                    this.periodId +
                    '_couponList'
      )
      this.calculateData()
    },
    // 获取协议
    getClause(type) {
      if (type === 'cost') {
        clauseCostAndRefund({}).then(res => {
          console.log(res.data.data)
          if (res.data.code === 1) {
            this.content = res.data.data.explain
            this.visible = true
          }
        })
      } else if (type === 'travel') {
        clauseTravelService({}).then(res => {
          console.log(res.data.data)
          if (res.data.code === 1) {
            this.content = res.data.data.explain
            this.visible = true
          }
        })
      }
    },
    onJumpSelect(name) {
      this.$router.push({
        name: name,
        params: {
          storeId: this.storeId,
          periodId: this.periodId,
          activityId: this.activityId
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.red {
    color: #ff2c35;
}
.part {
    width: 335px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    margin: 14.5px auto;
    padding: 0 10px;
    .part-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 39px;
        border-bottom: 1px solid #eee;
        .title-text {
            color: @theme-color;
            font-size: 14px;
            font-weight: 500;
            padding-left: 10px;
        }
        .title-count {
            font-size: 14px;
            color: #666;
            padding-right: 10px;
        }
    }
}
.hint-box {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 24px;
    padding: 10px;
}

.min-join {
    height: 32px;
    background-color: #ffd4d5;
    color: #fd3a3e;
    line-height: 32px;
    padding-left: 12px;
    font-size: 14px;
}
.info-box {
    padding: 10px 10px 20px 10px;
    .info-item {
        height: 40px;
        background: rgba(246, 247, 249, 1);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
        padding: 0 10px;
        .user-info {
            display: flex;
            align-items: center;
            .name {
                font-size: 14px;
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
                margin-right: 10px;
            }
            .vip {
                width: 42px;
                margin-right: 10px;
            }
            .prove {
                color: @theme-color;
                border: 1px solid @theme-color;
                padding: 0px 5px;
                border-radius: 5px;
            }
        }
        .icon-delete {
            font-size: 18px;
            color: #999998;
        }
    }
    .add-user {
        width: 314px;
        height: 40px;
        line-height: 40px;
        background: rgba(246, 247, 249, 1);
        border-radius: 6px;
        text-align: center;
        font-size: 14px;
        color: #333;
    }
}
.discounts-box {
    .discounts-item {
        height: 37px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        padding: 0 10px;
        &:last-child {
            border-bottom: none;
        }
        .discounts-name {
            font-size: 12px;
            color: #333333;
        }
        .discounts-count {
            display: flex;
            align-items: center;
            font-size: 12px;
        }
    }
}
.pay-box {
    .custom-title {
        font-size: 12px;
        color: #333;
    }
}
.agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
    color: #999999;
    margin-bottom: 70px;
    .agreement-text {
        color: @theme-color;
    }
}
.count-box {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 11;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 46px;
    background: rgba(255, 255, 255, 1);
    .count-val {
        font-size: 12px;
        color: #999;
        line-height: 21px;
        width: 120px;
        .red {
            font-size: 15px;
            font-weight: bold;
        }
    }
    .pay-btn {
        width: 180px;
        height: 38px;
        background: @theme-color;
        border-radius: 19px;
        line-height: 38px;
        text-align: center;
        margin-left: 21px;
        font-size: 16px;
        color: #fff;
    }
}
</style>

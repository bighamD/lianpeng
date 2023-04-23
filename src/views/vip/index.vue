<template>
  <div v-if="storeData" class="page">
    <div class="head-box">
      <svg-icon slot="vip" icon-class="vip" class="icon-bg" />
      <div class="merchant-name">{{ storeData.store_name }}</div>
      <div class="head-title">
        <svg-icon slot="vip" icon-class="vip" class="icon-vip" />VIP会员
      </div>
      <div v-if="userData.vip === 0 && !is_past" class="head-money">{{ '限时' + storeData.vip_money_discounts }}{{ storeData.vip_open_duration == 0 ? '元/永久' : '元/' + storeData.vip_open_duration + '个月' }}</div>
      <div v-else-if="!is_past" class="head-money">{{ userData.name + '：' +userData.phone }}</div>
      <div v-else class="head-money">{{ storeData.vip_money }}{{ storeData.vip_open_duration == 0 ? '元/永久' : '元/' + storeData.vip_open_duration + '个月' }}</div>
      <div class="head-btns">
        <div class="rule" @click="getClause('rule')">权益规则<van-icon name="question-o" class="icon-question" /></div>
        <div v-if="userData.vip === 0" class="go-open" @click="show = true">立即开通<van-icon name="arrow" class="icon-right" /></div>
        <div v-else class="expire">{{ userData.vip_time ? userData.vip_time + '到期' : '永久会员' }}</div>
      </div>
    </div>
    <div class="equity-box">
      <div class="box-title">成为会员 尊享权益</div>
      <div class="equity-item">
        <svg-icon slot="vip1" icon-class="vip1" class="icon-equity" />
        <div class="equity-content">
          <div class="equity-slogan">专属特权</div>
          <div class="equity-title">会员专属活动，仅会员可参加或优先参加</div>
        </div>
      </div>
      <div class="equity-item">
        <svg-icon slot="vip2" icon-class="vip2" class="icon-equity" />
        <div class="equity-content">
          <div class="equity-slogan">活动特价</div>
          <div class="equity-title">享受活动特别优惠价格</div>
        </div>
      </div>
      <div class="equity-item">
        <svg-icon slot="vip3" icon-class="vip3" class="icon-equity" />
        <div class="equity-content">
          <div class="equity-slogan">推广返利<small>(即将上线)</small></div>
          <div class="equity-title">推广活动、获取返利</div>
        </div>
      </div>
    </div>
    <div class="coupon-box">
      <div class="box-title">会员开通礼包</div>
      <div v-for="(item, index) in couponList" :key="index" class="coupon-item">
        <div class="coupon-content">满{{ item.enough_money }}减{{ item.money }}券</div>
        <div v-if="userData.vip === 0" class="coupon-count">{{ item.number }}张</div>
        <div v-else class="coupon-count">已发放至我的-优惠券</div>
      </div>
    </div>
    <div class="agreement-box"> <van-checkbox v-model="checked" checked-color="#4C4845" icon-size="14px">我已阅读并同意<span class="agreement-text" @click.stop="getClause('agreement')">《会员服务协议》</span></van-checkbox></div>
    <div v-if="userData.vip === 0" class="buy-box">
      <div v-if="false" class="time">疯抢进行中，距结束：<van-count-down :time="time" format="DD 天 HH 时 mm 分 ss 秒" /></div>
      <div class="return-btn" @click="onJump('user')">
        <svg-icon slot="return" icon-class="gotop" class="icon-return" />
        返回上一页
      </div>
      <div class="money-box" @click="show = true">
        <div class="money-l">
          <div v-if="is_past" class="year-money">
            ¥<span class="big">{{ storeData.vip_money }}</span>{{ storeData.vip_open_duration == 0 ? '/永久' : '/' + storeData.vip_open_duration + '个月' }}
          </div>
          <div v-else class="year-money">
            ¥<span class="big">{{ storeData.vip_money_discounts }}</span>{{ storeData.vip_open_duration == 0 ? '/永久' : '/' + storeData.vip_open_duration + '个月' }}
            <span class="small">¥{{ storeData.vip_money }}元</span>
          </div>
        </div>
        <div class="money-r">{{ is_past ? '点击购买' : '限时抢购' }} </div>
      </div>
    </div>
    <van-popup v-model="show" position="bottom" closeable :close-on-click-overlay="false" @close="emptyData">
      <div class="form-box">
        <div class="form-title">VIP会员资料填写</div>
        <van-field v-model="name" label="姓名" type="text" placeholder="请输入姓名" />
        <van-field v-model="phone" label="手机号码" type="tel" placeholder="请输入手机号" />
        <van-field v-model="sms" center clearable label="短信验证码" type="number" placeholder="请输入短信验证码">
          <template #button>
            <div v-if="showCountDown" class="set-code" @click="getAuthCode">{{ codeText }}</div>
            <div v-else class="set-code">{{ count }}'s获取</div>
          </template>
        </van-field>
        <div class="form-btn">
          <div v-if="storeData" class="money-box" @click="onPay">
            <div class="money-l">
              <div v-if="is_past" class="year-money">
                ¥<span class="big">{{ storeData.vip_money }}</span>{{ storeData.vip_open_duration == 0 ? '/永久' : '/' + storeData.vip_open_duration + '个月' }}
              </div>
              <div v-else class="year-money">
                ¥<span class="big">{{ storeData.vip_money_discounts }}</span>{{ storeData.vip_open_duration == 0 ? '/永久' : '/' + storeData.vip_open_duration + '个月' }}
                <span class="small">¥{{ storeData.vip_money }}元</span>
              </div>
            </div>
            <div class="money-r">{{ is_past ? '确认购买' : '限时抢购' }} </div>
          </div>
          <div class="agreement">
            <van-checkbox v-model="checked" checked-color="#4C4845" icon-size="14px" label-disabled>我已阅读并同意
              <span class="agreement-text" @click.stop="getClause('agreement')">《会员服务协议》</span>
            </van-checkbox>
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 协议弹窗组件 -->
    <clause-view :visible.sync="visible" :content="content" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Icon, Checkbox, Popup, Field, CountDown, Toast } from 'vant'
import { applyVip } from '@/api/vip'
import { storeDetails, vipCoupon } from '@/api/store'
import { getSms } from '@/api/common'
import { pastDue } from '@/utils/index'
import wx from 'weixin-js-sdk'
import { ClauseView } from '@/components'
import { clauseVipEquity, clauseVipService } from '@/api/clause'

export default {
  name: 'Vip',
  components: {
    [Icon.name]: Icon,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [CountDown.name]: CountDown,
    [Checkbox.name]: Checkbox,
    ClauseView
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      checked: true,
      show: false, // 弹窗
      phone: '',
      sms: '',
      name: '',
      time: 1000000000,
      storeData: null,
      couponList: [],
      is_past: false, // 优惠是否过期
      // 验证码
      codeText: '发送验证码',
      showCountDown: true, // 是否显示倒计时
      count: '', // 倒计时计数
      timer: null, // 时间方法
      // 协议弹窗
      visible: false,
      content: ''
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
    this.getStoreData()
    this.phone = this.userData.phone || ''
  },
  methods: {
    getStoreData() {
      storeDetails({}).then(res => {
        console.log(res.data.data)
        this.storeData = res.data.data
        var timeVal = res.data.data.vip_time_limit.replace(/-/g, '/')
        this.time = new Date(timeVal).getTime() / 1000
        this.is_past = pastDue(res.data.data.vip_time_limit) // 是否过期
        console.log(this.is_past)
      })
      vipCoupon({}).then(res => {
        this.couponList = res.data.data.list
        console.log(res.data.data)
      })
    },
    onPay() {
      if (!this.name) {
        Toast('请输入姓名')
        return false
      } else if (!/^1\d{10}$/.test(this.phone.replace(/(^\s*)|(\s*$)/g, ''))) {
        Toast('请输入正确的手机号')
        return false
      } else if (!this.sms) {
        Toast('验证码不能为空')
        return false
      } else {
        applyVip({
          code: this.sms,
          name: this.name
        }).then(res => {
          if (res.data.code === 1) {
            this.openConfig(res.data.data.pay)
          } else {
            Toast.fail(res.data.info)
          }
        })
      }
    },
    openConfig(data) {
      var that = this
      console.log('进入config', data)
      wx.config(data.config)
      wx.ready(() => {
        wx.checkJsApi({
          jsApiList: data.config.jsApiList,
          success: res => {
            that.openWxPay(data.option)
            console.log('checked api:', res)
          },
          fail: err => {
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
        'appId': data.appId,
        'timestamp': data.timeStamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        success: res => {
          // 支付成功后的回调函数
          Toast.success('支付成功')
          that.emptyData()
          // 重新获取用户数据
          that.$store.dispatch('user/getUserData')
          console.log(res)
        },
        cancel: res => {
          console.log(res)
        }
      })
    },
    // 获取验证码
    getAuthCode() {
      // 获取验证码
      var that = this
      var phone = this.phone ? this.phone.replace(/(^\s*)|(\s*$)/g, '') : ''
      if (!/^1\d{10}$/.test(phone)) {
        Toast('请输入正确的手机号')
      } else {
        this.codeText = '正在发送'
        getSms({
          'phone': phone
        }).then(res => {
          if (res.data.code === 0) {
            that.countDown()
          } else {
            this.codeText = '发送验证码'
            Toast(res.data.msg)
          }
        })
      }
    },
    // 倒计时
    countDown() {
      var that = this
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.showCountDown = false
        that.timer = setInterval(() => {
          if (that.count > 0 && that.count <= TIME_COUNT) {
            that.count--
          } else {
            that.codeText = '发送验证码'
            that.showCountDown = true
            clearInterval(that.timer)
            that.timer = null
          }
        }, 1000)
      }
    },
    // 清空数据
    emptyData() {
      this.show = false
      this.codeText = '发送验证码'
      this.showCountDown = true // 是否显示倒计时
      this.count = '' // 倒计时计数
      this.timer = null // 时间方法
    },
    // 获取协议
    getClause(type) {
      if (type === 'rule') {
        clauseVipEquity({}).then(res => {
          if (res.data.code === 1) {
            this.content = res.data.data.explain
            this.visible = true
          }
        })
      } else if (type === 'agreement') {
        clauseVipService({}).then(res => {
          if (res.data.code === 1) {
            console.log(res.data.data)
            this.content = res.data.data.explain
            this.visible = true
          }
        })
      }
    },
    onJump(name) {
      this.$router.push({
        name: name,
        params: { storeId: this.storeId }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .head-box{
    position: relative;
    width:343px;
    height:130px;
    background:rgba(76,72,69,1);
    border-radius: 10px;
    margin: 16.5px auto 0 auto;
    overflow: hidden;
    .icon-bg{
      position: absolute;
      z-index: 9;
      color: #47423F;
      font-size: 220px;
      right: -20px;
      top: -40px;
    }
    .merchant-name{
      position: absolute;
      z-index: 10;
      color: #FFFFFF;
      font-size: 11px;
      right: 20px;
      top: 20px;
    }
    .head-title{
      display: flex;
      align-items: center;
      font-size:18px;
      font-weight:bold;
      font-family:PingFang SC;
      color: #EBCEA0;
      line-height:21px;
      margin-left: 10px;
      margin-top: 10px;
      .icon-vip{
        font-size: 40px;
      }
    }
    .head-money{
      margin-left: 18px;
      font-size: 11px;
      color: #EBCEA0;
    }
    .head-btns{
      position: absolute;
      z-index: 11;
      bottom: 20px;
      left: 5%;
      width: 90%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .rule{
        color: #B8B5AF;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-question{
          font-size: 14px;
          padding-left: 6px;
        }
      }
      .go-open{
        width:71px;
        height:23px;
        background:rgba(235,206,160,1);
        border-radius:11px;
        font-size:11px;
        font-weight:500;
        color:rgba(68,64,61,1);
        line-height:23px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .expire{
        color: #B8B5AF;
        font-size: 11px;
      }
    }
  }
  .box-title{
    font-size:18px;
    font-weight:bold;
    color:rgba(76,72,69,1);
    padding: 20px 0;
  }
  .equity-box{
    position: relative;
    top: -8px;
    background: #fff;
    padding: 2px 20px;
    z-index: 10;
    .equity-item{
      display: flex;
      align-items: center;
      padding: 0 13px 16px;
      .icon-equity{
        font-size: 40px;
        margin-right: 10px;
      }
      .equity-content{
        color: #3E404D;
        .equity-slogan{
          font-weight: bold;
          font-size:14px;
        }
        .equity-title{
          margin-top: 3px;
          font-size:12px;
        }
      }
    }
  }
  .coupon-box{
    background: #fff;
    padding: 2px 20px 10px 20px;
    margin-bottom: 20px;
    .coupon-item{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      .coupon-content{
        font-size:12px;
        color:rgba(76,72,69,1);
      }
      .coupon-count{
        font-size:12px;
        color:rgba(76,72,69,1);
      }
    }
  }
  .buy-box{
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    /*height: 136px;*/
    height: 56px;
    background: #fff;
    display: flex;
    align-items: center;
    .time{
      text-align: center;
      color:rgba(76,72,69,1);
      font-size:12px;
      padding: 6px 0;
    }
    .return-btn{
      width: 60px;
      text-align: center;
      margin-left: 10px;
      color: #999;
      font-size: 10px;
      .icon-return{
        font-size: 22px;
        display: block;
        margin: 0 auto 4px auto;
      }
    }
    .money-box{
      width:265px;
      height:43px;
      background:rgba(76,72,69,1);
      border-radius:21px;
      display: flex;
      align-items: center;
      margin: 0 auto;
      .money-l{
        width: 167px;
        color: #EFE3C1;
        text-align: center;
        .year-money{
          font-size: 12px;
          .big{
            font-size: 22px;
          }
          .small{
            font-size: 11px;
            text-decoration: line-through;
            padding-left: 7px;
          }
        }
      }
      .money-r{
        width:128px;
        height:43px;
        text-align: center;
        line-height: 43px;
        font-size:18px;
        font-family:PingFang SC;
        font-weight:bold;
        background:linear-gradient(90deg,rgba(239,219,192,1),rgba(224,203,150,1));
        border-radius: 0 21px 21px 0;
      }
    }
  }
  .agreement-box{
    display: flex;
    align-items: center;
    padding: 0 10px 20px 20px;
    color: #999999;
    margin-bottom: 100px;
    .agreement-text{
      color: #BFA676;
    }
  }
  .form-box{
    font-size:18px;
    font-weight:bold;
    color:rgba(76,72,69,1);
    padding: 20px 20px 0 20px;
    .form-title{
      line-height:45px;
    }
    .set-code{
      color: #FF4144;
      font-size:14px;
    }
    .form-btn{
      margin-top: 20px;
      .money-box{
        width:295px;
        height:43px;
        background:rgba(76,72,69,1);
        border-radius:21px;
        display: flex;
        align-items: center;
        margin: 0 auto;
        .money-l{
          width: 167px;
          color: #EFE3C1;
          text-align: center;
          .year-money{
            font-size: 12px;
            .big{
              font-size: 22px;
            }
            .small{
              font-size: 11px;
              text-decoration: line-through;
              padding-left: 7px;
            }
          }
        }
        .money-r{
          width:128px;
          height:43px;
          text-align: center;
          line-height: 43px;
          font-size:18px;
          font-family:PingFang SC;
          font-weight:bold;
          background:linear-gradient(90deg,rgba(239,219,192,1),rgba(224,203,150,1));
          border-radius: 0 21px 21px 0;
        }
      }
      .agreement{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0;
        font-size: 11px;
        color: #999999;
        .agreement-text{
          color: #BFA676;
        }
      }
    }
  }
  .van-field{
    padding: 10px 0;
  }
  .van-cell:not(:last-child)::after{
    width: 100%;
    left: 0;
  }
</style>

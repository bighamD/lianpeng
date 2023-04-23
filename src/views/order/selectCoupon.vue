<template>
  <div class="page">
    <van-radio-group v-model="couponVal" class="coupon-list">
      <div v-for="(item, index) in couponList" :key="'list' + index" :class="['coupon-item', money < item.enough_money ? 'sel' : '' ]">
        <div v-if="!(money < item.enough_money)" class="coupon-main">
          <div class="coupon-price">
            <div class="price-val"><span class="small">¥</span>{{ item.money | moneyFilers }}</div>
            <div class="price-text">优惠券</div>
          </div>
          <van-radio class="coupon-info" :name="item" :disabled="money < item.enough_money">
            <template #icon="props">
              <van-icon v-if="props.checked" name="checked" class="icon-select" />
              <van-icon v-else name="passed" class="icon-select pass" />
              <div class="coupon-info-box">
                <p>{{ item.money }}元代金券</p>
                <p>活动单价{{ item.enough_money }}以上可用</p>
                <p>{{ item.start_time | timeFilers }}~{{ item.end_time | timeFilers }}内有效</p>
              </div>
            </template>
          </van-radio>
        </div>
        <div v-if="!(money < item.enough_money)" class="coupon-explain" @click="item.show = !item.show">
          <div class="coupon-explain-content">{{ item.show ? item.explain : '优惠券说明' }}</div>
          <van-icon v-if="item.show" name="arrow-up" class="icon-explain" />
          <van-icon v-else name="arrow-down" class="icon-explain" />
        </div>
      </div>
    </van-radio-group>
    <div class="save-btn" @click="onSave()">确定</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import cache from '@/utils/cache'
import { Tab, Tabs, Image, RadioGroup, Radio, Icon } from 'vant'
import { getActivityCoupon, getActivityPeriod } from '@/api/activity'
export default {
  name: 'SelectCoupon',
  components: {
    [Tab.name]: Tab,
    [Image.name]: Image,
    [Icon.name]: Icon,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Tabs.name]: Tabs
  },
  filters: {
    moneyFilers(val) {
      return parseInt(val)
    },
    timeFilers(time) {
      return time.substr(0, 11).replace(/-/g, '/')
    }
  },
  data() {
    return {
      storeId: undefined,
      periodId: undefined,
      couponList: [],
      couponVal: null,
      money: 0
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.periodId = this.$route.params.periodId
  },
  mounted() {
    this.getList()
    this.initData()
  },
  methods: {
    initData() {
      getActivityPeriod({
        id: this.periodId
      }).then(res => {
        if (res.data.code === 1) {
          this.money = parseFloat(res.data.data.money)
          console.log('money', this.money)
        }
      })
    },
    getList() {
      getActivityCoupon({
        id: this.periodId
      }).then(res => {
        if (res.data.code === 1) {
          this.couponList = res.data.data.list.map(item => {
            item.enough_money = parseFloat(item.enough_money)
            item.money = parseFloat(item.money)
            item.show = false
            return item
          })
          console.log('优惠券', this.couponList)
        }
      })
    },
    onSave() {
      if (this.couponVal) {
        cache.setItem({
          name: 'store' + this.storeId + '_period' + this.periodId + '_couponList',
          value: this.couponVal,
          expires: 259200 // 3天
        })
        this.$router.go(-1)
      } else {
        this.$router.go(-1)
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
  .coupon-list{
    padding: 12px 10px 60px 10px;
    .coupon-item{
      width: 355px;
      display: block;
      overflow: inherit;
      border-radius:6px;
      background: #fff;
      margin-bottom: 12px;
      &.sel{
        .coupon-price{
          background: #999;
        }
      }
      .coupon-main{
        display: flex;
        position: relative;
        &:before{
          content: '';
          position: absolute;
          z-index: 9;
          width: 10px;
          height: 10px;
          background: #eee;
          border-radius: 50%;
          bottom: -5px;
          left: -5px;
        }
        &:after{
          content: '';
          position: absolute;
          z-index: 9;
          width: 10px;
          height: 10px;
          background: #eee;
          border-radius: 50%;
          bottom: -5px;
          right: -5px;
        }
        .coupon-status-icon{
          position:absolute;
          right: 20px;
          top: 20px;
          font-size: 50px;
        }
      }
      .coupon-price{
        position: relative;
        width:92px;
        height:94px;
        background: @theme-color;
        text-align: center;
        border-radius: 6px 0 0 0;
        &:before{
          content: '';
          position: absolute;
          z-index: 9;
          width: 10px;
          height: 10px;
          background: #eee;
          border-radius: 50%;
          bottom: -5px;
          right: -5px;
        }
        &:after{
          content: '';
          position: absolute;
          z-index: 9;
          width: 10px;
          height: 10px;
          background: #eee;
          border-radius: 50%;
          top: -5px;
          right: -5px;
        }
        .price-val{
          color: #fff;
          font-size:36px;
          font-weight: 800;
          padding-top: 10px;
          .small{
            font-size:15px;
            font-weight: bold;
            padding-right: 5px;
          }
        }
        .price-text{
          color: #fff;
          font-size: 12px;
          font-weight: bold;
        }
      }
      .coupon-info{
        position: relative;
        width: 235px;
        height: 70px;
        padding: 20px 14px 0 14px;
        color: #999;
        display: block;
        .coupon-info-box{
          font-size: 11px;
          line-height: 20px;
        }
        .icon-select{
          position: absolute;
          right: 20px;
          top: 50%;
          margin-top: -10px;
          background: none;
          color: @theme-color;
          border: none;
          font-size: 22px;
          &.pass{
            color: #888;
          }
        }
      }
      .coupon-explain{
        border-top: 1px dashed #D6D6D6;
        display: flex;
        justify-content: space-between;
        padding: 12px 14px;
        .coupon-explain-content{
          font-size:11px;
          color: #666;
          width: 300px;
          line-height: 18px;
        }
        .icon-explain{
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  .van-radio__icon{
    height: auto;
  }
  .save-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height:46px;
    line-height: 46px;
    text-align: center;
    font-size:18px;
    background: @theme-color;
    color: #fff;
    z-index: 10;
  }
</style>

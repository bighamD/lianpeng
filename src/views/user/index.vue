<template>
  <div v-if="userData" class="page">
    <div :class="['head-box', userData.vip === 1 ? 'small-head' : '']">
      <div class="user-box" @click="onJump('userInfo')">
        <div class="user-content">
          <van-image class="cover-img" :src="userData.headimgurl" fit="cover" round />
          <div class="user-info">
            <div class="name">{{ userData.nickname }}
              <img v-if="userData.vip == 1" src="@/assets/vip-sel.png" class="vip" @click.stop="onJump('vip')">
              <img v-else src="@/assets/vip.png" class="vip" @click.stop="onJump('vip')">
            </div>
            <div class="signature">{{ userData.personalized || '放弃不难，但坚持很酷' }}</div>
          </div>
        </div>
        <van-icon name="arrow" class="icon-right" />
      </div>
      <div v-if="userData.vip === 0" class="vip-box" @click="onJump('vip')">
        <div class="vip-slogan"><svg-icon slot="vip" icon-class="vip" class="icon-vip" />开通VIP会员报名享优惠</div>
        <div class="vip-btn">立刻开通<van-icon name="arrow" class="icon-vip-right" /></div>
      </div>
    </div>
    <div class="order-box">
      <div class="order-title" @click="onJump('userActivity')">
        <span class="order-title-l">我的活动</span>
        <span class="order-title-r">查看全部活动<van-icon name="arrow" class="order-title-icon" /></span>
      </div>
      <div class="order-nav">
        <div class="order-nav-item" @click="onJumpOrder(1)">
          <svg-icon slot="order1" icon-class="order1" class="order-nav-icon" />
          <span class="nav-title">待支付</span>
        </div>
        <div class="order-nav-item" @click="onJumpOrder(2)">
          <svg-icon slot="order2" icon-class="order2" class="order-nav-icon" />
          <span class="nav-title">已报名</span>
        </div>
        <div class="order-nav-item" @click="onJumpOrder(3)">
          <svg-icon slot="order3" icon-class="order3" class="order-nav-icon" />
          <span class="nav-title">已退出</span>
        </div>
        <div class="order-nav-item" @click="onJumpOrder(4)">
          <svg-icon slot="order4" icon-class="order4" class="order-nav-icon" />
          <span class="nav-title">评价</span>
        </div>
      </div>
      <!--已报名-->
      <div v-if="list.length > 0" class="order-list">
        <div v-for="(item, index) in list" :key="'list' + index" class="order-item" @click="onJumpDetails(item.activity_id)">
          <van-image class="cover-img" :src="item.banner" fit="cover" radius="6" />
          <div class="order-data">
            <div class="order-item-title">{{ item.name }}</div>
            <div class="order-item-info">
              <span>{{ item.start_time | timeFilers }}</span>
              <span>{{ item.area }} </span>
            </div>
            <div class="order-data-footer">
              <div class="order-hint" />
              <div class="order-btns">
                <div v-if="item.status == 1" class="order-btn" @click.stop="onJumpSucceed(item.audit, item.id)">活动须知</div>
                <div class="order-btn" @click.stop="onJumpHandle('orderDetails', item.id)">订单详情</div>
                <div v-if="item.status == 1" class="order-btn" @click.stop="onJumpHandle('applyReplace', item.id)">改签/退出</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="nav-box">
      <van-cell title="优惠券" is-link @click="onJump('userCoupon')">
        <template #icon>
          <svg-icon slot="coupon" icon-class="coupon" class="icon-nav" />
        </template>
      </van-cell>
      <van-cell title="收藏夹" is-link @click="onJump('userCollect')">
        <template #icon>
          <svg-icon slot="collect" icon-class="collect" class="icon-nav" />
        </template>
      </van-cell>
      <van-cell title="投诉反馈" is-link @click="onJump('complaint')">
        <template #icon>
          <svg-icon slot="feedback" icon-class="feedback" class="icon-nav" />
        </template>
      </van-cell>
      <van-cell title="关于我们" is-link @click="onJump('aboutUs')">
        <template #icon>
          <svg-icon slot="about" icon-class="about" class="icon-nav" />
        </template>
      </van-cell>
    </div>
    <div class="copyright">
      脸盆科技提供技术支持
    </div>
  </div>
</template>

<script>
import { Cell, Icon, Image, CountDown } from 'vant'
import { mapGetters } from 'vuex'
import { getList } from '@/api/order'

export default {
  name: 'User',
  components: {
    [Cell.name]: Cell,
    [Image.name]: Image,
    [CountDown.name]: CountDown,
    [Icon.name]: Icon
  },
  filters: {
    timeFilers(time) {
      return time ? time.substr(5, 6).replace(/-/, '/') : ''
    }
  },
  data() {
    return {
      storeId: undefined,
      list: []
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.getOrderList()
  },
  mounted() {
  },
  methods: {
    getOrderList() {
      getList({ status: 1, pagesize: 2, page: 1 }).then(res => {
        this.list = res.data.data.list
        console.log(res.data.data.list)
      })
    },
    onJump(name) {
      this.$router.push({
        name: name,
        params: { storeId: this.storeId }
      })
    },
    onJumpDetails(key) {
      this.$router.push({
        name: 'activityDetails',
        params: { storeId: this.storeId, activityId: key }
      })
    },
    onJumpOrder(type) {
      this.$router.push({
        name: 'userActivity',
        params: { storeId: this.storeId, type: type }
      })
    },
    onJumpHandle(name, id) {
      this.$router.push({
        name: name,
        params: { storeId: this.storeId, orderId: id }
      })
    },
    onJumpSucceed(status, orderId) {
      console.log(status, orderId)
      this.$router.push({
        name: 'orderSucceed',
        params: { storeId: this.storeId, orderId: orderId, orderStatus: status }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .head-box{
    position: relative;
    background: url("../../assets/user-top.png") no-repeat bottom @theme-color;
    background-size: 100%;
    height: 180px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    &.small-head{
      height: 120px;
      .user-box{
        margin-bottom: 0;
      }
    }
    .user-box{
      width: 340px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 auto 30px auto;
      .user-content{
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .cover-img{
        width:60px;
        height:60px;
        margin-right: 13px;
        border-radius: 50%;
      }
      .user-info{
        color: #fff;
        .name{
          display: flex;
          align-items: center;
          font-size:18px;
          font-weight: bold;
          .vip{
            width: 45px;
            margin-left: 5px;
          }
        }
        .signature{
          margin-top: 5px;
          font-size:11px;
        }
      }
      .icon-right{
        font-size: 26px;
        color: #fff;
        margin-right: 10px;
      }
    }
    .vip-box{
      position: absolute;
      bottom: 0;
      background: #4C4845;
      width: 311px;
      height: 50px;
      border-radius:6px 6px 0 0;
      left: 50%;
      margin-left: -335/2px;
      color: #EBCEA0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      .icon-vip{
        font-size: 32px;
      }
      .vip-slogan{
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        width: 200px;
      }
      .vip-btn{
        width:71px;
        height:23px;
        background: #EBCEA0;
        color: #44403D;
        font-size: 11px;
        text-align: center;
        line-height: 23px;
        border-radius:11px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .order-box{
    background: #fff;
    margin-bottom: 12.5px;
    padding: 0 12.5px 12.5px 12.5px;
    .order-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      border-bottom: 1px solid #eee;
      padding:0 10px;
      .order-title-l{
        font-size:15px;
        font-weight:bold;
        color: #333;
      }
      .order-title-r{
        font-size:11px;
        color: #666;
        display: flex;
        align-items: center;
        .order-title-icon{
          font-size: 10px;
        }
      }
    }
    .order-nav{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 10px 0 10px;
      .order-nav-item{
        text-align: center;
        .order-nav-icon{
          display: block;
          font-size: 34px;
        }
        .nav-title{
          display: block;
          color: #42434E;
          font-size: 12px;
        }
      }
    }
    .order-list{
      position: relative;
      background: #F6F6F6;
      margin-top: 18px;
      padding: 0 8px;
      border-radius:6px;
      &.pay{
        &:before{
          width:0; height:0; font-size:0;border-style:solid;overflow:hidden; position:absolute;
          content: '';border-width:15px;border-color:transparent transparent #F6F6F6 transparent;left:12px; top:-28px;
        }
      }
      &:before{
        width:0; height:0; font-size:0;border-style:solid;overflow:hidden; position:absolute;
        content: '';border-width:15px;border-color:transparent transparent #F6F6F6 transparent;left:112px; top:-28px;
      }
      .order-item {
        border-bottom: 1px solid #eee;
        padding: 10px 0;
        display: flex;
        &:last-child{
          border-bottom: none;
        }
        .cover-img {
          height: 80px;
          width: 80px;
          border-radius: 6px;
          margin-right: 13px;
        }
        .order-data{
          position: relative;
          padding-bottom: 20px;
          height: 56px;
        }
        .order-item-title{
            font-size:14px;
            width: 230px;
            color: #333;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
        }
        .order-item-info{
          width: 240px;
          font-size: 11px;
          margin-top: 5px;
          color: #999;
          span{
            margin-right: 20px;
          }
        }
        .order-data-footer{
          position:absolute;
          width: 100%;
          right: 0;
          bottom: 0;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .order-hint{
          color: #FF2C36;
          font-size: 10px;
          .order-hint-text{
            color: #FF2C36;
            font-size: 10px;
            display: inline-block;
          }
          &.gary{
            color: #999999;
          }
          text-align: left;
        }
        .order-btns{
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .order-btn{
            width:60px;
            height:20px;
            line-height: 20px;
            border:1px solid @theme-color;
            border-radius:10px;
            color: @theme-color;
            margin-left: 8px;
            text-align: center;
            font-size: 11px;
            &.gray{
              color: #999999;
              border: 1px solid #999999;
            }
          }
        }
      }
    }
  }
  .nav-box{
    color: #42434e;
    .icon-nav{
      font-size: 22px;
      margin: 0 5px;
    }
  }
  .copyright{
    text-align: center;
    color: #999999;
    padding: 30px 0 100px;
    font-size: 11px;
  }
</style>

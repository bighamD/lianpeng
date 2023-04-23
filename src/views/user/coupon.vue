<template>
  <div class="page">
    <van-tabs v-model="active" color="#13D1B5" title-active-color="#13D1B5" line-height="2px" @change="getList()" @rendered="getList()">
      <van-tab title="未使用">
        <div v-if="list.length > 0" class="coupon-list">
          <div v-for="(item, index) in list" :key="'list' + index" class="coupon-item">
            <div class="coupon-main">
              <div class="coupon-price">
                <div class="price-val"><span class="small">¥</span>{{ item.money | moneyFilers }}</div>
                <div class="price-text">优惠券</div>
              </div>
              <div class="coupon-info">
                <p>{{ item.money }}元代金券</p>
                <p>活动单价{{ item.enough_money }}以上可用</p>
                <p>{{ item.start_time | timeFilers }}~{{ item.end_time | timeFilers }}内有效</p>
              </div>
            </div>
            <div class="coupon-explain" @click="item.show = !item.show">
              <div class="coupon-explain-content">{{ item.show ? item.explain : '优惠券说明' }}</div>
              <van-icon v-if="item.show" name="arrow-up" class="icon-explain" />
              <van-icon v-else name="arrow-down" class="icon-explain" />
            </div>
          </div>
        </div>
        <div v-else class="order-list-null">
          <img src="@/assets/list-null.png">
          <div class="order-list-null-text">这里什么都还没有哦～</div>
        </div>
      </van-tab>
      <van-tab title="已使用">
        <div v-if="list1.length > 0" class="coupon-list">
          <div v-for="(item, index) in list1" :key="'list1' + index" class="coupon-item sel">
            <div class="coupon-main">
              <svg-icon slot="use" icon-class="use" class="coupon-status-icon" />
              <div class="coupon-price">
                <div class="price-val"><span class="small">¥</span>{{ item.money | moneyFilers }}</div>
                <div class="price-text">优惠券</div>
              </div>
              <div class="coupon-info">
                <p>{{ item.money }}元代金券</p>
                <p>活动单价{{ item.enough_money }}以上可用</p>
                <p>{{ item.start_time | timeFilers }}~{{ item.end_time | timeFilers }}内有效</p>
              </div>
            </div>
            <div class="coupon-explain" @click="item.show = !item.show">
              <div class="coupon-explain-content">{{ item.show ? item.explain : '优惠券说明' }}</div>
              <van-icon v-if="item.show" name="arrow-up" class="icon-explain" />
              <van-icon v-else name="arrow-down" class="icon-explain" />
            </div>
          </div>
        </div>
        <div v-else class="order-list-null">
          <img src="@/assets/list-null.png">
          <div class="order-list-null-text">这里什么都还没有哦～</div>
        </div>
      </van-tab>
      <van-tab title="已过期">
        <div v-if="list2.length > 0" class="coupon-list">
          <div v-for="(item, index) in list2" :key="'list2' + index" class="coupon-item sel">
            <div class="coupon-main">
              <svg-icon slot="pastdue" icon-class="pastdue" class="coupon-status-icon" />
              <div class="coupon-price">
                <div class="price-val"><span class="small">¥</span>{{ item.money | moneyFilers }}</div>
                <div class="price-text">优惠券</div>
              </div>
              <div class="coupon-info">
                <p>{{ item.money }}元代金券</p>
                <p>活动单价{{ item.enough_money }}以上可用</p>
                <p>{{ item.start_time | timeFilers }}~{{ item.end_time | timeFilers }}内有效</p>
              </div>
            </div>
            <div class="coupon-explain" @click="item.show = !item.show">
              <div class="coupon-explain-content">{{ item.show ? item.explain : '优惠券说明' }}</div>
              <van-icon v-if="item.show" name="arrow-up" class="icon-explain" />
              <van-icon v-else name="arrow-down" class="icon-explain" />
            </div>
          </div>
        </div>
        <div v-else class="order-list-null">
          <img src="@/assets/list-null.png">
          <div class="order-list-null-text">这里什么都还没有哦～</div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Tab, Tabs, Image, Icon } from 'vant'
import { getCoupon } from '@/api/user'
export default {
  name: 'Coupon',
  components: {
    [Tab.name]: Tab,
    [Image.name]: Image,
    [Icon.name]: Icon,
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
      list: [],
      list1: [],
      list2: [],
      active: 0 //  未使用，已使用，已过期
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {},
  methods: {
    getList() {
      getCoupon({ is_use: this.active }).then(res => {
        console.log(res.data)
        switch (this.active) {
          case 0: // 未使用
            this.list = res.data.data.list.map(item => {
              item.show = false
              return item
            })
            break
          case 1: // 已使用
            this.list1 = res.data.data.list.map(item => {
              item.show = false
              return item
            })
            break
          case 2: // 已过期
            this.list2 = res.data.data.list.map(item => {
              item.show = false
              return item
            })
            break
        }
      })
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
    padding: 12px 10px;
    .coupon-item{
      width: 355px;
      overflow: hidden;
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
        padding: 16px 14px;
        line-height: 20px;
        font-size: 11px;
        color: #999;
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
  .order-list-null{
    padding-top: 70px;
    .order-list-null-text{
      font-size: 14px;
      color: #666;
      text-align: center;
      padding-top: 10px;
    }
  }
</style>

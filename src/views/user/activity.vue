<template>
  <div class="page">
    <van-tabs v-model="active" color="#13D1B5" title-active-color="#13D1B5" line-height="2px" @change="getList()">
      <van-tab title="全部">
        <div v-if="listAll.length > 0" class="order-list">
          <div v-for="(item, index) in listAll" :key="'listAll' + index" class="order-item" @click="onJumpDetails(item.activity_id)">
            <van-image class="cover-img" :src="item.banner" fit="cover" radius="6" />
            <div class="order-data">
              <div class="order-item-title">{{ item.name }}</div>
              <div class="order-item-info">
                <span>{{ item.start_time | timeFilers }}</span>
                <span>{{ item.area }} </span>
              </div>
              <div class="order-data-footer">
                <div v-if="item.status == 1" :class="['order-hint', item.audit == 1 ? 'gary' : '']">
                  <span v-if="item.model == 0">报名成功</span>
                  <span v-else>{{ item.audit | auditFilers }}</span>
                </div>
                <div v-if="item.status == 4" class="order-hint">
                  <span>超时未支付已取消</span>
                </div>
                <div v-else class="order-hint gary">
                  <span v-if="item.status == 0"><van-count-down :time="item.end_pay_limit" class="order-hint-text" format="mm分ss秒" @finish="finishTime(index, 'allList')" /> 自动取消</span>
                  <span v-if="item.status == 3">已结束</span>
                </div>
                <div v-if="item.status == 0" class="order-btns">
                  <div class="order-btn" @click.stop="onJumpHandle('orderDetails', item.id)">修改信息</div>
                  <div class="order-btn" @click.stop="onPayHandle(index, item.id)">立即支付</div>
                </div>
                <div v-if="item.status == 1" class="order-btns">
                  <div class="order-btn" @click.stop="onJumpSucceed(item.audit, item.id)">活动须知</div>
                  <div class="order-btn" @click.stop="onJumpHandle('orderDetails', item.id)">订单详情</div>
                  <div class="order-btn" @click.stop="onJumpHandle('applyReplace', item.id)">改签/退出</div>
                </div>
                <div v-if="item.status == 2" class="order-btns">
                  <div v-if="item.refund_status == 1 && item.model == 0" class="order-btn gray">已退款</div>
                  <div v-if="item.refund_status == 1 && item.model != 0" class="order-btn gray">已退出</div>
                  <!--   <div v-if="item.refund_status == 0" class="order-btn gray">审核中</div>-->
                </div>
                <div v-if="item.status == 3" class="order-btns">
                  <div v-if="item.is_comment == 0" class="order-btn" @click.stop="onJumpHandle('orderComment', item.id)">评价活动</div>
                  <div v-else class="order-btn gray">已评论</div>
                </div>
                <div v-if="item.status == 4" class="order-btns">
                  <div class="order-btn" @click.stop="onDeleteHandle(index, item.id, 'allList')">删除订单</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="order-list-null">
          <img src="@/assets/list-null.png">
          <div class="order-list-null-text">这里什么都还没有哦～</div>
        </div>
      </van-tab>
      <van-tab title="待支付">
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
                <div class="order-hint">
                  <span v-if="item.status == 0"><van-count-down :time="item.end_pay_limit" class="order-hint-text" format="mm分ss秒" @finish="finishTime(index, 'list')" /> 自动取消</span>
                  <span v-if="item.status == 4">超时未支付已取消</span>
                </div>
                <div v-if="item.status == 0" class="order-btns">
                  <div class="order-btn" @click.stop="onJumpHandle('orderDetails', item.id)">修改信息</div>
                  <div class="order-btn" @click.stop="onPayHandle(index, item.id)">立即支付</div>
                </div>
                <div v-if="item.status == 4" class="order-btns">
                  <div class="order-btn" @click.stop="onDeleteHandle(index, item.id, 'list')">删除订单</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="order-list-null">
          <img src="@/assets/list-null.png">
          <div class="order-list-null-text">这里什么都还没有哦～</div>
        </div>
      </van-tab>
      <van-tab title="已报名">
        <div v-if="list1.length > 0" class="order-list">
          <div v-for="(item, index) in list1" :key="'list1' + index" class="order-item" @click="onJumpDetails(item.activity_id)">
            <van-image class="cover-img" :src="item.banner" fit="cover" radius="6" />
            <div class="order-data">
              <div class="order-item-title">{{ item.name }}</div>
              <div class="order-item-info">
                <span>{{ item.start_time | timeFilers }}</span>
                <span>{{ item.area }} </span>
              </div>
              <div class="order-data-footer">
                <div v-if="item.status == 1" :class="['order-hint', item.audit == 1 ? 'gary' : '']">
                  <span v-if="item.model == 0">报名成功</span>
                  <span v-else>{{ item.audit | auditFilers }}</span>
                </div>
                <div class="order-btns">
                  <div class="order-btn" @click.stop="onJumpSucceed(item.audit, item.id)">活动须知</div>
                  <div class="order-btn" @click.stop="onJumpHandle('orderDetails', item.id)">订单详情</div>
                  <div class="order-btn" @click.stop="onJumpHandle('applyReplace', item.id)">改签/退出</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="order-list-null">
          <img src="@/assets/list-null.png">
          <div class="order-list-null-text">这里什么都还没有哦～</div>
        </div>
      </van-tab>
      <van-tab title="已退出">
        <div v-if="list2.length > 0" class="order-list">
          <div v-for="(item, index) in list2" :key="'list2' + index" class="order-item" @click="onJumpDetails(item.activity_id)">
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
                  <div v-if="item.refund_status == 1 && item.model == 0" class="order-btn gray">已退款</div>
                  <div v-if="item.refund_status == 1 && item.model != 0" class="order-btn gray">已退出</div>
                  <!--   <div v-if="item.refund_status == 0" class="order-btn gray">审核中</div>-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="order-list-null">
          <img src="@/assets/list-null.png">
          <div class="order-list-null-text">这里什么都还没有哦～</div>
        </div>
      </van-tab>
      <van-tab title="评价">
        <div v-if="list3.length > 0" class="order-list">
          <div v-for="(item, index) in list3" :key="'list3' + index" class="order-item" @click="onJumpDetails(item.activity_id)">
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
                  <div v-if="item.is_comment == 0" class="order-btn" @click.stop="onJumpHandle('orderComment', item.id)">评价活动</div>
                  <div v-else class="order-btn gray">已评论</div>
                </div>
              </div>
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
import { Tab, Tabs, Image, CountDown, Toast, Dialog } from 'vant'
import { getList, createPay, deleteOrder } from '@/api/order'
import wx from 'weixin-js-sdk'

export default {
  name: 'Activity',
  components: {
    [Tab.name]: Tab,
    [Image.name]: Image,
    [CountDown.name]: CountDown,
    [Tabs.name]: Tabs
  },
  filters: {
    timeFilers(time) {
      return time.substr(5, 6).replace(/-/, '/')
    },
    auditFilers(val) {
      var arr = ['未审核', '报名成功', '审核未通过']
      return arr[val]
    }
  },
  data() {
    return {
      storeId: undefined,
      list: [],
      list1: [],
      list2: [],
      list3: [],
      listAll: [],
      active: 0
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.active = parseInt(this.$route.params.type) || 0
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      var status = this.active === 0 ? '' : this.active - 1
      getList({ status: status }).then(res => {
        switch (status) {
          case 0: // 待支付
            this.list = res.data.data.list.map(item => {
              item.name = item.name.length > 30 ? item.name.substr(0, 30) + '...' : item.name
              item.end_pay_limit = item.end_pay_limit * 1000
              return item
            })
            break
          case 1: // 已报名
            this.list1 = res.data.data.list.map(item => {
              item.name = item.name.length > 30 ? item.name.substr(0, 30) + '...' : item.name
              return item
            })
            break
          case 2: // 已退出
            this.list2 = res.data.data.list.map(item => {
              item.name = item.name.length > 30 ? item.name.substr(0, 30) + '...' : item.name
              return item
            })
            break
          case 3: // 评价
            this.list3 = res.data.data.list.map(item => {
              item.name = item.name.length > 30 ? item.name.substr(0, 30) + '...' : item.name
              return item
            })
            break
          default: // 全部
            this.listAll = res.data.data.list.map(item => {
              item.name = item.name.length > 30 ? item.name.substr(0, 30) + '...' : item.name
              item.end_pay_limit = item.end_pay_limit * 1000
              return item
            })
            break
        }
        console.log(res.data.data.list)
      })
    },
    // 支付订单
    onPayHandle(index, id) {
      createPay({
        order_id: id,
        pay_type: 1
      }).then(res => {
        if (res.data.code === 1) {
          if (res.data.data.pay) {
            this.openConfig(res.data.data.pay, id)
          } else {
            // 返回空表示免费活动，直接跳转到报名完成页
            this.onJumpSucceed(0, id)
          }
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    // 删除订单
    onDeleteHandle(index, id, status) {
      Dialog.confirm({
        title: '确认提示',
        message: '确认删除此订单吗？'
      }).then(() => {
        deleteOrder({ id: id }).then(res => {
          if (res.data.code === 1) {
            console.log(res)
            if (status === 'allList') {
              this.listAll.splice(index, 1)
            } else {
              this.list.splice(index, 1)
            }
          } else {
            Toast.fail(res.data.info)
          }
        })
      }).catch(() => {
        // on cancel
      })
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
    openWxPay(data, id) {
      var that = this
      console.log('进入chooseWXPay', data.timeStamp)
      wx.chooseWXPay({
        'appId': data.appId,
        'timestamp': data.timestamp,
        'nonceStr': data.nonceStr,
        'package': data.package,
        'signType': data.signType,
        'paySign': data.paySign,
        success: res => {
          // 支付成功后的回调函数
          if (res.errMsg === 'chooseWXPay:ok') {
            Toast.success('支付成功')
            that.onJumpSucceed(1, id)
            console.log('支付成功', res)
          }
        },
        cancel: res => {
          console.log('用户取消支付', res)
        },
        // 支付失败回调函数
        fail: res => {
          console.log('支付失败')
        }
      })
    },
    // 倒计时结束，变换状态
    finishTime(index, type) {
      if (type === 'allList') {
        this.$set(this.listAll[index], 'status', 4)
      } else {
        this.$set(this.list[index], 'status', 4)
      }
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
    onJumpHandle(name, id) {
      this.$router.push({
        name: name,
        params: { storeId: this.storeId, orderId: id }
      })
    },
    onJumpSucceed(status, id) {
      this.$router.push({
        name: 'orderSucceed',
        params: { storeId: this.storeId, orderId: id, orderStatus: status }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .order-list{
    .order-item {
      background: #fff;
      padding: 10px 8px;
      display: flex;
      margin-top: 12.5px;
      &:last-child{
        border-bottom: none;
      }
      .cover-img {
        height: 82.5px;
        width: 82.5px;
        border-radius: 6px;
        margin-right: 13px;
      }
      .order-data{
        position: relative;
        padding-bottom: 30px;
        height: 56px;
        width: 255px;
      }
      .order-item-title{
        font-size:14px;
        color: #333;
      }
      .order-item-info{
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
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .order-hint{
        color: #FF2C36;
        font-size: 11px;
        .order-hint-text{
          color: #FF2C36;
          font-size: 11px;
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

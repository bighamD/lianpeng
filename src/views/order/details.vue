<template>
  <div v-if="detailData" class="page">
    <div class="activity-box">
      <van-image
        class="cover-img"
        :src="detailData.activity_banner"
        fit="cover"
        radius="6"
      />
      <div class="activity-data">
        <div class="activity-item-title">
          {{ detailData.name | nameFilters }}
        </div>
        <div class="activity-item-info">
          <span>{{ detailData.start_time | timeFilers }}</span>
          <span>{{ detailData.area }}</span>
        </div>
        <div class="activity-item-info">
          <span>活动费用：{{ detailData.money }}/人</span>
        </div>
      </div>
    </div>
    <div class="activity-look" @click="onActivityJump()">
      <span>点击查看活动详情</span>
      <van-icon name="arrow" class="icon-right" />
    </div>
    <div class="apply-box">
      <div class="apply-title">报名信息</div>
      <div class="apply-table">
        <div class="apply-line apply-header">
          <div class="user">报名人</div>
          <div class="project">项目</div>
          <div class="cost">费用</div>
          <div class="status">操作</div>
        </div>
        <div
          v-for="item in detailData.member"
          :key="'member' + item.id"
          class="apply-line"
        >
          <div class="user" @click="onShow(item)">
            {{ item.real_name }}
          </div>
          <div class="project">基础费用</div>
          <div class="cost">{{ item.payment_money }}元</div>
          <div class="status">{{ item.status | statusFilters }}</div>
        </div>
        <div v-if="detailData.coupon" class="apply-line">
          <div class="count">
            优惠券优惠（满{{ detailData.coupon.enough_money }}减{{
              detailData.coupon.money
            }}）
          </div>
          <div class="status">
            {{ detailData.coupon.is_use | useFilters }}
          </div>
        </div>
      </div>
      <div class="apply-btns">
        <!--  <div class="apply-btn" @click="onJump('selectContact')">增加人员</div>-->
        <div class="apply-btn" @click="onJump('applyReplace')">
          修改/替员
        </div>
      </div>
    </div>
    <div v-if="detailData.qr_code" class="code-box">
      <div class="activity-code">
        <div class="title">活动编号</div>
        <div class="code">{{ detailData.t_number }}</div>
        <p class="desc">
          活动现场出示活动编号可便于活动现场签到/领取物资
        </p>
        <p class="desc group">活动群</p>
      </div>
      <img :src="detailData.qr_code" class="code-path">
      <div class="code-hint">
        识别二维码加入<span class="high">活动讨论群</span>谨慎接受群友的好友添加请求，避免个人信息泄露及被骚扰。
      </div>
    </div>
    <van-popup v-model="popupShow">
      <div v-if="popupData" class="user-box">
        <div class="user-title">信息查看</div>
        <div class="user-info">
          姓名：{{ popupData.real_name }}<br>
          证件号码：{{ popupData.identity_no }}<br>
          电话号码：{{ popupData.phone }}
        </div>
        <div class="user-btn" @click="popupShow = false">确定</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Image, Icon, Popup, Toast } from 'vant'
import { orderDetail } from '@/api/order'
export default {
  name: 'Details',
  components: {
    [Image.name]: Image,
    [Popup.name]: Popup,
    [Icon.name]: Icon
  },
  filters: {
    timeFilers(time) {
      return time.substr(5, 6).replace(/-/, '/')
    },
    statusFilters(data) {
      switch (data) {
        case 0:
          return '已报名'
        case 1:
          return '已退出'
        case 2:
          return '已取消'
      }
    },
    useFilters(data) {
      switch (data) {
        case 0:
          return '未使用'
        case 1:
          return '已使用'
        case 2:
          return '已过期'
      }
    },
    nameFilters(text) {
      var name = text.length > 25 ? text.substr(0, 25) + '...' : text.name
      return name
    }
  },
  data() {
    return {
      storeId: undefined,
      orderId: undefined,
      detailData: null,
      popupShow: false,
      popupData: null
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.orderId = this.$route.params.orderId
    if (this.orderId) {
      this.initData()
    } else {
      this.$router.go(-1)
    }
  },
  mounted() {},
  methods: {
    initData() {
      orderDetail({ id: this.orderId }).then(res => {
        if (res.data.code === 1) {
          this.detailData = res.data.data
          console.log(res.data.data)
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    onShow(row) {
      this.popupData = row
      this.popupShow = true
    },
    onJump(name) {
      this.$router.push({
        name: name,
        params: { storeId: this.storeId, orderId: this.orderId }
      })
    },
    onActivityJump() {
      this.$router.push({
        name: 'activityDetails',
        params: {
          storeId: this.storeId,
          activityId: this.detailData.activity_id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.activity-box {
    background: #fff;
    padding: 14.5px 10px;
    display: flex;
    margin: 12.5px auto;
    width: 335px;
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    &:last-child {
        border-bottom: none;
    }
    .cover-img {
        height: 82.5px;
        width: 82.5px;
        border-radius: 6px;
        margin-right: 13px;
    }
    .activity-data {
        position: relative;
        padding-bottom: 30px;
        height: 56px;
        width: 255px;
    }
    .activity-item-title {
        font-size: 14px;
        color: #333;
        line-height: 21px;
    }
    .activity-item-info {
        font-size: 11px;
        color: #999999;
        padding-top: 8px;
        span {
            margin-right: 30px;
        }
    }
}
.activity-look {
    color: #333;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 325px;
    padding: 0 15px;
    background: #fff;
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    height: 34px;
    margin: 0 auto;
    .icon-right {
        font-size: 14px;
    }
}
.apply-box {
    width: 339px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    padding: 8px;
    margin: 10px auto;
    .apply-title {
        border-bottom: 1px solid #eee;
        height: 35px;
        line-height: 35px;
        color: @theme-color;
        font-size: 12px;
        font-weight: bold;
        padding-left: 10px;
    }
    .apply-table {
        margin-top: 10px;
        border: 1px solid #3b3c40;
        border-radius: 6px;
        width: 335px;
        .apply-line {
            display: flex;
            height: 32px;
            border-bottom: 1px solid #3b3c40;
            color: #333;
            &:last-child {
                border-bottom: none;
            }
            &.apply-header {
                background: #cecece;
                .user {
                    color: #333;
                    text-decoration: none;
                }
            }
            .user {
                width: 80px;
                height: 32px;
                border-right: 1px solid #3b3c40;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #466fd5;
                text-decoration: underline;
            }
            .project {
                width: 80px;
                height: 32px;
                border-right: 1px solid #3b3c40;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .cost {
                width: 80px;
                height: 32px;
                border-right: 1px solid #3b3c40;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .status {
                width: 98px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .count {
                border-right: 1px solid #3b3c40;
                width: 243px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    .apply-btns {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 19px 0 10px 0;
        .apply-btn {
            width: 75px;
            height: 25px;
            border: 1px solid @theme-color;
            border-radius: 13px;
            font-size: 12px;
            color: @theme-color;
            line-height: 25px;
            text-align: center;
            margin-left: 10px;
        }
    }
}
.code-box {
    .activity-code {
        text-align: center;
        transform: translateY(-16px);
        .title {
            font-size: 14px;
            font-weight: 700;
        }

        .code {
            font-size: 32px;
            color: #21cab2;
            margin: 8px 0;
        }
        .desc {
        font-weight: bold;
            color: rgba(51, 51, 51, 1);

            &.group {
              margin-top: 20px;
              font-size: 14px;
            }
        }
    }

    width: 355px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    margin: 8px auto;
    padding-top: 40px;
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
}
.van-popup {
    background: none;
}
.user-box {
    position: relative;
    width: 250px;
    padding: 23px 19px 19px 25px;
    background: #fff;
    border-radius: 6px;
    .user-title {
        text-align: center;
        font-size: 14px;
        color: @theme-color;
    }
    .user-info {
        margin-top: 20px;
        font-size: 12px;
        font-weight: bold;
        color: #333;
        line-height: 30px;
    }
    .user-btn {
        width: 195px;
        height: 38px;
        line-height: 38px;
        background: rgba(19, 209, 181, 1);
        border-radius: 19px;
        margin: 23px auto 0 auto;
        color: #fff;
        font-size: 14px;
        text-align: center;
    }
}
</style>

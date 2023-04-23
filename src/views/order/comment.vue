<template>
  <div class="page">
    <div class="comment-box">
      <div v-if="orderInfo" class="order-box">
        <van-image class="cover-img" :src="orderInfo.activity_banner" fit="cover" radius="6" />
        <div class="order-data">
          <div class="order-item-title">{{ orderInfo.name }}</div>
          <div class="order-item-info">
            <span>{{ orderInfo.start_time | timeFilers }}</span>
            <span>{{ orderInfo.area }}</span>
          </div>
        </div>
      </div>
      <div class="rate-box">
        <div class="rate-title">综合评星</div>
        <van-rate v-model="value" class="rate-star" size="26px" color="#f08223" gutter="13px" />
        <div class="rate-text">{{ value | starFilers }}</div>
      </div>
      <van-field v-model="comment" placeholder="多角度评价活动，可以帮助更多想参加的人" autosize type="textarea" rows="4">
        <svg-icon slot="left-icon" icon-class="input" class="icon-input" />
      </van-field>
      <div class="open-box">
        <van-checkbox v-model="checked" checked-color="#13D1B5" icon-size="14px">
          <div slots="default" class="open-status">公开</div>
        </van-checkbox>
        <div class="open-text">公开评论，大家可以在评论区看到我的头像和昵称</div>
      </div>
    </div>
    <div v-if="guideList.length > 0" class="leader-box">
      <div class="leader-box-title">
        领队评星
      </div>
      <div v-for="(item, index) in guideList" :key="item.id" class="leader-rate">
        <div class="leader-info">
          <van-image class="leader-avatar" :src="item.headimgurl" fit="cover" round />
          <div class="leader-name">{{ item.nickname }}</div>
        </div>
        <van-rate v-model="guideLevel[index].level" class="rate-star" size="26px" color="#f08223" gutter="13px" />
        <div class="rate-text">{{ value | starFilers }}</div>
      </div>
    </div>
    <div class="comment-btn" @click="onSubmit()">立即评价</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Rate, Image, Field, Checkbox, CheckboxGroup, Toast } from 'vant'
import { orderDetail, commentPage, createComment } from '@/api/order'

export default {
  name: 'OrderComment',
  components: {
    [Image.name]: Image,
    [Field.name]: Field,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Rate.name]: Rate
  },
  filters: {
    timeFilers(time) {
      return time.substr(5, 6).replace(/-/, '/')
    },
    starFilers(val) {
      var a = ['', '很不满意', '不满意', '还行', '满意', '很满意']
      return a[val]
    }
  },
  data() {
    return {
      storeId: undefined,
      comment: null,
      value: 5,
      checked: true,
      orderInfo: null,
      guideList: [],
      guideLevel: null
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
  mounted() {
  },
  methods: {
    initData() {
      orderDetail({ id: this.orderId }).then(res => {
        if (res.data.code === 1) {
          this.orderInfo = {
            activity_banner: res.data.data.activity_banner,
            activity_id: res.data.data.activity_id,
            area: res.data.data.area,
            name: res.data.data.name,
            start_time: res.data.data.start_time
          }
          console.log(res.data.data)
        } else {
          Toast.fail(res.data.info)
        }
      })
      commentPage({ id: this.orderId }).then(res => {
        if (res.data.code === 1) {
          this.guideList = res.data.data.guide
          this.guideLevel = res.data.data.guide.map(item => {
            item = {
              id: item.id,
              level: 5
            }
            return item
          })
          console.log('领队', res.data.data.guide)
        }
      })
    },
    onSubmit() {
      if (this.comment.length > 5) {
        createComment({
          id: this.orderId,
          level: this.value,
          comment: this.comment,
          is_anonymous: this.checked ? 0 : 1,
          guide: JSON.stringify(this.guideLevel)
        }).then(res => {
          if (res.data.code === 1) {
            this.onJump('user')
          } else {
            Toast.fail(res.data.info)
          }
          console.log(res.data)
        })
      } else {
        Toast.fail('评论内容不得少于5个字')
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
  .comment-box{
    background: #fff;
    width:331px;
    margin: 10px auto;
    padding: 0 12px;
    border-radius:6px;
    border: 1px solid #DEDEDE;
  }
  .order-box{
    display: flex;
    align-items: center;
    margin-top: 8px;
    .cover-img{
      width:35px;
      height:35px;
      margin-right: 10.5px;
    }
    .order-data{
      .order-item-title{
        font-size:12px;
        color: #333;
      }
      .order-item-info{
        font-size:11px;
        color: #999;
        margin-top: 5px;
        span{
          margin-right: 20px;
        }
      }
    }
  }
  .rate-box{
    display: flex;
    align-items: center;
    margin: 20px 0;
    .rate-title{
      font-size:15px;
      color: #666;
      margin-right: 10px;
    }
    .rate-text{
      font-size:15px;
      font-weight:bold;
      color:rgba(217,217,217,1);
      padding-left: 20px;
    }
  }
  .icon-input{
    font-size: 24px;
    color: #666666;
  }
  .van-cell:not(:last-child)::after{
    border: none;
  }
  .van-field{
    font-size: 12px;
    color: #666;
    padding: 0;
  }
  .open-box{
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #999999;
  }
  .open-status{
    color: #999999;
  }
  .leader-box{
    background: #fff;
    width:331px;
    margin: 10px auto;
    padding: 0 12px;
    border-radius:6px;
    border: 1px solid #DEDEDE;
    .leader-box-title{
      font-size:15px;
      color: #666;
      margin-right: 10px;
      margin-top: 16px;
      margin-bottom: 10px;
    }
    .leader-rate{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .leader-info{
        margin:0 20px;
        text-align: center;
        .leader-avatar{
          width: 28px;
          height: 28px;
        }
        .leader-name{
          color: #999999;
        }
      }
      .rate-text{
        font-size:15px;
        font-weight:bold;
        color:rgba(217,217,217,1);
        padding-left: 20px;
      }
    }
  }
  .comment-btn{
    width:195px;
    height:38px;
    line-height: 38px;
    background:rgba(19,209,181,1);
    border-radius:19px;
    margin: 20px auto;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
</style>

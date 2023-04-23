<template>
  <div class="page">
    <!-- 头部搜索 -->
    <div class="head-box">
      <div class="search-box" @click="onJump('indexSearch')">
        <svg-icon slot="search" icon-class="search" class="icon-search" />
        <span>搜索活动/路线</span>
      </div>
      <div :class="['message-box', not_read_count > 0 ? 'new-message' : '']" @click="onJump('message')">
        <svg-icon slot="message" icon-class="message" class="icon-message" />
      </div>
    </div>
    <!-- banner -->
    <div class="banner-box">
      <van-swipe class="my-swipe" indicator-color="#13D1B5" :autoplay="3000">
        <van-swipe-item v-for="(item, index) in bannerList" :key="'banner' + index">
          <div class="img-box" @click="windowJump(item.link)">
            <img :src="item.picture" class="banner-path">
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 广告 -->
    <div v-if="advData" class="ad-box" @click="windowJump(advData.link)">
      <img :src="advData.image">
    </div>
    <!-- 板块标题 -->
    <div class="tabs-box">
      <div v-for="(item, index) in navList" :key="'nav' + index" :class="['tab-item', tabType == index ? 'tab-sel' : '']" @click="toggleTab(item.id, index)">
        <span class="tab-item-title">{{ item.name }}</span>
      </div>
    </div>
    <!-- 板块内容 -->
    <div class="activity-list">
      <div v-for="(item, index) in activityList" :key="'activity' + index" class="activity-item" @click="onJumpDetails(item.id)">
        <div class="activity-info">
          <van-image class="cover-img" :src="item.banner" fit="cover" />
          <div class="info-box">
            <div class="activity-title">{{ item.name }}</div>
            <div class="activity-address">{{ item.area }}</div>
            <div class="activity-time">
              <div class="time">{{ item.start_time | timeFilers }}</div>
              <div class="money">{{ item.money == 0 ? '免费' : '¥' + item.money }}</div>
            </div>
          </div>
        </div>
        <div class="activity-submit-bar">
          <div class="difficulty">
            <!--    难度：-->
            <!--    <svg-icon v-for="starItem in item.difficulty_level" :key="'star' + starItem" slot="star" icon-class="star" class="icon-star" />-->
            {{ item.difficulty_name }}
          </div>
          <div class="submit-btn">立即报名</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem, Button, Icon, Image, Toast } from 'vant'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { getActivityList, getBannerList, activityCategory, getAdv } from '@/api/index'
import { isMessage } from '@/api/user'
export default {
  name: 'Index',
  components: {
    [Button.name]: Button,
    [Image.name]: Image,
    [Icon.name]: Icon,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem
  },
  filters: {
    timeFilers(time) {
      return time ? time.substr(5, 6).replace(/-/, '/') : ''
    }
  },
  data() {
    return {
      storeId: undefined,
      tabType: 0,
      bannerList: [],
      navList: [],
      activityList: [],
      advData: null, // 广告位
      not_read_count: 0 // 未读消息
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
    // console.log('storeId', this.$route.params.storeId)
  },
  mounted() {
    Toast.loading()
    axios.all([this.getBanner(), this.getNavList(), this.getMessage(), this.getAdv()])
  },
  methods: {
    getBanner() {
      getBannerList({}).then(res => {
        this.bannerList = res.data.data.list
        // console.log('getBannerList', res.data.data.list)
      })
    },
    getNavList() {
      activityCategory({}).then(res => {
        this.navList = res.data.data.list
        // console.log('getNavList', res.data.data.list)
        this.getActivityList(res.data.data.list[0].id)
      })
    },
    getActivityList(tabId) {
      getActivityList({ id: tabId }).then(res => {
        this.activityList = res.data.data.list.map(item => {
          item.name = item.name.length > 25 ? item.name.substr(0, 25) + '...' : item.name
          return item
        })
        // console.log('getActivityList', res.data.data.list)
      })
    },
    getMessage() {
      isMessage({}).then(res => {
        this.not_read_count = res.data.data.not_read_count
        // console.log('isMessage', res.data.data)
      })
    },
    getAdv() {
      getAdv({}).then(res => {
        this.advData = res.data.data.advertising_index_1
        Toast.clear()
        // console.log('getAdv', res.data.data.advertising_index_1)
      })
    },
    toggleTab(type, index) {
      this.tabType = index
      this.getActivityList(type)
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
    windowJump(url) {
      window.location.href = url
    }
  }
}
</script>

<style lang="less" scoped>
  .page{
    padding-bottom: 70px;
  }
  .head-box{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 55px;
    background: #fff;
    padding: 0 12.5px;
    .search-box{
      display: flex;
      align-items: center;
      color: #999;
      width: 85%;
      height: 33px;
      background:rgba(238,238,238,1);
      border-radius:16px;
      padding: 0 16px;
      font-size:14px;
      .icon-search{
        width: 10%;
        font-size: 20px;
      }
    }
    .message-box{
      width: 10%;
      margin-left: 2%;
      text-align: center;
      &.new-message{
        position: relative;
        &:before{
          content: '';
          position: absolute;
          background: red;
          width: 7.5px;
          height: 7.5px;
          border-radius: 100%;
          z-index: 8;
          left: 50%;
          margin-left: 5px;
          top: 5px;
        }
      }
      .icon-message{
        color: #8e8e8e;
        font-size: 32px;
      }
    }
  }
  .banner-box{
    background: #fff;
    .my-swipe{
      margin: 0 12.5px;
      border-radius: 6px;
    }
    .banner-path{
      width: 100%;
    }
  }
  .ad-box{
    padding: 20px 12.5px 12px 12.5px;
    background: #fff;
  }
  .tabs-box{
    background: #fff;
    padding: 20px 12.5px 12px 12.5px;
    display: flex;
    align-items: flex-end;
    .tab-item{
      font-size: 15px;
      margin-right: 20px;
      .tab-item-title{
        position: relative;
        z-index: 2;
      }
      &.tab-sel{
        position: relative;
        font-size: 18px;
        font-weight: bold;
        &:after{
          position: absolute;
          content: '';
          background: @theme-color;
          width: 100%;
          height: 5px;
          left: 0;
          bottom: 3px;
          z-index: 1;
        }
      }
    }
  }
  .activity-list{
    .activity-item{
      background: #fff;
      margin-bottom: 9px;
      padding: 12.5px 12.5px 0 12.5px;
      .activity-info{
        display: flex;
        .cover-img{
          width: 140px;
          height: 90px;
          margin-right: 7px;
        }
        .info-box{
          width: 200px;
          .activity-title{
            font-size:14px;
            line-height: 21px;
          }
          .activity-address{
            font-size:11px;
            color: #999;
            margin-top: 10px;
          }
          .activity-time{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .time{
              font-size:11px;
              color: #999;
            }
            .money{
              font-size:15px;
              font-weight:800;
              color: @theme-color;
            }
          }
        }
      }
      .activity-submit-bar{
        border-top: 1px solid #eee;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 45px;
        .difficulty{
          font-size:11px;
          color: #999;
          .icon-star{
            font-size: 12px;
          }
        }
        .submit-btn{
          width: 75px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          color: #fff;
          background: @theme-color;
          border-radius: 30px;
          font-size: 12px;
        }
      }
    }
  }
</style>

<template>
  <div class="page">
    <div class="search-box">
      <van-icon name="arrow-left" class="icon-return" @click="onReturn" />
      <van-field v-model="keyword" left-icon="search" class="search-input" placeholder="搜索活动/路线" />
      <div class="search-btn" @click="getList()">搜索</div>
    </div>
    <div class="order-list">
      <div v-for="(item, index) in activityList" :key="index" class="order-item" @click="onJumpDetails(item.id)">
        <van-image class="cover-img" :src="item.banner" fit="cover" radius="6" />
        <div class="order-data">
          <div class="order-item-title">{{ item.name }}</div>
          <div class="order-item-info">
            <span>{{ item.start_time | timeFilers }}</span>
            <span>{{ item.area }} </span>
          </div>
          <div class="order-data-footer">
            <div class="order-btns">
              <div :class="['order-btn', item.period_status === 3 || item.period_status === 4 ? 'gray' : '']">{{ item.period_status | statusFilers }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Field, Icon, Image, Toast } from 'vant'
import { activitySearch } from '@/api/index'
export default {
  name: 'Search',
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Image.name]: Image
  },
  filters: {
    timeFilers(time) {
      return time.substr(5, 6).replace(/-/, '/')
    },
    statusFilers(data) {
      switch (data) {
        case 0:
          return '报名中'
        case 1:
          return '已满员'
        case 2:
          return '已开始'
        case 3:
          return '已结束'
        case 4:
          return '未成行'
      }
    }
  },
  data() {
    return {
      storeId: undefined,
      keyword: '',
      activityList: []
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
  },
  methods: {
    getList() {
      if (this.keyword) {
        activitySearch({
          keyword: this.keyword
        }).then(res => {
          this.activityList = res.data.data.list
          console.log(res.data)
        })
      } else {
        Toast.fail('请输入搜索内容')
      }
    },
    onJumpDetails(key) {
      this.$router.replace({
        name: 'activityDetails',
        params: { storeId: this.storeId, activityId: key }
      })
    },
    onReturn() {
      this.$router.go(-1)
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
  .search-box{
    background: #fff;
    display: flex;
    align-items: center;
    padding: 10px 0;
    .icon-return{
      font-size: 20px;
      color: #333;
      padding: 0 8px;
    }
    .search-input{
      width:271px;
      height:33px;
      line-height: 33px;
      padding: 0 10px;
      color: #333;
      font-size: 14px;
      background:rgba(238,238,238,1);
      border-radius:16px;
    }
    .search-btn{
      font-size: 14px;
      color: @theme-color;
      padding: 0 16px;
    }
  }
  .order-list{
    background: #fff;
    padding: 0 10px;
    .order-item {
      padding: 10px 8px;
      display: flex;
      border-bottom: 1px solid #e4e4e4;
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
        justify-content: flex-end;
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

</style>

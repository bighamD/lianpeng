<template>
  <div class="page">
    <div v-if="guideList.length > 0" class="user-box">
      <div class="user-title">活动领队</div>
      <div class="user-list">
        <div v-for="(item, index) in guideList" :key="'guide' + index" class="user-item">
          <svg-icon slot="lead" icon-class="lead" class="icon-lead" />
          <van-image class="avatar-img" :src="item.headimgurl" fit="cover" round />
          <div class="user-name">{{ item.nickname }}</div>
        </div>
      </div>
    </div>
    <div v-if="memberList.length > 0" class="user-box">
      <div class="user-title">已报名</div>
      <div class="user-list">
        <div v-for="(item, index) in memberList" :key="'member' + index" class="user-item">
          <div v-if="item.join_number > 1" class="team-count">{{ item.join_number }}</div>
          <van-image class="avatar-img" :src="item.headimgurl" fit="cover" round />
          <div class="user-name">{{ item.nickname }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Image } from 'vant'
import { getActivityPeriod } from '@/api/activity'

export default {
  name: 'ActivityUserList',
  components: {
    [Image.name]: Image
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      guideList: [],
      memberList: []
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.id = this.$route.params.periodId
    if (this.id) {
      this.initData()
    }
  },
  mounted() {
  },
  methods: {
    initData() {
      getActivityPeriod({ id: this.id }).then(res => {
        this.guideList = res.data.data.member.guide
        console.log('activityPeriod', res.data.data.member)
        this.memberList = res.data.data.member.member
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
  .user-box {
    width: 90%;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(222, 222, 222, 1);
    border-radius: 6px;
    padding: 8px 2%;
    margin: 10px auto;
    .user-title {
      border-bottom: 1px solid #eee;
      height: 35px;
      line-height: 35px;
      color: @theme-color;
      font-size: 12px;
      font-weight: bold;
      padding-left: 10px;
    }
    .user-list{
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 10px 0;
      .user-item{
        position: relative;
        margin: 6px;
        text-align: center;
        width: 55px;
        .icon-lead{
          position: absolute;
          z-index: 9;
          right: 0;
          bottom: 30px;
          font-size: 24px;
        }
        .user-name{
          font-size:12px;
          font-weight:500;
          color:rgba(102,102,102,1);
          line-height:30px;
          overflow:hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
        }
        .team-count{
          position: absolute;
          z-index: 9;
          right: 7px;
          bottom: 30px;
          font-size: 9px;
          color: #fff;
          background: @theme-color;
          border-radius: 50%;
          width: 14px;
          height: 14px;
          text-align: center;
          line-height: 14px;
        }
        .avatar-img{
          width:40px;
          height:40px;
          border-radius:50%;
        }
      }
    }
  }
</style>

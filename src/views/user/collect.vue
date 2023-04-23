<template>
  <div class="page">
    <div v-if="list.length > 0" class="order-list">
      <div v-for="(item, index) in list" :key="index" class="order-item" @click="onJumpDetails(item.data.id)">
        <van-image class="cover-img" :src="item.data.banner" fit="cover" radius="6" />
        <div class="order-data">
          <div class="order-item-title">{{ item.data.name }}</div>
          <div class="order-data-footer">
            <div class="order-hint" />
            <div class="order-btns">
              <div class="order-btn">点击查看</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="order-list-null">
      <img src="@/assets/list-null.png">
      <div class="order-list-null-text">这里什么都还没有哦～</div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Image } from 'vant'
import { getFavorites } from '@/api/user'

export default {
  name: 'Collect',
  components: {
    [Image.name]: Image
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      list: []
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getFavorites({}).then(res => {
        this.list = res.data.data.list
        console.log(res.data.data.list)
      })
    },
    onJumpDetails(id) {
      this.$router.push({
        name: 'activityDetails',
        params: { storeId: this.storeId, activityId: id }
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

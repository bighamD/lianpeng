<template>
  <div class="page">
    <div v-for="(value, key, index) in list" :key="'key' + index" class="message-list">
      <div class="item-time">{{ key }}</div>
      <div v-for="messageItem in value" :key="messageItem.id" class="item">
        <div class="item-title">{{ messageItem.title }} </div>
        <div class="item-content" v-html="messageItem.content" />
        <div class="item-skip" @click="onJump(messageItem.id)">
          查看详情<van-icon name="arrow" class="icon-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Icon } from 'vant'
import { getMessage } from '@/api/user'

export default {
  name: 'Message',
  components: {
    [Icon.name]: Icon
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      list: [],
      page: 1
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getMessage({ page: this.page }).then(res => {
        var list = {}
        for (var i = 0; i < res.data.data.list.length; i++) {
          var data = res.data.data.list[i]
          var time = data.create_at.substr(0, 10)
          if (list.hasOwnProperty(time)) {
            list[time].push(data)
          } else {
            list[time] = [data]
          }
        }
        this.list = list
        console.log(list)
      })
    },
    onJump(id) {
      this.$router.push({
        name: 'messageDetails',
        params: { storeId: this.storeId, id: id }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .message-list{
    .item-time{
      width:96px;
      height:19px;
      background:rgba(216,216,216,1);
      border-radius:6px;
      font-size:12px;
      color:rgba(255,255,255,1);
      line-height:19px;
      margin: 15px auto;
      text-align: center;
    }
    .item{
      width:335px;
      margin: 9px auto;
      background:rgba(255,255,255,1);
      border:1px solid rgba(222,222,222,1);
      border-radius:6px;
      padding: 0 10px;
      .item-title{
        font-size:15px;
        font-weight:bold;
        color: #333;
        padding: 17px 10px 15px 10px;
      }
      .item-content{
        padding: 0 10px;
        font-size: 12px;
        color: #666;
        line-height: 25px;
        margin-bottom: 15px;
      }
      .item-skip{
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size:12px;
        color: #333;
        padding: 0 10px;
        border-top: 1px solid #eee;
        .icon-right{
          font-size: 10px;
        }
      }
    }
  }
</style>

<template>
  <div v-if="infoData" class="page">
    <div class="title">{{ infoData.title }}</div>
    <div class="time">{{ infoData.create_at }}</div>
    <div class="html" v-html="infoData.content" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Icon } from 'vant'
import { messageDetails } from '@/api/user'

export default {
  name: 'MessageDetails',
  components: {
    [Icon.name]: Icon
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      infoData: null,
      page: 1
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.id = this.$route.params.id
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      messageDetails({ id: this.id }).then(res => {
        this.infoData = res.data.data
        console.log(res.data.data)
      })
    },
    onJump(id) {
      this.$router.push({
        name: '',
        params: { storeId: this.storeId }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .page{
    padding: 0 12px;
    .title{
      text-align: center;
      font-size: 14px;
      padding: 12px 0;
      font-weight: bold;
    }
    .time{
      text-align: right;
      font-size: 10px;
      color: #999;
    }
    .html{
      padding: 10px 0;
    }
  }
</style>

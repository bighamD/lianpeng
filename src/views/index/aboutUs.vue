<template>
  <div class="page" v-html="content" />
</template>

<script>
// import { mapGetters } from 'vuex'
import { clauseAboutUs } from '@/api/clause'

export default {
  name: 'AboutUs',
  components: {},
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      content: ''
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.initData()
  },
  mounted() {
  },
  methods: {
    initData() {
      clauseAboutUs({}).then(res => {
        if (res.data.code === 1) {
          this.content = res.data.data.explain
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
  .page{
    padding: 21px;
    p{
      font-size:14px;
      line-height: 25px;
      padding-bottom: 20px;
      color:rgba(85,85,85,1);
    }
    .center{
      text-align: center;
      margin-top: 20px;
    }
  }
</style>

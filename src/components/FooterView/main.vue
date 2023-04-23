<template>
  <div class="page-footer">
    <div :class="['footer-item', routeName == 'index' ? 'sel' : '']" @click="onJump('index')">
      <svg-icon v-if="routeName == 'index'" slot="index-sel" icon-class="index-sel" class="icon-index" />
      <svg-icon v-else slot="index" icon-class="index" class="icon-index" />
      <span class="footer-item-text">首页</span>
    </div>
    <div :class="['footer-item', routeName == 'user' ? 'sel' : '']" @click="onJump('user')">
      <svg-icon v-if="routeName == 'user'" slot="user-sel" icon-class="user-sel" class="icon-user" />
      <svg-icon v-else slot="user" icon-class="user" class="icon-user" />
      <span class="footer-item-text">我的</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MainFooterView',
  components: {
  },
  data() {
    return {
      seasonId: undefined
    }
  },
  computed: {
    ...mapGetters([
      'routeName'
    ])
  },
  created() {
    this.seasonId = this.$route.params.seasonId
  },
  mounted() {
  },
  methods: {
    onJump(name) {
      this.$router.push({
        name: name,
        params: { seasonId: this.seasonId }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .page-footer{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    box-shadow:0 2px 3px 0 rgba(0, 0, 0, 0.03);
    height: 50px;
    .footer-item{
      text-align: center;
      color: #999;
      &.sel{
        color: @theme-color;
      }
      .icon-index, .icon-user{
        font-size: 26px;
      }
      .footer-item-text{
        display: block;
      }
    }
  }
</style>

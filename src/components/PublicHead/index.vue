<template>
  <div class="title-box">
    <svg-icon slot="return" icon-class="return" class="icon-return" @click="goReturn" />
    <div class="head-title">{{ headTitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'Head',
  props: {
    headTitle: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    goReturn() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
  .title-box{
    height: 100px;
    background-size: 100%;
    color: #fff;
    position: relative;
    .icon-return{
      position: absolute;
      bottom: 0;
      font-size: 30px;
      margin: 0 20px 10px 20px;
      z-index: 9;
    }
    .head-title{
      position: absolute;
      bottom: 0;
      width: 100%;
      font-size: 18px;
      text-align: center;
      margin-bottom: 12px;
    }
  }
</style>

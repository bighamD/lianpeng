<template>
  <van-popup v-model="visible" :close-on-click-overlay="false">
    <div class="popup-box">
      <div class="content-box" v-html="content" />
      <van-icon name="close" class="icon-close" @click="closeApplyBox" />
    </div>
  </van-popup>
</template>

<script>
import { Popup, Icon } from 'vant'

export default {
  name: 'Clause',
  components: {
    [Popup.name]: Popup,
    [Icon.name]: Icon
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    // 回调。关闭
    closeApplyBox: function() {
      this.$emit('update:visible', false) // 传递关闭事件
    }
  }
}
</script>

<style lang="less" scoped>
  .van-popup{
    background: none;
  }
  .popup-box{
    width: 290px;
    text-align: center;
    .content-box{
      height: 400px;
      background: #fff;
      text-align: left;
      font-size: 12px;
      padding: 12px;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow-y: auto;
    }
    .icon-close{
      color: #fff;
      font-size: 28px;
    }
  }
</style>

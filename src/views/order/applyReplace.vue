<template>
  <div v-if="!isLoad" class="page">
    <!-- disabled：灰色，不可点击-->
    <div class="list">
      <van-cell :class="[isReplace ? '' : 'disabled']" is-link center @click="isReplace ? onJump('userReplace') : showHint('不支持替员')">
        <template #title>
          <div class="cell-left">
            <svg-icon icon-class="icon-replace1" class="icon-replace" />
            <div class="custom-box">
              <div class="custom-title">我要替员</div>
              <div class="custom-hint">可通过替员修改报名信息</div>
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell :class="[isExit ? '' : 'disabled']" is-link center @click="isExit ? onJump('orderRefund') : showHint('不支持退出')">
        <template #title>
          <div class="cell-left">
            <svg-icon icon-class="icon-replace2" class="icon-replace" />
            <div class="custom-box">
              <div class="custom-title">退出活动</div>
              <div class="custom-hint">退款将在2-5个工作日回到你的账户</div>
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell :class="[isUpdate ? '' : 'disabled']" is-link center @click="isUpdate ? onJump('orderHandle') : showHint('不支持改签')">
        <template #title>
          <div class="cell-left">
            <svg-icon icon-class="icon-replace3" class="icon-replace" />
            <div class="custom-box">
              <div class="custom-title">我要改签</div>
              <div class="custom-hint">每个用户可改签一次</div>
            </div>
          </div>
        </template>
      </van-cell>
    </div>
    <div class="hint">
      <span class="hint-title">提示: </span>
      1.替员信息仅可修改一次； <br>
      2.若该活动无其他排期，不能改签；<br>
      3.出发前一天22点后不允许替员或改签；
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Cell, CellGroup, Toast } from 'vant'
import { checkSing } from '@/api/order'

export default {
  name: 'Handle',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      orderId: undefined,
      isLoad: true,
      isReplace: false, // 替换
      isExit: false, // 退出
      isUpdate: false // 改签
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.orderId = this.$route.params.orderId
    if (this.orderId) {
      this.checkData()
    } else {
      this.$router.go(-1)
    }
  },
  methods: {
    checkData() {
      checkSing({ id: this.orderId }).then(res => {
        console.log('替换', res.data.data)
        if (res.data.code === 1) {
          this.isReplace = res.data.data.is_for_member === 1
          this.isExit = res.data.data.is_quit === 1
          this.isUpdate = res.data.data.is_changing === 1
          this.isLoad = false
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    showHint(text) {
      Toast.fail(text)
    },
    onJump(name) {
      this.$router.push({
        name: name,
        params: { storeId: this.storeId, orderId: this.orderId }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .list{
    margin-top: 12px;
  }
  .disabled{
    .cell-left {
      display: flex;
      align-items: center;
      .icon-replace {
        font-size: 30px;
        margin-right: 10px;
        color: #999;
      }
      .custom-title {
        color: #999;
      }
    }
  }
  .cell-left{
    display: flex;
    align-items: center;
    .icon-replace{
      font-size: 30px;
      margin-right: 10px;
      color: @theme-color;
    }
    .custom-title{
      font-size:14px;
      color: #333333;
    }
    .custom-hint{
      font-size:12px;
      color: #999999;
    }
  }
  .hint{
    padding: 14px 18.5px;
    color: #999999;
    line-height: 22px;
    .hint-title{
      font-size:14px;
      display: block;
    }
  }
</style>

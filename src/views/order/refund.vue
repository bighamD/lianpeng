<template>
  <div class="page">
    <div class="list">
      <div class="list-title">勾选退出人员（可多选）</div>
      <van-checkbox-group v-model="result" @change="onChange">
        <van-cell-group>
          <van-cell v-for="(item, index) in memberList" :key="item.id" clickable @click="toggle(index)">
            <template #title>
              <div class="custom-title">
                <span class="name">{{ item.real_name }}</span> 已支付报名费：{{ item.payment_money }}元
              </div>
            </template>
            <template #right-icon>
              <van-checkbox ref="checkboxes" :name="item.id" checked-color="#13D1B5" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
    <div v-if="infoCheck" class="list">
      <div class="list-title">信息确认</div>
      <van-cell-group>
        <van-cell>
          <template #title><div class="custom-title">退出人数</div></template>
          <template #default><span class="count">{{ infoCheck.length }}</span>人</template>
        </van-cell>
        <van-cell>
          <template #title><div class="custom-title">扣除违约金</div></template>
          <template #default><span class="count">{{ infoCheck.damages_money || '按规则核算' }}</span></template>
        </van-cell>
        <!--        <van-cell>-->
        <!--          <template #title><div class="custom-title">活动费用退款</div></template>-->
        <!--          <template #default><span class="count">{{ infoCheck.refund_money }}</span>人</template>-->
        <!--        </van-cell>-->
        <van-cell>
          <template #title><div class="custom-title">合计退款金额</div></template>
          <template #default><span class="count">{{ infoCheck.refund_money }}</span></template>
        </van-cell>
      </van-cell-group>
    </div>
    <div class="list">
      <div class="list-title">退出原因</div>
      <van-field v-model="complaintText" class="textarea" placeholder="请输入你的退出原因..." autosize type="textarea" rows="4" />
    </div>
    <div v-if="refund_list" class="hint">
      <p class="hint-title">退款说明：</p>
      ·{{ refund_list.refund_date }}前退出活动，违约金=【报名费*{{ refund_list.percentage }}%】；<br>
      <!--      ·2020年07月18日 23:59前退出活动，违约金=【报名费*2%】；<br>-->
      <!--      ·2020年07月17日 23:59后退出活动，违约金=【报名费*100%】；<br>-->
      ·活动当天由于个人原因未能参加活动的，活动费用不退还；<br>
      ·不接受替员参加
    </div>
    <div class="hint bottom">
      <p class="hint-title">优惠券说明：</p>
      ·使用后由于个人原因退出活动的，优惠券不退还； <br>
      ·活动操作取消后被动退出的，平台推送活动延期后时间不适合退出的，优惠券退还。
    </div>
    <div v-if="result.length > 0" class="apply-btn" @click="onSubmit">申请退款</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Cell, CellGroup, Checkbox, CheckboxGroup, Field, Toast } from 'vant'
import { checkExit, quitCate, activityQuit } from '@/api/order'

export default {
  name: 'Refund',
  components: {
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      orderId: undefined,
      memberList: [], // 订单成员
      result: [], // 选中
      complaintText: '', // 退出理由
      refund_list: null, // 核算规则
      infoCheck: null // 核算数据
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.orderId = this.$route.params.orderId
    if (this.orderId) {
      this.initData()
    } else {
      this.$router.go(-1)
    }
  },
  mounted() {
  },
  methods: {
    initData() {
      checkExit({ id: this.orderId }).then(res => {
        console.log(res.data.data)
        if (res.data.code === 1) {
          var list = []
          for (var i = 0; i < res.data.data.member.length; i++) {
            if (res.data.data.member[i].is_quit === 0 && res.data.data.member[i].refund_status !== 1) {
              list.push(res.data.data.member[i])
            }
          }
          this.memberList = list
          console.log(list)
          this.refund_list = res.data.data.refund_list
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    onChange() {
      console.log(this.result)
      if (this.result.length > 0) {
        this.getCalculate()
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    getCalculate() {
      quitCate({ id: this.orderId, member: JSON.stringify(this.result) }).then(res => {
        if (res.data.code === 1) {
          this.infoCheck = res.data.data
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    onSubmit() {
      activityQuit({
        id: this.orderId,
        member: JSON.stringify(this.result),
        quit_reason: this.complaintText
      }).then(res => {
        if (res.data.code === 1) {
          Toast.success('退出成功')
          this.$router.replace({
            name: 'userActivity',
            params: { storeId: this.storeId, type: 2 }
          })
        } else {
          Toast.fail(res.data.info)
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
  .list{
    margin: 12px auto;
    width:355px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(222,222,222,1);
    border-radius:6px;
    overflow: hidden;
    .custom-title{
      font-weight:500;
      font-size: 12px;
      color: #333;
      .name{
        padding-right: 10px;
      }
    }
    .list-title{
      font-size:12px;
      color: @theme-color;
      height: 46px;
      line-height: 46px;
      padding-left: 15px;
      font-weight: 500;
    }
    .count{
      color: @theme-color;
    }
    .textarea{
      color: #999999;
      font-size: 12px;
    }
  }
  .hint{
    padding: 10px 18.5px 0 18.5px;
    color: #999999;
    line-height: 22px;
    &.bottom{
      padding: 10px 18.5px 70px 18.5px;
    }
    .hint-title{
      font-size:14px;
      color: @theme-color;
      display: block;
    }
  }
  .apply-btn{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height:46px;
    line-height: 46px;
    text-align: center;
    font-size:18px;
    background: @theme-color;
    color: #fff;
  }
</style>

<template>
  <div class="page">
    <div class="list">
      <div class="list-title">本活动存在其他期次，可以选改签：</div>
      <van-radio-group v-model="radio">
        <van-cell-group v-for="(item, index) in list" :key="index" :name="item.period_id">
          <van-cell clickable @click="toggle(index)">
            <template #title>
              <div class="custom-title">
                出发：{{ item.start_time | timeFilers }} <br>
                集合：{{ item.assembling_place }}
              </div>
            </template>
            <template #right-icon>
              <van-radio ref="checkboxes" :name="item.period_id" checked-color="#13D1B5" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </div>
    <div class="hint">
      <span class="hint-title">改签说明：</span>
      1.活动改签无需支付任何费用，仅可改签一次； <br>
      2.根据服务约定，因为退款退款无需扣费，所以改签后再申请退出的，按改签后的活动退款规则处理。
    </div>
    <div class="apply-btn" @click="onSubmit">申请改签</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Cell, CellGroup, Radio, RadioGroup, Checkbox, CheckboxGroup, Toast } from 'vant'
import { checkUpdate, changing } from '@/api/order'

export default {
  name: 'Details',
  components: {
    [Cell.name]: Cell,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [CellGroup.name]: CellGroup,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  filters: {
    timeFilers(time) {
      return time.substr(0, 16)
    }
  },
  data() {
    return {
      storeId: undefined,
      orderId: undefined,
      radio: undefined,
      list: []
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
      checkUpdate({ id: this.orderId }).then(res => {
        console.log(res.data.data)
        if (res.data.code === 1) {
          this.list = res.data.data.list
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle()
    },
    onJump(name) {
      console.log(name)
      this.$router.push({
        name: name,
        params: { seasonId: this.seasonId }
      })
    },
    onSubmit() {
      if (this.radio) {
        changing({
          id: this.orderId,
          period_id: this.radio
        }).then(res => {
          if (res.data.code === 1) {
            Toast.success('改签成功')
            this.$router.replace({
              name: 'userActivity',
              params: { storeId: this.storeId, type: 2 }
            })
          } else {
            Toast.fail(res.data.info)
          }
        })
      }
      console.log(this.radio)
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
    }
    .list-title{
      font-size:12px;
      color: @theme-color;
      height: 46px;
      line-height: 46px;
      padding-left: 15px;
      font-weight: 500;
    }
  }
  .hint{
    padding: 14px 18.5px 70px 18.5px;
    color: #999999;
    line-height: 22px;
    .hint-title{
      font-size:14px;
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

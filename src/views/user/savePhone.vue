<template>
  <div class="page">
    <van-field v-model="userPhone" type="tel" label="手机号" maxlength="11" placeholder="请输入手机号" />
    <van-field v-model="userSms" center clearable label="短信验证码" placeholder="请输入短信验证码">
      <template #button>
        <van-button v-if="showCountDown" size="small" type="primary" class="sms-btn" @click="getAuthCode">{{ codeText }}</van-button>
        <van-button v-else size="small" type="primary" class="sms-btn">{{ count }}'s获取</van-button>
      </template>
    </van-field>
    <div class="update-btn" @click="onSubmit">确定修改</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Cell, CellGroup, Field, Button, Toast } from 'vant'
import { savePhone } from '@/api/user'
import { getSms } from '@/api/common'

export default {
  name: 'Info',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Field.name]: Field
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      userPhone: '',
      userSms: '',
      // 验证码
      codeText: '发送验证码',
      showCountDown: true, // 是否显示倒计时
      count: '', // 倒计时计数
      timer: null // 时间方法
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
    this.userPhone = this.userData.phone
  },
  methods: {
    onSubmit() {
      if (!/^1\d{10}$/.test(this.userPhone.replace(/(^\s*)|(\s*$)/g, ''))) {
        Toast('请输入正确的手机号')
        return false
      } else if (!this.userSms) {
        Toast('验证码不能为空')
        return false
      } else {
        savePhone({
          code: this.userSms
        }).then(res => {
          if (res.data.code === 1) {
            this.$store.dispatch('user/getUserData')
            this.$router.go(-1)
          } else {
            Toast.fail(res.data.info)
          }
        })
      }
    },
    // 获取验证码
    getAuthCode() {
      // 获取验证码
      var that = this
      var phone = this.userPhone ? this.userPhone.replace(/(^\s*)|(\s*$)/g, '') : ''
      if (!/^1\d{10}$/.test(phone)) {
        Toast('请输入正确的手机号')
      } else {
        this.codeText = '正在发送'
        getSms({
          'phone': phone
        }).then(res => {
          if (res.data.code === 0) {
            that.countDown()
          } else {
            this.codeText = '发送验证码'
            Toast(res.data.msg)
          }
        })
      }
    },
    // 倒计时
    countDown() {
      var that = this
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.showCountDown = false
        that.timer = setInterval(() => {
          if (that.count > 0 && that.count <= TIME_COUNT) {
            that.count--
          } else {
            that.codeText = '发送验证码'
            that.showCountDown = true
            clearInterval(that.timer)
            that.timer = null
          }
        }, 1000)
      }
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
  .sms-btn{
    color: @theme-color;
    background: #fff;
    border: 1px solid @theme-color;
  }
  .update-btn{
    width:195px;
    height:38px;
    line-height: 38px;
    background:rgba(19,209,181,1);
    border-radius:19px;
    margin: 20px auto 0 auto;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }
</style>

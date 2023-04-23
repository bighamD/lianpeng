<template>
  <div class="page">
    <div class="contact-box">
      <div class="name-box">
        <div class="input-box">
          <span class="input-title">真实姓名：</span>
          <input v-model="contactData.real_name" class="real_name" placeholder="请输入">
        </div>
        <van-checkbox v-model="contactData.is_default" class="default" checked-color="#13D1B5" icon-size="14px">设为默认联系人</van-checkbox>
      </div>
      <div class="info-box">
        <div v-for="item in fieldsList" :key="item">
          <div v-if="item == 'identity_no'" class="input-box">
            <span class="input-title" @click="showType = true">{{ contactData.identity_type ? contactData.identity_type : '证件类型' }} <van-icon name="arrow-down" class="icon-title" /></span>
            <input v-model="contactData.identity_no" class="input card" placeholder="请输入">
          </div>
          <div v-if="item == 'clothes_size'" class="input-box" @click="showSize = true">
            <span class="input-title">衣服码数：</span>
            <div class="input">{{ contactData.clothes_size }}</div>
          </div>
          <div v-if="item == 'birthdate'" class="input-box" @click="showDate = true">
            <span class="input-title">出生日期：</span>
            <div class="input">{{ contactData.birthdate }}</div>
          </div>
          <div v-if="item == 'sex'" class="input-box">
            <span class="input-title">性别：</span>
            <van-radio-group v-model="contactData.sex" class="sex-box" checked-color="#13D1B5" icon-size="16px">
              <van-radio :name="1">男</van-radio>
              <van-radio :name="2">女</van-radio>
            </van-radio-group>
          </div>
          <div v-if="item == 'phone'" class="input-box">
            <span class="input-title">电话号码：</span>
            <input v-model="contactData.phone" class="input" placeholder="请输入">
          </div>
          <div v-if="item == 'blood_type'" class="input-box">
            <span class="input-title">血型：</span>
            <input v-model="contactData.blood_type" class="input" placeholder="请输入">
          </div>
          <div v-if="item == 'contacts_name'" class="input-box">
            <span class="input-title">紧急联系人姓名：</span>
            <input v-model="contactData.contacts_name" class="input" placeholder="请输入">
          </div>
          <div v-if="item == 'contacts_phone'" class="input-box">
            <span class="input-title">紧急联系人电话：</span>
            <input v-model="contactData.contacts_phone" class="input" placeholder="请输入">
          </div>
        </div>
      </div>
      <div class="save-contact" @click="submit()">保存联系人</div>
    </div>
    <van-popup v-model="showDate" position="bottom">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel="showDate = false" @confirm="onConfirm" />
    </van-popup>
    <van-popup v-model="showSize" position="bottom">
      <van-picker show-toolbar :columns="sizeList" @confirm="onSizeConfirm" @cancel="showSize = false" />
    </van-popup>
    <van-popup v-model="showType" position="bottom">
      <van-picker show-toolbar :columns="typeList" @confirm="onTypeConfirm" @cancel="showType = false" />
    </van-popup>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Icon, Checkbox, RadioGroup, Radio, Toast, DatetimePicker, Popup, Picker } from 'vant'
import { clothesSize, createContacts, identityType, updateContacts, getContacts } from '@/api/user'
import { getActivityDetail } from '@/api/activity'

export default {
  name: 'SaveContact',
  components: {
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [RadioGroup.name]: RadioGroup,
    [DatetimePicker.name]: DatetimePicker,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Radio.name]: Radio
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      activityId: undefined, // 活动ID, 有活动ID则根据活动报名表单填写
      fields: [],
      callBack: null, // 回调路径
      id: undefined, // 联系人ID
      // 日期选择
      showDate: false,
      minDate: new Date(1900, 1, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      // 衣服码数
      showSize: false,
      sizeList: [],
      // 证件类型
      showType: false,
      typeList: [],
      // 资料
      contactData: {
        is_default: true,
        sex: 1,
        phone: null,
        real_name: null,
        birthdate: null,
        identity_type: '身份证',
        identity_no: null,
        clothes_size: null,
        blood_type: null,
        contacts_name: null,
        contacts_phone: null
      },
      // 获取的字段
      fieldsList: ['phone', 'real_name', 'birthdate', 'sex', 'identity_type', 'identity_no', 'clothes_size', 'blood_type', 'contacts_name', 'contacts_phone']
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.id = this.$route.params.id
    this.activityId = this.$route.params.activityId
    console.log('活动ID', this.activityId)
    if (this.id) { // 是否编辑状态下
      this.getDetails()
    }
    if (this.activityId) { // 获取活动报名字段
      this.getActivityDetail()
    }
    this.init()
  },
  mounted() {
  },
  methods: {
    // 获取衣服码数，身份证类型
    init() {
      clothesSize({}).then(res => {
        this.sizeList = res.data.data
      })
      identityType({}).then(res => {
        this.typeList = res.data.data
      })
    },
    // 获取报名字段
    getActivityDetail() {
      getActivityDetail({ id: this.activityId }).then(res => {
        if (res.data.code === 1) {
          this.fieldsList = res.data.data.fields
          console.log('活动字段', res.data.data.fields)
        }
      })
    },
    // 获取联系人详情（缓存）
    getDetails() {
      getContacts({
        id: this.id
      }).then(res => {
        console.log(res.data)
        if (res.data.code === 1) {
          res.data.data.is_default = res.data.data.is_default === 1
          this.currentDate = new Date(res.data.data.birthdate)
          this.contactData = res.data.data
          console.log(res.data.data)
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    // 表单校验
    submit() {
      var i
      for (i = 0; i < this.fieldsList.length; i++) {
        const name = this.fieldsList[i]
        if (!this.contactData[name]) {
          switch (name) {
            case 'phone':
              Toast('电话号码格式有误')
              return false
            case 'real_name':
              Toast('请输入真实姓名')
              return false
            case 'birthdate':
              Toast('请选择出生日期')
              return false
            case 'identity_no':
              Toast('请输入证件号码')
              return false
            case 'identity_type':
              Toast('请选择证件类型')
              return false
            case 'sex':
              Toast('请选择性别')
              return false
            case 'clothes_size':
              Toast('请选择衣服码数')
              return false
            case 'blood_type':
              Toast('请输入血型')
              return false
            case 'contacts_phone':
              Toast('请输入紧急联系人电话')
              return false
            case 'contacts_name':
              Toast('请输入紧急联系人')
              return false
          }
        } else {
          console.log('已填', this.contactData[name])
        }
      }
      if (i === this.fieldsList.length) {
        this.id ? this.saveData() : this.createData()
      }
    },
    // 添加联系人
    createData() {
      this.contactData['is_default'] = this.contactData['is_default'] ? 1 : 0
      createContacts(this.contactData).then(res => {
        if (res.data.code === 1) {
          Toast.success('添加成功')
          this.$router.go(-1)
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    // 保存联系人
    saveData() {
      this.contactData['is_default'] = this.contactData['is_default'] ? 1 : 0
      updateContacts(this.contactData).then(res => {
        if (res.data.code === 1) {
          Toast.success('修改成功')
          this.$router.go(-1)
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    onTypeConfirm(value) {
      this.contactData.identity_type = value
      this.showType = false
    },
    onSizeConfirm(value) {
      this.contactData.clothes_size = value
      this.showSize = false
    },
    onConfirm(value) {
      var year = value.getFullYear()
      var month = value.getMonth() + 1
      var day = value.getDate()
      day = day < 10 ? '0' + day : day
      month = month < 10 ? '0' + month : month
      this.contactData.birthdate = `${year}-${month}-${day}`
      this.showDate = false
    },
    onReturn(name) {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
  .contact-box{
    width:339px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(222,222,222,1);
    border-radius:6px;
    margin: 11.5px auto 0 auto;
    padding: 8px;
  }
  .save-contact{
    text-align: center;
    font-size:14px;
    color: @theme-color;
    padding-top: 13px;
    padding-bottom: 6px;
    border-top: 1px solid #eee;
  }
  .name-box{
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .default{
      font-size: 11px;
      margin-right: 10px;
    }
  }
  .input-box{
    margin: 0 20px;
    padding: 12px 0;
    display: flex;
    align-items: center;
    .input-title{
      font-size:14px;
      color: #333;
      display: flex;
      align-items: center;
      .icon-title{
        font-size: 12px;
        margin-right: 10px;
      }
    }
    .input{
      width: 120px;
      font-size:14px;
      &.card{
        width: 200px;
      }
    }
    .real_name{
      width: 80px;
      font-size:14px;
    }
  }
  .sex-box{
    display: flex;
  }
  .van-radio{
    margin-right: 20px;
  }
</style>

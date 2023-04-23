<template>
  <div class="page">
    <div class="complaint-main">
      <van-field v-model="complaintText" placeholder="对我们有任何建议或投诉，都可以与我们反馈哦~" autosize type="textarea" rows="6" maxlength="140" show-word-limit>
        <svg-icon slot="left-icon" icon-class="input" class="icon-input" />
      </van-field>
      <van-field v-model="phone" placeholder="联系方式选填（手机或邮箱）" class="complaint-phone" />
      <van-uploader v-model="fileList" multiple :after-read="afterRead" class="uploader-box" />
      <div v-if="storeData" class="contact">客服电话：{{ storeData.service_phone }} <br> 公司邮箱：{{ storeData.company_email }}</div>
    </div>
    <div class="complaint-btn" @click="onSubmit">提交</div>
  </div>
</template>

<script>
import { Image, Field, Uploader, Toast } from 'vant'
import { suggest } from '@/api/index'
import { upload } from '@/api/common'
import { storeDetails } from '@/api/store'

export default {
  name: 'Complaint',
  components: {
    [Image.name]: Image,
    [Uploader.name]: Uploader,
    [Field.name]: Field
  },
  filters: {
  },
  data() {
    return {
      seasonId: undefined,
      storeData: null,
      complaintText: '',
      phone: '',
      fileList: [],
      pics: []
    }
  },
  computed: {},
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
    this.getStoreData()
  },
  methods: {
    getStoreData() {
      storeDetails({}).then(res => {
        console.log(res.data.data)
        this.storeData = res.data.data
      })
    },
    onSubmit() {
      console.log(this.complaintText.length)
      if (this.complaintText.length < 5) {
        Toast.fail('反馈内容不得少于5个字')
        return false
      } else {
        suggest({
          content: this.complaintText,
          picture: this.pics.length > 0 ? this.pics.join(',') : null
        }).then(res => {
          if (res.data.code === 1) {
            Toast.success('提交成功')
            this.$router.go(-1)
          }
        })
      }
    },
    // 上传图片
    afterRead(file) {
      const that = this
      var deviceFile = []
      if (Array.isArray(file)) {
        deviceFile = file
      } else {
        deviceFile.push(file)
      }
      if (deviceFile.length === 0) {
        return
      }
      var promise = Promise.all(deviceFile.map((item, index) => {
        return new Promise(function(resolve, reject) {
          upload(item.file).then(res => {
            if (res.data.code === 0) {
              console.log(res.data.data)
              resolve(res.data.data.url, index)
            } else {
              reject('第' + (index + 1) + '张图片上传失败！')
            }
          })
        })
      }))
      promise.then(function(results) {
        that.pics = results
      }).catch(function(error) {
        Toast(error)
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
  .complaint-main{
    background: #fff;
    padding: 12.5px;
    .icon-input{
      font-size: 24px;
      color: #666666;
    }
    .van-field{
      font-size: 12px;
      color: #666;
      padding: 0;
    }
    .complaint-phone{
      margin-top: 10px;
      padding: 30px 0 10px 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
    }
  }
  .comment-btn{
    width:195px;
    height:38px;
    line-height: 38px;
    background:rgba(19,209,181,1);
    border-radius:19px;
    margin: 20px auto;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
  .van-cell:not(:last-child)::after{
    border: none;
  }
  .uploader-box{
    margin-top: 20px;
  }
  .contact{
    font-size:12px;
    color:rgba(153,153,153,1);
    line-height: 21px;
  }
  .complaint-btn{
    width:195px;
    height:38px;
    line-height: 38px;
    background:rgba(19,209,181,1);
    border-radius:19px;
    margin: 20px auto;
    color: #fff;
    font-size: 18px;
    text-align: center;
  }
</style>

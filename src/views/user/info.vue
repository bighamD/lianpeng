<template>
  <div v-if="userData" class="page">
    <van-cell title="头像" center>
      <div cell-slots="default">
        <van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" :deletable="false" class="edit-img">
          <van-image class="avatar-img" :src="headimgurl" fit="cover" round @click="showEdit = true" />
        </van-uploader>
      </div>
    </van-cell>
    <van-cell title="昵称" :value="userData.nickname" is-link @click="openPopup(0, '昵称修改')" />
    <van-cell title="个性签名" :value="userData.personalized || '放弃不难，但坚持很酷'" is-link @click="openPopup(1, '个性签名修改')" />
    <van-cell title="用户ID" :value="userData.id" />
    <van-cell title="性别">
      <div cell-slots="default" class="sex-box">
        <span :class="[userData.sex == 1 ? 'sel' : '' ]" @click="updateSex(1)">男</span>
        <span :class="[userData.sex == 2 ? 'sel' : '' ]" @click="updateSex(2)">女</span>
      </div>
    </van-cell>
    <van-cell title="绑定微信">
      <div cell-slots="default" class="binding-wx">
        <div class="wx">{{ userData.wechat ? userData.wechat.nickname : '去绑定' }}</div>
        <van-image v-if="userData.wechat" class="wx-avatar-img" :src="userData.wechat.headimgurl" fit="cover" round />
      </div>
    </van-cell>
    <van-cell title="真实姓名" :value="userData.name" is-link @click="openPopup(2, '真实姓名修改')" />
    <van-cell :title="userData.phone ? '手机号' : '绑定手机号'" :value="userData.phone" is-link @click="onJump('savePhone')" />
    <van-cell title="常用联系人" is-link @click="onJump('contactList')" />
    <van-popup v-model="popupShow">
      <div class="update-box">
        <van-icon name="close" class="icon-close" @click="popupShow = false" />
        <div class="update-title">{{ popupTitle }}</div>
        <van-field v-if="popupStatus == 1" v-model="signature" class="update-textarea" placeholder="输入你的个性签名" autosize type="textarea" rows="3" show-word-limit />
        <van-field v-if="popupStatus == 0" v-model="nickName" class="update-input" placeholder="输入新的昵称" maxlength="6" />
        <van-field v-if="popupStatus == 2" v-model="name" class="update-input" placeholder="输入真实姓名" maxlength="5" />
        <div class="update-btn" @click="updateText()">确定修改</div>
      </div>
    </van-popup>
    <van-popup v-model="showEdit" position="bottom" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Icon, Image, Cell, CellGroup, Popup, Field, Toast, Uploader } from 'vant'
import { saveInfo } from '@/api/user'
import { upload } from '@/api/common'

export default {
  name: 'Info',
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Image.name]: Image,
    [Popup.name]: Popup,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Icon.name]: Icon
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      popupShow: false,
      popupTitle: '',
      popupStatus: undefined,
      headimgurl: '',
      nickName: '',
      name: '',
      signature: '',
      fileList: [],
      showEdit: false
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
    this.nickName = this.userData.nickname
    this.headimgurl = this.userData.headimgurl
    this.name = this.userData.name
    this.signature = this.userData.personalized || '放弃不难，但坚持很酷'
  },
  methods: {
    // 性别
    updateSex(sex) {
      var parameter = {}
      parameter['sex'] = sex
      this.saveData(parameter)
    },
    // 昵称、个性签名
    updateText() {
      var parameter = {}
      if (this.popupStatus === 1) {
        parameter['personalized'] = this.signature
      } else if (this.popupStatus === 0) {
        parameter['nickname'] = this.nickName
      } else if (this.popupStatus === 2) {
        parameter['name'] = this.name
      }
      this.saveData(parameter)
    },
    // 请求接口
    saveData(parameter) {
      saveInfo(parameter).then(res => {
        if (res.data.code === 1) {
          this.popupShow = false
          this.$store.dispatch('user/getUserData')
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    // 打开弹窗
    openPopup(status, title) {
      this.popupShow = true
      this.popupTitle = title
      this.popupStatus = status
    },
    // 修改头像
    afterRead(file) {
      var that = this
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
              resolve(res.data.data.url, index)
            } else {
              reject('上传失败！')
            }
          })
        })
      }))
      promise.then(function(results) {
        var parameter = {
          headimgurl: results[0]
        }
        that.headimgurl = results[0]
        that.saveData(parameter)
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
  .avatar-img{
    width: 60px;
    height: 60px;
  }
  .sex-box{
    background: #eee;
    width: 50px;
    height: 24px;
    border-radius: 5px;
    overflow: hidden;
    float: right;
    span{
      display: inline-block;
      width: 25px;
      text-align: center;
      color: @theme-color;
    }
    .sel{
      color: #fff;
      background: @theme-color;
    }
  }
  .binding-wx{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .wx{
      margin-right: 10px;
    }
    .wx-avatar-img{
      width: 25px;
      height: 25px;
    }
  }
  .van-popup{
    background: none;
  }
  .update-box{
    position: relative;
    width: 250px;
    padding:35px 19px 19px 25px;
    background: #fff;
    border-radius: 6px;
    .icon-close{
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 24px;
      color: @theme-color;
    }
    .update-title{
      text-align: center;
      font-size: 14px;
      color: #333;
    }
    .update-textarea{
      width:250px;
      background:rgba(246,247,249,1);
      border-radius:6px;
      font-size:12px;
      color: #666;
      margin: 20px 0;
    }
    .update-input{
      width:250px;
      background:rgba(246,247,249,1);
      border-radius:6px;
      font-size:12px;
      color: #666;
      margin: 20px 0;
    }
    .update-btn{
      width:195px;
      height:38px;
      line-height: 38px;
      background:@theme-color;
      border-radius:19px;
      margin: 20px auto 0 auto;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
  }
  .edit-img{
    border-radius: 50%;
    width: 60px;
    height: 60px;
    overflow: hidden;
  }
</style>

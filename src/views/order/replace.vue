<template>
  <div class="page">
    <div class="rule-box">
      请选择需要替换的报名人员<br>
      如果报名人员信息填写错误，也可用替员功能更正<br><br>
      替员功能说明：<br>
      1.出发前一天22点后不允许替员；<br>
      2.替员信息仅可修改一次，不可撤销，请谨慎操作。
    </div>
    <div class="list">
      <div v-for="item in memberList" :key="'member' + item.id" :class="['item', item.is_for == 0 || item.is_quit == 1 ? 'gary' : '']">
        <div class="item-info">
          <div class="info">姓名：{{ item.real_name }}</div>
          <div class="info">证件号码：{{ item.identity_no }}</div>
          <div class="info">电话号码：{{ item.phone }}</div>
        </div>
        <div class="item-btn" @click="item.is_for == 0 || item.is_quit === 1 ? '' : openPopup(item)">替员</div>
      </div>
    </div>
    <van-popup v-model="popupShow">
      <div class="update-box">
        <van-icon name="close" class="icon-close" @click="popupShow = false" />
        <div v-if="popupData" class="update-title">你当前要替换的人员是：<span class="update-user">{{ popupData.real_name }}</span></div>
        <div class="replace-box">
          <div class="replace-hint">请选择代替者信息</div>
          <div class="replace-btn" @click="onContactJump()">添加联系人</div>
        </div>
        <van-radio-group v-model="radio" class="contact-list">
          <van-radio v-for="(item) in list" :key="item.id" :name="item.id" class="contact-item">
            <template #icon="props">
              <div :class="['item-box', props.checked ? 'item-sel' : '']">
                <div class="name-box">
                  <div class="name">{{ item.real_name }}: {{ item.phone }}</div>
                  <div class="name">{{ item.identity_type }}: {{ item.identity_no }}</div>
                </div>
                <van-icon name="success" class="icon-select" />
                <div class="edit-contact" @click.stop="onContactJump(item.id)">编辑</div>
              </div>
            </template>
          </van-radio>
        </van-radio-group>
        <div class="update-btn" @click="submitUpdate">提交</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Icon, Popup, Field, Toast, RadioGroup, Radio } from 'vant'
import { checkReplace, forMember } from '@/api/order'
import { getContactsList } from '@/api/user'

export default {
  name: 'Replace',
  components: {
    [Popup.name]: Popup,
    [Field.name]: Field,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [Icon.name]: Icon
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      orderId: undefined,
      isReplace: false, // 替换
      memberList: [],
      // 替换人员
      popupShow: false,
      popupData: null,
      radio: null,
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
      checkReplace({ id: this.orderId }).then(res => {
        console.log(res.data.data)
        if (res.data.code === 1) {
          this.isReplace = res.data.data.order_is_for === 1
          this.memberList = res.data.data.member
          this.getList()
        } else {
          Toast.fail(res.data.info)
        }
      })
    },
    // 获取我的常用联系人列表
    getList() {
      getContactsList({}).then(res => {
        this.list = res.data.data.list
        for (var i = 0; i < this.list.length; i++) {
          for (var j = 0; j < this.memberList.length; j++) {
            if (this.list[i].identity_no === this.memberList[j].identity_no) {
              this.list.splice(i, 1)
            }
          }
        }
        console.log(this.list)
      })
    },
    // 替换
    submitUpdate() {
      if (this.radio) {
        forMember({
          id: this.orderId,
          order_member_id: this.popupData.id,
          for_contacts_id: this.radio
        }).then(res => {
          if (res.data.code === 1) {
            Toast.success('替换成功')
            this.initData()
          } else {
            Toast.fail(res.data.info)
          }
        })
      }
    },
    openPopup(row) {
      this.popupData = row
      this.popupShow = true
    },
    onContactJump(id) {
      var parameter = {
        storeId: this.storeId
      }
      if (id) { parameter['id'] = id }
      this.$router.push({
        name: 'saveContact',
        params: parameter
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
  .rule-box{
    margin: 12px auto;
    width:315px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(222,222,222,1);
    border-radius:6px;
    overflow: hidden;
    font-size:12px;
    font-weight:500;
    line-height: 20px;
    padding: 20px;
    color: #333;
  }
  .list{
    .item{
      margin: 12px auto;
      width:355px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(222,222,222,1);
      border-radius:6px;
      overflow: hidden;
      font-size:14px;
      font-weight:500;
      line-height: 20px;
      color: #333;
      &.gary{
        .item-info{
          .info{
            &:before{
              background:#C5C5C5;
            }
          }
        }
        .item-btn{
          background: #999999;
        }
      }
      .item-info{
        padding: 20px;
        color: #333333;
        .info{
          position: relative;
          height: 30px;
          line-height: 30px;
          padding-left: 15px;
          &:before{
            content: '';
            position: absolute;
            width: 7px;
            height: 7px;
            background: @theme-color;
            border-radius: 50%;
            left: 0;
            top: 12px;
          }
        }
      }
      .item-btn{
        height:46px;
        line-height: 46px;
        background: @theme-color;
        font-size:18px;
        color: #fff;
        text-align: center;
      }
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
      font-size:14px;
      color: #333;
    }
    .update-user{
      color: @theme-color;
    }
    .replace-box{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px 0 12px 0;
      .replace-hint{
        font-size:11px;
        font-weight:500;
        color: #666666;
      }
      .replace-btn{
        width:70px;
        height:20px;
        line-height: 20px;
        background: @theme-color;
        border-radius:5px;
        color: #fff;
        font-size: 11px;
        text-align: center;
      }
    }
    .update-btn{
      width:195px;
      height:38px;
      line-height: 38px;
      background: @theme-color;
      border-radius:19px;
      margin: 20px auto 0 auto;
      color: #fff;
      font-size: 15px;
      text-align: center;
    }
  }

  .contact-list{
    margin: 0 auto;
    overflow-y: auto;
    max-height: 200px;
  }
  .contact-item{
    width: 100%;
    display: block;
    height: 59px;
    margin: 5px auto 0 auto;
    .item-box{
      position: relative;
      background:rgba(255,255,255,1);
      border:1px solid rgba(222,222,222,1);
      border-radius:6px;
      overflow: hidden;
      padding: 8px 12px;
      &.item-sel{
        border: 1px solid @theme-color;
        &:before{
          content: '';
          width:0; height:0; font-size:0;border-style:solid;overflow:hidden; position:absolute;
          border-width:30px;border-color:transparent @theme-color transparent transparent;right:0; bottom:-30px;
        }
      }
    }
    .icon-select{
      position: absolute;
      color: #fff;
      font-size: 18px;
      right: -2px;
      bottom: -5px;
      z-index: 9;
      background: none;
      border: none;
    }
    .name-box{
      .name{
        font-size:12px;
        color: #666;
      }
    }
    .edit-contact{
      position: absolute;
      right: 20px;
      top: 7px;
      font-size:12px;
      text-align: center;
      color: @theme-color;
    }
  }
</style>

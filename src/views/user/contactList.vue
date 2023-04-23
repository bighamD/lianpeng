<template>
  <div class="page">
    <div class="add-contact" @click="onContactJump()">
      <van-icon name="plus" class="icon-add" />添加出行人
    </div>
    <div class="contact-list">
      <div v-for="(item, index) in list" :key="item.id" class="contact-item">
        <van-icon name="delete" class="icon-delete" @click.stop="deleteData(item.id, index)" />
        <div class="name-box">
          <div class="name">
            {{ item.real_name }}
            <img v-if="item.is_vip == 1" src="@/assets/vip-sel.png" class="vip">
            <img v-else src="@/assets/vip.png" class="vip">
          </div>
          <div v-if="item.is_default == 1" class="default">默认</div>
        </div>
        <div class="info-box">
          {{ item.identity_type }}：{{ item.identity_no }}<br>
          电话号码：{{ item.phone }}
        </div>
        <div class="edit-contact" @click="onContactJump(item.id)">编辑联系人</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Icon, Toast, Dialog } from 'vant'
import { getContactsList, deleteContacts } from '@/api/user'

export default {
  name: 'Activity',
  components: {
    [Icon.name]: Icon
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      list: []
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取我的常用联系人列表
    getList() {
      getContactsList({}).then(res => {
        console.log(res.data.data.list)
        this.list = res.data.data.list
      })
    },
    // 删除联系人
    deleteData(id, index) {
      Dialog.confirm({
        title: '确认提示',
        message: '确认删除联系人《' + this.list[index].real_name + '》吗？'
      }).then(() => {
        deleteContacts({ id: id }).then(res => {
          if (res.data.code === 1) {
            console.log(res)
            this.list.splice(index, 1)
          } else {
            Toast.fail(res.data.info)
          }
        })
      }).catch(() => {
        // on cancel
      })
    },
    onContactJump(id) {
      var parameter = {
        storeId: this.storeId
      }
      console.log(id)
      if (id) { parameter['id'] = id }
      this.$router.push({
        name: 'saveContact',
        params: parameter
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .add-contact{
    width:355px;
    height:50px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(222,222,222,1);
    border-radius:6px;
    margin: 11.5px auto 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #444;
    .icon-add{
      font-size: 20px;
      color: #9C9C9C;
    }
  }
  .contact-list{
    width:355px;
    margin: 0 auto;
  }
  .contact-item{
    position: relative;
    margin: 11.5px auto 0 auto;
    background:rgba(255,255,255,1);
    border:1px solid rgba(222,222,222,1);
    border-radius:6px;
    padding: 8px;
    .icon-delete{
      position: absolute;
      right: 10px;
      top: 10px;
      color: #999998;
      font-size: 15px;
    }
    .name-box{
      padding: 12px 25px;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;
      .name{
        display: flex;
        align-items: center;
        font-size:14px;
        color: #333;
        .vip{
          width: 42px;
          margin-left: 10px;
        }
      }
      .default{
        color: @theme-color;
        border-radius: 5px;
        border: 1px solid @theme-color;
        width:33px;
        height:15px;
        text-align: center;
        line-height: 15px;
        font-size: 11px;
        margin-left: 12px;
      }
    }
    .info-box{
      padding: 15px 25px;
      font-size:12px;
      color: #666666;
      line-height: 26px;
      border-bottom: 1px solid #eee;
    }
    .edit-contact{
      text-align: center;
      font-size:14px;
      color: @theme-color;
      padding-top: 13px;
      padding-bottom: 6px;
    }
  }
</style>

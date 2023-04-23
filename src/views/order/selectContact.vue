<template>
  <div class="page">
    <div class="add-contact" @click="onContactJump()">
      <van-icon name="plus" class="icon-add" />添加出行人
    </div>
    <van-checkbox-group v-model="checked" class="contact-list">
      <van-checkbox v-for="item in list" :key="item.id" :name="item.id" class="contact-item" @click="item.isLack ? onContactJump(item.id) : ''">
        <template #icon="props">
          <div class="item-box">
            <div class="name-box">
              <div class="name">
                {{ item.real_name }}
                <img v-if="item.is_vip == 1" src="@/assets/vip-sel.png" class="vip">
                <img v-else src="@/assets/vip.png" class="vip">
              </div>
              <div v-if="item.is_default == 1" class="default">默认</div>
            </div>
            <div v-if="item.isLack" class="edit-contact replenish" @click.stop="onContactJump(item.id)">信息不全，点击补充</div>
            <div v-else class="edit-contact" @click.stop="onContactJump(item.id)">编辑联系人</div>
            <van-icon v-if="props.checked" name="checked" class="icon-select" />
            <van-icon v-else class="icon-select-pass" name="passed" />
          </div>
        </template>
      </van-checkbox>
    </van-checkbox-group>
    <div class="save-btn" @click="onSave()">确定</div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Icon, Checkbox, CheckboxGroup } from 'vant'
import { getContactsList } from '@/api/user'
import { getActivityDetail } from '@/api/activity'
import cache from '@/utils/cache'
export default {
  name: 'SelectContact',
  components: {
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup
  },
  filters: {
  },
  data() {
    return {
      storeId: undefined,
      periodId: undefined,
      fields: [],
      list: [],
      checked: []
    }
  },
  created() {
    this.storeId = this.$route.params.storeId
    this.activityId = this.$route.params.activityId
    this.periodId = this.$route.params.periodId
    if (this.activityId && this.periodId) {
      this.getActivityDetail()
    }
  },
  mounted() {
  },
  methods: {
    // 获取报名字段
    getActivityDetail() {
      getActivityDetail({ id: this.activityId }).then(res => {
        if (res.data.code === 1) {
          this.fields = res.data.data.fields
          console.log('活动字段', res.data.data.fields)
          this.getList(res.data.data.fields)
        }
      })
    },
    // 获取我的常用联系人列表
    getList(fields) {
      getContactsList({}).then(res => {
        // 循环判断是否有缺省字段
        this.list = res.data.data.list.map(item => {
          item['isLack'] = false
          for (var i = 0; i < fields.length; i++) {
            if (item.hasOwnProperty(fields[i]) && !item[fields[i]]) {
              item['isLack'] = true
            }
          }
          return item
        })
        console.log(this.list)
        // 查询缓存中是否有缓存的选中用户
        var data = cache.getItem('store' + this.storeId + '_period' + this.periodId + '_contactsList') || []
        this.checked = data.map(item => {
          return item.id
        })
      })
    },
    // 提交, 并加入缓存, 返回
    onSave() {
      var data = []
      var list = this.list
      var i = 0
      for (;i < list.length;) {
        if (this.checked.indexOf(list[i].id) > -1) {
          data.push(list[i])
        }
        i++
      }
      if (i === list.length) {
        cache.setItem({
          name: 'store' + this.storeId + '_period' + this.periodId + '_contactsList',
          value: data,
          expires: 259200 // 3天
        })
        this.$router.go(-1)
      }
    },
    onContactJump(id) {
      var parameter = {
        storeId: this.storeId,
        activityId: this.activityId
      }
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
      margin-right: 5px;
    }
  }
  .contact-list{
    width:355px;
    margin: 0 auto;
    padding-bottom: 100px;
  }
  .contact-item{
    width: 100%;
    display: block;
    overflow: inherit;
    height: 60px;
    .item-box{
      position: relative;
      margin: 11.5px auto 0 auto;
      background:rgba(255,255,255,1);
      border:1px solid rgba(222,222,222,1);
      border-radius:6px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .name-box{
      width: 160px;
      padding: 12px 0 12px 12px;
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
    .icon-select{
      position: absolute;
      color: @theme-color;
      font-size: 20px;
      right: 10px;
      top: 50%;
      z-index: 9;
      margin-top: -10px;
      background: none;
      border: none;
    }
    .icon-select-pass{
      position: absolute;
      color: #999999;
      font-size: 20px;
      right: 10px;
      top: 50%;
      z-index: 9;
      margin-top: -12px;
      background: none;
      border: none;
    }
    .edit-contact{
      margin-right: 35px;
      text-align: center;
      font-size:14px;
      color: @theme-color;
      &.replenish{
        color: #f41614;
        font-size: 11px;
      }
    }
  }
  .save-btn{
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
    z-index: 10;
  }
</style>

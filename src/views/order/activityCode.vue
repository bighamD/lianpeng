<template>
  <div class="activity-code">
    <div class="title">活动编号</div>
    <div class="code">{{ code }}</div>
    <p class="desc">活动现场出示活动编号可便于活动现场签到/领取物资</p>
  </div>
</template>
<script>
export default {
  name: 'AcitivtyCode',
  props: {
    code: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.activity-code {
    text-align: center;
    transform: translateY(-16px);
    .title {
        font-size: 14px;
        font-weight: 700;
    }

    .code {
        font-size: 32px;
        color: #21cab2;
        margin: 8px 0;
    }
    .desc {
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
    }
}
</style>

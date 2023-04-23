<template>
  <div id="app">
    <router-view name="header" />
    <router-view />
    <router-view name="footer" />
  </div>
</template>

<script>
import { Popup, Icon } from 'vant'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    [Popup.name]: Popup,
    [Icon.name]: Icon
  },
  data() {
    return {
      tagType: false
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  methods: {}
}
</script>
<style lang="less" scoped></style>

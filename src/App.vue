<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { XHeader } from 'vux'
export default {
  name: 'app',
  components: {
    XHeader
  },
  data () {
    return {
      showBackData: true
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body{
  background: #ebebeb;
}
.vux-x-icon {
  fill: #ffffff;
}
.weui-cells{
  margin: 0 !important;
}
.weui-dialog__bd{
  display: none;
}
.weui-dialog__btn_primary{
  color: #459ffb;
}
.vux-table{
  line-height: normal !important;
}
.weui-dialog{
  z-index: 499!important;
}
.weui-mask {
  z-index: 498!important;
}
</style>

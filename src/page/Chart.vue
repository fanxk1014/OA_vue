<template>
  <div>
    <x-header :left-options="{showBack: true}">
      {{pageTitle}}
      <a slot="right" @click="goLogin()" v-if="!userName">
        <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
        <!--<i class="iconfont icon-user1"></i>-->
      </a>
      <a slot="right" @click="goLogin()" v-if="userName">
        {{userName}}
      </a>
    </x-header>
  </div>
</template>

<script>
  import { XHeader } from 'vux'

  export default {
    components: {
      XHeader
    },
    data () {
      return {
        pageTitle: '管理员驾驶舱',
        userName: false
      }
    },
    mounted () {
      if(this.$store.state.userInfo.accounts){
        this.userName = this.$store.state.userInfo.accounts;
      }
    },
    methods: {
      goLogin () {
        this.$router.push({ name: 'Login'});
      }
    }
  }
</script>

<style>
  .weui-cells{
    margin-top: 0 !important;
  }
</style>

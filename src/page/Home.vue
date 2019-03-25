<template>
  <div>
    <x-header :left-options="{showBack: false}">
      {{pageTitle}}
      <a slot="right" @click="goLogin()" v-if="!userName">
        <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
        <!--<i class="iconfont icon-user1"></i>-->
      </a>
      <a slot="right" @click="goLogin()" v-if="userName">
        {{userName}}
      </a>
    </x-header>
    <swiper :list="swiperData" height="170px"></swiper>
    <!--<div class="top-img">-->
      <!--<img src="../assets/banner/banner1.png" height="170px" width="100%" alt="">-->
    <!--</div>-->
    <home-list v-if="$store.state.url" :baseUrl="$store.state.url"></home-list>
  </div>
</template>

<script>
import { Group, Cell, XHeader, Swiper } from 'vux'
import HomeList from '../components/home/HomeList'

export default {
  components: {
    HomeList,
    Group,
    Cell,
    XHeader,
    Swiper
  },
  data () {
    return {
      pageTitle: '',
      userName: false,
      swiperData: [{
        url: 'javascript:',
        img: '',
        title: ''
      }]
    }
  },
  mounted: function () {
    this.showBackData = true;

    let stateUrl = this.$store.state.url;
    if(stateUrl == ''){
      this.$store.state.url = window.parent.document.getElementById("hostAddress").value;
      this.getUser();
    }else{
      this.getUser();
    }
    this.swiperData[0].img = this.$store.state.url+'/app/src/assets/banner/banner1.png';
  },
  methods: {
    goLogin () {
      this.$router.push({ name: 'Login'});
    },
    getUser () {
      this.axios({
        url: this.$store.state.url+'/wechat/login/user',
        method: 'get'
      }).then((response) => {
        console.log(response.data);
        if(response.data.account){
          this.$store.state.userInfo = response.data.account;
          this.$store.state.openId = response.data.account.openid;
          this.userName = response.data.account.accounts;
        }
        if(response.data.token && response.data.success === true){
          this.$store.state.token = response.data.token;
        }
        if(this.$store.state.token == '' && this.$store.state.openId == ''){// 如果未绑定，获取微信openId
          this.getOpenId();
        }
      }).catch((response) => {
        console.log(response);
      });
    },
    getOpenId () {
      let openidUrl = window.location.href;
      let openidStr;
      if(openidUrl.indexOf('openid') != -1){
        let fromPos = openidUrl.indexOf('=');
        openidStr = openidUrl.substr(fromPos+1);
        this.$store.state.openId = openidStr;
      }else{// 必须经过微信认证中心跳转才会有openid
        window.location.href = this.$store.state.url + '/wechat/login';
      }
    }
  }
}
</script>

<style scoped lang="less">
  .vux-header{
    z-index: 9;
    position: fixed !important;
    top: 0;
    width: 100%;
  }
  .vux-slider{
    margin-top: 46px;
  }
  .top-img{
    margin-top: 46px;
  }
</style>

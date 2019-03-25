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
    <group style="margin-top: 46px;">
      <cell-box is-link :link="{path:'/content',query: {id: item}}" :key="item.id" v-for="item in noticeData.list">
        <flexbox>
          <flexbox-item><div class="flex-demo home-list-title">
            <p class="item-p">{{item.title}}</p>
          </div></flexbox-item>
          <flexbox-item><div class="flex-demo home-list-date">{{item.sendTime.substr(0,10)}}</div></flexbox-item>
        </flexbox>
      </cell-box>

    </group>
  </div>
</template>

<script>
  import { XHeader, Group, Cell, CellBox, Flexbox, FlexboxItem } from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      Cell,
      CellBox,
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        pageTitle: '公司新闻',
        noticeData: {},
        userName: false,
        pageType: ''
      }
    },
    mounted () {

      // 通知通告，若未登录，跳转到登录页
      if(this.$store.state.userInfo.accounts){
        this.userName = this.$store.state.userInfo.accounts;
      }

      this.axios({
        url: this.$store.state.url+'/wechat/information/list?columnType=2',
        method: 'get',
      }).then((response) => {
        this.noticeData = response.data;
      }).catch((response) => {
      });

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
  .vux-header{
    z-index: 9;
    position: fixed !important;
    top: 0;
    width: 100%;
  }
  .home-list-date{
    float: right;
    padding-right: 15px;
  }
  .item-p{
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2;
  }
  .articleContext img{
    width: 100% !important;
    height: auto !important;
  }
  *{
    word-wrap:break-word;
  }
</style>

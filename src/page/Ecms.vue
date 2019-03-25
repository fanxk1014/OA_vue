<template>
  <div>
    <x-header :left-options="{showBack: false}">
      <a slot="left" @click="goHome()">
        <img class="icon" slot="label" src="../assets/icon/back.png" width="18" height="18">
        <span class="jump-back">返回</span>
      </a>
      {{pageTitle}}
      <a slot="right" @click="goLogin()" v-if="!userName">
        <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
        <!--<i class="iconfont icon-user1"></i>-->
      </a>
      <a slot="right" @click="goLogin()" v-if="userName">
        {{userName}}
      </a>
    </x-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>

    <div class="list-part">
      <div class="msg-items" v-for="item in tabList">
        <p class="item-date">
          <span>{{item.createDate}}</span>
        </p>
        <div class="item-detail">
          <router-link :to="{path:'detail',query: {id: item.taskId,stepId: item.stepId,flowId: item.flowId,tag: '',title: item.flowName}}">
            <p class="item-detail-type">{{item.flowName}}</p>
            <p class="item-detail-subtitle">您有一个申请需要处理，请点击本信息进行处理</p>
            <p class="item-detail-title">标题：{{item.businessName}}</p>
            <p class="item-detail-user">申请人：{{item.operatorName}}</p>
          </router-link>
        </div>
      </div>
    </div>

    <tabbar>
      <tabbar-item @on-item-click="todoTrigger" link="/todo">
        <span slot="label">待办事宜</span>
      </tabbar-item>
      <tabbar-item @on-item-click="launchTrigger">
        <span slot="label">发起申请</span>
      </tabbar-item>
      <tabbar-item @on-item-click="processTrack">
        <span slot="label">进度跟踪</span>
      </tabbar-item>
    </tabbar>

    <div class="done-dialog" v-show="maskStatus">
      <span class="done-list-item" @click="goDone">已办事项</span>
      <p>
        <img class="icon" slot="label" src="../assets/icon/arrow-down.png" >
      </p>
    </div>

    <div class="mask" @click="processTrack" v-show="maskStatus"></div>

  </div>
</template>

<script>
  import { XHeader, Tabbar, TabbarItem, Cell } from 'vux'

  export default {
    components: {
      XHeader,
      Tabbar,
      TabbarItem,
      Cell
    },
    data () {
      return {
        pageTitle: '',
        userName: false,
        baseUrl: this.$store.state.url,
        tabList: [],
        maskStatus: false,//遮罩层
      }
    },
    mounted () {

      if(this.$route.query.isJump){//点击推送，跳入详情页
        console.log('跳转',this.$route.query);
        this.baseUrl = this.$route.query.hostAddress;
        this.$store.commit('setStateVal',{
          url: this.baseUrl,
          token: this.$route.query.token,
          userName: this.$route.query.account,
        });
      }

      if(this.$store.state.userInfo.accounts){
        this.userName = this.$store.state.userInfo.accounts;
      }

      this.$store.state.todoTabType = '';// 待办页 默认打开合同tab
      this.$vux.loading.show({
        text: '加载中'
      });
      this.axios({
        url: this.baseUrl+'/wechat/todo/personal',// 打开待办页，默认显示‘合同’
        method: 'get'
      }).then((response) => {
        let dataArr = response.data.list;
        this.tabList = dataArr;
        this.$vux.loading.hide();
      }).catch((response) => {
        this.$vux.loading.hide();
      });

    },
    methods: {
      goLogin () {
        this.$router.push({ name: 'Login'});
      },
      goHome () {
        this.$router.push({ name: 'Home'});
      },
      goDone () {
        this.$router.push({ name: 'Done'});
      },
      todoTrigger () {
        this.maskStatus = false;
      },
      launchTrigger () {
        this.maskStatus = false;
        this.$router.push({ name: 'Launch'});
        // this.$common.notFound();
      },
      processTrack () {
        if(this.maskStatus == true){
          this.maskStatus = false;
        }else{
          this.maskStatus = true;
        }
      },
    }
  }
</script>

<style scoped lang="less">
  .weui-tabbar{
    position: fixed;
    bottom: 0;
  }
  .vux-header{
    z-index: 9;
    position: fixed !important;
    top: 0;
    width: 100%;
    .jump-back{
      position: relative;
      top: -3px;
    }
  }
  .list-part{
    background: #ebebeb;
    margin-top: 46px;
    padding-bottom: 100px;
    .msg-items{
      padding: 15px 13px 5px 13px;
      .item-date{
        text-align: center;
        font-size: 12px;
        span{
          background: #cecece;
          color: #ffffff;
          border-radius: 5px;
          padding: 2px 10px;
        }
      }
      .item-detail{
        background: #ffffff;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        p{
          margin: 3px 0px;
          color: #000000;
        }
        .item-detail-type{
          font-size: 16px;
          font-weight: 600;
        }
        .item-detail-subtitle{
          color: #888888;
          font-size: 15px;
        }
      }
    }
  }
  .done-dialog{
    font-size: 12px;
    width: 25%;
    background: #F7F7FA;
    text-align: center;
    border: 0.5px solid #cecece;
    border-radius: 4px;
    padding: 5px 0px;
    position: fixed;
    bottom: 57px;
    right: 15px;
    z-index: 1;
    .done-list-item{
      color: #999999;
      font-size: 14px;
    }
    img{
      position: absolute;
      top: 24px;
      right: 35px;
    }
  }
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
  }
</style>

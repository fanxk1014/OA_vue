<!--发起流程-->
<template>
  <div>
    <div class="fixed-part">
      <x-header class="fixed-header" :left-options="{showBack: true}">
        {{pageTitle}}
        <a slot="right" @click="goLogin()" v-if="!userName">
          <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
        </a>
        <a slot="right" @click="goLogin()" v-if="userName">
          {{userName}}
        </a>
      </x-header>
      <tab class="fixed-tab">
        <tab-item selected @on-item-click="changeTab('行政')">行政</badge></tab-item>
        <tab-item @on-item-click="changeTab('财务')">财务</tab-item>
        <tab-item @on-item-click="changeTab('人力')">人力</tab-item>
      </tab>
    </div>
    <div class="list-part">

      <div id="attendance" class="hideClass" :class="{showClass: AtdIsActive}">
        <div class="msg-items">
          <div class="item-detail">
            <router-link :to="{path:'launchPages',query: {name: 'LeaveApplyPage'}}">
              <p class="item-detail-type">请假申请流程</p>
            </router-link>
          </div>
        </div>
        <div class="msg-items">
          <div class="item-detail">
            <router-link :to="{path:'launchPages',query: {name: 'OvertimeApplyPage'}}">
              <p class="item-detail-type">加班申请流程</p>
            </router-link>
          </div>
        </div>
        <div class="msg-items">
          <div class="item-detail">
            <router-link :to="{path:'launchPages',query: {name: 'SealApplyPage'}}">
              <p class="item-detail-type">盖章申请流程</p>
            </router-link>
          </div>
        </div>
        <!--<div class="msg-items">-->
          <!--<div class="item-detail">-->
            <!--<router-link :to="{path:'launchPages',query: {name: 'BuyApplyPage'}}">-->
              <!--<p class="item-detail-type">采购资产流程</p>-->
            <!--</router-link>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="msg-items">-->
          <!--<div class="item-detail">-->
            <!--<router-link :to="{path:'launchPages',query: {name: 'BuyOfficeApplyPage'}}">-->
              <!--<p class="item-detail-type">办公用品购买申请流程</p>-->
            <!--</router-link>-->
          <!--</div>-->
        <!--</div>-->
      </div>

      <div id="finance" class="hideClass" :class="{showClass: FinIsActive}">
        <div class="msg-items">
          <div class="item-detail">
            <router-link :to="{path:'launchPages',query: {name: 'CostExpensePage'}}">
              <p class="item-detail-type">报销申请-费用报销流程</p>
            </router-link>
          </div>
        </div>
        <!--<div class="msg-items">-->
          <!--<div class="item-detail">-->
            <!--<router-link :to="{path:'launchPages',query: {name: 'TravelExpensePage'}}">-->
              <!--<p class="item-detail-type">报销申请-差旅报销流程</p>-->
            <!--</router-link>-->
          <!--</div>-->
        <!--</div>-->
        <div class="msg-items">
          <div class="item-detail">
            <router-link :to="{path:'launchPages',query: {name: 'LoanApplyPage'}}">
              <p class="item-detail-type">借款申请流程</p>
            </router-link>
          </div>
        </div>
      </div>

      <div id="hr" class="hideClass" :class="{showClass: HrIsActive}">
        <div class="msg-items">
          <div class="item-detail">
            <router-link :to="{path:'launchPages',query: {name: 'RecruitApplyPage'}}">
              <p class="item-detail-type">人员录用流程</p>
            </router-link>
          </div>
        </div>
        <!--<div class="msg-items">-->
          <!--<div class="item-detail">-->
            <!--<router-link :to="{path:'launchPages',query: {name: 'RegularApplyPage'}}">-->
              <!--<p class="item-detail-type">申请转正流程</p>-->
            <!--</router-link>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="msg-items">-->
          <!--<div class="item-detail">-->
            <!--<router-link :to="{path:'launchPages',query: {name: 'LeaveJobApplyPage'}}">-->
              <!--<p class="item-detail-type">申请离职流程</p>-->
            <!--</router-link>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="msg-items">-->
          <!--<div class="item-detail">-->
            <!--<router-link :to="{path:'launchPages',query: {name: 'PersonChangeApplyPage'}}">-->
              <!--<p class="item-detail-type">申请人事变动流程</p>-->
            <!--</router-link>-->
          <!--</div>-->
        <!--</div>-->
      </div>

    </div>

  </div>
</template>
<script>
  import { XHeader, Tab, TabItem } from 'vux'

  export default {
    components: {
      XHeader,
      Tab,
      TabItem
    },
    data () {
      return {
        pageTitle: '发起流程',
        baseUrl: this.$store.state.url,
        userName: false,
        AtdIsActive: true,
        FinIsActive: false,
        HrIsActive: false
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
      },
      changeTab (v) { // 待办事宜-切换tab
        if (v === '行政') { // 行政
          this.FinIsActive = false;
          this.HrIsActive = false;
          this.AtdIsActive = true;
        } else if (v === '财务') { // 财务
          this.AtdIsActive = false;
          this.HrIsActive = false;
          this.FinIsActive = true;
        } else if (v === '人力') { // 人力
          this.AtdIsActive = false;
          this.FinIsActive = false;
          this.HrIsActive = true;
        }
      },
    }
  }

</script>

<style scoped lang="less">
  .fixed-header{
    position: fixed;
    top: 0;
    width: 100%;
  }
  .fixed-tab{
    position: fixed;
    top: 46px;
    width: 100%;
    border-top: 9px solid #ebebeb;
  }
  .list-part{
    background: #ebebeb;
    margin-top: 99px;
    margin-bottom: 60px;
    .hideClass{
      display: none;
    }
    .showClass{
      display: block !important;
    }
    .msg-items{
      padding: 2px 10px 2px 10px;
      .item-detail{
        background: #ffffff;
        padding: 2px 20px;
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
      }
    }
  }
</style>

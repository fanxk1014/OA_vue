<!--待办事宜-->
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
      <search class="fixed-search"
        @on-change="getChange"
        :results="results"
        v-model="value"
        position="absolute"
        cancel-text="搜索"
        auto-scroll-to-top
        auto-fixed
        top="46px"
        @on-cancel="onSearch"
        @on-submit="onSearch"
        ref="search"></search>
      <tab class="fixed-tab">
        <tab-item selected @on-item-click="changeTab('合同')">合同<badge v-if="contractNum"></badge></tab-item>
        <tab-item @on-item-click="changeTab('行政')">行政<badge v-if="attendanceNum"></badge></tab-item>
        <tab-item @on-item-click="changeTab('财务')">财务<badge v-if="financeNum"></badge></tab-item>
        <tab-item @on-item-click="changeTab('业务')">业务<badge v-if="businessNum"></badge></tab-item>
        <tab-item @on-item-click="changeTab('人力')">人力<badge v-if="hrNum"></badge></tab-item>
        <tab-item @on-item-click="changeTab('其他')">其他<badge v-if="otherNum"></badge></tab-item>
      </tab>
    </div>
    <div class="list-part">
      <div class="msg-items" v-for="item in tabList">
        <p class="item-date">
          <span>{{item.createDate}}</span>
        </p>
        <div class="item-detail">
          <router-link :to="{path:'detail',query: {id: item.taskId,stepId: item.stepId,flowId: item.flowId,tag: tabName,title: item.flowName}}">
            <p class="item-detail-type">{{item.flowName}}</p>
            <p class="item-detail-subtitle">您有一个{{tabName}}的申请需要处理，请点击本信息进行处理</p>
            <p class="item-detail-title">标题：{{tabName}}-{{item.businessName}}</p>
            <p class="item-detail-user">申请人：{{item.operatorName}}</p>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import { XHeader, Search, Tab, TabItem, ViewBox, Badge } from 'vux'

  export default {
    components: {
      XHeader,
      Search,
      Tab,
      TabItem,
      ViewBox,
      Badge
    },
    data () {
      return {
        pageTitle: '待办事宜',
        value: '', // 顶部搜索内容
        results: [], // 搜索结果
        tabList: [], // 待办列表数据
        tabName: '合同', // tab页名称
        baseUrl: this.$store.state.url,
        userName: false,
        contractNum: false,
        attendanceNum: false,
        financeNum: false,
        businessNum: false,
        hrNum: false,
        otherNum: false
      }
    },
    mounted () {
      // 打开待办页面，默认显示合同待办
      this.showTodo('CONTRACT');
      if(this.$store.state.userInfo.accounts){
        this.userName = this.$store.state.userInfo.accounts;
      }
      this.getTodoNum();//获取各类待办数量
    },
    methods: {
      goLogin () {
        this.$router.push({ name: 'Login'});
      },
      getTodoNum () {//获取各类待办数量
        this.axios({
          url: this.baseUrl+'/wechat/todo/personal/todoCount',
          method: 'get',
        }).then((response) => {
          let numData = response.data.data;
          if(numData.HR > 0){
            this.hrNum = true;
          }
          if(numData.FINANCE > 0){
            this.financeNum = true;
          }
          if(numData.ATTENDANCE > 0){
            this.attendanceNum = true;
          }
          if(numData.BUSINESS > 0){
            this.businessNum = true;
          }
          if(numData.CONTRACT > 0){
            this.contractNum = true;
          }
          if(numData.OTHER > 0){
            this.otherNum = true;
          }

        }).catch((response) => {
        });
      },
      getChange (val) {
        this.value = val;
      },
      onSubmit () {
        this.$refs.search.setBlur();
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
      },
      onSearch () {// 改造cancel=>search,对列表中的数据进行筛选
        let tabListLength = this.tabList.length;
        let newTabList = [];
        let keyStr = this.value.trim();
        if(keyStr != ''){
          for(let i = 0;i < tabListLength;i++){
            let searchMark = this.tabList[i].businessName.includes(keyStr);
            if(searchMark){
              newTabList.push(this.tabList[i]);
            }
          }
          this.tabList = newTabList;
        }else if(keyStr == ''){
          this.changeTab(this.tabName);
        }
      },
      changeTab (v) { // 待办事宜-切换tab
        if (v === '合同') { // 合同
          this.tabName = '合同';
          this.showTodo('CONTRACT');
          this.$store.state.todoTabType = 'CONTRACT';// 回退到待办页时使用
        } else if (v === '行政') { // 行政
          this.tabName = '行政';
          this.showTodo('ATTENDANCE');
          this.$store.state.todoTabType = 'ATTENDANCE';
        } else if (v === '财务') { // 财务
          this.tabName = '财务';
          this.showTodo('FINANCE');
          this.$store.state.todoTabType = 'FINANCE';
        } else if (v === '业务') { // 业务
          this.tabName = '业务';
          this.showTodo('BUSINESS');
          this.$store.state.todoTabType = 'BUSINESS';
        } else if (v === '人力') { // 人力
          this.tabName = '人力';
          this.showTodo('HR');
          this.$store.state.todoTabType = 'HR';
        } else if (v === '其他') { // 其他
          this.tabName = '其他';
          this.showTodo('OTHER');
          this.$store.state.todoTabType = 'OTHER';
        }
      },
      showTodo(tag){// 加载待办列表数据
        if(tag){
          this.$vux.loading.show({
            text: '加载中'
          });
          this.axios({
            url: this.baseUrl+'/wechat/todo/personal?tag='+tag,// 打开待办页，默认显示‘合同’
            method: 'get',
          }).then((response) => {
            let dataArr = response.data.list;
            this.tabList = dataArr;
            this.$vux.loading.hide();
          }).catch((response) => {
            this.$vux.loading.hide();
          });
        }else{
          this.tabList = [];
        }
      }
    }
  }

</script>

<style scoped lang="less">
  .fixed-header{
    position: fixed;
    top: 0;
    width: 100%;
  }
  .fixed-search{
    position: fixed !important;
    top: 46px;
    width: 100%;
  }
  .fixed-tab{
    position: fixed;
    top: 90px;
    width: 100%;
  }
  .list-part{
    background: #ebebeb;
    margin-top: 134px;
    margin-bottom: 20px;
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

</style>

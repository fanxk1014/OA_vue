<template>
  <div id="detail-page">

    <component :is="who" :idArr="this.idArr"></component>

  </div>
</template>

<script>
  import Vue from 'vue'

  //动态待办详情页
  import DefaultTodoPage from './todo/defaultTodo'

  // 行政
  import LeavePage from './todo/attendance/leave'
  import OutTimePage from './todo/attendance/outtime'
  import BusinessTripPage from './todo/attendance/businessTrip'
  import OverTimePage from './todo/attendance/overtime'
  import SealBusinessPage from './todo/attendance/sealBusiness'
  import AssetBuyPage from './todo/attendance/assetBuy'

  // 合同
  import CollectionPage from './todo/contract/collection'

  // 财务
  import RepaymentPage from './todo/finance/repayment'
  import LoanPage from './todo/finance/loan'
  import ExpensePage from './todo/finance/expense'
  import Expense2Page from './todo/finance/expense2'
  import Expense3Page from './todo/finance/expense3'

  // 人力
  import PersonEmployPage from './todo/hr/personEmploy'
  import RegularPage from './todo/hr/regular'
  import LeaveJobPage from './todo/hr/leaveJob'
  import RecruitmentPage from './todo/hr/recruitment'
  import PersonChangePage from './todo/hr/personChange'

  // 业务
  import BusinessPage from './todo/business/business'
  import TimeAuditPage from './todo/business/timeAudit'
  import BidPage from './todo/business/bid'
  import CostPage from './todo/business/cost'
  import ConsultPage from './todo/business/consult'

  var DetailPageCom = Vue.extend({})
  Vue.component('detail-page', DetailPageCom)

  export default {
    name: 'DetailPage',
    props: {
      idArr: Array
    },
    components:{
      //动态待办详情页
      DefaultTodoPage,
      // 行政
      LeavePage,//请假
      OutTimePage,//外出申请
      BusinessTripPage,//出差申请
      OverTimePage,//加班申请
      SealBusinessPage,//盖章申请
      AssetBuyPage,//采购资产

      // 合同
      CollectionPage,//收款合同

      // 财务
      RepaymentPage,//还款
      LoanPage,//借款
      ExpensePage,//差旅报销
      Expense2Page,//费用报销
      Expense3Page,//支出凭单

      // 人力
      PersonEmployPage,//人员录用
      RegularPage,//人员转正
      LeaveJobPage,//申请离职
      RecruitmentPage,//申请招聘
      PersonChangePage,//人事变动

      // 业务
      BusinessPage,//业务
      TimeAuditPage,//工时审批
      BidPage,//招标代理
      CostPage,//造价咨询
      ConsultPage,//工程咨询
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        who: '',
        idStr: '',
        flowIdStr: '',
        stepIdStr: ''
      }
    },
    mounted () {
      //用flowId判断打开哪个详情页面，用id传入详情页面请求数据
      this.idStr = this.idArr[0];
      this.flowIdStr = this.idArr[1];
      this.stepIdStr = this.idArr[2];//只用于业务详情
      if(this.flowIdStr == '08c4a7eccfdb4efa9ba2c8c12e8f81fa'){
        this.getExpenseType();
      }else{
        this.changePageCom(this.flowIdStr);
      }
    },
    methods: {
      getExpenseType () {
        this.axios({
          url: this.baseUrl+'/wechat/expense/getExpenseType/'+this.idArr[0],
          method: 'get'
        }).then((response) => {
          console.log(response.data.type,'getExpenseType');
          let typeNum = response.data.type;
          if(typeNum == 1){
            this.who='ExpensePage';//差旅报销
          }else if(typeNum == 2){
            this.who='Expense2Page';//费用报销
          }else if(typeNum == 4){
            this.who='Expense3Page';//支出凭单
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      changePageCom:function(v){
        switch (v)
        {
          // 行政
          case '402880c64423d4cd0144243d69670006':
            this.who='LeavePage';//请假
            break;
          case '402880744eb4e47f014eb509e7430005':
            this.who='OutTimePage';//外出申请
            break;
          case 'BUSINESSTRIP':
            this.who='BusinessTripPage';//出差申请
            break;
          case '402880c6441ef72101441f7bde9b0006':
            this.who='OverTimePage';//加班申请
            break;
          case '402880c24490516201449054b8330001':
            this.who='SealBusinessPage';//盖章申请
            break;
          case 'ASSET_BUY':
            this.who='AssetBuyPage';//采购资产
            break;

          // 合同
          case '402880c24581ab53014581bef4260001':
            this.who='CollectionPage';//收款合同
            break;

          // 财务
          case '5a60eb91d7484075ac18de8f70b9b4b4':
            this.who='RepaymentPage';//还款
            break;
          case '4028807450506009015050f267710001':
            this.who='LoanPage';//借款
            break;
          case '08c4a7eccfdb4efa9ba2c8c12e8f81fa':
            this.who='ExpensePage';//差旅报销
            break;
          case '08c4a7eccfdb4efa9ba2c8c12e8f81fa':
            this.who='Expense2Page';//费用报销
            break;
          case '08c4a7eccfdb4efa9ba2c8c12e8f81fa':
            this.who='Expense3Page';//支出凭单
            break;

          // 人力
          case 'PERSON_LUYONG':
            this.who='PersonEmployPage';//人员录用
            break;
          case 'POSITIVE_TURNOVER':
            this.who='RegularPage';//人员转正
            break;
          case 'LEAVE_JOB':
            this.who='LeaveJobPage';//申请离职
            break;
          case 'PERSON_RECRUITMENT':
            this.who='RecruitmentPage';//申请招聘
            break;
          case 'PEOPLE_CHANGES':
            this.who='PersonChangePage';//人事变动
            break;

          // 业务
          case 'COST1':
            this.who='CostPage';//造价咨询
            break;
          case 'COST_BASE':
            this.who='CostPage';//简易造价
            break;
          case '402881e5434d98d801434dd51c3c0001':
            this.who='ConsultPage';//工程咨询
            break;
          case 'BID1':
            this.who='BidPage';//招标代理
            break;
          case '402880e642fe05a20142fe0de6c20001':
            this.who='BusinessPage';//跟踪审计
            break;
          case 'SUPERVISE':
            this.who='BusinessPage';//工程监理
            break;
          case '2218ab49848740f6b4235d5c22882d49':
            this.who='TimeAuditPage';//工时审批
            break;

          default:
            // console.log('不匹配',v);
            this.who='DefaultTodoPage';//动态待办列表
            break;
        }
      }
    }
  }
</script>

<style lang="less">
  #detail-page{
    width: 100%;
    margin-bottom: 46px;
    background: white;
  }
  td{
    width: 30%;
  }
  .detail-page-name{
    width: 20%;
  }
</style>

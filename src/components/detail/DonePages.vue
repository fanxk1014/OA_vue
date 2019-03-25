<template>
  <div>
    <x-header class="fixed-header" :left-options="{showBack: true}">
      {{pageTitle}}
      <a slot="right" @click="goLogin()" v-if="!userName">
        <img class="icon" slot="label" src="../../assets/icon/user-white.png" width="18" height="18">
      </a>
      <a slot="right" @click="goLogin()" v-if="userName">
        {{userName}}
      </a>
    </x-header>

    <button-tab class="done-tab">
      <button-tab-item selected @on-item-click="changeTab(1)">
        详情列表
      </button-tab-item>
      <button-tab-item @on-item-click="changeTab(2)">
        流程意见
      </button-tab-item>
      <button-tab-item @on-item-click="changeTab(3)">
        查看附件
      </button-tab-item>
    </button-tab>

    <div id="detail-page">

      <component v-show="listShow" :is="who" :idArr="this.idArr"></component>

      <detail-msg v-if="auditData.length>0" v-show="msgShow" :auditData="this.auditData"></detail-msg>

      <!--查看附件tab-->
      <detail-file v-if="fileShow" v-show="fileShow" :fileData="fileData" :fileList="fileList"></detail-file>

      <!--其他已办-查看附件tab-->
      <detail-default-file v-if="defaultFileShow" v-show="defaultFileShow" :fileData="fileData" :idArr="[this.id,this.flowId,this.stepId]"></detail-default-file>


    </div>

  </div>

</template>

<script>
  import { XHeader, ButtonTab, ButtonTabItem, XTable, XButton } from 'vux'
  import DetailMsg from './Msg'
  import DetailFile from './File'
  import DetailDefaultFile from './DefaultFile'
  import Vue from 'vue'

  //动态其他已办详情页
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
    components:{
      XHeader,ButtonTab,ButtonTabItem,XTable,XButton,

      DetailMsg,
      DetailFile,
      DetailDefaultFile,

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
      BusinessPage,//业务-跟踪审计和工程监理
      TimeAuditPage,//工时审批
      BidPage,//招标代理
      CostPage,//造价咨询
      ConsultPage,//工程咨询
    },
    data () {
      return {
        pageTitle: '',
        userName: false,
        baseUrl: this.$store.state.url,
        who: '',
        idStr: '',
        flowIdStr: '',
        stepIdStr: '',
        idArr: [],
        listShow: true,// 详情列表tab
        msgShow: false,// 流程意见tab
        fileShow: false,// 查看附件tab
        defaultFileShow: false,//// 查看其他待办、已办附件tab
        auditData: [],// 流程意见-审核
        fileData: [],// 附件
        fileUrl: '',// 附件-文件地址（供复制）
        fileList: [],// 查看附件-附件地址列表
        filePath: '/wechat/commonFile/downLoadEcmsFile',//查看附件-访问地址(不含参数)
      }
    },
    mounted () {
      if(this.$store.state.userInfo.accounts){
        this.userName = this.$store.state.userInfo.accounts;
      }
      //用flowId判断打开哪个详情页面，用id传入详情页面请求数据
      this.idArr = [this.$route.query.id,this.$route.query.flowId,this.$route.query.stepId];
      this.pageTitle = this.$route.query.title;
      this.idStr = this.$route.query.id;
      this.flowIdStr = this.$route.query.flowId;
      this.stepIdStr = this.$route.query.stepId;//只用于业务详情
      if(this.flowIdStr == '08c4a7eccfdb4efa9ba2c8c12e8f81fa'){
        this.getExpenseType();
      }else{
        this.changePageCom(this.flowIdStr);
      }
      this.getFlow();
    },
    methods: {
      goLogin () {
        this.$router.push({ name: 'Login'});
      },
      changeTab (v) {// 切换tab页
        if (v === 1) {
          this.msgShow = false;
          this.fileShow = false;
          this.listShow = true;
        } else if (v === 2) {
          this.listShow = false;
          this.fileShow = false;
          this.msgShow = true;
        } else if (v === 3) {
          this.listShow = false;
          this.msgShow = false;
          this.fileShow = true;
          this.getFile();
        }
      },
      getExpenseType () {
        this.axios({
          url: this.baseUrl+'/wechat/expense/getExpenseType/'+this.idStr,
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
            this.who='TimeAuditPage';//项目工时审批
            break;
          default:
            // console.log('不匹配',v);
            this.who='DefaultTodoPage';//动态待办列表
            break;
        }
      },
      getFlow () {// 获取流程意见数据
        this.axios({
          url: this.baseUrl+'/wechat/wf/'+this.idStr+'/flowChat?stepId='+this.stepIdStr+'&isFinish=1',
          method: 'get'
        }).then((response) => {
          console.log('getFlow',response.data);
          let stepsArr = response.data.fc;
          let stepsArrL = stepsArr.length;
          for(let i = 0;i < stepsArrL;i++){
            this.auditData.push(stepsArr[i]);
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      getFile () {// 获取附件数据
        this.$vux.loading.show({
          text: '加载中'
        });
        this.axios({
          url: this.baseUrl+'/wechat/todo/getFiles/'+this.idStr+'/'+this.flowIdStr,
          method: 'get'
        }).then((response) => {
          console.log('getFile',response);
          this.fileData = response.data.data;
          this.$vux.loading.hide();
          this.fileList = [];// 清空
          let fileDataL = this.fileData.length;
          for(let i=0;i<fileDataL;i++){
            let fileUrl = {src:this.filePath+'?taskId='+this.idStr+'&flowId='+this.flowIdStr+'&fileId='+this.fileData[i].fileId,type:this.fileData[i].fileType};
            this.fileList.push(fileUrl);
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      showFile (index,url,type,fileName){// 查看附件
        this.fileUrl = '';
        let typeStr = type.toLowerCase().slice(-3);
        if(typeStr==='jpg'||typeStr==='png'||typeStr==='gif'||typeStr==='peg'){// 图片

          let imgLinkArr = [];// 图片流地址
          let imgArr = this.fileList;
          let imgLink;// 需要展示的图片流
          for(var i in imgArr){
            imgLinkArr.push(imgArr[i].src);
          }
          imgLink = imgLinkArr[index];

          this.$vux.loading.show({
            text: '加载中'
          });
          this.axios({
            url: this.baseUrl + imgLink,
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response) => {
            this.$vux.loading.hide();
            let showImg = this.baseUrl + '/' + response.data.filePath;// 需要展示的图片地址
            let showImgArr = [];

            showImgArr.push(showImg);

            setTimeout(() => {
              wx.previewImage({
                current: showImg, // 当前显示图片的http链接
                urls: showImgArr // 需要预览的图片http链接列表
              });
            }, 500);

          }).catch((response) => {
            this.$vux.loading.hide();
          });

        }else{// 文档

          let fileLinkArr = [];// 文件流地址
          let fileArr = this.fileList;
          let fileLink;// 需要展示的文件流
          let loadFile;
          for(var i in fileArr){
            fileLinkArr.push(fileArr[i].src);
          }
          fileLink = fileLinkArr[index];

          this.$vux.loading.show({
            text: '加载中'
          });
          this.axios({
            url: this.baseUrl + fileLink,
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response) => {
            this.$vux.loading.hide();
            loadFile = this.baseUrl + '/' + response.data.filePath;// 需要展示的文档地址
            this.fileUrl = loadFile;
            this.$router.push({
              path: '/seefile',
              query:{
                loadFile:this.fileUrl,
                fileName:fileName
              }
            });

          }).catch((response) => {
            this.$vux.loading.hide();
          });

        }

      }
    }
  }
</script>

<style scoped lang="less">
  .fixed-header{
    position: fixed !important;
    top: 0;
    width: 100%;
    z-index: 9;
  }
  .done-tab{
    position: relative;
    top: 46px;
    margin: 10px;
  }
  #detail-page{
    margin-top: 55px;
  }
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
  .vux-table{
    line-height: normal !important;
  }
</style>

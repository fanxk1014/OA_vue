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
    </div>
    <div class="list-part">
      <component :is="who" ref="childLaunch" :saveStatus="saveStatus" @sendTitleToParent="getTitleFromChild" @sendStatusToParent="getStatusFromChild"></component>
    </div>

    <!--提交dialog-->
    <div v-transfer-dom>

      <x-dialog v-model="showToast" class="submit-dialog">

        <div @click="showToast=false" class="dialog-close-btn">
          <span class="vux-close">
            <img class="img-user" slot="label" style="padding:8px 10px 0px 0px;" src="../assets/icon/close.png" width="24" height="24">
          </span>
        </div>

        <div class="dialog-content">
          <div style="padding: 0px 15px;">
            <span class="dialog-title">选择节点</span>
            <checker class="dialog-part dialog-check-list" v-model="checkNodeArr" @on-change="singleCheck" selected-item-class="selected-item">
              <checker-item v-for="item in nextFlowNodeArr" :key="item.id" :value="item.stepId+','+item.id+','+item.openOperatorManualChoose+','+item.todoResolveMode">{{item.name}}</checker-item>
            </checker>
          </div>

          <div style="padding:15px;" v-if="nextFlowStaffArr.length > 0">
            <span class="dialog-title">选择人员</span>
            <checker class="dialog-part dialog-check-list" v-model="checkPersonArr" :max="10" type="checkbox" @on-change="multipleCheck" selected-item-class="selected-item">
              <checker-item v-for="item in nextFlowStaffArr" :key="item.id" :value="item.id">{{item.name}}</checker-item>
            </checker>
          </div>

          <div v-if="checkTreeShow">
            <group id="searchBar">
              <x-input title="搜索" placeholder="在此输入姓名" @on-click-clear-icon="clearSearchResult" v-model="checkTreeSearchVal">
                <x-button slot="right" @click.native="treeSearch" mini>搜索</x-button>
              </x-input>
            </group>
            <div id="searchResult">
              <ul>
                <li v-for="item in checkTreeSearchResult">
                  <span>
                    <x-button @click.native="addToTree(item)">{{item.name}}</x-button>
                  </span>
                </li>
              </ul>
            </div>

            <el-tree id="checkType"
                     :data="treeData"
                     :props="treeProps"
                     ref="tree"
                     node-key="id"
                     show-checkbox
                     @check-change="getCheckedNodes">
            </el-tree>
          </div>

        </div>

        <div id="confirmSub">
          <x-button :disabled="!confirmBtn" @click.native="confirmAudit" mini>确认提交</x-button>
        </div>

      </x-dialog>

    </div>
    <!--提交dialog-END-->

    <div id="footer">
      <x-input :placeholder="placeholderStr" v-model="opinion" class="weui-vcode" :disabled="footerBtnStatus==0">
        <x-button v-if="footerBtnStatus==0" slot="right" type="primary" class="btn" @click.native="parentStartToChild" mini>保存</x-button>
        <x-button v-else slot="right" type="primary" class="btn" @click.native="parentSubmitToChild" mini>提交</x-button>
      </x-input>
    </div>

  </div>
</template>
<script>
  import { XHeader, XButton, XInput, TransferDom, XDialog, Checker, CheckerItem, Group } from 'vux'

  // 行政
  import LeaveApplyPage from '@/components/launch/attendance/leaveApply'
  import OvertimeApplyPage from '@/components/launch/attendance/overtimeApply'
  import SealApplyPage from '@/components/launch/attendance/sealApply'
  import BuyApplyPage from '@/components/launch/attendance/buyApply'
  import BuyOfficeApplyPage from '@/components/launch/attendance/buyOfficeApply'

  // 财务
  import TravelExpensePage from '@/components/launch/finance/travelExpense'
  import CostExpensePage from '@/components/launch/finance/costExpense'
  import LoanApplyPage from '@/components/launch/finance/loanApply'

  //人力
  import RecruitApplyPage from '@/components/launch/hr/recruitApply'
  import RegularApplyPage from '@/components/launch/hr/regularApply'
  import LeaveJobApplyPage from '@/components/launch/hr/leaveJobApply'
  import PersonChangeApplyPage from '@/components/launch/hr/personChangeApply'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,XButton,XInput,TransferDom,XDialog,Checker,CheckerItem,Group,

      // 行政
      LeaveApplyPage,//请假申请
      OvertimeApplyPage,//加班申请
      SealApplyPage,//盖章申请
      BuyApplyPage,//采购资产申请
      BuyOfficeApplyPage,//

      // 财务
      TravelExpensePage,//差旅报销
      CostExpensePage,//费用报销
      LoanApplyPage,//借款申请

      // 人力
      RecruitApplyPage,//人员录用申请
      RegularApplyPage,//转正申请
      LeaveJobApplyPage,//离职申请
      PersonChangeApplyPage//人事变动申请

    },
    data () {
      return {
        pageTitle: '',
        baseUrl: this.$store.state.url,
        footerBtnStatus: 0,//footer-发起、提交btn状态切换
        placeholderStr: '',//footer-placeholder
        opinion: '',// 提交意见
        userName: false,
        who: '',
        saveStatus: 0//0发起,1提交-for子组件
,
        // 提交
        checkNodeArr: '',// 审批提交-选择节点 单选
        showToast: false,// 提交弹窗
        nextFlowNodeArr: [],// 下一步节点集合
        nextFlowStaffArr: [],// 下一步人员集合-角色
        nextFlowStaffValueArr: [],// 下一步人员id集合-角色
        nextFlowStaffTreeArr: [],// 下一步人员id集合-组织架构
        confirmBtn: false,// 控制显示、隐藏 确认提交按钮
        checkNodeArr: '',// 审批提交-选择节点 单选
        checkPersonArr: [],// 审批提交-选择人员 可多选
        treeData: [],//提交-组织结构树
        treeProps: {
          children: 'children',
          label: 'name'
        },
        checkTreeShow: false,
        checkTreeSearchVal: '',//提交-组织结构树搜索内容
        checkTreeSearchResult: []//提交-组织结构树搜索结果

      }
    },
    mounted () {
      this.who = this.$route.query.name;
      if(this.$store.state.userInfo.accounts){
        this.userName = this.$store.state.userInfo.accounts;
      }
    },
    methods: {
      showAlert (msg) {
        this.$vux.alert.show({
          title: msg
        });
        setTimeout(() => {
          this.$vux.alert.hide();
        }, 2000)
      },
      goLogin () {
        this.$router.push({ name: 'Login'});
      },
      getTitleFromChild (data) {
        this.pageTitle = data;
      },
      getStatusFromChild (data) {//0发起-成功，1提交-子组件保存成功

        console.log('getStatusFromChild',data);
        if(data.status == 0){//发起成功
          this.footerBtnStatus = 1;//隐藏发起，显示提交
          this.saveStatus = 1;//告诉子组件，saveForm只保存，不发起
          this.id = data.id;
          this.stepId = data.stepId;
          this.placeholderStr = '  请签批';
          this.getNextFlow();
        }else{//提交
          this.openDialog();
        }

      },
      parentStartToChild () {//子组件-保存、发起
        this.$refs.childLaunch.saveForm();
      },
      parentSubmitToChild () {//保存-提交
        this.$refs.childLaunch.saveForm();
      },

      //以下为提交相关方法
      getNextFlow () {// 获取下一步骤

        this.axios({
          url: this.baseUrl+'/wechat/wf/'+ this.id +'/listNextFlowNodeInfo?stepId='+ this.stepId,
          method: 'get'
        }).then((response) => {
          this.nextFlowNodeArr = response.data.rows;
        }).catch((response) => {
        });
      },
      openDialog () {// 审批-提交 打开节点、人员选择弹窗
        this.showToast = true;
      },
      singleCheck (value) {// 选择节点-单选
        //获取选中节点下的人员列表
        if(value === ''){
          this.nextFlowStaffArr = [];
          this.confirmBtn = false;// 隐藏确认提交按钮
        }
        this.checkPersonArr = [];
        let checkArr = value.split(',');
        this.nextFlowNodeId = checkArr[1];
        this.nextFlowStepId = checkArr[0];
        let nodeData = {
          stepId: this.stepId,
          nextFlowNodeId: this.nextFlowStepId
        };

        if(checkArr[2] === '1' && checkArr[3] === '1'){// 需要手动选择人员,使用角色
          this.nextFlowStaffTreeArr = [];
          this.checkTreeShow = false;
          this.confirmBtn = false;// 隐藏确认提交按钮
          this.axios({// 获取人员列表
            url: this.baseUrl+'/wechat/wf/'+ this.id +'/listChooseOperator',
            method: 'post',
            data: nodeData,
            transformRequest: [function (data) {
              let ret = '';
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
            }]
          }).then((response) => {
            this.nextFlowStaffArr = response.data.staffs;
          }).catch((response) => {

          });
        }else if(checkArr[2] === '1' && checkArr[3] === '2'){// 需要手动选择人员,使用组织架构
          this.checkTreeShow = true;
          this.axios({
            url: this.baseUrl+'/wechat/staff/getOrgStaff',
            method: 'get'
          }).then((response) => {
            this.treeData = response.data;
            if(this.nextFlowStaffTreeArr.length == 0){
              this.confirmBtn = false;// 隐藏确认提交按钮
            }
          }).catch((response) => {
            this.$vux.loading.hide();
          });
        }else if(checkArr[2] === '0'){// 不用手动选择人员
          this.nextFlowStaffTreeArr = [];
          this.checkTreeShow = false;
          this.confirmBtn = true;// 显示确认提交按钮
          this.nextFlowStaffArr = [];
        }
      },
      confirmAudit (staffIds) {
        if(this.nextFlowStaffArr.length === 0 && this.checkTreeShow ===false){// 不需手选人员
          this.audit (1,this.nextFlowNodeId);
        }else if(this.nextFlowStaffArr.length > 0 && this.checkTreeShow ===false){// 需手选人员-角色
          this.multipleAudit (1,staffIds);
        }else if(this.nextFlowStaffTreeArr.length > 0 && this.checkTreeShow ===true){// 需手选人员-组织架构
          this.multipleAudit ();
        }

      },
      audit (agree,nodeId) {// 提交 不用手选人员
        let opinionStr = this.opinion;
        if(opinionStr == ''){
          opinionStr = '同意'
        }
        let auditData = {
          stepId: this.stepId,
          agree: agree,
          nextFlowNodeId: nodeId,
          opinion: opinionStr
        };

        this.axios({
          url: this.baseUrl+'/wechat/wf/'+ this.id +'/audit',
          method: 'post',
          transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          data: auditData
        }).then((response) => {
          this.showToast = false;
          this.$vux.loading.hide();
          if(response.data.status === 1){
            this.showAlert(response.data.msg);
            setTimeout(() => {
              this.$router.back(-1);
            }, 2000);
          }else{
            if(response.data.msg != '审批意见不能为空'){
              this.showAlert(response.data.msg+',请到PC端处理');
            }else{
              this.showAlert(response.data.msg);
            }
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      clearSearchResult () {//清空搜索栏
        this.checkTreeSearchResult = [];
      },
      treeSearch () {//提交-组织架构搜索按钮
        this.checkTreeSearchResult = [];
        let checkTreeSearchVal = this.checkTreeSearchVal;
        let treeData = this.treeData;
        if(checkTreeSearchVal!=''){
          this.getArray(treeData,checkTreeSearchVal);
        }
      },
      getArray (data,name) {//组织架构搜索-递归
        for (var i in data) {
          if (data[i].name == name || data[i].name.indexOf(name) != -1) {
            this.checkTreeSearchResult.push(data[i]);
          }else {
            this.getArray(data[i].children, name);
          }
        }
      },
      addToTree (item) {//将搜索结果添加到树
        let CheckedNodes = this.$refs.tree.getCheckedNodes();
        CheckedNodes.push(item);
        this.$refs.tree.setCheckedNodes(CheckedNodes);
        this.checkTreeSearchResult = [];
      },
      getCheckedNodes() {//审批-组织架构树
        let checkedPersonArr = this.$refs.tree.getCheckedNodes();
        if(checkedPersonArr.length > 0){
          this.confirmBtn = true;// 显示确认提交按钮
        }else{
          this.confirmBtn = false;
        }
        let personIdArr = [];
        for(let i=0;i<checkedPersonArr.length;i++){
          if(checkedPersonArr[i].isParent == false){
            personIdArr.push(checkedPersonArr[i].id);
          }
        }
        this.nextFlowStaffTreeArr = personIdArr;
      },
      multipleCheck (value) {// 选择人员-多选
        this.nextFlowStaffValueArr = value;
        if(value.length > 0){
          this.confirmBtn = true;// 显示确认提交按钮
        }else{
          this.confirmBtn = false;
        }
      },
      multipleAudit () {// 提交 需要手选人员
        let staffIdsVal = '';
        if(this.nextFlowStaffValueArr.length>0){
          staffIdsVal = this.nextFlowStaffValueArr.join(',');
        }else if(this.nextFlowStaffTreeArr.length>0){
          staffIdsVal = this.nextFlowStaffTreeArr.join(',');
        }
        let opinionStr = this.opinion;
        if(opinionStr == ''){
          opinionStr = '同意'
        }
        let auditData = {
          stepId: this.stepId,
          agree: 1,
          nextFlowNodeId: this.nextFlowNodeId,
          opinion: opinionStr,
          staffIds: staffIdsVal
        };

        this.axios({
          url: this.baseUrl+'/wechat/wf/'+ this.id +'/audit',
          method: 'post',
          transformRequest: [function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
          }],
          data: auditData
        }).then((response) => {
          this.showToast = false;
          this.$vux.loading.hide();
          this.showAlert(response.data.msg);
          if(response.data.status === 1){
            setTimeout(() => {
              this.$router.back(-1);
            }, 2000);
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },

    }
  }

</script>

<style scoped lang="less">
  .fixed-header{
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
  .list-part{
    background: white;
    margin-top: 51px;
    margin-bottom: 60px;
  }
  #footer{
    position: fixed;
    bottom: 0;
    height: 46px;
    width: 100%;
    background-color: #ffffff;
    border-top: .2px solid #D9D9D9;
    margin-top: 15px;
    z-index: 100;
    .btn{
      color: #ffffff;
      background-color: #459ffb;
      margin-top: 0;
    }
  }
  #confirmSub{
    padding: 5px;
  }
  .submit-dialog{
    height: 95%;
  }
  .dialog-close-btn{
    text-align: right;
  }
  .selected-item{
    width: 100%;
    color: #ffffff;
    background-color: #459ffb;
  }
  .dialog-content{
    max-height: 400px;
    overflow-y: scroll;
  }
  #searchBar{
    .weui-cell{
      font-size: 14px;
      padding: 5px 10px;
    }
  }
  #searchResult{
    .weui-btn{
      font-size: 12px;
      line-height: 22px;
    }
  }
  .dialog-part{
    font-size: 12px;
  }
  .dialog-check-list .vux-checker-item{
    display: block !important;
  }
</style>

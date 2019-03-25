<!--详情列表；流程意见；查看附件-通用-->
<template>
  <div>
    <div class="fixed-part detail-part">
      <x-header :left-options="{showBack: headerBackStatus}">
        <a slot="left" @click="goTodo()" v-if="!headerBackStatus">
          <img class="icon" slot="label" src="../assets/icon/back.png" width="18" height="18">
          <span class="jump-back">返回</span>
        </a>
        {{pageTitle}}
        <a slot="right" @click="goLogin()" v-if="!userName">
          <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
        </a>
        <a slot="right" @click="goLogin()" v-if="userName">
          {{userName}}
        </a>
      </x-header>

      <button-tab>
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
    </div>

    <div class="scroll-part">

      <detail-page v-if="id.length>0" v-show="listShow" :idArr="[this.id,this.flowId,this.stepId]"></detail-page>

      <detail-msg v-if="auditData.length>0" v-show="msgShow" :auditData="this.auditData"></detail-msg>

      <!--查看附件tab-->
      <detail-file v-if="fileShow" v-show="fileShow" :fileData="fileData" :fileList="fileList"></detail-file>

      <!--默认待办-查看附件tab-->
      <detail-default-file v-if="defaultFileShow" v-show="defaultFileShow" :fileData="fileData" :idArr="[this.id,this.flowId,this.stepId]"></detail-default-file>

    </div>

    <!--审批提交-选择节点、人员-->
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
            <checker v-if="nextFlowNodeArr.length===1" class="dialog-part" v-model="checkNodeArr" @on-change="singleCheck" selected-item-class="selected-item">
              <checker-item class="selected-item" v-for="item in nextFlowNodeArr" :key="item.id" :value="item.stepId+','+item.id+','+item.openOperatorManualChoose+','+item.todoResolveMode">{{item.name}}</checker-item>
            </checker>
            <checker v-else class="dialog-part" v-model="checkNodeArr" @on-change="singleCheck" selected-item-class="selected-item">
              <checker-item v-for="item in nextFlowNodeArr" :key="item.id" :value="item.stepId+','+item.id+','+item.openOperatorManualChoose+','+item.todoResolveMode">{{item.name}}</checker-item>
            </checker>
          </div>

          <div style="padding:15px;" v-if="nextFlowStaffArr.length > 0">
            <span class="dialog-title">选择人员</span>
            <checker class="dialog-part" v-model="checkPersonArr" :max="10" type="checkbox" @on-change="multipleCheck" selected-item-class="selected-item">
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

    <div id="footer">
      <x-input placeholder="  请签批" v-model="opinion" class="weui-vcode">
        <x-button slot="right" class="btn-refuse" @click.native="openDialog" mini :disabled="auditDisable">同意</x-button>
        <x-button slot="right" class="btn-submit" @click.native="auditReject" mini :disabled="rejectDisable">驳回</x-button>
      </x-input>
    </div>

  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  import DetailMsg from '../components/detail/Msg'
  import DetailPage from '../components/detail/DetailPages'
  import DetailFile from '../components/detail/File'
  import DetailDefaultFile from '../components/detail/DefaultFile'
  import { XHeader, ButtonTab, ButtonTabItem, Group, Cell,
    Flow, FlowState, FlowLine, XImg, XInput, XButton, XTable,
    Previewer, TransferDom, XDialog, Checker, CheckerItem } from 'vux'

  export default {
    name: 'app',
    directives: {
      TransferDom
    },
    components: {
      DetailMsg,
      DetailFile,
      DetailDefaultFile,
      DetailPage,
      XHeader,
      ButtonTab,
      ButtonTabItem,
      Group,
      Cell,
      Flow,
      FlowState,
      FlowLine,
      XImg,
      XInput,
      XButton,
      XTable,
      Previewer,
      XDialog,
      Checker,
      CheckerItem
    },
    data () {
      return {
        pageTitle: '详情',
        headerBackStatus: true,//页首返回按钮是否显示，推送跳入时使用
        listShow: true,// 详情列表tab
        msgShow: false,// 流程意见tab
        fileShow: false,// 查看附件tab
        defaultFileShow: false,// 动态通用-查看附件tab
        id: '',// 业务id（taskId）
        flowId: '',// 流程id
        tab: '',// 业务分类name
        auditData: [],// 流程意见-审核
        fileData: [],// 附件
        fileUrl: '',// 附件-文件地址（供复制）
        stepId: '',// 步骤id
        prevFlowNodeId: '',// 上一步节点id
        nextFlowNodeId: '',// 下一步节点id
        nextFlowStepId: '',// 下一步步骤id
        nextFlowNodeArr: [],// 下一步节点集合
        nextFlowStaffArr: [],// 下一步人员集合-角色
        nextFlowStaffValueArr: [],// 下一步人员id集合-角色
        nextFlowStaffTreeArr: [],// 下一步人员id集合-组织架构

        opinion: '',// 审批意见
        fileList: [],// 查看附件-附件地址列表
        filePath: '/wechat/commonFile/downLoadEcmsFile',//查看附件-访问地址(不含参数)
        baseUrl: '',
        userName: false,
        showToast: false,// 提交弹窗
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
        checkTreeSearchResult: [],//提交-组织结构树搜索结果

        auditDisable: true,//同意按钮-disabled
        rejectDisable: false,//驳回按钮-disabled

        selectedStatus: true
      }
    },
    mounted () {

      this.baseUrl = this.$store.state.url;

      if(this.$route.query.isJump){//点击推送，跳入详情页
        console.log('跳转',this.$route.query);
        this.headerBackStatus = false;//替换返回按钮
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

      this.pageTitle = this.$route.query.title;
      this.id = this.$route.query.id;// 业务id
      this.flowId = this.$route.query.flowId;// 流程id
      this.tab = this.$route.query.tag;// 业务分类name
      this.stepId = this.$route.query.stepId;// 当前步骤id

      this.$vux.loading.show({
        text: '加载中'
      });

      this.getFlow();// 流程意见
    },
    methods: {

      goLogin () {
        this.$router.push({ name: 'Login'});
      },
      goTodo () {
        this.$router.push({ name: 'Ecms'});
      },
      changeTab (v) {// 切换tab页
        if (v === 1) {
          this.msgShow = false;
          this.fileShow = false;
          this.defaultFileShow = false;
          this.listShow = true;
        } else if (v === 2) {
          this.listShow = false;
          this.fileShow = false;
          this.defaultFileShow = false;
          this.msgShow = true;
        } else if (v === 3) {
          this.listShow = false;
          this.msgShow = false;
          this.changeFileCom(this.flowId);
        }
      },
      getFlow () {// 获取流程意见数据
        this.axios({
          url: this.baseUrl+'/wechat/wf/'+this.id+'/flowChat?stepId='+this.stepId,
          method: 'get'
        }).then((response) => {
          let stepsArr = response.data.fc;
          let stepsArrL = stepsArr.length;
          for(let i = 0;i < stepsArrL;i++){
            this.auditData.push(stepsArr[i]);
          }
          this.getPrevFlow ();// 获取上一步
          this.getNextFlow();// 获取下一步
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      changeFileCom:function(v){//判断是特定待办还是通用待办
        switch (v)
        {
          // 行政
          case '402880c64423d4cd0144243d69670006':
            this.getFile();
            break;
          case '402880744eb4e47f014eb509e7430005':
            this.getFile();
            break;
          case 'BUSINESSTRIP':
            this.getFile();
            break;
          case '402880c6441ef72101441f7bde9b0006':
            this.getFile();
            break;
          case '402880c24490516201449054b8330001':
            this.getFile();
            break;
          case 'ASSET_BUY':
            this.getFile();
            break;

          // 合同
          case '402880c24581ab53014581bef4260001':
            this.getFile();
            break;

          // 财务
          case '5a60eb91d7484075ac18de8f70b9b4b4':
            this.getFile();
            break;
          case '4028807450506009015050f267710001':
            this.getFile();
            break;
          case '08c4a7eccfdb4efa9ba2c8c12e8f81fa':
            this.getFile();
            break;
          case '08c4a7eccfdb4efa9ba2c8c12e8f81fa':
            this.getFile();
            break;
          case '08c4a7eccfdb4efa9ba2c8c12e8f81fa':
            this.getFile();
            break;

          // 人力
          case 'PERSON_LUYONG':
            this.getFile();
            break;
          case 'POSITIVE_TURNOVER':
            this.getFile();
            break;
          case 'LEAVE_JOB':
            this.getFile();
            break;
          case 'PERSON_RECRUITMENT':
            this.getFile();
            break;
          case 'PEOPLE_CHANGES':
            this.getFile();
            break;

          // 业务
          case 'COST1':
            this.getFile();
            break;
          case 'COST_BASE':
            this.getFile();
            break;
          case '402881e5434d98d801434dd51c3c0001':
            this.getFile();
            break;
          case 'BID1':
            this.getFile();
            break;
          case '402880e642fe05a20142fe0de6c20001':
            this.getFile();
            break;
          case 'SUPERVISE':
            this.getFile();
            break;
          case '2218ab49848740f6b4235d5c22882d49':
            this.getFile();
            break;

          default:
            this.getDefaultFile();
            break;
        }
      },
      getFile () {// 获取附件数据
        this.$vux.loading.show({
          text: '加载中'
        });
        this.axios({
          url: this.baseUrl+'/wechat/todo/getFiles/'+this.id+'/'+this.flowId,
          method: 'get'
        }).then((response) => {
          this.fileShow = true;
          this.fileData = response.data.data;
          this.$vux.loading.hide();
          this.fileList = [];// 清空
          let fileDataL = this.fileData.length;
          for(let i=0;i<fileDataL;i++){
            let fileUrl = {src:this.filePath+'?taskId='+this.id+'&flowId='+this.flowId+'&fileId='+this.fileData[i].fileId,type:this.fileData[i].fileType};
            this.fileList.push(fileUrl);
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      getDefaultFile () {// 获取通用待办附件数据
        this.fileData = [];// 清空
          this.$vux.loading.show({
          text: '加载中'
        });
        this.axios({
          url: this.baseUrl+'/wechat/otherBusiness/'+this.id+'/files?flowId='+this.flowId,
          method: 'get'
        }).then((response) => {
          this.defaultFileShow=true;
          this.fileData = response.data;
          this.$vux.loading.hide();
          // this.fileList = [];// 清空
          // let fileDataL = this.fileData.length;
          // for(let i=0;i<fileDataL;i++){
          //   let fileUrl = {src:this.filePath+'?taskId='+this.id+'&flowId='+this.flowId+'&fileId='+this.fileData[i].fileId,type:this.fileData[i].fileType};
          //   this.fileList.push(fileUrl);
          // }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      getPrevFlow () {// 获取上一步骤
        this.axios({
          url: this.baseUrl+'/wechat/wf/'+ this.id +'/listPrevFlowNodeInfo?stepId='+ this.stepId,
          method: 'get'
        }).then((response) => {
          this.prevFlowNodeId = response.data.rows[0].id;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      getNextFlow () {// 获取下一步骤
        this.axios({
          url: this.baseUrl+'/wechat/wf/'+ this.id +'/listNextFlowNodeInfo?stepId='+ this.stepId,
          method: 'get'
        }).then((response) => {
          this.$vux.loading.hide();
          this.nextFlowNodeArr = response.data.rows;
          this.auditDisable = false;//打开"同意"按钮
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      confirmAudit (staffIds) {
        this.auditDisable = true;//锁住"同意"按钮
        this.confirmBtn = false;//打开"确认提交"按钮
        this.$vux.loading.show({
          text: '正在提交'
        });
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

        let auditData = new FormData();
        auditData.append('stepId',this.stepId);
        auditData.append('agree','1');
        auditData.append('nextFlowNodeId',nodeId);
        auditData.append('opinion',opinionStr);

        this.axios({
          url: this.baseUrl+'/wechat/wf/'+ this.id +'/audit',
          method: 'post',
          data: auditData
        }).then((response) => {
          this.showToast = false;
          this.$vux.loading.hide();
          if(response.data.status === 1){
            this.showToastMsg(response.data.msg);
            if(this.$route.query.isJump) {//点击推送，跳入详情页
              setTimeout(() => {
                this.$router.push({ name: 'Ecms'});
              }, 2000);
            }else{
              setTimeout(() => {
                this.$router.back(-1);
              }, 2000);
            }
          }else{
            if(response.data.msg != '审批意见不能为空'){
              this.showToastMsg(response.data.msg+',请到PC端处理');
            }else{
              this.showToastMsg(response.data.msg);
            }
            this.confirmBtn = true;//打开"确认提交"按钮
            this.auditDisable = false;//打开"同意"按钮
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
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

        let auditData = new FormData();
        auditData.append('stepId',this.stepId);
        auditData.append('agree','1');
        auditData.append('nextFlowNodeId',this.nextFlowNodeId);
        auditData.append('opinion',opinionStr);
        auditData.append('staffIds',staffIdsVal);

        this.axios({
          url: this.baseUrl+'/wechat/wf/'+ this.id +'/audit',
          method: 'post',
          data: auditData
        }).then((response) => {
          this.showToast = false;
          this.$vux.loading.hide();
          this.showToastMsg(response.data.msg);
          if(response.data.status === 1){
            if(this.$route.query.isJump) {//点击推送，跳入详情页
              setTimeout(() => {
                this.$router.push({ name: 'Ecms'});
              }, 2000);
            }else{
              setTimeout(() => {
                this.$router.back(-1);
              }, 2000);
            }
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      auditReject () {// 审批-驳回
        this.rejectDisable = true;//锁住"驳回"按钮
        if(this.prevFlowNodeId == ''){// 没有上一节点，不可驳回
          this.showToastMsg('请到PC端处理！');
          this.rejectDisable = false;//打开"驳回"按钮
          setTimeout(() => {
            this.$vux.loading.hide();
          }, 1000);
        }else{// 有上一节点，可以驳回
          let opinionStr = this.opinion;
          if(opinionStr == ''){
            opinionStr = '不同意'
          }

          let auditData = new FormData();
          auditData.append('stepId',this.stepId);
          auditData.append('agree','0');
          auditData.append('nextFlowNodeId',this.prevFlowNodeId);
          auditData.append('opinion',opinionStr);

          this.$vux.loading.show({
            text: '正在驳回'
          });
          this.axios({
            url: this.baseUrl+'/wechat/wf/'+ this.id +'/audit',
            method: 'post',
            data: auditData
          }).then((response) => {
            this.$vux.loading.hide();
            this.showToastMsg(response.data.msg);
            if(response.data.status === 1){
              if(this.$route.query.isJump) {//点击推送，跳入详情页
                setTimeout(() => {
                  this.$router.push({ name: 'Ecms'});
                }, 2000);
              }else{
                setTimeout(() => {
                  this.$router.back(-1);
                }, 2000);
              }
            }
          }).catch((response) => {
            this.$vux.loading.hide();
          });
        }

      },
      openDialog () {// 审批-提交 打开节点、人员选择弹窗
        if(this.nextFlowNodeArr.length==1 && this.nextFlowNodeArr[0].openOperatorManualChoose==0){//只有一个选择节点且不用手动选择人员
          this.nextFlowNodeId=this.nextFlowNodeArr[0].id;
          this.$vux.loading.show({
            text: '正在提交'
          });
          this.audit (1,this.nextFlowNodeId);
        }else{//打开弹窗-手动选择节点
          this.showToast = true;
          if(this.nextFlowNodeArr.length==1 && this.nextFlowNodeArr[0].openOperatorManualChoose==1){//只有一个选择节点,且需要手动选择人员-默认选择

            let valStr = [];
            valStr.push(this.nextFlowNodeArr[0].stepId,this.nextFlowNodeArr[0].id,this.nextFlowNodeArr[0].openOperatorManualChoose,this.nextFlowNodeArr[0].todoResolveMode);
            this.singleCheck(valStr.join());

          }
        }
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
      clearSearchResult () {//清空搜索栏
        this.checkTreeSearchResult = [];
      },
      multipleCheck (value) {// 选择人员-多选
        this.nextFlowStaffValueArr = value;
        if(value.length > 0){
          this.confirmBtn = true;// 显示确认提交按钮
        }else{
          this.confirmBtn = false;
        }
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
      showAlert (msg) {// alert提示框，3s后消失
        this.$vux.alert.show({
          title: msg
        });
        setTimeout(() => {
          this.$vux.alert.hide();
        }, 3000)
      },
      showToastMsg (msg) {// toast提示框，2s后消失
        this.$vux.toast.show({
          text: msg,
          type: 'text',
          position: 'middle',
          width: '50%'
        })
      },

    }
  }
</script>

<style lang="less">
  .vux-button-group{
    margin: 10px;
  }
  .button-tab{
    text-align: center;
  }
  .vux-label{
    color: #999999;
  }
  .fixed-part{
    position: fixed;
    top: 0;
    width: 100%;
    background: #ebebeb;
    z-index: 100;
  }
  .detail-part .vux-header{
    position: relative !important;
  }
  .scroll-part{
    margin-top: 96px;
    padding-bottom: 80px;
  }
  .weui-cells__title{
    font-weight: 600;
  }
  .vux-cell-primary{
    color: #000000 !important;
  }
  .vux-button-tab-item-middle{
    border-left: .2px solid #459FFB;
  }
  .weui-wepay-flow{
    padding: 0px 20px !important;
  }
  .weui-wepay-flow__line,.weui-wepay-flow__state{
    background-color: #cccccc !important;
  }
  .weui-wepay-flow__li_done .weui-wepay-flow__state,.weui-wepay-flow__line_done .weui-wepay-flow__process{
    background-color: #45a8fb !important;
  }
  .state-start .weui-wepay-flow__state{
    background-color: transparent !important;
    border: 2px solid #45a8fb;
  }
  .state-end .weui-wepay-flow__state{
    background-color: transparent !important;
    border: 2px solid #cccccc !important;
  }
  .weui-wepay-flow__process{
    background-color: #45a8fb !important;
  }
  .weui-wepay-flow__bd{
    float: left;
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
  }
  #footer .btn-submit{
    color: #ffffff;
    background-color: #459ffb;
    margin-top: 0;
  }
  #footer .btn-refuse{
    color: #ffffff;
    background-color: #6bbd22;
    margin-right: 5px;
  }
  .vux-table{
    font-size: 13px;
    line-height: normal !important;
  }
  .vux-table thead tr{
    line-height: 40px;
  }
  .vux-table .weui-btn{
    margin: 10px 0px;
  }
  .vux-table th{
    width: 33%;
  }
  .weui-dialog__bd{
    display: none;
  }
  .submit-dialog{
    .weui-dialog{
      height: 95%;
      max-width: 95%;
      width: 95%;
    }
  }
  .dialog-content{
    max-height: 85%;
    overflow-y: scroll;
  }
  .dialog-title{
    color: #459ffb;
    padding: 3px;
  }
  .vux-checker-item{
    display: block !important;
    font-size: 14px;
    padding: 2px;
  }
  .selected-item{
    color: #ffffff;
    background-color: #459ffb;
  }
  .dialog-part{
    border: 1px solid #bbdafb;
  }
  .dialog-close-btn{
    text-align: right;
  }
  .weui-dialog__hd{
    word-break: break-all;
  }
  #copyUrl{
    border: none;
    outline:none;
  }
  .tag-read{
    background: none;
    display: inline-block;
    padding: 0 1.32em;
    line-height: 2.3;
    font-size: 13px;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
  .urlPart{
    width: 300px;
    word-wrap: break-word;
    word-break: normal;
  }
  #checkType{
    border-top: 1px solid #e4e4e4;
    padding: 5px 10px;
  }
  #searchResult{
    background: #eaeaea;
    padding: 0px 50px;
    font-size: 12px;
    ul{
      li{
        list-style-type:none;
        padding: 2px 0px;
        .btnLink{
          cursor: pointer;
        }
      }
    }
    .btnl{
      float: left;
    }
    .btnr{
      float: right;
      .weui-btn{
        padding: 2px 8px;
        line-height: 17px;
      }
    }
  }
  #searchBar{
    .weui-cell{
      font-size: 14px;
    }
  }
  #searchResult{
    .weui-btn{
      font-size: 12px;
      line-height: 22px;
    }
  }
  #confirmSub{
    padding:15px;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>

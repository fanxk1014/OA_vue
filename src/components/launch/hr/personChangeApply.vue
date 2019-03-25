<!-人事变动申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">员工姓名<span class="required">*</span></td>
          <td>
            {{employeeName}}
            <x-button class="inline-btn" @click.native="openDialog('person')" mini>选择</x-button>
          </td>
          <td class="detail-page-name">工号</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="employeeNo"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">现在职务</td>
          <td>{{beforeJob}}</td>
          <td class="detail-page-name">入职日期</td>
          <td>{{registerTime}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">变动申请信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">变动情况</td>
          <td colspan="3" id="turnover-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('turnover',turnoverList)">
                {{turnoverLabel}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">变动情况说明</td>
          <td colspan="3">
            <x-textarea title="" :max="100" v-model="changesDescription" placeholder="请输入"></x-textarea>
          </td>
        </tr>

        <tr>
          <th colspan="2" class="detail-page-title">变动前</th>
          <th colspan="2" class="detail-page-title">变动后</th>
        </tr>
        <tr>
          <td class="detail-page-name">部门</td>
          <td>{{beforeDepartmentName}}</td>
          <td class="detail-page-name">部门</td>
          <td>
            {{laterDepartmentName}}
            <x-button class="inline-btn" @click.native="openDialog('department')" mini>选择</x-button>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">职务</td>
          <td>{{beforeJob}}</td>
          <td class="detail-page-name">职务</td>
          <td id="job-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('job',jobList)">
                {{jobLabel}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">职级</td>
          <td>{{positionLevelName}}</td>
          <td class="detail-page-name">职级</td>
          <td id="position-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('positionLevel',positionLevelList)">
                {{positionLevelLabel}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">工资总额</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="beforeMoney"></x-input>
          </td>
          <td class="detail-page-name">工资总额</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="laterMoney"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">工资调整说明</td>
          <td colspan="3">
            <x-textarea title="" :max="100" v-model="wageAdjustment" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">生效日期</td>
          <td colspan="3">
            {{signatureDate}}
            <a @click="chooseDate">
              <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
            </a>
          </td>
        </tr>
      </tbody>
    </x-table>

    <!--弹窗-dialog-->
    <div v-transfer-dom>
      <x-dialog mask-z-index="100" v-model="showToast" class="dialog-part">
        <div @click="showToast=false" class="dialog-close-btn">
          <span>
            <img slot="label" style="padding:8px 10px 0px 0px;" src="../../../assets/icon/close.png" width="24" height="24">
          </span>
        </div>

        <!--所在部门经理-->
        <div id="dept-part" v-if="checkTreeShow">
          <group id="searchBar">
            <x-input title="搜索" placeholder="在此输入部门" @on-click-clear-icon="clearSearchResult" v-model="checkTreeSearchVal">
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
          <div id="dept-tree-part">
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
        <!--所在部门经理-END-->

        <!--新部门-->
        <div id="dept-part1" v-if="checkTreeShow1">
          <group id="searchBar1">
            <x-input title="搜索" placeholder="在此输入部门" @on-click-clear-icon="clearSearchResult1" v-model="checkTreeSearchVal">
              <x-button slot="right" @click.native="treeSearch1" mini>搜索</x-button>
            </x-input>
          </group>
          <div id="searchResult1">
            <ul>
              <li v-for="item in checkTreeSearchResult1">
                <span>
                  <x-button @click.native="addToTree1(item)">{{item.name}}</x-button>
                </span>
              </li>
            </ul>
          </div>
          <div id="dept-tree-part1">
            <el-tree id="checkType1"
                     :data="treeData1"
                     :props="treeProps1"
                     ref="tree1"
                     node-key="id"
                     show-checkbox
                     @check-change="getCheckedNodes1">
            </el-tree>
          </div>
        </div>
        <!--新部门-END-->

      </x-dialog>

    </div>
    <!--弹窗-dialog-END-->

    <div v-transfer-dom>
      <popup v-model="selectModelFlag" height="50%">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          :title="selectModelTitle"
          :show-bottom-border="false"></popup-header>
        <group gutter="0">
          <radio :options="selectModelData" @on-change="getLeaveType" v-model="selectModel"></radio>
        </group>
      </popup>
    </div>

  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton, XDialog, TransferDom, Group, XInput, CellBox, Radio, PopupHeader, Popup, XTextarea } from 'vux'
  var PersonChangeApplyPage = Vue.extend({})
  Vue.component('personChangeApply-page', PersonChangeApplyPage)

  export default {
    name: 'PersonChangeApplyPage',
    components: {
      XTable,XButton,XDialog,Group,XInput,CellBox,Radio,PopupHeader,Popup,XTextarea
    },
    directives: {
      TransferDom
    },
    props: {
      saveStatus: Number
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '',
        info: {},
        refRecordId: '',
        refModule: '',
        showToast: false,//弹窗-dialog

        checkTreeShow: false,
        treeData: [],//人员结构树
        checkTreeSearchVal: '',//人员结构树搜索内容
        checkTreeSearchResult: [],//人员结构树搜索结果
        treeProps: {
          children: 'children',
          label: 'name'
        },
        checkDeptResult: {},//人员结构树-选择结果

        employeeName: '',//人员结构树name
        employeeNo: '',//工号
        employeeId: '',//员工id
        beforeJob: '',//现在职务
        beforeDepartmentName: '',//现在部门
        departmentId: '',
        laterDepartmentName: '',
        registerTime: '',//入职时间
        positionLevelName: '',//职级

        beforeMoney: '',//变动前工资总额
        laterMoney: '',//变动后工资总额

        treeType: '',
        auditChoose1: '',
        changesDescription: '',
        signatureDate: '',

        jobList: [],//职务
        jobValue: '',
        jobLabel: '',
        jobId: '',//职务ID

        turnoverList: [
          {id:'0',name:'晋升'},
          {id:'1',name:'降职'},
          {id:'2',name:'调职'},
          {id:'3',name:'免职'},
          {id:'4',name:'复职'},
          {id:'5',name:'调薪'},
          {id:'6',name:'降薪'},
        ],//变动情况
        turnoverValue: '',
        turnoverLabel: '',
        turnoverId: '',

        positionLevelList: [],//变动情况
        positionLevelValue: '',
        positionLevelLabel: '',
        positionLevelId: '',//变动情况ID

        positionLevelList: [],//职级
        positionLevelValue: '',
        positionLevelLabel: '',
        positionLevelId: '',//职级ID

        selectModelFlag: false, //下拉选择弹框控制
        selectModelTitle: '', //下拉选择弹框标题
        selectModelData:[], //下拉选择弹框数据
        selectModel: '',
        wageAdjustment: '',//工资调整说明

        // 部门
        treeData1: [],//组织结构树
        checkTreeShow1: false,
        checkTreeSearchVal1: '',//组织结构树搜索内容
        checkTreeSearchResult1: [],//组织结构树搜索结果
        treeProps1: {
          children: 'children',
          label: 'name'
        },
        checkDeptResultName1: '',//责任中心name
        checkDeptResult1: {},//责任中心-选择结果
        // 部门-END

      }
    },
    mounted () {
      this.$emit('sendTitleToParent','人事变动申请');
      this.getJob();
      this.getPositionLevel();
      this.axios({
        url: this.baseUrl+'/wechat/personnelChange/changeApply',
        method: 'get'
      }).then((response) => {
        this.info = response.data.obj;
        this.refRecordId = response.data.refRecordId;
        this.refModule = response.data.refModule;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
    },
    methods: {
      showMsg (msg) {
        this.$vux.toast.show({
          text: msg,
          type: 'text',
          position: 'middle',
          width: '50%'
        })
      },
      openDialog (v) {// 打开选择业务-dialog
        this.showToast = true;
        if(v === 'person'){
          this.getDeptTree();
        }else if(v === 'department'){
          this.getDeptTree1();
        }

      },
      getDeptTree () {//获取人员架构
        this.axios({
          url: this.baseUrl+'/wechat/staff/getOrgStaff',
          method: 'get'
        }).then((response) => {
          this.treeData = response.data;
          this.checkTreeShow = true;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      clearSearchResult () {//清空搜索栏
        this.checkTreeSearchResult = [];
      },
      clearDeptResult () {//清除组织架构
        this.employeeName = '';
        this.checkDeptResult = {};
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
      getCheckedNodes() {//选择-人员架构树

        let checkedPersonArr = this.$refs.tree.getCheckedNodes();

        this.checkDeptResult = checkedPersonArr[0];
        this.employeeName = this.checkDeptResult.name;
        this.employeeId = this.checkDeptResult.id;
        this.checkTreeShow = false;//隐藏part
        this.showToast = false;//关闭dialog
        console.log('组织架构树',this.checkDeptResult,this.employeeName);
        this.getStaffDetail();
      },
      getStaffDetail () {
        this.axios({
          url: this.baseUrl+'/wechat/staff/getStaffDetail?staffId='+this.employeeId,
          method: 'get'
        }).then((response) => {
          console.log('getStaffDetail',response.data.staff);
          this.employeeNo = this.checkDeptResult.numberCode;
          this.beforeJob = response.data.staff.rankName;
          this.beforeDepartmentName = response.data.staff.departmentName;
          this.departmentId = response.data.staff.departmentId;
          this.registerTime = response.data.staff.entryDate;
          this.positionLevelName = response.data.staff.positionLevelName;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      treeSearch () {//提交-人员架构搜索按钮
        this.checkTreeSearchResult = [];
        let checkTreeSearchVal = this.checkTreeSearchVal;
        let treeData = this.treeData;
        if(checkTreeSearchVal!=''){
          this.getArray(treeData,checkTreeSearchVal);
        }
      },
      openSelectModelFlage(type,data){
        console.log('openSelectModelFlage',type,data);
        this.selectModelData = [];
        if(type == 'job'){
          this.selectModelTitle = '请选择职务';
          this.selectModel = this.jobValue;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }else if(type == 'positionLevel'){
          this.selectModelTitle = '请选择职级';
          this.selectModel = this.positionLevelValue;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }else if(type == 'turnover'){
          this.selectModelTitle = '请选择变动情况';
          this.selectModel = this.turnoverValue;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }
        this.selectModelFlag = true;
      },
      getLeaveType (value, label) {

        this.accountUniId = value;

        let isChange = value == this.selectModel ? false : true
        if(this.selectModelTitle == '请选择职务'){
          this.selectModel = this.jobValue = value;
          this.jobLabel = label;
        } else if(this.selectModelTitle == '请选择职级') {
          this.selectModel = this.positionLevelValue = value;
          this.positionLevelLabel = label;
        } else if(this.selectModelTitle == '请选择变动情况'){
          this.selectModel = this.turnoverValue = value;
          this.turnoverLabel = label;
        }
        if(isChange){
          this.selectModelFlag = false;
        }
        console.log(this.selectModel)
      },
      //职务
      async getJob () {//获取职务

        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/listValidRank',
          method: 'get'
        });
        let list = res.data.list;
        this.jobList.push({id:'',name:''});
        for(let i=0;i<list.length;i++){
          this.jobList.push(list[i]);
        }

      },
      //职务-END
      //职级
      async getPositionLevel () {//获取职级

        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/listBaseDatas/POSITION_LEVEL',
          method: 'get'
        });

        let list = res.data.list;
        this.positionLevelList.push({id:'',name:''});
        for(let i=0;i<list.length;i++){
          this.positionLevelList.push(list[i]);
        }

      },
      //职级-END
      //新部门
      getDeptTree1 () {//责任中心-获取组织架构
        this.axios({
          url: this.baseUrl+'/wechat/commonInterface/deptTree',
          method: 'get'
        }).then((response) => {
          this.treeData1 = response.data;
          this.checkTreeShow1 = true;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      treeSearch1 () {//提交-组织架构搜索按钮
        this.checkTreeSearchResult1 = [];
        let checkTreeSearchVal = this.checkTreeSearchVal1;
        let treeData = this.treeData1;
        if(checkTreeSearchVal!=''){
          this.getArray1(treeData,checkTreeSearchVal);
        }
      },
      getArray1 (data,name) {//组织架构搜索-递归
        for (var i in data) {
          if (data[i].name == name || data[i].name.indexOf(name) != -1) {
            this.checkTreeSearchResult1.push(data[i]);
          }else {
            this.getArray1(data[i].children, name);
          }
        }
      },
      addToTree1 (item) {//将搜索结果添加到树
        let CheckedNodes = this.$refs.tree.getCheckedNodes1();
        CheckedNodes.push(item);
        this.$refs.tree1.setCheckedNodes(CheckedNodes);
        this.checkTreeSearchResult1 = [];
      },
      clearSearchResult1 () {//清空搜索栏
        this.checkTreeSearchResult1 = [];
      },
      getCheckedNodes1() {//审批-组织架构树

        let checkedPersonArr = this.$refs.tree1.getCheckedNodes();

        this.checkDeptResult1 = checkedPersonArr[0];
        this.checkDeptResultName1 = this.checkDeptResult1.name;
        this.checkTreeShow1 = false;//隐藏责任中心part
        this.showToast = false;//关闭dialog
        this.laterDepartmentName = this.checkDeptResult1.name
        console.log('组织架构树',this.checkDeptResult1);
      },
      clearDeptResult1 () {//清除组织架构
        this.checkDeptResultName1 = '';
        this.checkDeptResult1 = {};
      },
      //新部门-END
      chooseDate () {//预计还款日期
        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.signatureDate,
          onConfirm (val) {
            that.signatureDate = val;
          }
        })
      },
      saveForm () {//保存
        if(this.employeeName == ''){
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        });

        let formData = new FormData();
        formData.append("id",this.info.id);

        if(this.businessName){

        }

        formData.append("employeeId",this.employeeId);
        formData.append("employeeName",this.employeeName);
        formData.append("employeeNo",this.employeeNo);
        formData.append("job",this.beforeJob);
        formData.append("registerTime",this.registerTime);
        formData.append("departmentId",this.departmentId);
        formData.append("departmentName",this.beforeDepartmentName);

        formData.append("changesDescription",this.changesDescription);
        formData.append("beforeDepartmentName",this.beforeDepartmentName);
        formData.append("laterDepartmentName",this.laterDepartmentName);
        formData.append("beforeJob",this.beforeJob);
        formData.append("laterJob",this.jobLabel);
        formData.append("beforePositionLevel",this.positionLevelName);
        formData.append("positionLevel",this.positionLevelLabel);
        formData.append("beforeMoney",this.beforeMoney);
        formData.append("laterMoney",this.laterMoney);
        formData.append("wageAdjustment",this.wageAdjustment);
        formData.append("signatureDate",this.signatureDate);
        formData.append("auditChoose1",this.turnoverValue);

        this.axios({
          url: this.baseUrl+'/wechat/personnelChange/saveForm',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData,
        }).then((response) => {
          console.log('人事变动saveForm',response.data,this.saveStatus);
          if(response.data.status == 0){//保存失败
            this.$vux.loading.hide();
            this.showMsg(response.data.msg);
          }else if(this.saveStatus == 0&&response.data.status == 1){//父组件操作发起，并且保存成功
            this.startFlow();
          }else if(this.saveStatus == 1&&response.data.status == 1){//父组件操作提交，并且保存成功
            this.$emit('sendStatusToParent',{status:1});
            this.$vux.loading.hide();
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      startFlow () {//发起
        let startData = new FormData();
        startData.append("id",this.info.id);
        startData.append("flowId",this.info.flowId);
        this.axios({
          url: this.baseUrl+'/wechat/loan/startFlow',
          method: 'post',
          data: startData
        }).then((response) => {
          console.log('startFlow',response.data);
          this.showMsg('保存成功！请继续完成提交操作！');

          if(response.data.status == 1){

            this.$emit('sendStatusToParent',{
              status:0,
              id:response.data.taskId,
              stepId:response.data.stepId
            });
          }
          this.$vux.loading.hide();
        }).catch((response) => {
          this.$vux.loading.hide();
        });

      },
    }
  }
</script>

<style scoped lang="less">
  .detail-page-title{
    background: #edf7ff;
    padding: 5px;
  }
  .vux-table td{
    width: 30%;
    padding: 5px;
    font-size: 12px;
    line-height: 20px;
  }
  .detail-page-name{
    width: 20% !important;
    background: #edf7ff;
  }
  .required{
    color: red;
  }
  #dept-part{
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
    #dept-tree-part{
      height: 300px;
      overflow-y: auto;
    }
  }
  #dept-part1{
    #searchBar1{
      .weui-cell{
        font-size: 14px;
      }
    }
    #searchResult1{
      .weui-btn{
        font-size: 12px;
        line-height: 22px;
      }
    }
    #dept-tree-part1{
      height: 300px;
      overflow-y: auto;
    }
  }
  .dialog-part {
    border: none;
    .weui-dialog {
      height: 95%;
    }
    .dialog-close-btn {
      text-align: right;
    }
  }
  .vux-x-input{
    padding: 0;
  }
  #job-td,#position-td,#turnover-td{
    padding: 0;
    .weui-cell{
      font-size: 12px;
      height: 16px;
      padding-left: 5px;
    }
  }
  .vux-x-textarea{
    padding: 0;
  }
  .right{
    float: right;
  }
</style>

<!-转正申请详情-->
<template>

  <div>
    <x-table id="outer-table">
      <tbody>
        <tr>
          <td class="detail-page-name">员工姓名<span class="required">*</span></td>
          <td>
            {{employeeName}}
            <x-button class="inline-btn" @click.native="openDialog('person')" mini>选择</x-button>
          </td>
          <td class="detail-page-name">部门</td>
          <td>{{departmentName}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">职务</td>
          <td>{{job}}</td>
          <td class="detail-page-name">职级</td>
          <td>{{beforeTurnPositionLevel}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">工号</td>
          <td>{{employeeNo}}</td>
          <td class="detail-page-name">入职日期</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="registerTime"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">转正申请日期</td>
          <td id="right-td">
            {{createFlowDate}}
            <a @click="chooseDate">
              <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
            </a>
          </td>
          <td class="detail-page-name">转正类型</td>
          <td id="turnover-type-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('turnoverType',turnoverTypeList)">
                {{turnoverType}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">第一阶段试用起止时间</td>
          <td colspan="3">
            <flexbox :gutter="0" wrap="wrap">
              <flexbox-item :span="1/2">
                <a @click="chooseStartDate" class="chooseDate">
                  <span class="data-text">{{firstStageBeginDate}}</span>
                  <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
                  <span class="pull-right">~</span>
                </a>
              </flexbox-item>
              <flexbox-item :span="1/2">
                <a @click="chooseEndDate" class="chooseDate" style="padding-left: 15px">
                  <span class="data-text">{{firstStageEndDate}}</span>
                  <img style="    right: 5px;" class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
                </a>
              </flexbox-item>
            </flexbox>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">第二阶段试用起止时间</td>
          <td colspan="3">
            <flexbox :gutter="0" wrap="wrap">
              <flexbox-item :span="1/2">
                <a @click="chooseStartDate1" class="chooseDate">
                  <span class="data-text">{{secondStageBeginDate}}</span>
                  <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
                  <span class="pull-right">~</span>
                </a>
              </flexbox-item>
              <flexbox-item :span="1/2">
                <a @click="chooseEndDate1" class="chooseDate" style="padding-left: 15px">
                  <span class="data-text">{{secondStageEndDate}}</span>
                  <img style="    right: 5px;" class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
                </a>
              </flexbox-item>
            </flexbox>
          </td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">员工自评</th>
        </tr>
        <tr>
          <td class="detail-page-name">员工述职总结报告</td>
          <td colspan="3">
            <x-textarea title="" :max="100" v-model="finalReport" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">本人对本职工作的意见</td>
          <td colspan="3">
            <x-textarea title="" :max="100" v-model="workSuggestion" placeholder="请输入"></x-textarea>
          </td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">附件</th>
        </tr>
        <tr>
          <td class="detail-page-name">附件</td>
          <td colspan="3">
            <input type="file" name="file" id="file" @change="chooseFile" accept="image/*" class="inputfile" multiple/>
            <label for="file" class='btn-file'>选择</label>
            <p id="box">
              <div class="img-box" v-for="(item,key) in fileShowList" :key="key">
                <img class="icon-close" src="../../../assets/icon/close-blue.png" @click="deleteFile(key)">
                <img class="img-part" :src="item" alt=""/>
              </div>
            </p>
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
  import { XTable, TransferDom, XButton, XDialog, Group, XInput, CellBox, Radio, PopupHeader, Popup, XTextarea, Flexbox, FlexboxItem } from 'vux'
  var RegularApplyPage = Vue.extend({})
  Vue.component('regularApply-page', RegularApplyPage)

  export default {
    name: 'RegularApplyPage',
    components: {
      XTable,XButton,XDialog,Group,XInput,CellBox,Radio,PopupHeader,Popup,XTextarea,Flexbox,FlexboxItem,
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

        employeeId: '',
        employeeName: '',

        departmentId: '',
        departmentName: '',
        job: '',
        employeeNo: '',
        beforeTurnPositionLevel: '',

        registerTime: '',
        finalReport: '',
        workSuggestion: '',
        createFlowDate: '',

        firstStageBeginDate: '',
        firstStageEndDate: '',

        secondStageBeginDate: '',
        secondStageEndDate: '',

        checkTreeShow: false,
        treeData: [],//人员结构树
        checkTreeSearchVal: '',//人员结构树搜索内容
        checkTreeSearchResult: [],//人员结构树搜索结果
        treeProps: {
          children: 'children',
          label: 'name'
        },
        checkDeptResult: {},//人员结构树-选择结果

        selectModelFlag: false, //下拉选择弹框控制
        selectModelTitle: '', //下拉选择弹框标题
        selectModelData:[], //下拉选择弹框数据
        selectModel: '',

        createFlowDate: '',//转正申请日期

        fileObj: {},//文件上传集合
        fileShowList: [],//上传文件集合-预览
        uploadedFileIdList: [],//已上传文件ID集合

        turnoverTypeList: [],
        turnoverTypeValue: '',
        turnoverType: '',
        turnoverTypeId: '',

      }
    },
    mounted () {
      this.$emit('sendTitleToParent','人员转正申请');
      this.axios({
        url: this.baseUrl+'/wechat/positiveTurnover/turnoverApply',
        method: 'get'
      }).then((response) => {
        console.log(response.data);
        this.info = response.data.obj;
        this.refRecordId = response.data.refRecordId;
        this.refModule = response.data.refModule;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
      this.getTurnoverType();
    },
    methods: {
      openDialog (v) {// 打开选择业务-dialog
        this.showToast = true;
        this.getDeptTree();
      },
      showMsg (msg) {
        this.$vux.alert.show({
          title: msg
        })
        setTimeout(() => {
          this.$vux.alert.hide()
        }, 2000)
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
      getCheckedNodes() {//选择-人员架构树

        let checkedPersonArr = this.$refs.tree.getCheckedNodes();

        this.checkDeptResult = checkedPersonArr[0];
        this.employeeId = this.checkDeptResult.id;
        this.employeeName = this.checkDeptResult.name;
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
          this.employeeNo = response.data.staff.numberCode;
          this.job = response.data.staff.rankName;
          this.departmentName = response.data.staff.departmentName;
          this.departmentId = response.data.staff.departmentId;
          this.registerTime = response.data.staff.entryDate;
          this.beforeTurnPositionLevel = response.data.staff.positionLevelName;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
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
      chooseDate () {//转正申请日期
        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.createFlowDate,
          onConfirm (val) {
            that.createFlowDate = val;
          }
        })
      },
      chooseStartDate () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.firstStageBeginDate,
          onConfirm (val) {
            that.firstStageBeginDate = val
          }
        })
      },
      chooseEndDate () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.firstStageEndDate,
          onConfirm (val) {
            that.firstStageEndDate = val
          }
        })
      },
      chooseStartDate1 () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.secondStageBeginDate,
          onConfirm (val) {
            that.secondStageBeginDate = val
          }
        })
      },
      chooseEndDate1 () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.secondStageEndDate,
          onConfirm (val) {
            that.secondStageEndDate = val
          }
        })
      },
      chooseFile () { // 选择附件
        this.fileObj = document.getElementById('file').files;
        this.$vux.loading.show({
          text: '保存中'
        })
        this.submitFile();
      },
      deleteFile (index) { // 删除已选附件
        this.fileShowList.splice(index, 1)

        let deleteFileId = this.uploadedFileIdList[index]
        let fileData = new FormData()
        fileData.append('fileId', deleteFileId)
        this.$vux.loading.show({
          text: '删除中'
        });
        this.axios({
          url: this.baseUrl + '/wechat/commonFile/deleteFile',
          method: 'post',
          data: fileData
        }).then((response) => {
          this.$vux.loading.hide();
          this.uploadedFileIdList.splice(index, 1)
        }).catch((response) => {
          this.$vux.loading.hide()
        })
      },
      async submitFile () { // 上传附件-图片
        let fileObjL = this.fileObj.length;
        for (let i = 0; i < fileObjL; i++) {
          let fileData = new FormData()
          fileData.append('file', this.fileObj[i])
          fileData.append('taskId', this.info.id)
          fileData.append('refRecordId', this.refRecordId)
          fileData.append('refModule', this.refModule)
          let res = await this.axios({
            url: this.baseUrl + '/wechat/commonFile/uploadFile',
            method: 'post',
            data: fileData
          })
          this.uploadedFileIdList.push(res.data.fileId)

          let that = this
          let file = this.fileObj[i]
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            that.fileShowList.push(this.result)
          }
        }

        this.$vux.loading.hide()
      },
      //转正类型
      async getTurnoverType () {

        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/listBaseDatas/POSITIVE_TURNOVER_TYPE',
          method: 'get'
        });

        let list = res.data.list;
        this.turnoverTypeList.push({id:'',name:''});
        for(let i=0;i<list.length;i++){
          this.turnoverTypeList.push(list[i]);
        }
      },
      //转正类型-END
      openSelectModelFlage(type,data){
        console.log('openSelectModelFlage',type,data);
        this.selectModelData = [];
        if(type == 'turnoverType'){
          this.selectModelTitle = '请选择转正类型';
          this.selectModel = this.sex;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }
        this.selectModelFlag = true;
      },
      getLeaveType (value, label) {

        this.turnoverTypeId = value;

        let isChange = value == this.selectModel ? false : true
        if(this.selectModelTitle == '请选择转正类型'){
          this.selectModel = this.turnoverTypeValue = value;
          this.turnoverType = label;
        }
        if(isChange){
          this.selectModelFlag = false;
        }
        console.log(this.selectModel)
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

        formData.append("employeeId",this.employeeId);
        formData.append("employeeName",this.employeeName);
        formData.append("departmentId",this.departmentId);
        formData.append("departmentName",this.departmentName);
        formData.append("job",this.job);

        if(this.employeeNo){
          formData.append("employeeNo",this.employeeNo);
        }else{
          formData.append("employeeNo",'');
        }

        formData.append("beforeTurnPositionLevel",this.beforeTurnPositionLevel);
        formData.append("registerTime",this.registerTime);

        formData.append("finalReport",this.finalReport);
        formData.append("workSuggestion",this.workSuggestion);
        formData.append("createFlowDate",this.createFlowDate);
        if(this.turnoverType){
          formData.append("turnoverType",this.turnoverTypeValue);
        }
        formData.append("firstStageBeginDate",this.firstStageBeginDate);

        formData.append("firstStageEndDate",this.firstStageEndDate);
        formData.append("secondStageBeginDate",this.secondStageBeginDate);
        formData.append("secondStageEndDate",this.secondStageEndDate);

        this.axios({
          url: this.baseUrl+'/wechat/positiveTurnover/saveForm',
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
    },
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
  #outer-table{
    margin-bottom: 80px !important;
    .weui-btn{
      margin: 0;
    }
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
  .vux-x-textarea{
    padding: 0;
  }
  #right-td .right{
    float: right;
  }
  .inputfile {
    opacity: 0;
    width: 0px;
  }
  .btn-file{
    display: inline-block;
    width: 60px;
    height: 29px;
    background-color: #F8F8F8;
    line-height: 29px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
  }
  .img-box{
    width: 80px;
    height: 80px;
    border: 1px solid #dad8d8;
    display: inline-block;
    float: left;
    margin: 2px;
  }
  .img-part{
    width: 100%;
    height: 100%;
  }
  .icon-close{
    position: absolute;
  }
  .data-text{
    width: 70%;
    display: inline-block;
    text-align: center;
  }
  .vux-checker-item{
    display: block !important;
  }
  #turnover-type-td{
    padding: 0;
  .weui-cell{
    font-size: 12px;
    height: 16px;
    padding-left: 5px;
  }
  }
</style>

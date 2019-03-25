<!-离职申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">申请人</td>
          <td>{{info.employeeName}}</td>
          <td class="detail-page-name">所在公司</td>
          <td>{{info.deptParentName}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">所在部门</td>
          <td>{{info.departmentName}}</td>
          <td class="detail-page-name">职务</td>
          <td>{{info.job}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">申请信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">辞职原因</td>
          <td colspan="3">
            <x-textarea :max="100" v-model="text1" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">拟最后任职天数</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="leaveDay"></x-input>
          </td>
          <td class="detail-page-name">拟最后任职时间</td>
          <td>
            <flexbox :gutter="0" wrap="wrap">
              <flexbox-item>
                <a @click="chooseDate" class="chooseDate" style="">
                  {{positiveDate}}
                  <img style="float: right;" class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
                </a>
              </flexbox-item>
            </flexbox>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">所在部门经理<span class="required">*</span></td>
          <td colspan="2">{{checkDeptResultName}}</td>
          <td>
            <x-button class="inline-btn" @click.native="openDialog('deptTree')" mini>选择</x-button>
          </td>
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

  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XTextarea, XInput, Flexbox, FlexboxItem, TransferDom, XDialog, XButton, Group } from 'vux'
  var LeaveJobApplyPage = Vue.extend({})
  Vue.component('leaveJobApply-page', LeaveJobApplyPage)

  export default {
    name: 'LeaveJobApplyPage',
    components: {
      XTable,XTextarea,XInput,Flexbox,FlexboxItem,XDialog,XButton,Group
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
        text1: '',
        leaveDay: '',
        positiveDate: '',
        fileObj: {},//盖章文件上传集合
        fileShowList: [],//上传盖章文件集合-预览
        uploadedFileIdList: [],//已上传盖章文件ID集合
        showToast: false,//弹窗-dialog
        checkTreeShow: false,

        treeData: [],//组织结构树
        checkTreeShow: false,
        checkTreeSearchVal: '',//组织结构树搜索内容
        checkTreeSearchResult: [],//组织结构树搜索结果
        treeProps: {
          children: 'children',
          label: 'name'
        },
        checkDeptResultName: '',//组织结构树name
        checkDeptResult: {},//组织结构树-选择结果

      }
    },
    mounted () {
      this.$emit('sendTitleToParent','离职申请');
      this.axios({
        url: this.baseUrl+'/wechat/leaveJob/leaveJobApply',
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
        this.$vux.alert.show({
          title: msg
        });
        setTimeout(() => {
          this.$vux.alert.hide();
        }, 2000)
      },
      openDialog (v) {// 打开选择业务-dialog
        this.showToast = true;
        this.getDeptTree();
      },
      chooseDate () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD HH:mm',
          value: this.endDate,
          minuteList: ['00', '15', '30', '45'],
          positiveDate: this.positiveDate,
          onConfirm (val) {
            that.positiveDate = val;
            that.getDateDiffer()
          }
        })
      },
      async getDateDiffer () {
        if (this.startDate != '' && this.endDate != '') {
          let res = await this.axios({
            url: this.baseUrl + '/wechat/leave/countLeaveDays?startTime=' + this.startDate + '&endTime=' + this.endDate,
            method: 'get'
          })
          if (res.data.status) {
            this.dateDiffer = res.data.leaveDay + '天 ' + res.data.leaveHour + '小时  共计' + res.data.leaveCountHour + '小时'
            this.countLeaveDays = res.data
          }
        }
      },
      getDeptTree () {//责任中心-获取组织架构
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
        this.checkDeptResultName = '';
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
      getCheckedNodes() {//审批-组织架构树

        let checkedPersonArr = this.$refs.tree.getCheckedNodes();

        this.checkDeptResult = checkedPersonArr[0];
        this.checkDeptResultName = this.checkDeptResult.name;
        this.checkTreeShow = false;//隐藏责任中心part
        this.showToast = false;//关闭dialog
        console.log('组织架构树',this.checkDeptResult,this.checkDeptResultName);
      },
      treeSearch () {//提交-组织架构搜索按钮
        this.checkTreeSearchResult = [];
        let checkTreeSearchVal = this.checkTreeSearchVal;
        let treeData = this.treeData;
        if(checkTreeSearchVal!=''){
          this.getArray(treeData,checkTreeSearchVal);
        }
      },
      chooseFile () {// 选择盖章文件
        this.fileObj = document.getElementById('file').files;
        this.$vux.loading.show({
          text: '保存中'
        });
        this.submitFile();
      },
      deleteFile (index) {// 删除已选盖章文件
        this.fileShowList.splice(index,1);

        let deleteFileId = this.uploadedFileIdList[index];
        let fileData = new FormData();
        fileData.append("fileId",deleteFileId);

        this.axios({
          url: this.baseUrl+'/wechat/commonFile/deleteFile',
          method: 'post',
          data: fileData
        }).then((response) => {
          console.log('deleteFile',response);
          this.uploadedFileIdList.splice(index,1);
        }).catch((response) => {
          this.$vux.loading.hide();
        });

      },
      async submitFile () {// 上传盖章文件-图片
        let fileObjL = this.fileObj.length;
        for(let i=0;i<fileObjL;i++){
          let fileData = new FormData();
          fileData.append("file",this.fileObj[i]);
          fileData.append("taskId",this.info.id);
          fileData.append("refRecordId",this.refRecordId);
          fileData.append("refModule",this.refModule);

          let res = await this.axios({
            url: this.baseUrl+'/wechat/commonFile/uploadFile',
            method: 'post',
            data: fileData
          });
          this.uploadedFileIdList.push(res.data.fileId);

          let that = this;
          let file = this.fileObj[i];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload=function(e) {
            that.fileShowList.push(this.result);
          }
        }

        this.$vux.loading.hide();
      },
      saveForm () {//保存
        if(this.checkDeptResultName == ''||this.checkDeptResultName == ''||this.checkDeptResultName == ''){
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        });

        let formData = new FormData();
        formData.append("id",this.info.id);
        formData.append("depManagerId",this.checkDeptResult.id);
        formData.append("depManagerName",this.checkDeptResultName);
        formData.append("text1",this.text1);
        formData.append("leaveDay",this.leaveDay);
        formData.append("positiveDate",this.positiveDate);

        this.axios({
          url: this.baseUrl+'/wechat/leaveJob/saveForm',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData,
        }).then((response) => {
          console.log('离职saveForm',response.data,this.saveStatus);
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
          url: this.baseUrl+'/wechat/leaveJob/startFlow',
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: startData
        }).then((response) => {
          console.log('盖章startFlow',response.data);
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

      }
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
  .vux-x-textarea,.vux-x-input{
    padding: 0;
  }
  .inputfile {
    opacity: 0;
    width: 0px;
  }
  .btn-file{
    display: inline-block;
    width: 60px;
    height: 25px;
    background-color: #F8F8F8;
    line-height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.1);
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
  .dialog-part {
    .weui-dialog {
      height: 95%;
    }
    .dialog-close-btn {
      text-align: right;
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
  }
</style>

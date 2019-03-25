<!-人员录用申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">申请部门</td>
          <td>{{info.departmentName}}</td>
          <td class="detail-page-name">申请人</td>
          <td>{{info.applicantName}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">申请日期</td>
          <td colspan="3">{{info.registerTime}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">拟录用人员基本信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">拟录用人员姓名</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="luyongPeople"></x-input>
          </td>
          <td class="detail-page-name">出生年月</td>
          <td id="birthday-td">
            <!--{{birthday}}-->
            <!--<a @click="chooseDate('birthday')">-->
              <!--<img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">-->
            <!--</a>-->
            <group>
              <datetime v-model="birthday" start-date="1950-01-01" end-date="2030-01-01" format="YYYY-MM-DD" ></datetime>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">性别</td>
          <td id="sex-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('sex',sexList)">
                {{sex}}
              </cell-box>
            </group>
          </td>
          <td class="detail-page-name">专业</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="specialty"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">学历</td>
          <td id="education-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('education',educationList)">
                {{education}}
              </cell-box>
            </group>
          </td>
          <td class="detail-page-name">毕业院校</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="graduateSchool"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">证书情况</td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="carInfo"></x-input>
          </td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">拟录用人员信息确认</th>
        </tr>
        <tr>
          <td class="detail-page-name">拟聘职务</td>
          <td id="job-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('job',jobList)">
                {{job}}
              </cell-box>
            </group>
          </td>
          <td class="detail-page-name">拟聘职级</td>
          <td id="position-level-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('positionLevel',positionLevelList)">
                {{positionLevel}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">预计到岗时间</td>
          <td>
            {{toDate}}
            <a @click="chooseDate('toDate')">
              <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
            </a>
          </td>
          <td class="detail-page-name">实际到岗时间</td>
          <td>
            {{toRealDate}}
            <a @click="chooseDate('toRealDate')">
              <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
            </a>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">试用工资</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="tryMoney"></x-input>
          </td>
          <td class="detail-page-name">试用限期</td>
          <td id="try-month-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('tryMonth',tryMonthList)">
                {{tryMonth}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">转正工资</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="formalMoney"></x-input>
          </td>
          <td class="detail-page-name">转正工资模式</td>
          <td id="try-model-td">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('tryModel',tryModelList)">
                {{tryModel}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">录用人员所在部门经理</td>
          <td colspan="2">
            {{belongLeader}}
          </td>
          <td>
            <x-button class="inline-btn" @click.native="openDialog()" mini>选择</x-button>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">工作地点</td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="workAddress"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">部门评价</td>
          <td colspan="3">
            <x-textarea title="" :max="100" v-model="jobRequire" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">录用过程文件</td>
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
      <tr id="last-tr">
        <td></td>
      </tr>
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
  import { XTable, TransferDom, XButton, XDialog, Group, XInput, CellBox, Radio, PopupHeader, Popup, XTextarea, Flexbox, FlexboxItem, Datetime } from 'vux'
  var RecruitApplyPage = Vue.extend({})
  Vue.component('recruitApply-page', RecruitApplyPage)

  export default {
    name: 'RecruitApplyPage',
    components: {
      XTable,XButton,XDialog,Group,XInput,CellBox,Radio,PopupHeader,Popup,XTextarea,Flexbox,FlexboxItem,Datetime
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

        luyongPeople: '',
        birthday: '',
        specialty: '',
        education: '',
        graduateSchool: '',
        carInfo: '',
        positionLevel: '',
        toDate: '',
        toRealDate: '',
        tryMoney: '',
        formalMoney: '',
        belongLeader: '',
        belongLeaderId: '',
        workAddress: '',
        jobRequire: '',

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

        sexList: [
          {id:'1',name:'男'},
          {id:'0',name:'女'},
        ],//变动情况
        sexValue: '',
        sex: '',
        sexId: '',

        educationList: [],
        educationValue: '',
        education: '',
        educationId: '',

        tryModelList: [],
        tryModelValue: '',
        tryModel: '',
        tryModelId: '',

        tryMonthList: [
          {id:'0',name:''},
          {id:'1',name:'1个月'},
          {id:'2',name:'2个月'},
          {id:'3',name:'3个月'},
          {id:'6',name:'6个月'},
          {id:'7',name:'其他月份'},
        ],
        tryMonthValue: '',
        tryMonth: '',
        tryMonthId: '',

        positionLevelList: [],//职级
        positionLevelValue: '',
        positionLevel: '',
        positionLevelId: '',//职级ID

        jobList: [],//职务
        jobValue: '',
        job: '',
        jobId: '',//职务ID

        fileObj: {},//文件上传集合
        fileShowList: [],//上传文件集合-预览
        uploadedFileIdList: [],//已上传文件ID集合

      }
    },
    mounted () {
      this.$emit('sendTitleToParent','人员录用申请');
      this.axios({
        url: this.baseUrl+'/wechat/personnelEmploy/employApply',
        method: 'get'
      }).then((response) => {
        console.log(response.data);
        this.info = response.data.obj;
        this.refRecordId = response.data.refRecordId;
        this.refModule = response.data.refModule;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
      this.getEducation();
      this.getTryModel();
      this.getPositionLevel();
      this.getJob();
    },
    methods: {
      openDialog () {// 打开选择业务-dialog
        this.showToast = true;
        this.getDeptTree();
      },
      showMsg (msg) {
        this.$vux.toast.show({
          text: msg,
          type: 'text',
          position: 'middle',
          width: '50%'
        })
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
        this.belongLeader = this.checkDeptResult.name;
        this.belongLeaderId = this.checkDeptResult.id;
        this.checkTreeShow = false;//隐藏part
        this.showToast = false;//关闭dialog
        console.log('组织架构树',this.checkDeptResult,this.belongLeader);
      },
      treeSearch () {//提交-组织架构搜索按钮
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
        if(type == 'sex'){
          this.selectModelTitle = '请选择性别';
          this.selectModel = this.sex;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }else if(type == 'education'){
          this.selectModelTitle = '请选择学历';
          this.selectModel = this.educationValue;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }else if(type == 'tryModel'){
          this.selectModelTitle = '请选择转正工资模式';
          this.selectModel = this.tryModelValue;
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
        }else if(type == 'job'){
          this.selectModelTitle = '请选择职务';
          this.selectModel = this.jobValue;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }else if(type == 'tryMonth'){
          this.selectModelTitle = '请选择试用期限';
          this.selectModel = this.tryMonthValue;
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
        if(this.selectModelTitle == '请选择性别'){
          this.selectModel = this.sexValue = value;
          this.sex = label;
        } else if(this.selectModelTitle == '请选择学历') {
          this.selectModel = this.educationValue = value;
          this.education = label;
        } else if(this.selectModelTitle == '请选择转正工资模式'){
          this.selectModel = this.tryModelValue = value;
          this.tryModel = label;
        } else if(this.selectModelTitle == '请选择职级'){
          this.selectModel = this.positionLevelValue = value;
          this.positionLevel = label;
        } else if(this.selectModelTitle == '请选择职务'){
          this.selectModel = this.jobValue = value;
          this.job = label;
        } else if(this.selectModelTitle == '请选择试用期限'){
          this.selectModel = this.tryMonthValue = value;
          this.tryMonth = label;
        }
        if(isChange){
          this.selectModelFlag = false;
        }
        console.log(this.selectModel)
      },
      //学历
      async getEducation () {//获取职级

        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/listBaseDatas/EDUCATION',
          method: 'get'
        });

        let list = res.data.list;
        this.educationList.push({id:'',name:''});
        for(let i=0;i<list.length;i++){
          this.educationList.push(list[i]);
        }
      },
      //学历-END
      //转正工资类型
      async getTryModel () {

        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/salaryModel/zhuanzhen',
          method: 'get'
        });

        let list = res.data.list;
        this.tryModelList.push({id:'',name:''});
        for(let i=0;i<list.length;i++){
          this.tryModelList.push(list[i]);
        }
      },
      //转正类型-END
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
      chooseDate (v) {
        let that = this;
        let valueStr = this+'.'+v;
        if(v === 'birthday'){
          this.$vux.datetime.show({
            cancelText: '取消',
            confirmText: '确定',
            format: 'YYYY-MM-DD',
            value: this.birthday,
            onConfirm (val) {
              that.birthday = val;
            }
          })
        }else if(v === 'toDate'){
          this.$vux.datetime.show({
            cancelText: '取消',
            confirmText: '确定',
            format: 'YYYY-MM-DD',
            value: this.toDate,
            onConfirm (val) {
              that.toDate = val;
            }
          })
        }else if(v === 'toRealDate'){
          this.$vux.datetime.show({
            cancelText: '取消',
            confirmText: '确定',
            format: 'YYYY-MM-DD',
            value: this.toRealDate,
            onConfirm (val) {
              that.toRealDate = val;
            }
          })
        }
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
      saveForm () {//保存
        this.$vux.loading.show({
          text: '加载中'
        });

        let formData = new FormData();
        formData.append("id",this.info.id);

        formData.append("luyongPeople",this.luyongPeople);
        formData.append("birthday",this.birthday);
        formData.append("sex",this.sexValue);
        formData.append("specialty",this.specialty);
        formData.append("education",this.education);

        formData.append("graduateSchool",this.graduateSchool);
        formData.append("carInfo",this.carInfo);

        formData.append("job",this.job);
        formData.append("positionLevel",this.positionLevel);
        formData.append("toDate",this.toDate);
        formData.append("toRealDate",this.toRealDate);
        formData.append("tryMoney",this.tryMoney);

        formData.append("tryMonth",this.tryMonthValue);
        formData.append("tryModel",this.tryModelValue);
        formData.append("formalMoney",this.formalMoney);
        formData.append("belongLeader",this.belongLeaderId);
        formData.append("workAddress",this.workAddress);
        formData.append("jobRequire",this.jobRequire);

        this.axios({
          url: this.baseUrl+'/wechat/personnelEmploy/saveForm',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData,
        }).then((response) => {
          console.log('人员录用saveForm',response.data,this.saveStatus);
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
  #sex-td,#education-td,#try-model-td,#position-level-td,#job-td,#try-month-td,#birthday-td{
    padding: 0;
    .weui-cell{
      font-size: 12px;
      height: 16px;
      padding-left: 5px;
      color: black !important;
    }
  }
  #last-tr{
    td{
      padding: 30px;
    }
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
</style>

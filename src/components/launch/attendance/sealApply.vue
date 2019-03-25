<!-盖章申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">申请人</td>
          <td>{{info.applyStaffName}}</td>
          <td class="detail-page-name">申请部门</td>
          <td>{{info.takeDepartmentName}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">申请日期</td>
          <td colspan="3">{{info.applyDate}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">申请信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">所属业务</td>
          <td colspan="2">
            {{businessChoosed.businessName}}
          </td>
          <td>
            <x-button class="inline-btn" @click.native="openDialog('business')" mini>选择</x-button>
            <x-button class="inline-btn" @click.native="clearBusiness" mini>清除</x-button>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">盖章事由<span class="required">*</span></td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="useReason"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">报送单位<span class="required">*</span></td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="sendUnit"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">文件名称<span class="required">*</span></td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="fileNames"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">份数</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="fileNumber"></x-input>
          </td>
          <td class="detail-page-name">文件类型</td>
          <td id="file-type">
            <group>
              <cell-box is-link @click.native="openSelectModelFlage('fileType',fileTypeList)">
                {{fileTypeLabel}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">拟用章</td>
          <td colspan="3">
            <x-button class="inline-btn" @click.native="openDialog('companySealTypes')" mini>公司章</x-button>
            <x-button class="inline-btn" @click.native="openDialog('subCompanySealTypes')" mini>分/子公司章</x-button>
            <x-button v-if="sealShowChoosedList.length>0" class="inline-btn" @click.native="deleteSeal" mini>删除</x-button>
          </td>
        </tr>
      </tbody>
    </x-table>

    <x-table id="seal-table">
      <tbody>
        <tr class="seal-table-title">
          <td class="seal-table-first"></td>
          <td>类型</td>
          <td>拟用章</td>
          <td>持章人</td>
        </tr>
        <tr v-for="(item,key) in sealShowChoosedList" :key="key">
          <td class="seal-table-first">
            <input type="radio" name="" :value="key" v-model="sealShowChoosedListVal"/>
          </td>
          <td>{{item.organizationName}}</td>
          <td>{{item.sealTypeName}}</td>
          <td>{{item.haveSealName}}</td>
        </tr>
      </tbody>
    </x-table>

    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">盖章文件</td>
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
        <tr>
          <td class="detail-page-name">盖章数量</td>
          <td>{{sealNumber}}</td>
          <td class="detail-page-name">是否业务盖章</td>
          <td>
            <inline-x-switch v-model="isBusinessSeal" @on-change="switchVal"></inline-x-switch>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">备注</td>
          <td colspan="3">
            <x-textarea :max="100" v-model="remark" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">登记人</td>
          <td>{{info.registerStaffName}}</td>
          <td class="detail-page-name">登记日期</td>
          <td>{{info.registerDate}}</td>
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

        <!--所属业务-->
        <div id="business-part" v-if="businessShow">
          <div>
            <div class="dialog-input">
              <p>
                <x-input id="businessName" title="业务名称" placeholder="    请输入" :show-clear="true" v-model="businessName">
                  <x-button slot="right" class="dialog-btn" mini @click.native="searchBusiness">搜索</x-button>
                </x-input>
              </p>

              <p>
                <group>
                  <selector v-model="selectorValue" :value-map="['name', 'name']" title="业务类型" :options="selectorList" ></selector>
                </group>
              </p>
            </div>

            <div class="table-part">
              <x-table v-if="this.businessList.length>0" full-bordered style="background-color:#fff;width: 100%;">
                <thead>
                <tr class="dialog-title-tr">
                  <td></td>
                  <td>业务名称</td>
                  <td>委托单位</td>
                  <td>项目经理</td>
                  <td>业务类型</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,key) in businessList" :key="key">
                  <td class="dialog-switch-td">
                    <input type="radio" name="abc" :value="item" v-model="businessChoosed" />
                  </td>
                  <td>{{item.businessName}}</td>
                  <td>{{item.consignorUnitNames}}</td>
                  <td>{{item.managerName}}</td>
                  <td>{{item.flowType}}</td>
                </tr>
                </tbody>
              </x-table>

            </div>

            <p class="dialog-bottom-bar">
              <span v-if="this.businessList.length>0">
                <x-button mini class="dialog-btn btn-prev" :disabled="preStatus" @click.native="getPrePage">上一页</x-button>
                {{pageNum}}/{{businessAllNum}}页
                <x-button mini class="dialog-btn btn-next" :disabled="nextStatus" @click.native="getNextPage">下一页</x-button>
              </span>
              <x-button mini class="dialog-btn btn-confirm" @click.native="chooseBusiness">确定</x-button>
            </p>

          </div>

        </div>
        <!--所属业务-END-->

        <!--公司章-->
        <div id="company-seal" v-if="sealCompanyShow">
          <checklist title="印鉴名称" label-position="right" :options="sealShowList" v-model="sealChoosedId" @on-change="changeCheckList"></checklist>
          <div>
            <x-button class="inline-btn" @click.native="saveCompanySeal('companySeal')" mini>确定</x-button>
          </div>
        </div>
        <!--公司章-END-->

        <!--分/子公司章-->
        <div id="sub-company-seal" v-if="sealSubCompanyShow">
          <div id="sub-tree-part" v-if="subTreeShow">
            <el-tree id="sub-tree"
                     :data="treeData"
                     :props="treeProps"
                     ref="tree"
                     node-key="id"
                     show-checkbox
                     @check-change="getCheckedNodes">
            </el-tree>
          </div>
          <div id="sub-company-part" v-if="subCompanySealTypesPartShow">
            <div id="sub-company-part-back" @click="backToSubCompanyTree">
              <img class="icon" slot="label" src="../../../assets/icon/back-gray.png" width="18" height="18">返回
            </div>
            <checklist title="印鉴名称" label-position="right" :options="subSealShowList" v-model="subSealChoosedId" @on-change="changeCheckList"></checklist>
          </div>
          <div>
            <x-button class="inline-btn" @click.native="saveCompanySeal('subCompanySeal')" mini>确定</x-button>
          </div>
        </div>
        <!--分/子公司章-END-->

      </x-dialog>

    </div>
    <!--弹窗-dialog-END-->

    <div v-transfer-dom>
      <popup v-model="selectModelFlag">
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
  import { XTable, XDialog, TransferDom, XButton, XInput, Group,
    Selector, CellBox, PopupHeader, Popup, Radio, XTextarea, InlineXSwitch, Checklist  } from 'vux'
  var SealApplyPage = Vue.extend({})
  Vue.component('sealApply-page', SealApplyPage)

  export default {
    name: 'SealApplyPage',
    directives: {
      TransferDom
    },
    components: {
      XTable,XDialog,XButton,XInput,Group,Selector,CellBox,
      PopupHeader,Popup,Radio,XTextarea,InlineXSwitch,Checklist
    },
    props: {
      saveStatus: Number
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '',
        info: {},
        showToast: false,//弹窗-dialog

        //所属业务
        businessShow: false,
        businessName: '',//dialog-业务名称
        selectorList: [],//dialog-业务类型
        selectorValue: '',//dialog-业务类型-val

        preStatus: true,
        nextStatus: false,

        businessList: [],//dialog-业务搜索结果
        businessNameList: [],//dialog-业务搜索结果
        businessAllNum: '',//dialog-业务总个数
        businessChoosed: {},//dialog-选择的业务
        pageNum: 1,//dialog-业务搜索结果-页码
        switchValue: false,//dialog-选择业务switch
        //所属业务-END

        //附件
        refRecordId: '',
        refModule: '',
        //附件-END

        useReason: '',//盖章事由
        sendUnit: '',//报送单位
        fileNames: '',//文件名称
        fileNumber: '',//份数

        fileTypeList: [],//文件类型
        fileTypeValue: '',
        fileTypeLabel: '',
        fileTypeId: '',//文件类型ID

        selectModelFlag: false, //下拉选择弹框控制
        selectModelTitle: '', //下拉选择弹框标题
        selectModelData:[], //下拉选择弹框数据
        selectModel: '',

        fileObj: {},//盖章文件上传集合
        fileShowList: [],//上传盖章文件集合-预览
        uploadedFileIdList: [],//已上传盖章文件ID集合

        sealNumber: '',//盖章数量
        remark: '',
        isBusinessSeal: false,//是否用于抵扣费用报销(不计入成本)
        isBusinessSealVal: 0,//是否用于抵扣费用报销(不计入成本)

        sealCompanyShow: false,//公司章show
        sealSubCompanyShow: false,//分/子公司章show

        companySealTypesShow: false,
        subCompanySealTypesShow: false,

        companySealTypesList: [],//公司章
        sealShowList: [],//公司章
        sealChoosedId: [],//dialog-选择的公司章ID
        sealChoosedName: [],//dialog-选择的公司章 或 分/子公司章NAME

        sealShowChoosedList: [],//已选的公司章+分/子公司章
        sealShowChoosedListVal: {},//已选的公司章+分/子公司章 列表选中行-内容

        subTreeShow: false,//分/子公司树
        subSealShowList: [],//分/子公司章
        subSealChoosedId: [],//dialog-选择的分/子公司章ID
        treeData: [],//分/子公司树数据
        treeProps: {
          children: 'children',
          label: 'name'
        },
        subCompanySealTypesPartShow: false,//分/子公司章show

        sealNumber: '',//盖章数量

      }
    },
    mounted () {
      this.getFileType();
      this.$emit('sendTitleToParent','盖章申请');
      this.axios({
        url: this.baseUrl+'/wechat/sealBusiness/modSealBusiness',
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
        })
        setTimeout(() => {
          this.$vux.alert.hide()
        }, 2000)
      },
      openDialog (v) {// 打开选择业务-dialog
        this.businessShow = false;
        this.companySealTypesShow = false;
        this.subCompanySealTypesShow = false;
        this.sealCompanyShow = false;
        this.sealSubCompanyShow = false;
        this.subCompanySealTypesPartShow = false;
        this.showToast = true;
        if(v == 'business'){//所属业务
          this.businessShow = true;
          this.getBusinessList();
          this.searchBusiness();
        }else if(v == 'companySealTypes'){//公司章
          this.sealShowList = [];
          this.getCompanySealTypes();
          this.sealCompanyShow = true;
          this.companySealTypesShow = true;
        }else if(v == 'subCompanySealTypes'){//分/子公司章
          this.subSealShowList = [];
          this.sealSubCompanyShow = true;
          this.getSubCompanyTree();
          this.subCompanySealTypesShow = true;
        }
      },
      getPrePage () {//dialog-上一页
        if(this.pageNum == 1){
          this.preStatus = true;
        }else{
          this.businessChoosed = {};
          this.nextStatus = false;
          this.pageNum--;
          this.searchBusiness();
        }
      },
      getNextPage () {//dialog-下一页
        if(this.pageNum == this.businessAllNum){
          this.nextStatus = true;
        }else{
          this.businessChoosed = {};
          this.preStatus = false;
          this.pageNum++;
          this.searchBusiness();
        }
      },
      chooseBusiness () {//dialog-确定
        this.showToast = false;
      },
      clearBusiness () {// 清除业务
        this.businessChoosed = {};
      },
      async getBusinessList () {
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/listRefFlowTypes',
          method: 'get'
        });
        this.selectorList = res.data.list;
      },
      async searchBusiness () {// dialog-搜索业务
        this.businessList = [];
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/businessList?businessName='+this.businessName+'&flowType='+this.selectorValue+'&page='+this.pageNum+'&rows=15',
          method: 'get'
        });
        this.$vux.loading.hide();
        this.businessList = res.data.list;
        let businessLength = res.data.list.length;
        for(let i=0;i<businessLength;i++){
          this.businessNameList.push(res.data.list[i].businessName);
        }
        this.businessAllNum = Math.ceil(res.data.total/15);
      },
      async getFileType () {//获取文件类型
        let res = await this.axios({
          url: this.baseUrl+'/wechat/sealBusiness/fileTypes',
          method: 'get'
        });

        let list = res.data.list;
        this.fileTypeList.push({id:'',name:''});
        for(let i=0;i<list.length;i++){
          this.fileTypeList.push(list[i]);
        }

      },
      openSelectModelFlage(type,data){//文件类型
        this.selectModelData = [];
        if(type == 'fileType'){
          this.selectModelTitle = '请选择文件类型';
          this.selectModel = this.fileTypeLabel;
          data.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }
        this.selectModelFlag = true;
      },
      getLeaveType (value, label) {//文件类型
        this.fileTypeId = value;
        let isChange = label == this.selectModel ? false : true
        if(this.selectModelTitle == '请选择文件类型'){
          this.selectModel = this.payTypeVal = label
          this.fileTypeLabel = label
        }
        if(isChange){
          this.selectModelFlag = false;
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
          console.log('费用报销deleteFile',response);
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
      switchVal (data) {//switch
        if(data){
          this.isBusinessSealVal = 0;
        }else{
          this.isBusinessSealVal = 1;
        }
      },
      async getCompanySealTypes () {//获取公司章
        let res = await this.axios({
          url: this.baseUrl+'/wechat/sealBusiness/companySealTypes',
          method: 'get'
        });
        this.companySealTypesList = res.data.list;
        this.companySealTypesList.forEach((item) => {
          item.key = item.id;
          item.value = item.name;
        })
        this.sealShowList = this.companySealTypesList;
      },
      async getSubCompanyTree () {//获取分/子公司树
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/subCompanyTree',
          method: 'get'
        });
        this.treeData = res.data;
        this.subTreeShow = true;
      },
      getCheckedNodes() {//审批-组织架构树

        let checkedPersonArr = this.$refs.tree.getCheckedNodes();

        this.checkDeptResult = checkedPersonArr[0];
        this.checkDeptResultName = this.checkDeptResult.name;
        this.subTreeShow = false;//隐藏分/子公司树
        this.subCompanySealTypesPartShow = true;
        this.getsubCompanySealTypes();
      },
      async getsubCompanySealTypes () {//获取分/子公司章
        let res = await this.axios({
          url: this.baseUrl+'/wechat/sealBusiness/subCompanySealTypes?orgId='+this.checkDeptResult.id,
          method: 'get'
        });
        if(res.data.list.length>0){
          this.subSealShowList = res.data.list;
          this.subSealShowList.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
          })
        }else{
          this.subSealShowList = [];
          this.showMsg('无 分/子公司章')
        }
      },
      backToSubCompanyTree () {
        this.subCompanySealTypesPartShow = false;
        this.subTreeShow = true;
      },
      changeCheckList (value, label) {//公司章选择
        this.sealChoosedId = value;
        this.sealChoosedName = label;
      },
      saveCompanySeal (type) {//保存公司章 或 分/子公司章

        let formData = new FormData();
        let sealTypeIdStr = this.sealChoosedId.join(',');
        formData.append("taskId",this.info.id);
        formData.append("sealTypeId",sealTypeIdStr);
        if(type == 'companySeal'){//保存公司章
          formData.append("organizationName",'公司章');
        }else if(type == 'subCompanySeal'){//保存分/子公司章
          formData.append("organizationName",'分/子公司章');
          formData.append("haveSealId",this.checkDeptResult.id);
          formData.append("haveSealName",this.checkDeptResult.name);
        }

        this.axios({
          url: this.baseUrl+'/wechat/sealBusiness/saveCompanySeal',
          method: 'post',
          data: formData
        }).then((response) => {
          if(response.data.status == 1){
            this.showToast = false;
            this.sealShowChoosedList = response.data.sealList;
            this.sealNumber = response.data.sealNumber;
            this.showMsg(response.data.msg);
          }else{
            this.showMsg(response.data.msg);
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });

      },
      deleteSeal() {

        let delId = this.sealShowChoosedList[this.sealShowChoosedListVal].id;
        let formData = new FormData();
        formData.append("taskId",this.info.id);
        formData.append("id",delId);

        this.axios({
          url: this.baseUrl+'/wechat/sealBusiness/delSeal',
          method: 'post',
          data: formData
        }).then((response) => {
          console.log('删除公司章 或 分/子公司章',response.data);
          if(response.data.status == 1){
            this.sealShowChoosedList = response.data.sealList;
            this.sealNumber = response.data.sealNumber;
            this.showMsg(response.data.msg);
            console.log(this.sealShowChoosedList);
          }else{
            this.showMsg(response.data.msg);
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      saveForm () {//保存
        if(this.useReason == ''||this.sendUnit == ''||this.fileNames == ''){
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        });

        let formData = new FormData();
        formData.append("id",this.info.id);

        if(this.businessChoosed){
          formData.append("businessId",this.businessChoosed.id);
          formData.append("businessReport",this.businessChoosed.reportNo);
          formData.append("businessName",this.businessChoosed.businessName);
        }

        formData.append("useReason",this.useReason);
        formData.append("sendUnit",this.sendUnit);
        formData.append("fileNames",this.fileNames);
        formData.append("fileNumber",this.fileNumber);
        formData.append("fileType",this.fileTypeLabel);
        formData.append("sealNumber",this.sealNumber);
        formData.append("isBusinessSeal",this.isBusinessSealVal);
        formData.append("remark",this.remark);
        formData.append("businessFlowId",this.info.flowId);

        this.axios({
          url: this.baseUrl+'/wechat/sealBusiness/saveForm',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData,
        }).then((response) => {
          console.log('盖章saveForm',response.data,this.saveStatus);
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
        this.axios({
          url: this.baseUrl+'/wechat/sealBusiness/startFlow',
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
  #seal-table{
    .seal-table-first{
      width: 10px !important;
    }
    .seal-table-title{
      td{
        background: #edf7ff;
      }
    }
  }
  .inline-btn{
    padding: 0px 10px;
    font-size: 12px;
    margin: 10px 0px;
  }
  .detail-page-title{
    background: #edf7ff;
    padding: 5px;
  }
  .vux-table {
    line-height: normal !important;
  }
  .vux-table .weui-cell{
    padding: 0;
  }
  .vux-table td{
    width: 30%;
    padding: 5px;
    font-size: 12px;
  }
  .detail-page-name{
    width: 20% !important;
    background: #edf7ff;
  }
  .required{
    color: red;
  }
  .inputfile {
    opacity: 0;
    width: 0px;
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
  .btn-file{
    display: inline-block;
    width: 43px;
    height: 25px;
    background-color: #F8F8F8;
    line-height: 25px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }
  .vux-table .weui-btn{
    margin: 0;
  }
  .weui-switch:checked{
    border-color: #459FFB;
    background-color: #459FFB;
  }
  .dialog-part {
  .weui-dialog {
    height: 95%;
  }
  .dialog-close-btn {
    text-align: right;
  }
  }
  .expense-detail{
    margin: 2px 0px;
  }
  .loan-offset{
    margin: 2px 0px;
  }

  /*责任中心*/
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
  .dialog-btn-part{
    border-top: 0.5px solid #D9D9D9;
  .dialog-btn{
    margin: 5px;
  }
  }
  .inline-btn{
    padding: 0px 10px;
    font-size: 12px;
  }
  #businessName{
    position: relative;
    left: 3px;
  }
  .table-part{
    height: 300px;
    overflow: scroll;
  .vux-table td{
    width: auto;
    font-size: 12px;
  }
  .dialog-title-tr{
    font-size: 14px;
  td{
    line-height: 15px;
  }
  }
  .weui-switch{
    width: 26px;
    height: 17px;
  }
  .dialog-switch-td{
    width: 25px !important;
    padding: 3px;
  }
  .weui-switch:checked{
    border-color: #45a8fb;
    background-color: #45a8fb;
  }
  .weui-switch:after, .weui-switch-cp__box:after{
    width: 10px;
    height: 15px;
    left: -3px;
  }
  .weui-switch:before, .weui-switch-cp__box:before{
    width: 10px;
    height: 15px;
    left: -3px;
  }
  }
  .btn-prev{
    color: #000000;
    background-color: #F8F8F8;
  }
  .btn-next{
    color: #000000;
    background-color: #F8F8F8;
  }
  .dialog-bottom-bar{
  span{
    font-size: 12px;
    float: left;
  }
  .btn-confirm{
    float: right;
  }
  }
  .dialog-input{
    padding:5px;
    font-size: 14px;
  .vux-x-input{
    padding: 0px 15px;
  }
  }
  #business-part{
  .weui-cell_select{
    font-size: 14px;
  }
  .vux-selector.weui-cell_select-after{
    padding: 0;
    height: 30px;
  .weui-label{
    width: 100px;
  }
  }
  .dialog-btn{
    color: white;
    background-color: #45a8fb;
    margin: 3px;
  }
  }
  .select-gp{
    font-size: 12px;
    line-height: 20px;
    height: 20px;
  .weui-select{
    padding-left: 0 !important;
  }
  }
  .select-td{
    padding: 0;
  .weui-cell{
    font-size: 12px;
    height: 16px;
    padding-left: 5px;
  }
  }
  .expense-btn{
    margin: 5px;
  }
  #save-money-jkdx{
  td{
    width: auto;
  }
  }
  #offset-list{
  td{
    width: auto;
  }
  #offset-first-td{
    width: 20px;
  }
  }
  .vux-popup-dialog{
    z-index: 6000;
  }
  #file-type{
    padding: 0;
    .weui-cell{
      font-size: 12px;
      height: 16px;
      padding-left: 5px;
    }
  }
  #company-seal{

  }
  #sub-company-seal{
    /*height: 450px;*/
  }
  #sub-company-part-back{
    text-align: left;
    color: #8a8a8a;
    font-size: 13px;
    margin: 5px 10px;
    img{
      position: relative;
      top: 4px;
    }
  }
  #sub-tree-part,#sub-company-part{
    height: 300px;
    overflow: auto;
  }
  #sub-tree{
    margin: 5px 10px;
  }
</style>

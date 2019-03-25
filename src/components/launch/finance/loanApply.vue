<!--借款申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">经办人</td>
          <td>{{applicant.name}}</td>
          <td class="detail-page-name">申请时间</td>
          <td>{{info.fillDate}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">职务</td>
          <td colspan="3">{{applicant.rankName}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">借款信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">单据编号</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="recCode"></x-input>
          </td>
          <td class="detail-page-name">单据状态</td>
          <td>{{loanStatusStr}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">借款部门</td>
          <td>{{info.departmentName}}</td>
          <td class="detail-page-name">借款金额<span class="required">*</span></td>
          <td>
            <x-input title="" placeholder="请输入" @on-blur="transferChinese" v-model="loanMoney"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">借款金额大写</td>
          <td>{{loanMoneyChinese}}</td>
          <td class="detail-page-name">预计还款日期<span class="required">*</span></td>
          <td>
            {{willReturnDate}}
            <a @click="chooseDate">
              <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
            </a>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">所属业务</td>
          <td colspan="2">
            {{businessChoosed.businessName}}
          </td>
          <td>
            <button class="btn" @click="openDialog">选择</button>
            <button class="btn"  @click="clearBusiness">清除</button>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">用途</td>
          <td colspan="3">
            <x-textarea title="" :max="100" v-model="loanReason" placeholder="请输入"></x-textarea>
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

        <tr>
          <th colspan="4" class="detail-page-title">收付款信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">收款人/单位</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="payee"></x-input>
          </td>
          <td class="detail-page-name">收款银行</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="loanBankName"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">收款账号</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="loanBankNo"></x-input>
          </td>
          <td class="detail-page-name">支付方式</td>
          <td id="pay-type-td">
            <group>
              <!--<selector id="pay-type-gp" v-model="payTypeVal" title="" :options="payTypeList"></selector>-->
              <cell-box is-link @click.native="openSelectModelFlage('payType',payTypeList)">
                {{payTypeLabel}}
              </cell-box>
            </group>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">记账单位<span class="required">*</span></td>
          <td id="account-unit-td">
            <group>
              <!--<selector id="account-unit-gp" :value-map="['fsn', 'name']" v-model="accountUnitValue" :options="accountUnitList" @on-change="onAccountUnitChange"></selector>-->
              <cell-box is-link @click.native="openSelectModelFlage('accountUnit',accountUnitList)">
                {{accountUnitLabel}}
              </cell-box>
            </group>
          </td>
          <td class="detail-page-name">付款银行</td>
          <td>
            {{bankAccount.FAccountName}}
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">付款账号</td>
          <td colspan="3">
            {{bankAccount.FAccountNo}}
          </td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">备注</th>
        </tr>
        <tr>
          <td colspan="4">
            <x-textarea title="" :max="100" v-model="remark" placeholder="请输入"></x-textarea>
          </td>
        </tr>
      </tbody>
    </x-table>

    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="dialog-part">
        <div @click="showToast=false" class="dialog-close-btn">
          <span>
            <img slot="label" style="padding:8px 10px 0px 0px;" src="../../../assets/icon/close.png" width="24" height="24">
          </span>
        </div>
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
                  <input type="radio" name="" :value="item" v-model="businessChoosed" />
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

      </x-dialog>
    </div>
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
  import { XTable, XTextarea, XInput, XButton, XDialog,
    TransferDom, Selector, Group, XSwitch, InlineXSwitch,
    Scroller, Divider, LoadMore, Radio, PopupHeader, Popup, CellBox } from 'vux'
  var LoanApplyPage = Vue.extend({})
  Vue.component('loanApply-page', LoanApplyPage)

  export default {
    name: 'LoanApplyPage',
    directives: {
      TransferDom
    },
    components: {
      XTable, XTextarea, XInput, XButton, XDialog,
      Selector, Group, XSwitch, InlineXSwitch, Scroller,
      Divider, LoadMore, Radio, PopupHeader, Popup, CellBox
    },
    props: {
      saveStatus: Number
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '4028807450506009015050f267710001',
        remark: '',//备注
        info: {},
        applicant: {},

        recCode: '',//单据编号
        loanMoney: '',//借款金额
        loanMoneyChinese: '',//借款金额大写
        willReturnDate: '',//预计还款日期
        loanReason: '',//用途
        payee: '',//收款人
        loanBankName: '',//收款银行
        loanBankNo: '',//收款账号
        payTypeList: ['转账','现金','其他'],//支付方式
        payTypeVal: '',//支付方式-val
        payTypeLabel:'',

        showToast: false,//所属业务-dialog
        businessName: '',//dialog-业务名称
        selectorList: [],//dialog-业务类型
        selectorValue: '',//dialog-业务类型-val

        businessList: [],//dialog-业务搜索结果
        businessNameList: [],//dialog-业务搜索结果
        businessAllNum: '',//dialog-业务总个数
        businessChoosed: {},//dialog-选择的业务
        pageNum: 1,//dialog-业务搜索结果-页码
        switchValue: false,//dialog-选择业务switch

        preStatus: true,
        nextStatus: false,

        accountUnitList: [],//记账单位
        accountUnitValue: '',
        accountUnitLabel: '',
        accountUniId: '',//记账单位ID

        bankAccount: '',//银行信息

        fileObj: {},//上传附件集合
        fileShowList: [],//上传附件集合-预览
        uploadedFileIdList: [],//已上传附件ID集合

        selectModelFlag: false, //下拉选择弹框控制
        selectModelTitle: '', //下拉选择弹框标题
        selectModelData:[], //下拉选择弹框数据
        selectModel: ''
      }
    },
    computed: {
      loanStatusStr: function () {//单据状态-计算属性
        let status = this.info.loanStatus;
        let statusStr;
        if(status==''){
          statusStr = '';
        }else if(status==0){
          statusStr = '待审批';
        }else if(status==1){
          statusStr = '待发放';
        }else if(status==2){
          statusStr = '待归还';
        }else if(status==3){
          statusStr = '已归还';
        }
        return statusStr;
      }
    },
    mounted () {
      this.getAccountUnit();
      this.axios({
        url: this.baseUrl+'/wechat/loan/modLoan',
        method: 'get'
      }).then((response) => {
        this.info = response.data.obj;
        this.applicant = response.data.obj.applicant;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
      this.$emit('sendTitleToParent','借款申请');
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
      openSelectModelFlage(type,data){
        console.log('openSelectModelFlage',data);

        this.selectModelData = [];
        if(type == 'payType'){
          this.selectModelTitle = '请选择支付方式';
          this.selectModel = this.payTypeVal;
          this.selectModelData = data;
        }else {
          this.selectModelTitle = '请选择记账单位';
          this.selectModel = this.accountUnitValue;
          data.forEach((item) => {
            item.key = item.fsn;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }
        this.selectModelFlag = true;
      },
      getLeaveType (value, label) {

        this.accountUniId = value;

        let isChange = value == this.selectModel ? false : true
        if(this.selectModelTitle == '请选择支付方式'){
          this.selectModel = this.payTypeVal = value
          this.payTypeLabel = label
        } else {
          this.selectModel = this.accountUnitValue = value
          this.accountUnitLabel = label
        }
        if(isChange){
          this.selectModelFlag = false;
          if(this.selectModelTitle == '请选择记账单位'){
            this.getBankAccount();
          }
        }
        console.log(this.selectModel)
      },
      async openDialog () {// 打开选择业务-dialog
        this.showToast = true;
        this.$vux.loading.show({
          text: '加载中'
        });
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/listRefFlowTypes',
          method: 'get'
        });
        this.selectorList = res.data.list;
        this.searchBusiness();
      },
      async searchBusiness () {// dialog-搜索业务
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
      transferChinese () {
        if(isNaN(this.loanMoney)&&this.loanMoney!=''){
          this.showMsg('借款金额请输入数字');
        }else{
          let chineseStr = this.$common.changeMoneyToChinese(this.loanMoney);
          this.loanMoneyChinese = chineseStr;
        }
      },
      chooseDate () {//预计还款日期
        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.willReturnDate,
          onConfirm (val) {
            that.willReturnDate = val;
          }
        })
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
      async getAccountUnit () {//获取记账单位
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/listAccountUnit',
          method: 'get'
        });

        let list = res.data.list;
        this.accountUnitList.push({fsn:'',id:'',name:''});
        for(let i=0;i<list.length;i++){
          this.accountUnitList.push(list[i]);
        }

      },
      onAccountUnitChange (v) {
        this.getBankAccount();
      },
      async getBankAccount () {//获取银行信息
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/getBankAccount?accountUnitName='+this.accountUnitLabel,
          method: 'get'
        });
        this.bankAccount = res.data.bankAccount;
      },
      saveForm () {//保存
        if(this.loanMoney == ''||this.willReturnDate == ''||this.accountUnitValue == ''){
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        });
        let accountArr = this.accountUnitList;
        let formData = new FormData();
        for(let i=0;i<accountArr.length;i++){
          if(this.accountUnitList[i].fsn == this.accountUnitValue){
            formData.append("faccountUnit",this.accountUnitList[i].name);
          }
        }
        formData.append("id",this.info.id);
        formData.append("flowId",this.info.flowId);
        formData.append("fillDate",this.info.fillDate);
        formData.append("recCode",this.recCode);
        formData.append("loanStatus",this.info.loanStatus);
        formData.append("loanMoney",this.loanMoney);
        formData.append("loanMoneyDaxie",this.loanMoneyChinese);
        formData.append("willReturnDate",this.willReturnDate);
        if(this.businessChoosed.id){
          formData.append("businessId",this.businessChoosed.id);
        }
        if(this.businessChoosed.reportNo){
          formData.append("businessReport",this.businessChoosed.reportNo);
        }
        if(this.businessChoosed.businessName){
          formData.append("businessName",this.businessChoosed.businessName);
        }
        formData.append("loanReason",this.loanReason);
        formData.append("payee",this.payee);
        formData.append("loanBankName",this.loanBankName);
        formData.append("loanBankNo",this.loanBankNo);
        formData.append("payType",this.payTypeVal);
        formData.append("faccountUnitFsn",this.accountUnitValue);
        formData.append("payBankName",this.bankAccount.FAccountName);
        formData.append("payBankNo",this.bankAccount.FAccountNo);
        formData.append("remark",this.remark);

        this.axios({
          url: this.baseUrl+'/wechat/loan/saveForm',
          method: 'post',
          data: formData
        }).then((response) => {
          console.log('saveForm',response.data,this.saveStatus);
          if(response.data.status == 0){//保存失败
            console.log('保存失败');
            this.$vux.loading.hide();
            this.showMsg(response.data.msg);
          }else if(this.saveStatus == 0&&response.data.status == 1){//父组件操作发起，并且保存成功
            console.log('startFlow');
            this.startFlow();
          }else if(this.saveStatus == 1&&response.data.status == 1){//父组件操作提交，并且保存成功
            console.log('$emit');
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
      chooseFile () {// 选择附件
        this.fileObj = document.getElementById('file').files;
        this.$vux.loading.show({
          text: '保存中'
        });
        this.submitFile();
      },
      deleteFile (index) {// 删除已选附件
        this.fileShowList.splice(index,1);

        let deleteFileId = this.uploadedFileIdList[index];
        let fileData = new FormData();
        fileData.append("fileId",deleteFileId);
        this.$vux.loading.show({
          text: '删除中'
        });
        this.axios({
          url: this.baseUrl+'/wechat/commonFile/deleteFile',
          method: 'post',
          data: fileData
        }).then((response) => {
          this.$vux.loading.hide();
          this.uploadedFileIdList.splice(index,1);
        }).catch((response) => {
          this.$vux.loading.hide();
        });

      },
      async submitFile () {// 上传附件-图片
        let fileObjL = this.fileObj.length;
        for(let i=0;i<fileObjL;i++){
          let fileData = new FormData();
          fileData.append("file",this.fileObj[i]);
          fileData.append("taskId",this.info.id);
          fileData.append("refRecordId",this.info.id);
          fileData.append("refModule","AuditAchieveDoc");
          fileData.append("flowId",this.flowId);

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
  }
  .detail-page-name{
    width: 20% !important;
    background: #edf7ff;
  }
  .required{
    color: red;
  }
  .vux-table {
    line-height: normal !important;
  }
  .vux-table .weui-cell{
    padding: 0;
  }
  .right{
    float: right;
  }
  .btn{
    display: inline-block;
    width: 40px;
    height: 29px;
    background-color: #F8F8F8;
    line-height: 29px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    font-size: 12px;
  }
  .dialog-part{
    .weui-dialog{
      height: 95%;
    }
    .dialog-close-btn{
      text-align: right;
    }
    .vux-selector.weui-cell_select-after{
      padding: 0;
      height: 30px;
      .weui-label{
        width: 100px;
      }
    }
    .dialog-input{
      padding:5px;
      font-size: 14px;
      .vux-x-input{
        padding: 0px 15px;
      }
    }
    #businessName{
      position: relative;
      left: 3px;
    }
    .weui-cell_select{
      font-size: 14px;
    }
    .dialog-btn{
      color: white;
      background-color: #45a8fb;
      margin: 3px;
    }
    .vux-divider{
      padding: 1px 0px;
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
  }
  #pay-type-gp,#account-unit-gp{
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    .weui-select{
      padding-left: 0 !important;
    }
  }
  #pay-type-td,#account-unit-td{
    padding: 0;
    .weui-cell{
      font-size: 12px;
      height: 16px;
      padding-left: 5px;
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

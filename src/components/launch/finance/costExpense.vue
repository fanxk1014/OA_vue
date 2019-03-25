<!--费用报销详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">经办人</td>
          <td>{{info.userPeopleName}}</td>
          <td class="detail-page-name">申请时间</td>
          <td>{{info.applyDate}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">经办部门</td>
          <td>{{info.userDepartName}}</td>
          <td class="detail-page-name">职务</td>
          <td>{{info.jibie}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">报销信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">费用名称<span class="required">*</span></td>
          <td>
            <x-input title="" placeholder="请输入" v-model="name"></x-input>
          </td>
          <td class="detail-page-name">单据编号</td>
          <td>{{info.recCode}}</td>
        </tr>
        <tr>
          <td colspan="2" class="detail-page-name">是否用于抵扣费用报销（不计入成本）</td>
          <td colspan="2">
            <inline-x-switch v-model="isDeduction" @on-change="switchVal"></inline-x-switch>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">责任中心</td>
          <td colspan="2">
            {{checkDeptResultName}}
          </td>
          <td>
            <!--<button class="btn" @click="openDialog('deptTree')">选择</button>-->
            <x-button class="inline-btn" @click.native="openDialog('deptTree')" mini>选择</x-button>
            <x-button class="inline-btn" @click.native="clearDeptResult" mini>清除</x-button>
          </td>
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
          <td class="detail-page-name">报销明细</td>
          <td colspan="3">
            <x-button class="inline-btn" @click.native="openDialog('expense')" mini>{{btnText}}</x-button>
          </td>
        </tr>
      </tbody>
    </x-table>

    <x-table class="expense-detail">
      <tbody>
        <tr>
          <td class="detail-page-name">费用类型及说明</td>
          <td class="detail-page-name">报销费用</td>
          <td class="detail-page-name">计入部门考核</td>
        </tr>
        <tr>
          <td>{{savedList.feeRemark}}</td>
          <td>{{savedList.money10}}</td>
          <td>{{savedList.falDepAudit}}</td>
        </tr>
      </tbody>
    </x-table>

    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">费用合计(元)</td>
          <td>{{total1}}</td>
          <td class="detail-page-name">费用合计大写（元）</td>
          <td>{{total2}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">单据附件</td>
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
          <td class="detail-page-name">借款抵消</td>
          <td colspan="3">
            <x-button class="inline-btn" @click.native="openDialog('jkdx')" mini>增加</x-button>
            <x-button v-if="businessOffsetListRadio.length>0" class="inline-btn" @click.native="businessJKDXDelete" mini>删除</x-button>
          </td>
        </tr>
      </tbody>
    </x-table>

    <x-table class="loan-offset" id="offset-list">
      <tbody>
        <tr>
          <td id="offset-first-td" class="detail-page-name"></td>
          <td class="detail-page-name">申请人</td>
          <td class="detail-page-name">业务名称</td>
          <td class="detail-page-name">剩余可抵扣金额</td>
          <td class="detail-page-name">本次抵扣金额</td>
        </tr>
        <tr v-for="(item,key) in businessOffsetListRadio" :key="key">
          <td>
            <input type="radio" name="" :value="key" v-model="businessOffsetRadioVal"/>
          </td>
          <td>{{item.applyName}}</td>
          <td>{{item.businessName}}</td>
          <td>{{item.surplusDeductible}}</td>
          <td>
            <x-input title="" placeholder="请输入" :ref="'deductMoney'+key" @on-blur="getDeductMoney(key)"></x-input>
          </td>
        </tr>
      <tr>

      </tr>
      </tbody>
    </x-table>

    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">抵消借款（元）</td>
          <td>{{loanTotalStr}}</td>
          <td class="detail-page-name">应付金额</td>
          <td>{{shouldPayShow}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">部门未归还借款</td>
          <td colspan="3">{{departLoanMoney}},{{applicantLoanMoney}}</td>
        </tr>
        <tr>
          <th colspan="4" class="detail-page-title">收款人信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">收款人/单位</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="payUnitName"></x-input>
          </td>
          <td class="detail-page-name">收款银行</td>
          <td>
            <x-input title="" placeholder="请输入" v-model="bank"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">收款账号</td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="bankAccount"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name" colspan="4">备注</td>
        </tr>
        <tr>
          <td colspan="4">
            <x-textarea :max="100" v-model="remark" placeholder="请输入"></x-textarea>
          </td>
        </tr>
      </tbody>
    </x-table>
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
    <!--弹窗-dialog-->
    <div v-transfer-dom>
      <x-dialog mask-z-index="100" v-model="showToast" class="dialog-part">
        <div @click="showToast=false" class="dialog-close-btn">
          <span>
            <img slot="label" style="padding:8px 10px 0px 0px;" src="../../../assets/icon/close.png" width="24" height="24">
          </span>
        </div>

        <!--责任中心-->
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
        <!--责任中心-END-->

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

        <!--报销明细-->
        <div id="expense-detail-part" v-if="expenseShow">
          <div>报销明细</div>
          <x-table>
            <tbody>
              <tr>
                <td class="detail-page-name">费用类型及说明</td>
                <td colspan="3">
                  <x-input title="" placeholder="请输入" v-model="feeRemark"></x-input>
                </td>
              </tr>
              <tr>
                <td class="detail-page-name">报销费用</td>
                <td>
                  <x-input title="" placeholder="请输入" v-model="money10" @on-blur="changeMoney11"></x-input>
                </td>
                <td class="detail-page-name">财务核实金额列</td>
                <td>
                  <x-input title="" placeholder="请输入" v-model="money11"></x-input>
                </td>
              </tr>
              <tr>
                <td class="detail-page-name">成本科目</td>
                <td class="select-td">
                  <group>
                    <!--<selector class="select-gp" v-model="expenseCostItemsVal" :value-map="['FSN', 'FName']" title="" :options="expenseCostItemsList" ></selector>-->
                    <cell-box is-link @click.native="openSelectModelFlage('expenseCostItems',expenseCostItemsList)">
                      {{expenseCostItemsLabel}}
                    </cell-box>
                  </group>
                </td>
                <td class="detail-page-name">成本类型</td>
                <td class="select-td">
                  <group>
                    <!--<selector class="select-gp" v-model="expenseCostTypeVal" :value-map="['FSN', 'FName']" title="" :options="expenseCostTypeList" ></selector>-->
                    <cell-box is-link @click.native="openSelectModelFlage('expenseCostType',expenseCostTypeList)">
                      {{expenseCostTypeLabel}}
                    </cell-box>
                  </group>
                </td>
              </tr>
              <tr>
                <td class="detail-page-name">是否电子发票</td>
                <td>
                  <inline-x-switch v-model="isEInvoice" @on-change="switchEInvoice"></inline-x-switch>
                </td>
                <td class="detail-page-name">发票号码</td>
                <td>
                  <x-input title="" placeholder="请输入" v-model="eleInvoiceNo"></x-input>
                </td>
              </tr>
              <tr>
                <td class="detail-page-name">计入部门考核</td>
                <td colspan="3">
                  <inline-x-switch v-model="falDepAudit" @on-change="switchFalDepAudit"></inline-x-switch>
                </td>
              </tr>
            </tbody>
          </x-table>
          <div>
            <x-button mini class="dialog-btn expense-btn" @click.native="expenseSave">确定</x-button>
            <x-button mini class="dialog-btn expense-btn" v-if="btnText == '修改'" @click.native="expenseDelete">删除</x-button>
          </div>
        </div>
        <!--报销明细-END-->

        <!--借款抵消-->
        <div id="save-money-jkdx" v-if="saveMoneyJKDXShow">
          <div>借款单</div>
          <x-table>
            <tbody>
              <tr>
                <td></td>
                <td>申请人</td>
                <td>业务名称</td>
                <td>剩余可抵扣金额</td>
              </tr>
              <tr v-for="(item,key) in loanList" :key="key">
                <td>
                  <input type="radio" name="" :value="item" v-model="businessJKDXChoosed" />
                </td>
                <td>{{item.applicantName}}</td>
                <td>{{item.businessName}}</td>
                <td>{{item.surplusDeductible}}</td>
              </tr>
            </tbody>
          </x-table>
          <div>
            <x-button mini class="dialog-btn expense-btn" @click.native="businessJKDXSave">确定</x-button>
          </div>
        </div>
        <!--借款抵消-END-->

      </x-dialog>

    </div>
    <!--弹窗-dialog-END-->


  </div>

</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import { XTable, XButton, XInput, InlineXSwitch, XTextarea, XDialog, TransferDom, Group,
    Selector, PopupHeader, Popup, XSwitch, Radio, CellBox} from 'vux'
  var CostExpensePage = Vue.extend({})
  Vue.component('costExpense-page', CostExpensePage)

  export default {
    name: 'CostExpensePage',
    directives: {
      TransferDom
    },
    components: {
      XTable,XButton,XInput,InlineXSwitch,XTextarea,XDialog,Group,Selector, PopupHeader, Popup, XSwitch, Radio, CellBox
    },
    props: {
      saveStatus: Number
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '08c4a7eccfdb4efa9ba2c8c12e8f81fa',
        operatorId: '',//当前 操作人
        refModule: '',
        refRecordId: '',
        stepId: '',
        info: {},
        togetherName: '',//同行人
        tripRemark: '',//出差事由
        name: '',//费用名称
        isDeduction: false,//是否用于抵扣费用报销(不计入成本)
        isDeductionVal: 0,//是否用于抵扣费用报销(不计入成本)
        remark: '',//备注
        fileObj: {},//上传附件集合
        fileShowList: [],//上传附件集合-预览
        uploadedFileIdList: [],//已上传附件ID集合
        oldRefRecordIds: '',//对应文件记录，明细ID字符串

        showToast: false,//弹窗-dialog
        confirmBtn: false,// 控制显示、隐藏 确认提交按钮

        // 责任中心
        treeData: [],//组织结构树
        checkTreeShow: false,
        checkTreeSearchVal: '',//组织结构树搜索内容
        checkTreeSearchResult: [],//组织结构树搜索结果
        treeProps: {
          children: 'children',
          label: 'name'
        },
        checkDeptResultName: '',//责任中心name
        checkDeptResult: {},//责任中心-选择结果
        // 责任中心-END

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

        //报销明细
        expenseShow: false,
        feeRemark: '',//费用类型及说明
        money10: '',//报销费用
        money11: '',//财务核实金额列
        expenseCostItemsList: [],//成本科目list
        expenseCostItemsVal: '',//成本科目val
        expenseCostItemsLabel: '', //成本科目Label
        expenseCostTypeList: [],//成本类型list
        expenseCostTypeVal: '',//成本类型val
        expenseCostTypeLabel: '', // 成本类型Label
        isEInvoice: false,//是否电子发票
        isEInvoiceVal: 0,//是否电子发票
        eleInvoiceNo: '',//发票号码
        falDepAudit: false,//计入部门考核
        falDepAuditVal: 0,//计入部门考核

        savedList: {},//成功保存后，返回的明细list
        savedObj: {},//成功保存后，返回的明细Obj
        total1: '',//费用合计
        total2: '',//费用合计大写
        deductMoney: '',//本次抵扣金额
        btnText: '增加',
        //报销明细-END

        //借款抵消
        saveMoneyJKDXShow: false,
        loanList: [],//借款单
        businessJKDXChoosed: {},//dialog借款单选择radio
        businessOffsetListRadio: [],//借款抵消展示列表明细id
        businessOffsetRadioVal: {},//借款抵消展示列表选中行-内容
        savedJKDXList: [],//借款抵消明细保存后返回的list数组,供删除时使用
        savedJKDXObj: {},//借款抵消明细保存后返回的obj数组,供删除时使用
        departLoanMoney: '',//部门未归还金额
        applicantLoanMoney: '',//个人未归还金额
        shouldPayShow: '',//应付金额
        //借款抵消-END

        //收款人信息
        payUnitName: '',//收款人/单位
        bank: '',//收款银行
        bankAccount: '',//bankAccount
        //收款人信息-END

        selectModelFlag: false, //下拉选择弹框控制
        selectModelTitle: '', //下拉选择弹框标题
        selectModelData:[], //下拉选择弹框数据
        selectModel: '',

        loanTotalStr: ''//抵消借款（元）
      }
    },
    mounted () {
      this.axios({
        url: this.baseUrl+'/wechat/expense/modExpense?flowId='+this.flowId+'&type=2',
        method: 'get'
      }).then((response) => {
        this.info = response.data.obj;
        this.refRecordId = response.data.refRecordId;
        this.refModule = response.data.refModule;
        this.operatorId = response.data.operatorId;
        this.departLoanMoney = response.data.departLoanMoney;
        this.applicantLoanMoney = response.data.applicantLoanMoney;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
      this.$emit('sendTitleToParent','报销申请-费用报销');
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
        if(type == 'expenseCostItems'){
          this.selectModelTitle = '请选择成本科目';
          this.selectModel = this.expenseCostItemsVal
        }else {
          this.selectModelTitle = '请选择成本类型';
          this.selectModel = this.expenseCostTypeVal
        }
        this.selectModelData = []
        data.forEach((item) => {
          item.key = item.FSN
          item.value = item.FName
          this.selectModelData.push(item)
        })
        this.selectModelFlag = true;
      },
      getLeaveType (value, label) {
        let isChange = value == this.selectModel ? false : true
        if(this.selectModelTitle == '请选择成本科目'){
          this.selectModel = this.expenseCostItemsVal = value
          this.expenseCostItemsLabel = label
        } else {
          this.selectModel = this.expenseCostTypeVal = value
          this.expenseCostTypeLabel = label
        }
        if(isChange){
          this.selectModelFlag = false;
        }
        console.log(this.selectModel)
      },
      openDialog (v) {// 打开选择业务-dialog
        this.checkTreeShow = false;
        this.businessShow = false;
        this.expenseShow = false;
        this.saveMoneyJKDXShow = false;
        this.showToast = true;
        if(v == 'deptTree'){//责任中心
          this.checkDeptResult = [];
          this.getDeptTree();
        }else if(v == 'business'){//所属业务
          this.businessShow = true;
          this.getBusinessList();
          this.searchBusiness();
        }else if(v == 'expense'){//报销明细
          this.getExpenseCostItems();
          this.getExpenseCostType();
          this.expenseShow = true;
        }else if(v == 'jkdx'){//借款抵消
          this.businessJKDXChoosed = {};
          this.getlistLoanBusinessNewBX();
          this.saveMoneyJKDXShow = true;
        }
      },
      confirmDialog (v) {
        console.log('confirmDialog',v);
      },
      switchVal (data) {//switch
        if(data){
          this.isDeductionVal = 1;
        }else{
          this.isDeductionVal = 0;
        }
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
      async submitFile () {// 上传附件-图片
        let fileObjL = this.fileObj.length;
        for(let i=0;i<fileObjL;i++){
          let fileData = new FormData();
          fileData.append("file",this.fileObj[i]);
          fileData.append("taskId",this.info.id);
          fileData.append("refRecordId",this.savedList.id);
          fileData.append("refModule",this.refModule);
          fileData.append("stepId",this.stepId);
          fileData.append("operatorId",this.operatorId);
          fileData.append("expenseType",this.info.type);
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
      getDeptTree () {//责任中心-获取组织架构
        this.axios({
          url: this.baseUrl+'/wechat/commonInterface/deptTree',
          method: 'get'
        }).then((response) => {
          this.treeData = response.data;
          this.checkTreeShow = true;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
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
      getCheckedNodes() {//审批-组织架构树

        let checkedPersonArr = this.$refs.tree.getCheckedNodes();

        this.checkDeptResult = checkedPersonArr[0];
        this.checkDeptResultName = this.checkDeptResult.name;
        this.checkTreeShow = false;//隐藏责任中心part
        this.showToast = false;//关闭dialog
        console.log('组织架构树',this.checkDeptResult);
      },
      clearDeptResult () {//清除组织架构
        this.checkDeptResultName = '';
        this.checkDeptResult = {};
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
        console.log(res)
        this.$vux.loading.hide();
        this.businessList = res.data.list;
        let businessLength = res.data.list.length;
        for(let i=0;i<businessLength;i++){
          this.businessNameList.push(res.data.list[i].businessName);
        }
        this.businessAllNum = Math.ceil(res.data.total/15);
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
      async getExpenseCostItems () {//报销明细-获取成本科目
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/getCostItems',
          method: 'get'
        });

        this.expenseCostItemsList = res.data.list;
      },
      async getExpenseCostType () {//报销明细-获取成本类型
        let res = await this.axios({
          url: this.baseUrl+'/wechat/commonInterface/getBaseCostitemsBudgets',
          method: 'get'
        });

        this.expenseCostTypeList = res.data.list;
      },
      switchEInvoice (data) {//switch
        if(data){
          this.isEInvoiceVal = 1;
        }else{
          this.isEInvoiceVal = 0;
        }
      },
      switchFalDepAudit (data) {//switch
        if(data){
          this.falDepAuditVal = 1;
        }else{
          this.falDepAuditVal = 0;
        }
      },
      expenseSave(){//报销明细-保存
        this.$vux.loading.show({
          text: '保存中'
        });
        let formData = new FormData();
        if(this.btnText == '修改'){
          formData.append("id",this.savedList.id);
        }
        formData.append("businessId",this.info.id);
        formData.append("type",'2');
        formData.append("feeRemark",this.feeRemark);
        formData.append("money10",this.money10);
        formData.append("money11",this.money11);
        formData.append("itemsId",this.expenseCostItemsVal);
        formData.append("itemsTypeId",this.expenseCostTypeVal);
        formData.append("isEInvoice",this.isEInvoiceVal);
        formData.append("eleInvoiceNo",this.eleInvoiceNo);
        formData.append("falDepAudit",this.falDepAuditVal);

        this.axios({
          url: this.baseUrl+'/wechat/expense/saveMoneyBX',
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: formData
        }).then((response) => {
          this.$vux.loading.hide();
          console.log('dialog-报销明细-保存',response.data);
          if(response.data.status == 1){//保存成功
            this.savedList = response.data.list[0];
            this.total1 = response.data.total;
            this.total2 = response.data.total2;
            this.shouldPayShow = response.data.total3;
            this.savedObj = response.data.obj;
            this.btnText = '修改';
          }else{
            this.showMsg(response.data.error);
          }

          this.showToast = false;
          this.$common.showToastMsg(response.data.success);
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      expenseDelete (){//报销明细-删除
        this.$vux.loading.show({
          text: '正在删除'
        });
        let formData = new FormData();
        formData.append("id",this.savedList.id);
        formData.append("businessId",this.info.id);

        this.axios({
          url: this.baseUrl+'/wechat/expense/delMoneyBx',
          method: 'post',
          data: formData
        }).then((response) => {
          this.$vux.loading.hide();
          console.log('dialog-报销明细-删除',response.data);
          if(response.data.status == 1){//删除成功
            this.btnText = '增加';
            this.savedList = {};
            this.total1 = '';
            this.total2 = '';
            this.shouldPayShow = '';
          }
          this.showToast = false;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      async getlistLoanBusinessNewBX(){//获取借款单
        let res = await this.axios({
          url: this.baseUrl+'/wechat/loan/listLoanBusinessNewBX?expenseId='+this.info.id+'&loanStatus=2&',
          method: 'get'
        });
        this.loanList = res.data.list;

      },
      businessJKDXSave(){//抵消借款
        // console.log('businessJKDXSave',this.businessJKDXChoosed);
        if(this.businessJKDXChoosed.id){//选择了某项明细

          let choosedId = this.businessJKDXChoosed.id;//所选抵消明细id
          let savedList = this.businessOffsetListRadio;
          for(let i=0;i<savedList.length;i++){
            if(savedList[i].id==choosedId){//如果已存在，则返回false
              this.showToast = false;
              return false;
            }
          }

          this.$vux.loading.show({
            text: '保存中'
          });
          let formData = new FormData();
          formData.append("id",'');
          formData.append("loanBusinessId",this.businessJKDXChoosed.id);
          formData.append("loanBusinessName",this.businessJKDXChoosed.businessName);
          formData.append("expenseId",this.info.id);
          formData.append("applyName",this.businessJKDXChoosed.applicantName);
          formData.append("applyDate",this.businessJKDXChoosed.fill_date);
          formData.append("businessName",this.businessJKDXChoosed.businessName);
          formData.append("loanMoney",this.businessJKDXChoosed.loan_money);
          formData.append("noPaymentMoney",this.businessJKDXChoosed.no_payment_money);
          formData.append("loanReason",this.businessJKDXChoosed.loan_reason);
          formData.append("deductMoney",this.deductMoney);
          formData.append("remark",'');

          this.axios({
            url: this.baseUrl+'/wechat/expense/saveMoneyJKDX',
            method: 'post',
            data: formData,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response) => {
            this.$vux.loading.hide();
            console.log('抵消明细-保存',response.data);
            if(response.data.status == 1){//保存成功
              this.showMsg(response.data.success);
              this.savedJKDXList = response.data.list;
              this.businessOffsetListRadio=response.data.list;
              this.loanTotalStr = response.data.obj.loanTotal;
              this.savedJKDXObj = response.data.obj;
              this.departLoanMoney = response.data.departLoanMoney;
              this.applicantLoanMoney = response.data.applicantLoanMoney;
              this.shouldPayShow = this.savedJKDXObj.shouldPay;//应付金额赋值

              console.log('抵消明细-保存,用来展示的数组',this.businessOffsetListRadio);
              this.showToast = false;
            }

          }).catch((response) => {
            this.$vux.loading.hide();
          });


        }
      },
      businessJKDXDelete(){//抵消借款-删除所选抵消明细

        let formData = new FormData();
        formData.append("id",this.savedJKDXList[this.businessOffsetRadioVal].id);
        formData.append("expenseId",this.info.id);

        this.axios({
          url: this.baseUrl+'/wechat/expense/delMoneyJKDX',
          method: 'post',
          data: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          this.$vux.loading.hide();
          console.log('dialog-抵消明细-删除',response.data);

          if(response.data.status == 1){//保存成功
            this.savedJKDXList = response.data.list;
            this.businessOffsetListRadio.splice(this.businessOffsetRadioVal, 1);//删除该条数据
            this.shouldPayShow = response.data.obj.shouldPay;
            this.loanTotalStr = response.data.obj.loanTotal;
            this.departLoanMoney = response.data.departLoanMoney;
            this.applicantLoanMoney = response.data.applicantLoanMoney;
            this.$refs['deductMoney'+this.businessOffsetRadioVal][this.businessOffsetRadioVal]['currentValue'] = '';
            this.showMsg(response.data.success);
          }

        }).catch((response) => {
          this.$vux.loading.hide();
        });

      },
      changeMoney11(){
        this.money11 = this.money10;
      },
      getDeductMoney(v){//获取输入抵消借款-失去焦点时保存

        console.log('失去焦点时保存getDeductMoney',this.businessOffsetListRadio[v],this.$refs['deductMoney'+v][0]['currentValue'],v);
        this.$vux.loading.show({
          text: '保存中'
        });

        let tempDeductMoney = this.$refs['deductMoney'+v][0]['currentValue'];
        let formData = new FormData();
        formData.append("id",this.businessOffsetListRadio[v].id);
        formData.append("loanBusinessId",this.businessOffsetListRadio[v].loanBusinessId);
        formData.append("loanBusinessName",this.businessOffsetListRadio[v].loanBusinessName);
        formData.append("expenseId",this.info.id);
        formData.append("applyName",this.businessOffsetListRadio[v].applyName);
        formData.append("applyDate",this.businessOffsetListRadio[v].applyDate);
        formData.append("businessName",this.businessOffsetListRadio[v].businessName);
        formData.append("loanMoney",this.businessOffsetListRadio[v].loanMoney);
        formData.append("noPaymentMoney",this.businessOffsetListRadio[v].noPaymentMoney);
        formData.append("loanReason",this.businessOffsetListRadio[v].loanReason);
        formData.append("deductMoney",tempDeductMoney);

        this.axios({
          url: this.baseUrl+'/wechat/expense/saveMoneyJKDX',
          method: 'post',
          data: formData,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          this.$vux.loading.hide();
          console.log('dialog-抵消明细-修改抵消借款后保存',response.data);
          if(response.data.status == 1){//保存成功
            this.showMsg(response.data.success);
            this.savedJKDXList = response.data.list;
            this.loanTotalStr = response.data.obj.loanTotal;
            this.savedJKDXObj = response.data.obj;
            this.departLoanMoney = response.data.departLoanMoney;
            this.shouldPayShow = this.savedJKDXObj.shouldPay;//应付金额赋值
          }else{
            this.showMsg(response.data.error);
            this.$refs['deductMoney'+v][v]['currentValue'] = '';
          }

        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      saveForm () {//保存
        if(this.name == ''){
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        });

        let formData = new FormData();
        formData.append("flowId",this.info.flowId);
        formData.append("staffId",this.info.staffId);
        formData.append("id",this.info.id);
        formData.append("recCode",this.info.recCode);
        formData.append("name",this.name);
        formData.append("togetherName",this.togetherName);
        formData.append("tripRemark",this.tripRemark);
        formData.append("isDeduction",this.isDeductionVal);
        formData.append("remark",this.remark);
        formData.append("type",this.info.type);

        if(this.businessChoosed.id){
          formData.append("businessReport",this.businessChoosed.reportNo);
          formData.append("flowType",this.businessChoosed.flowType);
          formData.append("businessId",this.businessChoosed.id);
          formData.append("businessName",this.businessChoosed.businessName);
        }

        if(this.checkDeptResult.id){
          formData.append("centerDepartmentId",this.checkDeptResult.id);
          formData.append("centerDepartmentName",this.checkDeptResult.name);
        }

        formData.append("userPeopleId",this.info.userPeopleId);
        formData.append("userPeopleName",this.info.userPeopleName);
        formData.append("userDepartId",this.info.userDepartId);
        formData.append("userDepartName",this.info.userDepartName);
        formData.append("applyDate",this.info.applyDate);
        formData.append("jibie",this.info.jibie);
        formData.append("payUnitName",this.payUnitName);
        formData.append("bank",this.bank);
        formData.append("bankAccount",this.bankAccount);
        formData.append("total1",this.total1);
        formData.append("total2",this.total2);

        if(this.savedJKDXObj.loanTotal){
          formData.append("loanTotal",this.loanTotalStr);
          formData.append("shouldPay",this.shouldPayShow);
        }

        axios({
          url: this.baseUrl+'/wechat/expense/saveForm',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData,
        }).then((response) => {
          console.log('费用报销saveForm',response.data,this.saveStatus);
          if(response.data.status == 0){//保存失败
            this.$vux.loading.hide();
            this.showMsg(response.data.msg);
          }else if(this.saveStatus == 0&&response.data.status == 1){//父组件操作发起，并且保存成功
            this.departLoanMoney = response.data.departLoanMoney;
            this.applicantLoanMoney = response.data.applicantLoanMoney;
            this.startFlow();
          }else if(this.saveStatus == 1&&response.data.status == 1){//父组件操作提交，并且保存成功
            this.departLoanMoney = response.data.departLoanMoney;
            this.applicantLoanMoney = response.data.applicantLoanMoney;
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
        startData.append("staffId",this.info.staffId);
        this.axios({
          url: this.baseUrl+'/wechat/expense/startFlow',
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: startData
        }).then((response) => {
          console.log('费用报销startFlow',response.data);
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
</style>

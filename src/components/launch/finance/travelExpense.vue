<!--差旅报销详情-->
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
          <th colspan="4" class="detail-page-title">差旅信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">出差审批表</td>
          <td colspan="2">
            <span v-if="tripChoosed.out_reason">
              {{tripChoosed.out_reason}}--出差申请
            </span>
          </td>
          <td>
            <button class="btn" @click="openDialog('trip')">选择</button>
            <button class="btn" @click="clearName('trip')">清除</button>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">出差人</td>
          <td>
            <cell-box is-link @click.native="openDialog('tripName')">
              {{tripName}}
            </cell-box>
          </td>
          <td class="detail-page-name">所属部门</td>
          <td>{{tripChoosed.departmentName}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">同行人</td>
          <td colspan="3">
            <x-input title="" placeholder="" placeholder="请输入" v-model="togetherName"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">出差事由</td>
          <td colspan="3">
            <x-textarea :max="100" v-model="tripRemark" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">起止时间</td>
          <td colspan="3">
            {{tripChoosed.start_time}} ~ {{tripChoosed.end_time}}
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">责任中心</td>
          <td colspan="2">
            {{centerDepartmentName}}
          </td>
          <td>
            <button class="btn" @click="openDialog('center')">选择</button>
            <button class="btn" @click="clearName('center')">清除</button>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">所属业务</td>
          <td colspan="2">
            {{businessName}}
          </td>
          <td>
            <button class="btn" @click="openDialog('business')">选择</button>
            <button class="btn" @click="clearName('business')">清除</button>
          </td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">费用信息</th>
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
          <td class="detail-page-name">费用明细</td>
          <td colspan="3">
            <x-button class="inline-btn" @click.native="openDialog('expense')" mini>{{btnText}}</x-button>
          </td>
        </tr>
      </tbody>
    </x-table>

    <x-table class="cost-detail">
      <tbody>
        <tr>
          <td class="detail-page-name">费用类型及说明</td>
          <td class="detail-page-name">车/船/机票</td>
          <td class="detail-page-name">市内交通费</td>
          <td class="detail-page-name">住宿费</td>
          <td class="detail-page-name">出差补助费</td>
          <td class="detail-page-name">杂费</td>
        </tr>
        <tr>
          <td>{{savedList.feeRemark}}</td>
          <td>{{savedList.money1}}</td>
          <td>{{savedList.money2}}</td>
          <td>{{savedList.money3}}</td>
          <td>{{savedList.money5}}</td>
          <td>{{savedList.money6}}</td>
        </tr>
      </tbody>
    </x-table>

    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">费用合计（元）</td>
          <td>{{total1}}</td>
          <td class="detail-page-name">费用合计大写</td>
          <td>{{total2}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">预借差旅费（元）</td>
          <td>
            <x-input title="" placeholder="" placeholder="请输入" v-model="willTrivalMoney"></x-input>
          </td>
          <td class="detail-page-name">应付费用（元）</td>
          <td>{{shouldPay}}</td>
        </tr>
      </tbody>
    </x-table>

    <x-table v-if="savedList.id">
      <tbody>
        <tr>
          <td class="detail-page-name">单据附件</td>
          <td class="detail-page-name" colspan="3"></td>
        </tr>
        <tr>
          <td class="detail-page-name">费用类型及说明</td>
          <td class="detail-page-name" colspan="3">单据</td>
        </tr>
        <tr>
          <td>{{savedList.feeRemark}}</td>
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

    <x-table>
      <tbody>
        <tr>
          <th colspan="4" class="detail-page-title">收款人信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">收款人/单位</td>
          <td>
            <cell-box is-link @click.native="openDialog('payUnitName')">
              {{payUnitName}}
            </cell-box>
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
          <th colspan="4" class="detail-page-title">备注</th>
        </tr>
        <tr>
          <td colspan="4">
            <x-textarea :max="100" v-model="remark" placeholder="请输入"></x-textarea>
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

        <!--出差审批表-->
        <div id="trip-part" v-if="tripShow">
          <div>
            <div class="dialog-input">
              <p>
                <x-input id="tripName" title="出差人" placeholder="    请输入" :show-clear="true" v-model="tripNameSearch">
                </x-input>
              </p>

              <p>
                <x-input id="tripAddress" title="出差地点" placeholder="    请输入" :show-clear="true" v-model="addressSearch">
                  <x-button slot="right" class="dialog-btn" mini @click.native="searchTrip">搜索</x-button>
                </x-input>
              </p>
            </div>

            <div class="table-part">
              <x-table v-if="this.tripList.length>0" full-bordered style="background-color:#fff;width: 100%;">
                <thead>
                <tr class="dialog-title-tr">
                  <td></td>
                  <td>出差人</td>
                  <td>出差事由</td>
                  <td>出差天数</td>
                  <td>出差地点</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,key) in tripList" :key="key">
                  <td class="dialog-switch-td">
                    <input type="radio" name="abc" :value="item" v-model="tripChoosed" />
                  </td>
                  <td>{{item.outPeoplesName}}</td>
                  <td>{{item.out_reason}}</td>
                  <td>{{item.out_days}}</td>
                  <td>{{item.address}}</td>
                </tr>
                </tbody>
              </x-table>

            </div>

            <p class="dialog-bottom-bar">
              <span v-if="this.tripList.length>0">
                <x-button mini class="dialog-btn btn-prev" :disabled="preStatus" @click.native="getPrePage">上一页</x-button>
                {{pageNum}}/{{tripAllNum}}页
                <x-button mini class="dialog-btn btn-next" :disabled="nextStatus" @click.native="getNextPage">下一页</x-button>
              </span>
              <x-button mini class="dialog-btn btn-confirm" @click.native="chooseTrip">确定</x-button>
            </p>

          </div>

        </div>
        <!--出差审批表-END-->

        <!--出差人-->
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
        <!--出差人-END-->

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

        <!--费用明细-->
        <div id="expense-detail-part" v-if="expenseShow">
          <div>费用明细</div>
          <x-table>
            <tbody>
            <tr>
              <td class="detail-page-name">费用类型及说明</td>
              <td colspan="3">
                <x-input title="" placeholder="请输入" v-model="feeRemark"></x-input>
              </td>
            </tr>
            <tr>
              <td class="detail-page-name">出发时间</td>
              <td>
                <cell-box is-link @click.native="chooseStartDate">
                  {{startDate}}
                </cell-box>
              </td>
              <td class="detail-page-name">出发地点</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="startPlace"></x-input>
              </td>
            </tr>
            <tr>
              <td class="detail-page-name">返回时间</td>
              <td>
                <cell-box is-link @click.native="chooseEndDate">
                  {{endDate}}
                </cell-box>
              </td>
              <td class="detail-page-name">返回地点</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="endPlace"></x-input>
              </td>
            </tr>
            <tr>
              <td class="detail-page-name">车/船/机票费</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="money1"></x-input>
              </td>
              <td class="detail-page-name">市内交通费</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="money2"></x-input>
              </td>
            </tr>
            <tr>
              <td class="detail-page-name">住宿费（天）</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="outDays"></x-input>
              </td>
              <td class="detail-page-name">住宿费金额</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="money3"></x-input>
              </td>
            </tr>
            <tr>
              <td class="detail-page-name">出差补助费（天）</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="tripDays"></x-input>
              </td>
              <td class="detail-page-name">出差补助费（标准）</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="money4"></x-input>
              </td>
            </tr>
            <tr>
              <td class="detail-page-name">出差补助费（金额）</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="money5"></x-input>
              </td>
              <td class="detail-page-name">杂费</td>
              <td>
                <x-input title="" placeholder="请输入" v-model="money6"></x-input>
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
              <td class="detail-page-name">备注</td>
              <td colspan="3">
                <x-textarea :max="100" v-model="moneyRemark" placeholder="请输入"></x-textarea>
              </td>
            </tr>
            </tbody>
          </x-table>
          <div>
            <x-button mini class="dialog-btn expense-btn" @click.native="expenseSave">确定</x-button>
            <x-button mini class="dialog-btn expense-btn" v-if="btnText == '修改'" @click.native="expenseDelete">删除</x-button>
          </div>
        </div>
        <!--费用明细-END-->

      </x-dialog>
    </div>

  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton, XInput, InlineXSwitch, XTextarea, XDialog, TransferDom, Group,
    Selector, CellBox } from 'vux'
  var TravelExpensePage = Vue.extend({})
  Vue.component('travelExpense-page', TravelExpensePage)

  export default {
    name: 'TravelExpensePage',
    directives: {
      TransferDom
    },
    components: {
      XTable,XButton,XInput,InlineXSwitch,XTextarea,XDialog,Group,Selector,CellBox
    },
    props: {
      saveStatus: Number
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '08c4a7eccfdb4efa9ba2c8c12e8f81fa',//差旅报销
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

        //出差审批表
        tripShow: false,
        tripName: '',//dialog-出差审批表名称
        tripNameSearch: '',//dialog-出差审批表名称-供搜索
        addressList: [],//dialog-出差地点
        address: '',//dialog-出差地点-val
        addressSearch: '',//dialog-出差地点-供搜索

        preStatus: true,
        nextStatus: false,

        tripList: [],//dialog-业务搜索结果
        tripNameList: [],//dialog-业务搜索结果
        tripAllNum: '',//dialog-业务总个数
        tripChoosed: {},//dialog-选择的业务
        pageNum: 1,//dialog-业务搜索结果-页码
        switchValue: false,//dialog-选择业务switch
        //出差审批表-END

        //出差人\责任中心
        treeType: '',//0出差人，1责任中心，2收款人/单位
        checkTreeShow: false,
        treeData: [],//人员结构树
        checkTreeSearchVal: '',//人员结构树搜索内容
        checkTreeSearchResult: [],//人员结构树搜索结果
        treeProps: {
          children: 'children',
          label: 'name'
        },
        checkDeptResult: {},//人员结构树-选择结果
        //出差人\责任中心-END

        centerDepartmentName: '',

        //所属业务
        businessShow: false,
        businessName: '',//dialog-业务名称
        selectorList: [],//dialog-业务类型
        selectorValue: '',//dialog-业务类型-val

        businessPreStatus: true,
        businessNextStatus: false,

        businessList: [],//dialog-业务搜索结果
        businessNameList: [],//dialog-业务搜索结果
        businessAllNum: '',//dialog-业务总个数
        businessChoosed: {},//dialog-选择的业务
        businessPageNum: 1,//dialog-业务搜索结果-页码
        businessSwitchValue: false,//dialog-选择业务switch
        //所属业务-END

        //费用明细
        expenseShow: false,
        feeRemark: '',//费用类型及说明
        isEInvoice: false,//是否电子发票
        isEInvoiceVal: 0,//是否电子发票
        eleInvoiceNo: '',//发票号码
        startDate: '',
        endDate: '',
        startPlace: '',
        endPlace: '',
        money1: '',
        money2: '',
        outDays: '',
        money3: '',
        tripDays: '',
        money4: '',
        money5: '',
        money6: '',
        moneyRemark: '',

        savedList: {},//成功保存后，返回的明细list
        savedObj: {},//成功保存后，返回的明细Obj
        total1: '',//费用合计
        total2: '',//费用合计大写
        shouldPay: '',
        // deductMoney: '',//本次抵扣金额
        btnText: '增加',
        //费用明细-END

        bankAccount: '',
        bank: '',
        payUnitName: '',//收款人\单位
        willTrivalMoney: '',//预借差旅费

      }
    },
    mounted () {
      this.axios({
        url: this.baseUrl+'/wechat/expense/modExpense?flowId='+this.flowId+'&type=1',
        method: 'get'
      }).then((response) => {
        this.info = response.data.obj;
        this.tripName = this.info.outPeopleName;
        this.payUnitName = this.info.payUnitName;
        this.refRecordId = response.data.refRecordId;
        this.refModule = response.data.refModule;
        this.operatorId = response.data.operatorId;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
      this.$emit('sendTitleToParent','报销申请-差旅报销');
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
        this.tripShow = false;
        this.checkTreeShow = false;
        this.businessShow = false;
        this.expenseShow = false;
        this.showToast = true;
        if(v == 'trip'){//出差审批
          this.tripShow = true;
          this.searchTrip();
        }else if(v == 'tripName' || v == 'center'){//出差人
          this.checkTreeShow = true;
          this.getDeptTree(v);
        }else if(v == 'business'){//借款抵消
          this.businessShow = true;
          this.getBusinessList();
          this.searchBusiness();
        }else if(v == 'expense'){//费用明细
          this.expenseShow = true;
        }else if(v == 'payUnitName'){//收款人/单位
          this.checkTreeShow = true;
          this.getDeptTree(v);
        }

      },
      switchVal (data) {//switch
        if(data){
          this.isDeductionVal = 1;
        }else{
          this.isDeductionVal = 0;
        }
      },
      chooseFile () {// 选择附件
        let that = this;
        this.fileObj = document.getElementById('file').files;
        let fileL = document.getElementById('file').files.length;
        for(let i=0;i<fileL;i++){
          let file = document.getElementById('file').files[i];
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload=function(e) {
            that.fileShowList.push(this.result);
          }
        }
        this.submitFile();
      },
      deleteFile (index) {// 删除已选附件
        this.fileShowList.splice(index,1);

        let deleteFileId = this.uploadedFileIdList[index];
        let fileData = new FormData();
        fileData.append("fileId",deleteFileId);

        this.axios({
          url: this.baseUrl+'/wechat/expense/deleteFile',
          method: 'post',
          data: fileData
        }).then((response) => {
          console.log('deleteFile',response);
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
          fileData.append("refRecordId",this.refRecordId);
          fileData.append("refModule",this.refModule);
          fileData.append("stepId",this.stepId);
          fileData.append("operatorId",this.operatorId);
          fileData.append("expenseType",this.info.type);
          fileData.append("flowId",this.flowId);

          let res = await this.axios({
            url: this.baseUrl+'/wechat/expense/uploadFile',
            method: 'post',
            data: fileData
          });
          this.uploadedFileIdList.push(res.data.fileId);
        }
      },
      //出差审批
      async searchTrip () {// dialog-搜索业务
        this.tripList = [];
        let res = await this.axios({
          url: this.baseUrl+'/wechat/businessTrip/findTripList?status=2&isChoose=1&page='+this.pageNum+'&rows=15&outPeoplesName='+this.tripNameSearch+'&address='+this.addressSearch,
          method: 'get'
        });
        console.log('searchTrip',res.data);
        this.$vux.loading.hide();
        this.tripList = res.data.list;
        let tripLength = res.data.list.length;
        for(let i=0;i<tripLength;i++){
          this.tripNameList.push(res.data.list[i].tripName);
        }
        this.tripAllNum = Math.ceil(res.data.total/15);
      },
      getPrePage () {//dialog-上一页
        if(this.pageNum == 1){
          this.preStatus = true;
        }else{
          this.tripChoosed = {};
          this.nextStatus = false;
          this.pageNum--;
          this.searchTrip();
        }
      },
      getNextPage () {//dialog-下一页
        if(this.pageNum == this.tripAllNum){
          this.nextStatus = true;
        }else{
          this.tripChoosed = {};
          this.preStatus = false;
          this.pageNum++;
          this.searchTrip();
        }
      },
      chooseTrip () {//dialog-确定
        this.showToast = false;
        this.tripName = this.tripChoosed.outPeoplesName;
        this.tripRemark = this.tripChoosed.out_reason;
      },
      clearName (v) {// 清除业务
        if(v == 'trip'){
          this.tripChoosed = {};
          this.tripName = '';
          this.tripRemark = '';
        }else if(v == 'center'){
          this.centerDepartmentName = '';
        }else if(v == 'business'){
          this.businessName = '';
        }

      },
      //出差审批-END
      //获取树
      getDeptTree (v) {//获取人员架构
        let link;
        if(v == 'tripName'){
          link = '/wechat/staff/getOrgStaff';
          this.treeType = 0;
        }else if(v == 'center'){
          link = '/wechat/commonInterface/deptTree';
          this.treeType = 1;
        }else if(v == 'payUnitName'){
          link = '/wechat/staff/getOrgStaff';
          this.treeType = 2;
        }
        this.axios({
          url: this.baseUrl+link,
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
        if(this.treeType == 0){
          this.tripName = this.checkDeptResult.name;
        }else if(this.treeType == 1){
          this.centerDepartmentName = this.checkDeptResult.name;
        }else if(this.treeType == 2){
          this.payUnitName = this.checkDeptResult.name;
        }
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
      //获取树-END

      //所属业务
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
      getBusinessPrePage () {//dialog-上一页
        if(this.pageNum == 1){
          this.preStatus = true;
        }else{
          this.businessChoosed = {};
          this.nextStatus = false;
          this.pageNum--;
          this.searchBusiness();
        }
      },
      getBusinessNextPage () {//dialog-下一页
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
        this.businessName = this.businessChoosed.businessName;
      },
      clearBusiness () {// 清除业务
        this.businessChoosed = {};
        this.businessName = '';
      },
      //所属业务-END

      //费用明细
      switchEInvoice (data) {//switch
        if(data){
          this.isEInvoiceVal = 1;
        }else{
          this.isEInvoiceVal = 0;
        }
      },
      chooseStartDate () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.startDate,
          onConfirm (val) {
            that.startDate = val
          }
        })
      },
      chooseEndDate () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.endDate,
          onConfirm (val) {
            that.endDate = val
          }
        })
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
        formData.append("type",'1');
        formData.append("feeRemark",this.feeRemark);
        formData.append("isEInvoice",this.isEInvoiceVal);
        formData.append("eleInvoiceNo",this.eleInvoiceNo);
        formData.append("startDate",this.startDate);
        formData.append("endDate",this.endDate);
        formData.append("startPlace",this.startPlace);
        formData.append("endPlace",this.endPlace);
        formData.append("money1",this.money1);
        formData.append("money2",this.money2);
        formData.append("outDays",this.outDays);
        formData.append("money3",this.money3);
        formData.append("tripDays",this.tripDays);
        formData.append("money4",this.money4);
        formData.append("money5",this.money5);
        formData.append("money6",this.money6);
        formData.append("remark",this.moneyRemark);

        this.axios({
          url: this.baseUrl+'/wechat/expense/saveMoney',
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
            this.total1 = response.data.obj.total1;
            this.total2 = response.data.obj.total2;
            this.shouldPay = response.data.obj.shouldPay;
            this.willTrivalMoney = response.data.obj.willTrivalMoney;
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
          url: this.baseUrl+'/wechat/expense/delMoney',
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
            this.shouldPay = '';
            this.willTrivalMoney = '';
          }
          this.showToast = false;
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      //费用明细-END

      saveForm () {//保存
        if(this.name == ''){
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        });
        let formData = new FormData();
        formData.append("id",this.info.id);
        formData.append("flowId",this.info.flowId);
        formData.append("staffId",this.info.staffId);
        formData.append("recCode",this.info.recCode);
        formData.append("name",this.name);
        formData.append("togetherName",this.togetherName);
        formData.append("tripRemark",this.tripRemark);
        formData.append("isDeduction",this.isDeductionVal);
        formData.append("remark",this.remark);
        formData.append("type",this.info.type);

        if(this.businessChoosed){
          formData.append("businessReport",this.businessChoosed.reportNo);
          formData.append("flowType",this.businessChoosed.flowType);
          formData.append("businessId",this.businessChoosed.id);
          formData.append("businessName",this.businessChoosed.businessName);
        }

        formData.append("userDepartId",this.info.userDepartId);
        formData.append("applyDate",this.info.applyDate);
        formData.append("jibie",this.info.jibie);
        formData.append("userDepartName",this.info.userDepartName);
        formData.append("payUnitName",this.payUnitName);
        formData.append("bank",this.bank);
        formData.append("bankAccount",this.bankAccount);
        formData.append("total1",this.total1);
        formData.append("total2",this.total2);
        formData.append("willTrivalMoney",this.willTrivalMoney);
        formData.append("shouldPay",this.shouldPay);

        formData.append("payStatus",this.info.payStatus);

        formData.append("payDate",this.info.payDate);
        formData.append("remark",this.remark);

        if(this.tripChoosed){
          formData.append("businessTripId",this.tripChoosed.id);
          formData.append("businessTripName",this.tripChoosed.out_reason+'--出差申请');
          formData.append("tripDepartment",this.tripChoosed.departmentName);
          formData.append("tripDetails",this.tripChoosed.start_time+'至'+this.tripChoosed.end_time+'共'+this.tripChoosed.out_days+'天'+this.tripChoosed.out_honr+'小时');
        }

        this.axios({
          url: this.baseUrl+'/wechat/expense/saveForm',
          method: 'post',
          data: formData
        }).then((response) => {
          console.log('saveForm',response.data,this.saveStatus);
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
        startData.append("staffId",this.info.staffId);
        this.axios({
          url: this.baseUrl+'/wechat/expense/startFlow',
          method: 'post',
          data: startData
        }).then((response) => {
          console.log('startFlow',response.data);
          this.showMsg(response.data.msg);

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
    width: 60px;
    height: 29px;
    background-color: #F8F8F8;
    line-height: 29px;
    border: 1px solid rgba(0, 0, 0, 0.2);
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
  .cost-detail{
    margin: 2px 0px;
    td{
      width: auto;
    }
  }
  #trip-part{
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
  #tripName,#tripAddress{
    position: relative;
    left: 3px;
    padding: 5px;
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
  .dialog-bottom-bar{
    span{
      font-size: 12px;
      float: left;
    }
    .btn-confirm{
      float: right;
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
</style>

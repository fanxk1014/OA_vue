<!-请假申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">申请人</td>
          <td>{{info.staffName}}</td>
          <td class="detail-page-name">所在部门</td>
          <td>{{info.staffDeptName}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">直属领导</td>
          <td>{{info.leaderName}}</td>
          <td class="detail-page-name">申请日期</td>
          <td>{{info.fillDate}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">申请信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">请假类别<span class="required">*</span></td>
          <td id="select_td">
            <group>
              <!--<selector id="pay-type-gp" v-model="leaveType" title="" :options="leaveTypeList" @on-change="getLeaveType"></selector>-->
              <cell-box is-link @click.native="selectLeaveType">
                {{leaveTypeLabel}}
              </cell-box>
            </group>
          </td>
          <td class="detail-page-name">特殊假期</td>
          <td>
            <check-icon :value.sync="specialHolidays"></check-icon>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">请假时间<span class="required">*</span></td>
          <td colspan="3">
            <flexbox :gutter="0" wrap="wrap">
              <flexbox-item :span="1/2">
                <a @click="chooseStartDate" class="chooseDate">
                  {{startDate}}
                  <img class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
                  <span class="pull-right">~</span>
                </a>
              </flexbox-item>
              <flexbox-item :span="1/2">
                <a @click="chooseEndDate" class="chooseDate" style="padding-left: 15px">
                  {{endDate}}
                  <img style="    right: 5px;" class="icon right" src="../../../assets/icon/date-blue.png" width="18" height="18">
                </a>
              </flexbox-item>
            </flexbox>

          </td>
        </tr>
        <tr>
          <td class="detail-page-name">请假天数（天）<span class="required">*</span></td>
          <td colspan="3">
            {{dateDiffer}}
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">请假事由<span class="required">*</span></td>
          <td colspan="3">
            <x-textarea  :max="200" :show-counter="false" :height="50" :rows="4" :cols="30" v-model="cause" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">工作交接说明</td>
          <td colspan="3">
            <x-textarea  :max="200" :show-counter="false" :height="50" :rows="4" :cols="30" v-model="explain" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">外出联系方式</td>
          <td colspan="3">
            <x-textarea  :max="200" :show-counter="false" :height="50" :rows="4" :cols="30" v-model="contactInformation" placeholder="请输入"></x-textarea>
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

    <div v-transfer-dom>
      <popup v-model="leaveTypeFlag">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          title="请选择请假类别"
          :show-bottom-border="false"></popup-header>
        <group gutter="0">
          <radio :options="leaveTypeList" @on-change="getLeaveType"></radio>
        </group>
      </popup>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, Group, Selector, CheckIcon, Flexbox, FlexboxItem, XInput, XTextarea, CellBox, PopupHeader, Popup, XSwitch, Radio, TransferDom } from 'vux'
  var LeaveApplyPage = Vue.extend({})
  Vue.component('leaveApply-page', LeaveApplyPage)

  export default {
    name: 'LeaveApplyPage',
    components: {
      XTable,
      Selector,
      CheckIcon,
      Flexbox,
      FlexboxItem,
      XInput,
      XTextarea,
      Group,
      CellBox,
      PopupHeader,
      Popup,
      XSwitch,
      Radio
    },
    directives: {
      TransferDom
    },
    props: {

    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '',
        info: {},
        leaveData: {},
        leaveTypeList: [],
        leaveType: '',
        leaveTypeLabel: '',
        leaveTypeFlag: false,
        specialHolidays: false,
        startDate: '',
        endDate: '',
        nowDate: '',
        leaveDay: '',
        dateDiffer: '',
        cause: '',
        explain: '',
        contactInformation: '',
        fileShowList: [], // 上传附件集合-预览
        uploadedFileIdList: [], // 已上传附件ID集合
        countLeaveDays: {}
      }
    },
    mounted () {
      this.$emit('sendTitleToParent','请假申请');
      this.getLeaveTypeList()
      this.getModLeaveData()
  },
    props: {
      saveStatus: Number
    },
    methods: {
      async getModLeaveData () {
        let res = await this.axios({
          url: this.baseUrl + '/wechat/leave/modLeave',
          method: 'get'
        })
        this.info = res.data.form
        this.leaveData = res.data
      },
      async getLeaveTypeList () {
        let res = await this.axios({
          url: this.baseUrl + '/wechat/leave/types',
          method: 'get'
        })
        res.data.list.forEach((item) => {
          item.key = item.id
          item.value = item.name
          this.leaveTypeList.push(item)
        })
      },
      getLeaveType (value, label) {
        this.leaveType = value;
        this.leaveTypeLabel = label;
        this.leaveTypeFlag = false;
      },
      selectLeaveType () {
        console.log(this.leaveTypeList)
        this.leaveTypeFlag = true;
      },
      click5 (key, item) {
        console.log(key, item)
      },
      chooseStartDate () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD HH:mm',
          minuteList: ['00', '15', '30', '45'],
          endDate: this.endDate,
          value: this.startDate,
          onConfirm (val) {
            that.startDate = val
            that.getDateDiffer()
          }
        })
      },
      chooseEndDate () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD HH:mm',
          value: this.endDate,
          minuteList: ['00', '15', '30', '45'],
          startDate: this.startDate,
          onConfirm (val) {
            that.endDate = val
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
          fileData.append('refRecordId', this.leaveData.refRecordId)
          fileData.append('refModule', this.leaveData.refModule)
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

      showMsg (msg) {
        this.$vux.alert.show({
          title: msg
        })
        setTimeout(() => {
          this.$vux.alert.hide()
        }, 2000)
      },
      saveForm () { // 保存
        if (this.leaveType == '' || this.startDate == '' || this.endDate == '' || this.cause == '') {
          this.showMsg('请补充必填信息')
          return false
        }
        this.$vux.loading.show({
          text: '加载中'
        })
        let formData = new FormData()
        formData.append('id', this.info.id)
        formData.append('fillDate', this.info.fillDate)
        formData.append('leaveTypeId', this.leaveType)
        formData.append('startTime', this.startDate)
        formData.append('endTime', this.endDate)
        formData.append('leaveDay', this.countLeaveDays.leaveDay)
        formData.append('leaveHour', this.countLeaveDays.leaveHour)
        formData.append('leaveCountHour', this.countLeaveDays.leaveCountHour)
        formData.append('leaveReason', this.cause)
        formData.append('handoverRemark', this.explain)
        formData.append('contactRemark', this.contactInformation)
        if (this.specialHolidays) {
          formData.append('isSpecial', '1')
        } else {
          formData.append('isSpecial', '0')
        }
        this.axios({
          url: this.baseUrl + '/wechat/leave',
          method: 'post',
          data: formData
        }).then((response) => {
          if (response.data.status == 0) { // 保存失败
            console.log('保存失败')
            this.$vux.loading.hide()
            this.showMsg(response.data.msg)
          } else if (this.saveStatus == 0 && response.data.status == 1) { // 父组件操作发起，并且保存成功
            console.log('startFlow')
            this.startFlow()
          } else if (this.saveStatus == 1 && response.data.status == 1) { // 父组件操作提交，并且保存成功
            console.log('$emit')
            this.$emit('sendStatusToParent', {status: 1})
            this.$vux.loading.hide()
          }
        }).catch((response) => {
          debugger
          this.$vux.loading.hide()
        })
      },
      startFlow () { // 发起
        let startData = new FormData()
        startData.append('id', this.info.id)
        this.axios({
          url: this.baseUrl + '/wechat/leave/startFlow',
          method: 'post',
          data: startData
        }).then((response) => {
          console.log('startFlow', response.data)
          this.showMsg('保存成功！请继续完成提交操作！')

          if (response.data.status == 1) {
            this.$emit('sendStatusToParent', {
              status: 0,
              id: response.data.taskId,
              stepId: response.data.stepId
            })
          }
          this.$vux.loading.hide()
        }).catch((response) => {
          this.$vux.loading.hide()
        })
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
  #select_td{
    padding: 0;
    .weui-cell{
      font-size: 12px;
      height: 16px;
    }
  }
  #pay-type-gp{
    font-size: 12px;
    line-height: 29px;
    height: 29px;
    .weui-select{
      padding-left: 0 !important;
    }
  }
  .chooseDate{
    display: block;
    position: relative;
    height: 20px;
    img{
      position: absolute;
      right: 20px;
      top: 0px;
    }
    .pull-right{
      float: right;
    }
  }
  .vux-x-textarea{
    padding: 0;
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

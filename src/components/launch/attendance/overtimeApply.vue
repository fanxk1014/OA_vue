<!-加班申请详情-->
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
          <td class="detail-page-name">行政级别</td>
          <td colspan="3">{{info.rankName}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">申请信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">申请加班处理<span class="required">*</span></td>
          <td colspan="3">
            <cell-box is-link @click.native="openPopup">
              {{selectItem}}
            </cell-box>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">申请加班时间<span class="required">*</span></td>
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
          <td class="detail-page-name">加班天数</td>
          <td colspan="3">
            {{dateDiffer}}
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">加班事由<span class="required">*</span></td>
          <td colspan="3">
            <x-textarea  :max="200" :show-counter="false" :height="50" :rows="4" :cols="30" v-model="overtimeReason" placeholder="请输入"></x-textarea>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">备注</td>
          <td colspan="3">
            <x-textarea  :max="200" :show-counter="false" :height="50" :rows="4" :cols="30" v-model="remark" placeholder="请输入"></x-textarea>
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
          <radio :options="selectModelData" @on-change="getType" v-model="selectModel"></radio>
        </group>
      </popup>
    </div>

  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, TransferDom, Group, Radio, Popup, PopupHeader, CellBox, Flexbox, FlexboxItem, XTextarea } from 'vux'
  var OvertimeApplyPage = Vue.extend({})
  Vue.component('overtimeApply-page', OvertimeApplyPage)

  export default {
    name: 'OvertimeApplyPage',
    directives: {
      TransferDom
    },
    components: {
      XTable,Group,Radio,PopupHeader,Popup,CellBox,Flexbox,FlexboxItem,XTextarea
    },
    props: {
      saveStatus: Number
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '',
        info: {},
        typeLabel:'',
        selectModelFlag: false, //下拉选择弹框控制
        selectModelTitle: '加班类型', //下拉选择弹框标题
        selectModelData:[], //下拉选择弹框数据
        selectModel: '',
        selectItem: '',
        startDate: '',
        endDate: '',
        nowDate: '',
        leaveDay: '',
        dateDiffer: '',

        overtimeReason: '',
        remark: ''
      }
    },
    mounted () {
      this.axios({
        url: this.baseUrl+'/wechat/overtime/modOvertime',
        method: 'get'
      }).then((response) => {
        this.info = response.data.form;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
      this.$emit('sendTitleToParent','加班申请');
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
      openPopup () {
        this.selectModelData = [];
        this.getAllTypes();
        this.selectModelFlag = true;
      },
      getAllTypes () {//获取加班类型
        this.axios({
          url: this.baseUrl+'/wechat/overtime/types',
          method: 'get'
        }).then((response) => {
          response.data.list.forEach((item) => {
            item.key = item.id;
            item.value = item.name;
            this.selectModelData.push(item);
          })
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      getType (value, label) {
        this.selectItem = label;
        let isChange = value == this.selectModel ? false : true
        if(isChange){
          this.selectModelFlag = false;
        }
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
            url: this.baseUrl + '/wechat/overtime/countOvertimeDays?startTime=' + this.startDate + '&endTime=' + this.endDate,
            method: 'get'
          });
          if (res.data.status == 1) {
            this.dateDiffer = res.data.overtimeDay + '天 ' + res.data.overtimehour + '小时  共计' + res.data.overtimeCountHour + '小时';
            this.countOvertimeDays = res.data;
          }
        }
      },

      saveForm () { // 保存
        if (this.selectItem == '' || this.startDate == '' || this.endDate == '' || this.overtimeReason == '') {
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        })
        let formData = new FormData();
        formData.append('id', this.info.id);
        formData.append('overtimeTypeId', this.selectModel);
        formData.append('startTime', this.startDate);
        formData.append('endTime', this.endDate);
        formData.append('overtimeDay', this.countOvertimeDays.overtimeDay);
        formData.append('overtimeHour', this.countOvertimeDays.overtimehour);
        formData.append('overtimeCountHour', this.countOvertimeDays.overtimeCountHour);
        formData.append('overtimeReason', this.overtimeReason);
        formData.append('remark', this.remark)

        this.axios({
          url: this.baseUrl + '/wechat/overtime',
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
          this.$vux.loading.hide()
        })
      },
      startFlow () { // 发起

        let startData = new FormData();
        startData.append('id', this.info.id);
        startData.append('flowId', this.info.id);
        this.axios({
          url: this.baseUrl + '/wechat/overtime/startFlow',
          method: 'post',
          data: startData
        }).then((response) => {
          console.log('startFlow', response.data);
          this.showMsg('保存成功！请继续完成提交操作！');

          if (response.data.status == 1) {
            this.$emit('sendStatusToParent', {
              status: 0,
              id: response.data.taskId,
              stepId: response.data.stepId
            })
          }
          this.$vux.loading.hide();
        }).catch((response) => {
          this.$vux.loading.hide();
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
  /*.vux-tap-active{*/
    /*padding: 0;*/
  /*}*/
  .vux-x-textarea{
    padding: 0;
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
</style>

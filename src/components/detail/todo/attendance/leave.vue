<!--请假-->
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
        <td>{{info.headerName}}</td>
        <td class="detail-page-name">申请日期</td>
        <td>{{info.fillDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">申请信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">请假类别</td>
        <td>{{info.leaveTypeName}}</td>
        <td class="detail-page-name">特殊假期</td>
        <td>{{info.isSpecial}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">请假时间</td>
        <td>{{info.leaveTime}}</td>
        <td class="detail-page-name">请假天数（天）</td>
        <td>{{info.leaveDay}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">请假事由</td>
        <td colspan="3">{{info.leaveReason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工作交接说明</td>
        <td colspan="3">{{info.handoverRemark}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">外出联系方式</td>
        <td colspan="3">{{info.contactRemark}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">考勤员核实</th>
      </tr>
      <tr>
        <td class="detail-page-name">实际请假时间</td>
        <td>{{info.realTime}}</td>
        <td class="detail-page-name">实际请假天数</td>
        <td>{{info.realLeaveDay}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">备注</td>
        <td colspan="3">{{info.realRemark}}</td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable } from 'vux'
  var LeavePage = Vue.extend({})
  Vue.component('leave-page', LeavePage)

  export default {
    name: 'LeavePage',
    components: {
      XTable
    },
    props: {
      idArr: Array
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        info: {}
      }
    },
    mounted () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.axios({
        url: this.baseUrl+'/wechat/leave/getLeaveJson/'+this.idArr[0],
        method: 'get'
      }).then((response) => {
        this.info = response.data.data.info;
        this.$vux.loading.hide();
      }).catch((response) => {
      });
    },
    methods: {

    }
  }
</script>

<style scoped lang="less">
  .detail-page-title,.detail-page-name{
    background: #edf7ff;
  }
  .vux-table td, .vux-table th{
    padding: 5px;
  }
  .vux-table td{
    font-size: 12px;
  }
  .detail-page-remark{
    font-size: 13px !important;
  }
</style>

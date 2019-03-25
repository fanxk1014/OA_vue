<!--加班申请详情-->
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
        <td class="detail-page-name">申请加班处理</td>
        <td colspan="3">{{info.overtimeTypeName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">加班天数</td>
        <td>{{info.overtimeDays}}</td>
        <td class="detail-page-name">申请加班时间</td>
        <td>{{info.overtimeTime}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">加班事由</td>
        <td colspan="3">{{info.overtimeReason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">备注</td>
        <td colspan="3">{{info.remark}}</td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable } from 'vux'
  var OverTimePage = Vue.extend({})
  Vue.component('overTime-page', OverTimePage)

  export default {
    name: 'OverTimePage',
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
        url: this.baseUrl+'/wechat/overtime/getOvertimeJson/'+this.idArr[0],
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

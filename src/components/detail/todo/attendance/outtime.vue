<!--外出申请-->
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
        <td class="detail-page-name">外出时间</td>
        <td>{{info.outtimeTime}}</td>
        <td class="detail-page-name">外出天数</td>
        <td>{{info.outtimeDay}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">本月已外出次数</td>
        <td>{{info.overtimeTimes}}</td>
        <td class="detail-page-name">项目指令号</td>
        <td>{{info.projectOrder}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">项目名称</td>
        <td>{{info.businessName}}</td>
        <td class="detail-page-name">外出类型</td>
        <td>{{info.outGoingTypeName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">外出地点</td>
        <td colspan="3">{{info.areaName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">外出事由</td>
        <td colspan="3">{{info.outtimeReason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">外出联系方式</td>
        <td colspan="3">{{info.connectionMode}}</td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable } from 'vux'
  var OutTimePage = Vue.extend({})
  Vue.component('outtime-page', OutTimePage)

  export default {
    name: 'OutTimePage',
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
        url: this.baseUrl+'/wechat/outtime/getOuttimeJson/'+this.idArr[0],
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
</style>

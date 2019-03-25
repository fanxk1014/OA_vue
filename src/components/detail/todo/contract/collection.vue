<!--收款合同详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">客户名称</td>
        <td>{{info.customerName}}</td>
        <td class="detail-page-name">客户经理</td>
        <td>{{info.followupStaffName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">合同名称</td>
        <td>{{info.name}}</td>
        <td class="detail-page-name">合同类型</td>
        <td>{{info.contractTypeName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">合同编号（内部编号）</td>
        <td>{{info.contractNo}}</td>
        <td class="detail-page-name">委托编号（外部编号）</td>
        <td>{{info.entrustNo}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">合同金额（元）</td>
        <td>{{info.contractPrice}}</td>
        <td class="detail-page-name">是否补充合同</td>
        <td>{{info.isAdditional}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">是否历史合同</td>
        <td>{{info.isHistory}}</td>
        <td class="detail-page-name">合同有效期（合同服务期）</td>
        <td>{{info.contractDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">签订部门</td>
        <td>{{info.departmentName}}</td>
        <td class="detail-page-name">签订日期</td>
        <td>{{info.signDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">付款信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">付款方</td>
        <td>{{info.payUnitName}}</td>
        <td class="detail-page-name">付款方式</td>
        <td>{{info.payType}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">履约保证金信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">是否缴纳履约保证金</td>
        <td>{{info.isJNLYBZJ}}</td>
        <td class="detail-page-name">履约保证金金额</td>
        <td>{{info.LYBZJ}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">履约保证金形式</td>
        <td>{{info.LYBZJXS}}</td>
        <td class="detail-page-name">是否退回</td>
        <td>{{info.isBackBZJ}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">收款信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">记账单位</td>
        <td>{{info.faccountUnit}}</td>
        <td class="detail-page-name">收款账号</td>
        <td>{{info.faccountNo}}</td>
      </tr>
      <tr>
        <td colspan="4" class="detail-page-name detail-page-remark">备注</td>
      </tr>
      <tr>
        <td colspan="4">{{info.remark}}</td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable } from 'vux'
  var CollectionPage = Vue.extend({})
  Vue.component('collection-page', CollectionPage)

  export default {
    name: 'CollectionPage',
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
        url: this.baseUrl+'/wechat/contract/getContrtactDetailJson/'+this.idArr[0],
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

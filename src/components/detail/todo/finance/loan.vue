<!--借款详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">经办人</td>
        <td>{{info.applicantName}}</td>
        <td class="detail-page-name">申请日期</td>
        <td>{{info.fillDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">职务</td>
        <td colspan="3">{{info.rankName}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">借款信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">单据编号</td>
        <td>{{info.recCode}}</td>
        <td class="detail-page-name">单据状态</td>
        <td>{{info.loanStatus}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">借款部门</td>
        <td>{{info.departmentName}}</td>
        <td class="detail-page-name">所属业务</td>
        <td>{{info.businessName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">用途</td>
        <td colspan="3">{{info.loanReason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">借款金额（元）</td>
        <td>{{info.loanMoney}}</td>
        <td class="detail-page-name">借款金额（大写）</td>
        <td>{{info.loanMoneyDaxie}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">预计还款日期</td>
        <td colspan="3">{{info.willReturnDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">收款人信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">收款人/单位</td>
        <td>{{info.payee}}</td>
        <td class="detail-page-name">收款银行</td>
        <td>{{info.loanBankName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">收款账号</td>
        <td colspan="3">{{info.loanBankNo}}</td>
      </tr>
      <tr>
        <td colspan="4" class="detail-page-name detail-page-remark">备注</td>
      </tr>
      <tr>
        <td colspan="4">{{info.remark}}</td>
      </tr>
      <tr>
        <th colspan="4" class="detail-page-title">财务处理信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">记账单位</td>
        <td>{{info.faccountUnit}}</td>
        <td class="detail-page-name">支付方式</td>
        <td>{{info.payType}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">付款银行</td>
        <td>{{info.payBankName}}</td>
        <td class="detail-page-name">付款账户</td>
        <td>{{info.payBankNo}}</td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var LoanPage = Vue.extend({})
  Vue.component('loan-page', LoanPage)

  export default {
    name: 'LoanPage',
    components: {
      XTable,XButton
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
        url: this.baseUrl+'/wechat/loan/getLoanJson/'+this.idArr[0],
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
  .weui-btn{
    line-height: 1.8;
    margin: 0;
  }
</style>

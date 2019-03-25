<!--还款申请详情-->
<!--暂时不做还款申请-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">经办人</td>
          <td></td>
          <td class="detail-page-name">申请时间</td>
          <td></td>
        </tr>
        <tr>
          <td class="detail-page-name">经办部门</td>
          <td></td>
          <td class="detail-page-name">职务</td>
          <td></td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">差旅信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">经办部门</td>
          <td colspan="3">

          </td>
        </tr>
        <tr>
          <td class="detail-page-name">出差人</td>
          <td></td>
          <td class="detail-page-name">所属部门</td>
          <td></td>
        </tr>
        <tr>
          <td class="detail-page-name">同行人</td>
          <td colspan="3">

          </td>
        </tr>
        <tr>
          <td class="detail-page-name">出差事由</td>
          <td colspan="3">

          </td>
        </tr>
        <tr>
          <td class="detail-page-name">起止时间</td>
          <td colspan="3">

          </td>
        </tr>
        <tr>
          <td class="detail-page-name">责任中心</td>
          <td colspan="3">

          </td>
        </tr>
        <tr>
          <td class="detail-page-name">所属业务</td>
          <td colspan="3">

          </td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">费用信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">费用名称<span class="required">*</span></td>
          <td></td>
          <td class="detail-page-name">单据编号</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2" class="detail-page-name">是否用于抵扣费用报销（不计入成本）</td>
          <td colspan="2">

          </td>
        </tr>
        <tr>
          <td class="detail-page-name">费用明细</td>
          <td colspan="3">

          </td>
        </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable } from 'vux'
  var RepayApplyPage = Vue.extend({})
  Vue.component('repayApply-page', RepayApplyPage)

  export default {
    name: 'RepayApplyPage',
    components: {
      XTable
    },
    props: {

    },
    data () {
      return {
        baseUrl: this.$store.state.url,
      }
    },
    mounted () {
      this.$emit('sendTitleToParent','还款申请');
    },
    methods: {

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
</style>

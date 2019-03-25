<!--支出凭单详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">经办人</td>
        <td>{{info.staffName}}</td>
        <td class="detail-page-name">申请时间</td>
        <td>{{info.applyDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">所属部门</td>
        <td>{{info.departMent}}</td>
        <td class="detail-page-name">职务</td>
        <td>{{info.jibie}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">支出信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">支出名称</td>
        <td>{{info.name}}</td>
        <td class="detail-page-name">单据编号</td>
        <td>{{info.recCode}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">所属业务</td>
        <td>{{info.businessName}}</td>
        <td class="detail-page-name">责任中心</td>
        <td>{{info.centerDepartmentName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">成本科目</td>
        <td>{{info.itemsName}}</td>
        <td class="detail-page-name">成本类型</td>
        <td>{{info.itemsTypeName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">支出金额</td>
        <td>{{info.total1}}</td>
        <td class="detail-page-name">支出金额大写</td>
        <td>{{info.total2}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">收款人信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">收款人/单位</td>
        <td>{{info.payUnitName}}</td>
        <td class="detail-page-name">收款银行</td>
        <td>{{info.bank}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">收款账号</td>
        <td>{{info.bankAccount}}</td>
        <td class="detail-page-name">支付状态</td>
        <td>{{info.payStatus}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">支付日期</td>
        <td colspan="3">{{info.payDate}}</td>
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
        <td>{{info.recordUnitName}}</td>
        <td class="detail-page-name">支付方式</td>
        <td>{{info.payType}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">付款银行</td>
        <td>{{info.faccountName}}</td>
        <td class="detail-page-name">付款账户</td>
        <td>{{info.faccountNo}}</td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var Expense3Page = Vue.extend({})
  Vue.component('expense3-page', Expense3Page)

  export default {
    name: 'Expense3Page',
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
        url: this.baseUrl+'/wechat/expense/getExpenseJson/'+this.idArr[0],
        method: 'get'
      }).then((response) => {
        this.info = response.data.data.info;
        this.$vux.loading.hide();
      }).catch((response) => {
      });
    },
    methods: {
      showImg (src) {
        if(Object.keys(this.otherMap).length == 0){
          this.$vux.alert.show({
            title: '暂无数据'
          });
          setTimeout(() => {
            this.$vux.alert.hide();
          }, 2000)
        }else{
          let imgSrc = this.otherMap['image'+src]+'?number='+Math.random();
          let imgSrcArr = [];
          imgSrcArr.push(imgSrc);
          wx.previewImage({
            current: imgSrc, // 当前显示图片的http链接
            urls: imgSrcArr // 需要预览的图片http链接列表
          });
        }
      }
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

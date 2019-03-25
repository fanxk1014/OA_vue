<!--还款详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">申请人</td>
        <td>{{info.applicantName}}</td>
        <td class="detail-page-name">申请日期</td>
        <td>{{info.fillDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">职务</td>
        <td colspan="3">{{info.applicantPosition}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">借款信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">单据编号</td>
        <td>{{info.recCode}}</td>
        <td class="detail-page-name">还款部门</td>
        <td>{{info.departmentName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">还款金额</td>
        <td>{{info.repaymentMoney}}</td>
        <td class="detail-page-name">冲销借款</td>
        <td><x-button @click.native="showImg(1)" mini>查看</x-button></td>
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
        <td>{{info.accountUnitName}}</td>
        <td class="detail-page-name">支付方式</td>
        <td>{{info.payType}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">还款银行</td>
        <td>{{info.faccountName}}</td>
        <td class="detail-page-name">还款账户</td>
        <td>{{info.faccountNo}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">实际到账日期</td>
        <td colspan="3">{{info.returnDate}}</td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var RepaymentPage = Vue.extend({})
  Vue.component('repayment-page', RepaymentPage)

  export default {
    name: 'RepaymentPage',
    components: {
      XTable,XButton
    },
    props: {
      idArr: Array
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        info: {},
        otherMap: {}
      }
    },
    mounted () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.axios({
        url: this.baseUrl+'/wechat/repayment/getRepaymentJson/'+this.idArr[0],
        method: 'get'
      }).then((response) => {
        this.info = response.data.data.info;
        this.otherMap = response.data.data.otherMap;
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

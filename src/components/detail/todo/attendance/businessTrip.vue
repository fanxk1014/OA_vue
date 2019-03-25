<!--出差申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">申请人</td>
        <td>{{info.staffName}}</td>
        <td class="detail-page-name">申请时间</td>
        <td>{{info.fillDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">出差人</td>
        <td>{{info.outPeoplesName}}</td>
        <td class="detail-page-name">出差人职务</td>
        <td>{{info.outPeoplesJob}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">申请信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">代理人</td>
        <td>{{info.proxyStaffName}}</td>
        <td class="detail-page-name">代理人职务</td>
        <td>{{info.proxyStaffJob}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">出差事由</td>
        <td colspan="3">{{info.outReason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">开始时间</td>
        <td>{{info.startTime}}</td>
        <td class="detail-page-name">结束时间</td>
        <td>{{info.endTime}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">出差天数</td>
        <td>{{info.outDays}}</td>
        <td class="detail-page-name">交通工具</td>
        <td>{{info.vehicle}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">出差地点</td>
        <td colspan="3">{{info.address}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">预计出差费用</td>
        <td colspan="3"><x-button @click.native="showImg(1)" mini>查看</x-button></td>
      </tr>
      <tr>
        <td class="detail-page-name">合计（元）</td>
        <td>{{info.total}}</td>
        <td class="detail-page-name">合计大写</td>
        <td>{{info.bigTotal}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">预支金额（元）</td>
        <td>{{info.planMoney}}</td>
        <td class="detail-page-name">预支大写</td>
        <td>{{info.bigPlanMoney}}</td>
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
  import { XTable, XButton } from 'vux'
  var BusinessTripPage = Vue.extend({})
  Vue.component('businessTrip-page', BusinessTripPage)

  export default {
    name: 'BusinessTripPage',
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
        url: this.baseUrl+'/wechat/businessTrip/getBusinessTripJson/'+this.idArr[0],
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

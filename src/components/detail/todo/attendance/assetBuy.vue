<!--资产采购详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">购买人</td>
        <td>{{info.usePeopleName}}</td>
        <td class="detail-page-name">所属部门</td>
        <td>{{info.departName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">行政级别</td>
        <td>{{info.position}}</td>
        <td class="detail-page-name">申请时间</td>
        <td>{{info.applyDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">申请信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">单据名称</td>
        <td colspan="3">{{info.name}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">采购金额合计</td>
        <td colspan="3">{{info.totalMoney}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">所属业务</td>
        <td colspan="3">{{info.businessName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">用途</td>
        <td colspan="3">{{info.remark}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">采购事由</td>
        <td colspan="3">{{info.buyReason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">备注</td>
        <td colspan="3">{{info.remark2}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">购买明细</td>
        <td colspan="3"><x-button @click.native="showImg(1)" mini>查看</x-button></td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable,XButton } from 'vux'
  var AssetBuyPage = Vue.extend({})
  Vue.component('assetBuy-page', AssetBuyPage)

  export default {
    name: 'AssetBuyPage',
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
        url: this.baseUrl+'/wechat/assetBuy/getJson/'+this.idArr[0],
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
</style>

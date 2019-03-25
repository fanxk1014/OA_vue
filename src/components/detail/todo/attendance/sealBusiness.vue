<!--盖章申请详情-->
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
        <td class="detail-page-name">申请日期</td>
        <td colspan="3">{{info.applyDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">申请信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">所属业务</td>
        <td colspan="3">{{info.businessName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">盖章事由</td>
        <td colspan="3">{{info.useReason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">报送单位</td>
        <td colspan="3">{{info.sendUnit}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">文件名称</td>
        <td colspan="3">{{info.fileNames}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">份数</td>
        <td>{{info.fileNumber}}</td>
        <td class="detail-page-name">文件类型</td>
        <td>{{info.fileType}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">拟用章</td>
        <td colspan="3"><x-button @click.native="showImg(1)" mini>查看</x-button></td>
      </tr>
      <tr>
        <td class="detail-page-name">盖章数量</td>
        <td>{{info.sealNumber}}</td>
        <td class="detail-page-name">是否业务盖章</td>
        <td>{{info.isBusinessSeal}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">备注</td>
        <td colspan="3">{{info.remark}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">登记人</td>
        <td>{{info.registerName}}</td>
        <td class="detail-page-name">登记日期</td>
        <td>{{info.registerDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">盖章信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">盖章人</td>
        <td>{{info.sealStaffName}}</td>
        <td class="detail-page-name">盖章时间</td>
        <td>{{info.sealDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">盖章备注</td>
        <td colspan="3">{{info.sealRemark}}</td>
      </tr>
      <tr>
        <th colspan="4" class="detail-page-title">送出信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">送出人</td>
        <td>{{info.sendStaffName}}</td>
        <td class="detail-page-name">送出时间</td>
        <td>{{info.sendDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">送出备注</td>
        <td colspan="3">{{info.sendRemark}}</td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var SealBusinessPage = Vue.extend({})
  Vue.component('sealBusiness-page', SealBusinessPage)

  export default {
    name: 'SealBusinessPage',
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
        url: this.baseUrl+'/wechat/sealBusiness/getJson/'+this.idArr[0],
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

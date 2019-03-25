<!--申请离职详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">姓名（辞职人）</td>
        <td>{{info.employeeName}}</td>
        <td class="detail-page-name">公司</td>
        <td>{{info.deptParentName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">部门</td>
        <td>{{info.departmentName}}</td>
        <td class="detail-page-name">职务</td>
        <td>{{info.job}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">申请时间</td>
        <td colspan="3">{{info.createFlowDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">辞职原因</td>
        <td colspan="3">{{info.reason}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">拟最后任职时间</td>
        <td colspan="3">{{info.positiveDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">离职交接表</td>
        <td colspan="3"><x-button @click.native="showImg(1)" mini>查看</x-button></td>
      </tr>
      <tr>
        <td class="detail-page-name">审核表</td>
        <td colspan="3"><x-button @click.native="showImg(2)" mini>查看</x-button></td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var LeaveJobPage = Vue.extend({})
  Vue.component('leaveJob-page', LeaveJobPage)

  export default {
    name: 'LeaveJobPage',
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
        url: this.baseUrl+'/wechat/leaveJob/getJson/'+this.idArr[0],
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
  .weui-btn{
    line-height: 1.8;
    margin: 0;
  }
</style>

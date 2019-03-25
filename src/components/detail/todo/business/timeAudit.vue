<!--工时审批详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <th colspan="4" class="detail-page-title">基本信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">单据编号</td>
        <td>{{info.workTimeCode}}</td>
        <td class="detail-page-name">申请日期</td>
        <td>{{info.workDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">业务名称</td>
        <td>{{info.businessName}}</td>
        <td class="detail-page-name">业务编号</td>
        <td>{{info.businessNo}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">员工姓名</td>
        <td>{{info.staffName}}</td>
        <td class="detail-page-name">所属部门</td>
        <td>{{info.departmentName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工时</td>
        <td colspan="3">{{info.workTime}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工时登记周历表</td>
        <td colspan="3"><x-button @click.native="getImg()" mini>查看</x-button></td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var TimeAuditPage = Vue.extend({})
  Vue.component('timeAudit-page', TimeAuditPage)

  export default {
    name: 'TimeAuditPage',
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
        picArr: []
      }
    },
    mounted () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.axios({
        url: this.baseUrl+'/wechat/workTime/getJson/'+this.idArr[0],
        method: 'get'
      }).then((response) => {
        this.info = response.data.data.info;
        this.$vux.loading.hide();
      }).catch((response) => {
      });
    },
    methods: {
      getImg () {
        // if(this.picArr.length>0){
        //   this.showImg ();
        // }else{
          this.$vux.loading.show({
            text: '加载中'
          });
          this.picArr = [];
          this.axios({
            url: this.baseUrl+'/wechat/commonFile/screenPage?taskId='+this.idArr[0]+'&flowId='+this.idArr[1]+'&stepId='+this.idArr[2],
            method: 'get'
          }).then((response) => {
            this.$vux.loading.hide();
            if(response.data.status == false){//返回失败
              this.showErr();
            }else {//返回成功
              let urlArr = response.data.imageUrl.split(',');
              for(let i=0;i<urlArr.length;i++){
                if(urlArr[i] != ''){
                  this.picArr.push(urlArr[i]+'?number='+Math.random());
                }
              }
              if(this.picArr.length>0){
                this.showImg();
              }else{
                this.showErr();
              }
            }
          }).catch((response) => {
            this.$vux.loading.hide();
            this.showErr();
          });
        // }
      },
      showImg () {
        wx.previewImage({
          current: this.picArr[0],
          urls: this.picArr
        });
      },
      showErr () {
        this.$vux.alert.show({
          title: '暂无数据'
        });
        setTimeout(() => {
          this.$vux.alert.hide();
        }, 2000)
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

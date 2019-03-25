<!--招标代理-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name detail-page-img">信息总览</td>
        <td colspan="3"><x-button @click.native="getImg('overview')" mini>查看</x-button></td>
      </tr>
      <tr>
        <th colspan="4" class="detail-page-title">基本信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">业务编号</td>
        <td>{{info.businessNo}}</td>
        <td class="detail-page-name">业务名称</td>
        <td>{{info.businessName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">交易标的</td>
        <td>{{info.tradingSubjectName}}</td>
        <td class="detail-page-name">招标类型</td>
        <td>{{info.tenderTypeNames}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">招标方式</td>
        <td>{{info.tenderMeans}}</td>
        <td class="detail-page-name">所属合同</td>
        <td>{{info.contractName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">委托日期</td>
        <td>{{info.receiveDate}}</td>
        <td class="detail-page-name">委托结束日期</td>
        <td>{{info.claimCompleteDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">委托金额</td>
        <td>{{info.entrustMoney}}</td>
        <td class="detail-page-name">实际业务收入</td>
        <td>{{info.baseReceivables}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">招标内容</td>
        <td colspan="3">{{info.remark3}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">安排业务科室</th>
      </tr>
      <tr>
        <td class="detail-page-name">项目负责人</td>
        <td>{{info.managerName}}</td>
        <td class="detail-page-name">所属部门</td>
        <td>{{info.departmentName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name detail-page-img">日程安排</td>
        <td colspan="3"><x-button @click.native="getImg('bidSchedule')" mini>查看</x-button></td>
      </tr>
      <tr>
        <td class="detail-page-name detail-page-img">人员分工</td>
        <td colspan="3"><x-button @click.native="getImg('worktree')" mini>查看</x-button></td>
      </tr>
      <tr>
        <td class="detail-page-name detail-page-img">工时汇总</td>
        <td colspan="3"><x-button @click.native="getImg('worktime')" mini>查看</x-button></td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var BidPage = Vue.extend({})
  Vue.component('bid-page', BidPage)

  export default {
    name: 'BidPage',
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
        picArr1: [],// 人员分工
        picArr2: [],// 工时汇总
        picArr3: [],// 信息总览
        picArr4: []// 日程安排
      }
    },
    mounted () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.axios({
        url: this.baseUrl+'/wechat/todo/businessDetail/'+this.idArr[0]+'/'+this.idArr[1]+'/'+this.idArr[2],
        method: 'get'
      }).then((response) => {
        this.info = response.data.data.info;
        this.$vux.loading.hide();
      }).catch((response) => {
      });
    },
    methods: {
      getImg (imgType) {
        // if(imgType == 'worktree' && this.picArr1.length>0){//人员分工
        //   this.showImg(1);
        // }else if(imgType == 'worktime' && this.picArr2.length>0){//工时汇总
        //   this.showImg(2);
        // }else if(imgType == 'overview' && this.picArr3.length>0){//信息总览
        //   this.showImg(3);
        // }else if(imgType == 'bidSchedule' && this.picArr4.length>0){//日程安排
        //   this.showImg(4);
        // }else{
          this.$vux.loading.show({
            text: '加载中'
          });
          this.picArr1 = [];
          this.picArr2 = [];
          this.picArr3 = [];
          this.picArr4 = [];
          this.axios({
            url: this.baseUrl+'/wechat/commonFile/screenPage?taskId='+this.idArr[0]+'&flowId='+this.idArr[1]+'&stepId='+this.idArr[2]+'&type='+imgType,
            method: 'get'
          }).then((response) => {
            this.$vux.loading.hide();
            if(response.data.status == false){//返回失败
              this.showErr();
            }else{//返回成功
              if(imgType == 'overview'){//信息总览
                let urlArr = response.data.imageUrl.split(',');
                for(let i=0;i<urlArr.length;i++){
                  if(urlArr[i] != ''){
                    this.picArr3.push(urlArr[i]+'?number='+Math.random());
                  }
                }
                if(this.picArr3.length>0){
                  this.showImg(3);
                }else{
                  this.showErr();
                }
              }else if(imgType == 'worktree'){//人员分工
                let urlArr = response.data.imageUrl.split(',');
                for(let i=0;i<urlArr.length;i++){
                  if(urlArr[i] != ''){
                    this.picArr1.push(urlArr[i]+'?number='+Math.random());
                  }
                }
                if(this.picArr1.length>0){
                  this.showImg(1);
                }else{
                  this.showErr();
                }
              }else if(imgType == 'worktime'){//工时汇总
                let urlArr = response.data.imageUrl.split(',');
                for(let i=0;i<urlArr.length;i++){
                  if(urlArr[i] != ''){
                    this.picArr2.push(urlArr[i]+'?number='+Math.random());
                  }
                }
                if(this.picArr2.length>0){
                  this.showImg(2);
                }else{
                  this.showErr();
                }
              }else if(imgType == 'bidSchedule'){//日程安排
                let urlArr = response.data.imageUrl.split(',');
                for(let i=0;i<urlArr.length;i++){
                  if(urlArr[i] != ''){
                    this.picArr4.push(urlArr[i]+'?number='+Math.random());
                  }
                }
                if(this.picArr4.length>0){
                  this.showImg(4);
                }else{
                  this.showErr();
                }
              }
            }

          }).catch((response) => {
            this.$vux.loading.hide();
            this.showErr();
          });
        // }
      },
      showImg (num) {
        let arrOnShow;
        if(num == 1){
          arrOnShow = this.picArr1;
        }else if(num == 2){
          arrOnShow = this.picArr2;
        }else if(num == 3){
          arrOnShow = this.picArr3;
        }else if(num == 4){
          arrOnShow = this.picArr4;
        }
        wx.previewImage({
          current: arrOnShow[0],
          urls: arrOnShow
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
  .detail-page-img{
    font-size: 13px;
  }
  .weui-btn{
    line-height: 1.8;
    margin: 0;
  }
</style>

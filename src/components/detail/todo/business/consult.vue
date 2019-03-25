<!--工程咨询-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <th colspan="4" class="detail-page-title">基本信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">业务编号</td>
        <td>{{info.businessNo}}</td>
        <td class="detail-page-name">项目特性</td>
        <td>{{info.projectInfoPropertyName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">委托目的（业务明细）</td>
        <td colspan="3">{{info.entrustName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">咨询范围与内容</td>
        <td colspan="3">{{info.consultScopeCont}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">委托时间</td>
        <td>{{info.entrustDate}}</td>
        <td class="detail-page-name">委托完成时间</td>
        <td>{{info.claimCompleteDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">合同编号</td>
        <td>{{info.contractNo}}</td>
        <td class="detail-page-name">合同签订日期</td>
        <td>{{info.signDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">合同名称</td>
        <td>{{info.contractName}}</td>
        <td class="detail-page-name">委托投资(万元)</td>
        <td>{{info.touziMoney}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">实际应收金额</td>
        <td>{{info.baseReceivables}}</td>
        <td class="detail-page-name">委托单位信息</td>
        <td><x-button @click.native="getImg('showUnitPage_1')" mini>查看</x-button></td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">安排业务科室</th>
      </tr>
      <tr>
        <td class="detail-page-name">主办人（项目负责人）</td>
        <td>{{info.managerName}}</td>
        <td class="detail-page-name">主办部门</td>
        <td>{{info.departmentName}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">报告信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">报告日期</td>
        <td>{{info.reportDate}}</td>
        <td class="detail-page-name">报告号</td>
        <td>{{info.reportNo}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">报告分数</td>
        <td>{{info.reportCount}}</td>
        <td class="detail-page-name">清单份数</td>
        <td>{{info.inventoryCount}}</td>
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
  var ConsultPage = Vue.extend({})
  Vue.component('consult-page', ConsultPage)

  export default {
    name: 'ConsultPage',
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
        picArr3: []// 委托单位信息
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
        // }else if(imgType == 'showUnitPage_1' && this.picArr3.length>0){//委托单位信息
        //   this.showImg(3);
        // }else{
          this.$vux.loading.show({
            text: '加载中'
          });
          this.picArr1 = [];
          this.picArr2 = [];
          this.picArr3 = [];
          this.axios({
            url: this.baseUrl+'/wechat/commonFile/screenPage?taskId='+this.idArr[0]+'&flowId='+this.idArr[1]+'&stepId='+this.idArr[2]+'&type='+imgType,
            method: 'get'
          }).then((response) => {
            this.$vux.loading.hide();
            if(response.data.status == false){//返回失败
              this.showErr();
            }else{//返回成功
              if(imgType == 'showUnitPage_1'){// 委托单位信息
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

<!--人员转正详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">员工姓名</td>
        <td>{{info.employeeName}}</td>
        <td class="detail-page-name">部门</td>
        <td>{{info.departmentName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">职务</td>
        <td>{{info.job}}</td>
        <td class="detail-page-name">职级</td>
        <td>{{info.beforeTurnPositionLevel}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工号</td>
        <td>{{info.employeeNo}}</td>
        <td class="detail-page-name">入职日期</td>
        <td>{{info.registerTime}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">转正申请日期</td>
        <td>{{info.createFlowDate}}</td>
        <td class="detail-page-name">转正类型</td>
        <td>{{info.turnoverTypeName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">第一阶段试用起止时间</td>
        <td>{{info.firstStageDate}}</td>
        <td class="detail-page-name">第二阶段试用起止时间</td>
        <td>{{info.secondStageDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">员工自评</th>
      </tr>
      <tr>
        <td class="detail-page-name">员工述职总结报告</td>
        <td colspan="3">{{info.finalReport}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">本人对本职工作的意见</td>
        <td colspan="3">{{info.workSuggestion}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">部门意见</th>
      </tr>
      <tr>
        <td class="detail-page-name">建议同意该员工</td>
        <td>{{info.auditChoose}}</td>
        <td class="detail-page-name">考核结论</td>
        <td>{{info.optionASumCount}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">转正工资</td>
        <td>{{info.positiveCost}}</td>
        <td class="detail-page-name">转正时间</td>
        <td>{{info.positiveDate2}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">转正后职务</td>
        <td>{{info.laterTurnJod}}</td>
        <td class="detail-page-name">转正后职级</td>
        <td>{{info.positionLevel}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">用人部门</td>
        <td>{{info.employeeDepartment}}</td>
        <td class="detail-page-name">用人单位</td>
        <td>{{info.companyName}}</td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var RegularPage = Vue.extend({})
  Vue.component('regular-page', RegularPage)

  export default {
    name: 'RegularPage',
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
        url: this.baseUrl+'/wechat/positiveTurnover/getJson/'+this.idArr[0],
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
  .weui-btn{
    line-height: 1.8;
    margin: 0;
  }
</style>

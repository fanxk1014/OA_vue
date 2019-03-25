<!--人事变动详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">员工姓名</td>
        <td>{{info.employeeName}}</td>
        <td class="detail-page-name">工号</td>
        <td>{{info.employeeNo}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">现在职务</td>
        <td>{{info.job}}</td>
        <td class="detail-page-name">入职日期</td>
        <td>{{info.registerTime}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">变动申请信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">变动情况</td>
        <td colspan="3">{{info.auditChoose}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">变动情况说明</td>
        <td colspan="3">{{info.changesDescription}}</td>
      </tr>

      <tr>
        <th colspan="2" class="detail-page-title">变动前</th>
        <th colspan="2" class="detail-page-title">变动后</th>
      </tr>
      <tr>
        <td class="detail-page-name">部门</td>
        <td>{{info.beforeDepartmentName}}</td>
        <td class="detail-page-name">部门</td>
        <td>{{info.laterDepartmentName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">职务</td>
        <td>{{info.beforeJob}}</td>
        <td class="detail-page-name">职务</td>
        <td>{{info.laterJob}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">职级</td>
        <td>{{info.beforePositionLevel}}</td>
        <td class="detail-page-name">职级</td>
        <td>{{info.positionLevel}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工资总额</td>
        <td>{{info.beforeMoney}}</td>
        <td class="detail-page-name">工资总额</td>
        <td>{{info.laterMoney}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工资调整说明</td>
        <td colspan="3">{{info.wageAdjustment}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">生效日期</td>
        <td colspan="3">{{info.signatureDate}}</td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var PersonChangePage = Vue.extend({})
  Vue.component('personChange-page', PersonChangePage)

  export default {
    name: 'PersonChangePage',
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
        url: this.baseUrl+'/wechat/personnelChange/getJson/'+this.idArr[0],
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

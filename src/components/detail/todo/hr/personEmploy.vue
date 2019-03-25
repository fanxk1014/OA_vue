<!--人员录用详情-->
<template>

  <div>
    <x-table>
      <tbody>
      <tr>
        <td class="detail-page-name">申请部门</td>
        <td>{{info.staffDeptName}}</td>
        <td class="detail-page-name">申请人</td>
        <td>{{info.staffName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">申请日期</td>
        <td colspan="3">{{info.registerDate}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">拟录用人员基本信息</th>
      </tr>
      <tr>
        <td class="detail-page-name">拟录用人员姓名</td>
        <td>{{info.luyongPeople}}</td>
        <td class="detail-page-name">出生年月</td>
        <td>{{info.birthday}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">性别</td>
        <td>{{info.sex}}</td>
        <td class="detail-page-name">专业</td>
        <td>{{info.specialty}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">学历</td>
        <td>{{info.education}}</td>
        <td class="detail-page-name">毕业院校</td>
        <td>{{info.graduateSchool}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">证书情况</td>
        <td colspan="3">{{info.carInfo}}</td>
      </tr>

      <tr>
        <th colspan="4" class="detail-page-title">拟录用人员信息确认</th>
      </tr>
      <tr>
        <td class="detail-page-name">拟聘职务</td>
        <td>{{info.job}}</td>
        <td class="detail-page-name">拟聘职级</td>
        <td>{{info.positionLevel}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">预计到岗时间</td>
        <td>{{info.toDate}}</td>
        <td class="detail-page-name">实际到岗时间</td>
        <td>{{info.toRealDate}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">试用工资</td>
        <td>{{info.tryMoney}}</td>
        <td class="detail-page-name">试用期限</td>
        <td>{{info.tryMonth}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">转正工资</td>
        <td>{{info.formalMoney}}</td>
        <td class="detail-page-name">转正工资模式</td>
        <td>{{info.tryModel}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">录用人员所在部门经理</td>
        <td colspan="3">{{info.leaderName}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工作地点</td>
        <td colspan="3">{{info.workAddress}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">部门评价</td>
        <td colspan="3">{{info.jobRequire}}</td>
      </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var PersonEmployPage = Vue.extend({})
  Vue.component('expense-page', PersonEmployPage)

  export default {
    name: 'PersonEmployPage',
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
        url: this.baseUrl+'/wechat/personnelEmploy/getJson/'+this.idArr[0],
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

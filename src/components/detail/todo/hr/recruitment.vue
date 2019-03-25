<!--申请招聘详情-->
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
        <th colspan="4" class="detail-page-title">招聘需求</th>
      </tr>
      <tr>
        <td class="detail-page-name">到岗日期</td>
        <td>{{info.toDate}}</td>
        <td class="detail-page-name">拟招职务</td>
        <td>{{info.recruitmentJob}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">编制人数</td>
        <td>{{info.complementNumber}}</td>
        <td class="detail-page-name">在编人数</td>
        <td>{{info.formalCount}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">缺编人数</td>
        <td>{{info.lackNumber}}</td>
        <td class="detail-page-name">招聘类别</td>
        <td>{{info.recruitmentType}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">招聘人数</td>
        <td>{{info.recruitmentCount}}</td>
        <td class="detail-page-name">包含实习人数</td>
        <td>{{info.internshipNumber}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">工作地点</td>
        <td colspan="3">{{info.workAddress}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">申请原因</td>
        <td colspan="3">{{info.forReasons}}</td>
      </tr>
      <tr>
        <td class="detail-page-name">招聘人员</td>
        <td colspan="3"><x-button @click.native="showImg(1)" mini>查看</x-button></td>
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
  var RecruitmentPage = Vue.extend({})
  Vue.component('recruitment-page', RecruitmentPage)

  export default {
    name: 'RecruitmentPage',
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
        url: this.baseUrl+'/wechat/personnelRecruitment/getJson/'+this.idArr[0],
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
    font-size: 13px;
  }
  .weui-btn{
    line-height: 1.8;
    margin: 0;
  }
</style>

<!--待办-动态详情-->
<template>

  <div>
    <x-table>
      <tbody>

        <tr v-for="(item,index) in content" :key="index">
          <td class="detail-page-name">{{item.labelName}}</td>
          <!--<td v-html="item.labelValue"></td>-->
          <td>{{item.labelValue}}</td>
        </tr>

      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XButton } from 'vux'
  var DefaultTodoPage = Vue.extend({})
  Vue.component('defaultTodo-page', DefaultTodoPage)

  export default {
    name: 'DefaultTodoPage',
    components: {
      XTable,XButton
    },
    props: {
      idArr: Array
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        content: []
      }
    },
    mounted () {
      this.$vux.loading.show({
        text: '加载中'
      });
      this.axios({
        url: this.baseUrl+'/wechat/otherBusiness/'+this.idArr[0]+'/info?flowId='+this.idArr[1],
        method: 'get'
      }).then((response) => {
        if(response.data.status){
          this.content = response.data.colums;
        }
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

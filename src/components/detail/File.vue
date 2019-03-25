<!--待办详情-附件-->
<template>

  <div id="detail-file">
    <x-table v-if="fileData" :cell-bordered="false" :content-bordered="true" style="background-color:#fff;">
      <thead>
      <tr style="background-color: #F7F7F7">
        <th style="width: 50%">附件名</th>
        <th>上传用户</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,key) in fileData" :key="key">
        <td>{{item.fileName}}</td>
        <td>{{item.uploadPeople}}</td>
        <td>
          <x-button mini @click.native="showFile(key,fileList[key].src,fileList[key].type,item.fileName)">查看</x-button>
          <img class="previewer-demo-img" style="display: none" :src="fileList[key].src" width="100">
        </td>
      </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import { XTable, XButton } from 'vux'
  import Vue from 'vue'

  var DetailFileCom = Vue.extend({})

  Vue.component('detail-file', DetailFileCom)

  export default {
    name: 'DetailFile',
    props: ['fileData','fileList'],
    components: {
      XTable,
      XButton
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        fileUrl: '',// 附件-文件地址（供复制）
      }
    },
    mounted () {
    },
    methods: {
      showFile (index,url,type,fileName){// 查看附件
        this.fileUrl = '';
        let typeStr = type.toLowerCase().slice(-3);
        if(typeStr==='jpg'||typeStr==='png'||typeStr==='gif'||typeStr==='peg'){// 图片

          let imgLinkArr = [];// 图片流地址
          let imgArr = this.fileList;
          let imgLink;// 需要展示的图片流
          for(var i in imgArr){
            imgLinkArr.push(imgArr[i].src);
          }
          imgLink = imgLinkArr[index];

          this.$vux.loading.show({
            text: '加载中'
          });
          this.axios({
            url: this.baseUrl + imgLink,
            method: 'get',
          }).then((response) => {
            this.$vux.loading.hide();
            let showImg = this.baseUrl + '/' + response.data.filePath;// 需要展示的图片地址
            let showImgArr = [];

            showImgArr.push(showImg);
            setTimeout(() => {
              wx.previewImage({
                current: showImg, // 当前显示图片的http链接
                urls: showImgArr // 需要预览的图片http链接列表
              });
            }, 500);

          }).catch((response) => {
            this.$vux.loading.hide();
          });

        }else{// 文档

          let fileLinkArr = [];// 文件流地址
          let fileArr = this.fileList;
          let fileLink;// 需要展示的文件流
          let loadFile;
          for(var i in fileArr){
            fileLinkArr.push(fileArr[i].src);
          }
          fileLink = fileLinkArr[index];

          this.$vux.loading.show({
            text: '加载中'
          });
          this.axios({
            url: this.baseUrl + fileLink,
            method: 'get',
          }).then((response) => {
            this.$vux.loading.hide();
            loadFile = this.baseUrl + '/' + response.data.filePath;// 需要展示的文档地址
            this.fileUrl = loadFile;
            this.$router.push({
              path: '/seefile',
              query:{
                loadFile:this.fileUrl,
                fileName:fileName
              }
            });

          }).catch((response) => {
            this.$vux.loading.hide();
          });

        }

      }
    }
  }
</script>

<style scoped lang="less">
  #detail-file{
    margin-bottom: 46px;
  }
  .current-node{
    color: #459FFB;
  }
  .vux-timeline-item-checked{
    display: none;
  }
  .timeline-part{
    padding: 5px;
    h4,h5{
      font-weight: 500;
    }
  }
</style>

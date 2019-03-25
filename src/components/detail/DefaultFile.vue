<!--动态通用待办详情-附件-->
<template>

  <div id="detail-file">
    <x-table v-if="" :cell-bordered="false" :content-bordered="true" style="background-color:#fff;">
      <thead>
      <tr style="background-color: #F7F7F7">
        <th v-for="(item,key) in titleList">
          {{item.labelName}}
        </th>
        <th>
          操作
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,key) in fileList" :key="key">
        <td v-for="(indexItem,indexKey) in labelIndex" :key="indexKey">
          {{item[indexItem]}}
        </td>
        <td>
          <x-button mini @click.native="showFile(key,fileList[key].savePath,fileList[key].fileType,fileList[key].fileId,item.fileName)">查看</x-button>
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

  var DetailDefaultFileCom = Vue.extend({})

  Vue.component('detail-default-file', DetailDefaultFileCom)

  export default {
    name: 'DetailDefaultFile',
    props: ['fileData','idArr'],
    components: {
      XTable,
      XButton
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        fileUrl: '',// 附件-文件地址（供复制）
        titleList: [],
        fileList: [],
        labelIndex: []
      }
    },
    created () {
      if(this.fileData.field){
        let that = this;
        this.titleList = this.fileData.field;
        let fieldArr = this.fileData.field;
        fieldArr.forEach(function( val, index ) {
          that.labelIndex.push(val.label);
        });
      }
      if(this.fileData.maps){
        this.fileList = this.fileData.maps;
      }
    },
    methods: {
      showFile (index,url,type,fileId,fileName){// 查看附件
        this.fileUrl = '';
        let typeStr = type.toLowerCase().slice(-3);
        if(typeStr==='jpg'||typeStr==='png'||typeStr==='gif'||typeStr==='peg'){// 图片
          let imgLinkArr = [];// 图片流地址
          let imgArr = this.fileList;
          let imgLink;// 需要展示的图片流
          for(var i in imgArr){
            imgLinkArr.push(imgArr[i].savePath);
          }
          imgLink = imgLinkArr[index];

          this.$vux.loading.show({
            text: '加载中'
          });
          this.axios({
            url: this.baseUrl + '/wechat/commonFile/downLoadEcmsFile?taskId='+this.idArr[0]+'&flowId='+this.idArr[1]+'&fileId='+fileId,
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

          }).catch((error) => {
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
            url: this.baseUrl + '/wechat/commonFile/downLoadEcmsFile?taskId='+this.idArr[0]+'&flowId='+this.idArr[1]+'&fileId='+fileId,
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

          }).catch((error) => {
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

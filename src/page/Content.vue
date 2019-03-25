<template>
  <div>
    <x-header :left-options="{showBack: true}">
      {{pageTitle}}
      <a slot="right" @click="goLogin()" v-if="!userName">
        <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
        <!--<i class="iconfont icon-user1"></i>-->
      </a>
      <a slot="right" @click="goLogin()" v-if="userName">
        {{userName}}
      </a>
    </x-header>
    <cell-box style="margin-top: 46px;">
    <flexbox orient="vertical" align="center">
               <flexbox-item align="center">
                  <div class="artcleTitle">{{article.title}}</div>
                  <div><span class="articleTip">作者：{{article.staffName}}</span><span class="articleTip">发布时间：{{article.sendTime}}</span><span class="articleTip">查看次数：{{article.readTimes}}</span></div>
                </flexbox-item>
               <flexbox-item >
                 <div class="Brief" v-if="article.jian != ''">
                   <p class="title">简述：</p>
                   <p class="context">{{article.jian}}</p>
                 </div>
                 <div v-if="image !=''">
                   <img :src="imageSrc"  style="width: 100%;">
                 </div>
               </flexbox-item>
               <flexbox-item ><div class="articleContext" v-html=article.context></div></flexbox-item>
              <flexbox-item>
                <div v-if="article.fileName !=''">
                  附件：<a @click="getFilePath()" style="color:#0772e0">{{article.fileName}}</a>
                </div>
              </flexbox-item>
    </flexbox>
    </cell-box>
  </div>
</template>

<script>
  import { XHeader,Flexbox, FlexboxItem }from 'vux'
  import CellBox from "../../node_modules/vux/src/components/cell-box/index";

  export default {
    components: {
      CellBox,
      XHeader,
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        pageTitle: '',
        userName: false,
        itemId:'',
        article:{
          title:'',
          staffName:'',
          readTimes:0,
          jian:'',
          context:'',
          fileName:''
        },
        imageSrc:this.$store.state.url,
        image:'',
        wxFilePath:'',//附件地址
        baseUrl: this.$store.state.url,
      }
    },
    mounted () {
      this.itemId=this.$route.query.id.id;
      if(this.itemId==undefined){
        this.itemId=window.localStorage.getItem('articleId');
      }
      if(this.$store.state.userInfo.accounts){
        this.userName = this.$store.state.userInfo.accounts;
      }
      //获取新闻详情
      this.axios({
        url: this.$store.state.url+'/wechat/information/viewInformation/'+this.itemId,
        method: 'get',
      }).then((response) => {
        this.article=response.data.obj;
        this.image=response.data.photoPath;
        this.imageSrc=this.imageSrc+'/'+response.data.photoPath;
      }).catch((response) => {

      });
    },
    methods: {
      goLogin () {
        this.$router.push({ name: 'Login'});
      },
      //获取附件地址
      getFilePath(){
        this.$vux.loading.show({
          text: '加载中'
        });
        window.localStorage.setItem('articleId',this.itemId);
        this.axios({
          url: this.$store.state.url+'/wechat/information/viewFile/'+this.article.id,
          method: 'get',
        }).then((response) => {
          this.$vux.loading.hide();
          this.wxFilePath=response.data.wxFilePath;
          let typeStr = this.wxFilePath.toLowerCase().slice(-3);
          if(typeStr==='jpg'||typeStr==='png'||typeStr==='gif'||typeStr==='peg'){// 图片
            let picUrl = this.baseUrl + '/' +this.wxFilePath;
            let showImgArr = [];
            showImgArr.push(picUrl);
            setTimeout(() => {
              wx.previewImage({
                current: picUrl, // 当前显示图片的http链接
                urls: showImgArr // 需要预览的图片http链接列表
              });
            }, 500);
          }else{
            this.$router.push({
              path: '/seefile',
              query:{
                loadFile:this.baseUrl + '/'+this.wxFilePath,
                fileName:this.article.fileName
              }
            });
          }

        }).catch((response) => {

        });
      },
    }
  }
</script>

<style scoped>
  .vux-header{
    z-index: 9;
    position: fixed;
    top: 0;
    width: 100%;
  }
  .weui-cell{
    background: #ffffff;
  }
  .artcleTitle{
    font-weight: bold;
    font-size: 16px;
    border-bottom: 2px solid #e4a83b;
  }
  .articleTip{
    font-size: 12px;
    color:#666;
    margin-right: 8px;
  }
  .articleTip:last-child{
    margin-right: 0;
  }
  .Brief{
    border: 1px solid #e6e2e2;
    border-radius: 3px;
    padding: 2px;
  }
  .Brief .title{
    color: #000000;
    font-size: 12px;
  }
  .Brief .context{
    text-indent:2em;
    font-size: 12px;
  }
</style>

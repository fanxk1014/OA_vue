<template>
  <div class="fixed-part detail-part">
    <x-header :left-options="{showBack: true}" style="height: 2.9rem">
      {{fileName}}
    </x-header>
    <div :style="styleObject" class="scroll-wrapper">
      <iframe id="file-id" height="100%"  :src="fileSrc"  width="100%"  frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
  import Clipboard from 'clipboard'
  import { XHeader, ButtonTab, ButtonTabItem, Group, Cell,
    Flow, FlowState, FlowLine, XImg, XInput, XButton, XTable,
    Previewer, TransferDom, XDialog, Checker, CheckerItem } from 'vux'

  export default {
    name: 'app',
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ButtonTab,
      ButtonTabItem,
      Group,
      Cell,
      Flow,
      FlowState,
      FlowLine,
      XImg,
      XInput,
      XButton,
      XTable,
      Previewer,
      XDialog,
      Checker,
      CheckerItem
    },
    data () {
      return {
        loadFile:this.$route.query.loadFile,
        fileSrc:"",
        styleObject: {},
        fileName:this.$route.query.fileName
      }
    },
    mounted(){
      console.log('seeFile',this.loadFile);
      this.fileSrc=this.$store.state.url+'/static/pdf/web/viewer.html?file='+this.loadFile;
      this.getHeight();
    },
    methods:{
      getHeight (){
        let bodyH=document.body.clientHeight;
        let iframeH=bodyH-45+26;
        this.styleObject={
            width:'100%',
            height:iframeH+'px'
        };
      }
    }

  }
</script>
<style>
  html,body{
    height: 100%;
  }
  iframe{
    overflow: scroll;
  }
  .scroll-wrapper {
    -webkit-overflow-scrolling: touch;
    overflow: scroll;
  }
</style>


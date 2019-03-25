<!-采购资产申请详情-->
<template>

  <div>
    <x-table>
      <tbody>
        <tr>
          <td class="detail-page-name">购买人</td>
          <td>{{info.usePeopleName}}</td>
          <td class="detail-page-name">所属部门</td>
          <td>{{info.departName}}</td>
        </tr>
        <tr>
          <td class="detail-page-name">行政级别</td>
          <td>{{info.position}}</td>
          <td class="detail-page-name">申请时间</td>
          <td>{{info.applyDate}}</td>
        </tr>

        <tr>
          <th colspan="4" class="detail-page-title">申请信息</th>
        </tr>
        <tr>
          <td class="detail-page-name">单据名称<span class="required">*</span></td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="name"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">用途</td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="remark"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">采购事由</td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="buyReason"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">备注</td>
          <td colspan="3">
            <x-input title="" placeholder="请输入" v-model="remark2"></x-input>
          </td>
        </tr>
        <tr>
          <td class="detail-page-name">附件上传</td>
          <td colspan="3">
            <input type="file" name="file" id="file" @change="chooseFile" accept="image/*" class="inputfile"/>
            <label for="file" class='btn-file'>选择</label>
            <p id="box">
              <div class="img-box" v-for="(item,key) in fileShowList" :key="key">
                <img class="icon-close" src="../../../assets/icon/close-blue.png" @click="deleteFile(key)">
                <img class="img-part" :src="item" alt=""/>
              </div>
            </p>
          </td>
        </tr>
      </tbody>
    </x-table>
  </div>

</template>

<script>
  import Vue from 'vue'
  import { XTable, XInput, XButton } from 'vux'
  var BuyApplyPage = Vue.extend({})
  Vue.component('buyApply-page', BuyApplyPage)

  export default {
    name: 'BuyApplyPage',
    components: {
      XTable,XInput,XButton
    },
    props: {
      saveStatus: Number
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        flowId: '',
        info: {},

        //附件
        refRecordId: '',
        refModule: '',
        fileObj: {},//文件上传集合
        fileShowList: [], // 上传附件集合-预览
        uploadedFileIdList: [], // 已上传附件ID集合
        rootPathConfig: '',
        fileChange: false,
        //附件-END

        name: '',
        remark: '',
        remark2: '',
        buyReason: '',

      }
    },
    mounted () {
      this.$emit('sendTitleToParent','资产购买申请');
      this.axios({
        url: this.baseUrl+'/wechat/assetBuy/modAssetBuy?businessType=1',
        method: 'get'
      }).then((response) => {
        this.info = response.data.obj;
        this.refRecordId = response.data.refRecordId;
        this.refModule = response.data.refModule;
        this.rootPathConfig = response.data.rootPathConfig;
      }).catch((response) => {
        this.$vux.loading.hide();
      });
    },
    methods: {
      showMsg (msg) {
        this.$vux.alert.show({
          title: msg
        })
        setTimeout(() => {
          this.$vux.alert.hide()
        }, 2000)
      },
      chooseFile () { // 选择附件

        this.deleteFile(0);

        this.fileObj = document.getElementById('file').files;

        let that = this;
        let file = this.fileObj[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          that.fileShowList.push(this.result)
        }
        this.fileChange = true;
      },
      deleteFile (index) { // 删除已选附件
        this.fileShowList.splice(index, 1);
        let deleteFileId = this.uploadedFileIdList[index];
        let fileData = new FormData();
        fileData.append('fileId', deleteFileId);
        this.fileChange = false;
      },
      saveForm () {//保存
        if(this.name == ''){
          this.showMsg('请补充必填信息');
          return false;
        }
        this.$vux.loading.show({
          text: '加载中'
        });

        let formData = new FormData();
        formData.append("id",this.info.id);
        formData.append("name",this.name);
        formData.append("remark",this.remark);
        formData.append("remark2",this.remark2);
        formData.append("buyReason",this.buyReason);
        formData.append("businessType",'1');
        if(this.fileObj[0] && this.fileChange == true){
          formData.append('file', this.fileObj[0]);
          this.fileChange = false;
        }else{
          formData.append('file', '');
        }

        this.axios({
          url: this.baseUrl+'/wechat/assetBuy/saveForm',
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: formData,
        }).then((response) => {
          console.log('购买资产saveForm',response.data,this.saveStatus);
          if(response.data.status == 0){//保存失败
            this.$vux.loading.hide();
            this.showMsg(response.data.msg);
          }else if(this.saveStatus == 0&&response.data.status == 1){//父组件操作发起，并且保存成功
            this.startFlow();
          }else if(this.saveStatus == 1&&response.data.status == 1){//父组件操作提交，并且保存成功
            this.$emit('sendStatusToParent',{status:1});
            this.$vux.loading.hide();
          }
        }).catch((response) => {
          this.$vux.loading.hide();
        });
      },
      startFlow () {//发起
        let startData = new FormData();
        startData.append("id",this.info.id);
        startData.append("flowId",this.info.flowId);
        this.axios({
          url: this.baseUrl+'/wechat/assetBuy/startFlow',
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: startData
        }).then((response) => {
          console.log('购买资产startFlow',response.data);
          this.showMsg('保存成功！请继续完成提交操作！');

          if(response.data.status == 1){

            this.$emit('sendStatusToParent',{
              status:0,
              id:response.data.taskId,
              stepId:response.data.stepId
            });
          }
          this.$vux.loading.hide();
        }).catch((response) => {
          this.$vux.loading.hide();
        });

      }
    }
  }
</script>

<style scoped lang="less">
  .detail-page-title{
    background: #edf7ff;
    padding: 5px;
  }
  .vux-table td{
    width: 30%;
    padding: 5px;
    font-size: 12px;
    line-height: 20px;
  }
  .detail-page-name{
    width: 20% !important;
    background: #edf7ff;
  }
  .required{
    color: red;
  }
  .weui-cell{
    padding: 0;
  }
  .inputfile {
    opacity: 0;
    width: 0px;
  }
  .btn-file{
    display: inline-block;
    width: 60px;
    height: 29px;
    background-color: #F8F8F8;
    line-height: 29px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 6px;
  }
  .img-box{
    width: 80px;
    height: 80px;
    border: 1px solid #dad8d8;
    display: inline-block;
    float: left;
    margin: 2px;
  }
  .img-part{
    width: 100%;
    height: 100%;
  }
  .icon-close{
    position: absolute;
  }
</style>

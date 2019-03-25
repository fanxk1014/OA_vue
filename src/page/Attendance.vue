<template>
  <div class="content">
    <x-header :left-options="{showBack: true}">
      {{tabbarIndex == 0 ? "考勤打卡" : "打卡记录"}}
      <a slot="right" @click="goLogin()" v-if="!userName">
        <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
        <!--<i class="iconfont icon-user1"></i>-->
      </a>
      <a slot="right" @click="goLogin()" v-if="userName">
        {{userName}}
      </a>
    </x-header>
    <div style="margin-top: 46px;">
      <AttendanceCompoment v-if="tabbarIndex == 0"></AttendanceCompoment>
      <AttendanceCount v-if="tabbarIndex == 1"></AttendanceCount>
    </div>

  </div>

</template>

<script>
  import { PopupHeader, Popup, XHeader, Group, Cell,CellBox, Flexbox, FlexboxItem, TransferDom ,Radio, XTextarea, XButton, Tabbar, TabbarItem } from 'vux';
  import AttendanceCompoment from "../components/attendance/Attendance-compoment"
  import AttendanceCount from "./Attendance-count"
    export default {
      name: "Attendance",
      directives: {
        TransferDom
      },
      components: {
        XHeader, Group, Cell, CellBox, Flexbox, FlexboxItem, Radio, PopupHeader, Popup, XTextarea, XButton, Tabbar, TabbarItem,AttendanceCompoment ,AttendanceCount
      },
      data () {
        return {
          pageTitle: '',
          userName: false,
          tabbarIndex: 0
        }
      },
      mounted () {
        if(this.$store.state.userInfo.accounts){
          this.userName = this.$store.state.userInfo.accounts;
        };
      },
      methods: {
        goLogin () {
          this.$router.push({ name: 'Login'});
        }
      }
    }
</script>

<style scoped>

  .weui-cells{
    margin-top: 0 !important;
  }

  #allmap{
    height: 200px;
    overflow: hidden;
  }
  .vux-header{
    z-index: 100;
    position: fixed !important;
    top: 0;
    width: 100%;
  }
  .home-list-date{
    text-align: right;
    padding-right: 20px;
  }
  .text-center{
    text-align: center;
  }
  .weui-tabbar{
    position: fixed;
    bottom: 0;
  }
</style>
<style>
  .anchorBL{
    display: none;
  }
</style>

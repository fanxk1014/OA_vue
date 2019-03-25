<template>
  <div>
    <x-header :left-options="{showBack: true}">
      {{pageTitle}}
    </x-header>

    <div class="login-part" v-if="isLogin==false">
      <p class="login-in">
        <group>
          <x-input title="用户名" v-model="accountsVal">
            <img class="img-user" slot="label" style="padding-right:10px;display:block;" src="../assets/icon/user.png" width="24" height="24">
          </x-input>
        </group>
      </p>
      <p class="login-in">
        <group>
          <x-input title="密码" v-model="passwordVal">
            <img class="img-lock" slot="label" style="padding-right:10px;display:block;" src="../assets/icon/lock.png" width="24" height="24">
          </x-input>
        </group>
      </p>
      <p>
        <x-button class="login-button" action-type="button" @click.native="goLogin">登 录</x-button>
      </p>
      <p class="register-part">
        还没有账号，
        <router-link class="" to="/login">
          去注册
        </router-link>
      </p>
    </div>

    <div class="logout-part" v-else>
      <p>
        <x-button type="warn" class="logout-button" @click.native="goLogout">解除绑定</x-button>
      </p>
    </div>

  </div>
</template>

<script>
  import { Group, XButton, XInput, XHeader } from 'vux'

  export default {
    components: {
      XHeader,
      Group,
      XButton,
      XInput
    },
    data () {
      return {
        pageTitle: '登录',
        accountsVal: '',
        passwordVal: '',
        isLogin: false
      }
    },
    mounted () {
      if (this.$store.state.token.length > 0) {
        this.isLogin = true;
      }else{
        this.isLogin = false;
      }
    },
    methods: {
      goLogin () {
        this.$store.commit('login',{
          accounts: this.accountsVal,
          password: this.passwordVal
        });
      },
      goLogout () {
        this.$store.commit('logout',{});
        this.accountsVal = '';
        this.passwordVal = '';
      }
    }
  }
</script>

<style scoped lang="less">
  body{
    background: #ffffff;
  }
  .vux-header{
    z-index: 9;
    position: fixed;
    top: 0;
    width: 100%;
  }
  .login-part{
    width: 80%;
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%,-100%);
    overflow: hidden;
  }
  .login-in{
    margin: 15px 0px;
  }
  .register-part{
    text-align: center;
    display: none;
  }
  .login-button{
    background: #459FFB;
    color: #ffffff;
  }
  .register-part{
    color: #818181;
  }
  .register-part a{
    color: #459FFB;
  }
  .logout-part{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
</style>

import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // url : 'http://192.168.0.162:8666',
    url : 'http://app.ecms.gczj.com.cn/dev371',
    token: 'c15b2580c5a2485685ef9b3e17f1819c',
    // url : '',
    // token: '',
    userInfo: {},
    isLogin: false,
    openId: '',// 微信openId
    todoTabType: ''// 待办详情页回退时，待办页tab切换到之前状态
  },
  mutations: {
    // 登录
    login (state, payload) {

      axios({
        url: state.url+'/wechat/login/binding',
        method: 'post',
        transformRequest: [
          function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret;
          }
        ],
        data:{
          openid: state.openId,
          accounts: payload.accounts,
          password: payload.password
        }
      }).then((response) => {
        if(response.data){
          if(response.data.success === true){
            state.isLogin = true;
            state.userInfo = response.data.account;
            state.token = response.data.token;
            router.push({ name: 'Home'});
          }else if(response.data.success === false){
            state.isLogin = false;
          }
        }
        Vue.$vux.alert.show({
          title: response.data.msg
        });
        setTimeout(() => {
          Vue.$vux.alert.hide();
        }, 2000);
      }).catch((response) => {
        console.log(response);
      });

    },
    // 退出
    logout (state) {
      axios({
        url: state.url+'/wechat/login/unbind',
        method: 'get'
      }).then((response) => {
        state.isLogin = false;
        state.userInfo = {};
        state.token = '';
        Vue.$vux.alert.show({
          title: response.data.msg
        });
        setTimeout(() => {
          Vue.$vux.alert.hide();
          router.push({ name: 'Home'});
        }, 1000);
      }).catch((response) => {
        console.log(response);
      });
    },
    setStateVal (state,payload) {// 其他组件给vuex-state赋值
      state.url = payload.url;
      state.token = payload.token;
      state.userInfo.accounts = payload.userName;
    }
  }
})

export default store;


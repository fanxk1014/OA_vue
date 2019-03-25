<template>
  <div class="content">

    <div class="row1">
      <div class="col1">
        <grid>
          <grid-item link="/ecms">
            <div>
              <p class="title-font">ECMS系统</p>
              <img class="img-ecms" :src="baseUrl+'/app/src/assets/images/ecms.png'">
            </div>
          </grid-item>
        </grid>
      </div>
      <div class="col2">
        <p class="col2-1">
          <grid>
            <grid-item :link="{path:'/notice',query: {type: 'notice1'}}">
              <div>
                <p class="title-font">通知公告</p>
                <img class="img-notice" :src="baseUrl+'/app/src/assets/images/notice.png'" width="44" height="44">
              </div>
            </grid-item>
          </grid>
        </p>
        <p class="col2-2">
          <grid>
            <grid-item @click.native="openChart()">
              <div>
                <p class="title-font">管理员驾驶舱</p>
                <img class="img-pilot" :src="baseUrl+'/app/src/assets/images/pilot.png'" width="44" height="44">
              </div>
            </grid-item>
          </grid>
        </p>
      </div>
    </div>

    <div class="row2">
      <grid>
        <grid-item :link="{path:'/news',query: {type: 'notice2'}}">
          <div>
            <span class="title-font">公司新闻</span>
            <img class="img-news" :src="baseUrl+'/app/src/assets/images/news.png'">
          </div>
        </grid-item>
      </grid>
    </div>
  <div class="row3">
    <grid>
      <grid-item link="/attendance">
        <div>
          <span class="title-font">考勤打卡</span>
          <img class="img-news" :src="baseUrl+'/app/src/assets/images/work.png'">
        </div>
      </grid-item>
    </grid>
  </div>
  </div>
</template>

<script>
  import { Group, Cell, CellBox, Flexbox, FlexboxItem, Grid, GridItem, GroupTitle } from 'vux'
  import Vue from 'vue'

  var HomeListCom = Vue.extend({})

  Vue.component('home-list', HomeListCom)

  export default {
    name: 'HomeList',
    props: ['baseUrl'],
    components: {
      Group,
      Cell,
      CellBox,
      Flexbox,
      FlexboxItem,
      Grid,
      GridItem,
      GroupTitle
    },
    methods:{
      openChart(){
        this.$common.notFound();
      }
    }
  }
</script>

<style scoped lang="less">
  .content{
    padding: 10px;
    background: #ffffff;
  }
  .row1{
    font-weight: 600;
    font-size: 14px;
    display: flex;
    width: 100%;
    .col1{
      margin-right: 10px;
      width: 50%;
      float: left;
      .weui-grid{
        height: 220px;
        background: #cae5fd;
      }
      .title-font{
        color: #333333 !important;
      }
      p{
        margin: 0px 0px 5px 10px;
      }
      .img-ecms{
        width: 80%;
        float: right;
        margin: 28px 12px 10px;
      }
    }
    .col2{
      width: 50%;
      float: right;
      .col2-1{
        margin-bottom: 10px;
        .weui-grid{
          height: 104px;
          background: #fee8d6;
        }
        .title-font{
          vertical-align: top;
          color: #333333 !important;
          padding-left: 10px;
        }
        .img-notice{
          float: right;
          width: 60px;
          height: auto;
          position: relative;
          top: -5px;
        }
      }
      .col2-2{
        .weui-grid{
          height: 106px;
          background: #d4f1f6;
        }
        .title-font{
          vertical-align: top;
          color: #333333 !important;
          padding-left: 10px;
        }
        .img-pilot{
          float: right;
          width: 60px;
          height: auto;
          position: relative;
          top: -5px;
        }
      }
    }
  }
  .row2{
    display: flex;
    width: 100%;
    margin-top: 10px;
    .weui-grids{
      width: 100%;
    }
    .weui-grid{
      background: #fff5d8;
    }
    .title-font{
      color: #333333 !important;
      font-weight: 600;
      font-size: 14px;
      margin: 0px 0px 5px 10px;
    }
    .img-news{
      width: 50%;
      float: right;
      margin-top: 10px;
    }
  }
  .row3{
    display: flex;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 60px;
    .weui-grids{
      width: 100%;
    }
    .weui-grid{
      background: #d4f1f6;
    }
    .title-font{
      color: #333333 !important;
      font-weight: 600;
      font-size: 14px;
      margin: 0px 0px 5px 10px;
    }
    .img-news{
      width: 30%;
      float: right;
      margin-top: 10px;
      margin-right: 30px;
    }
  }
</style>

详情页
<template>
  <div>

    <group id="searchBar">
      <x-input title="搜索" placeholder="在此输入姓名" @on-click-clear-icon="clearSearchResult" v-model="checkTreeSearchVal">
        <x-button slot="right" @click.native="treeSearch" mini>搜索</x-button>
      </x-input>
    </group>
    <div id="searchResult">
      <ul>
        <li v-for="item in checkTreeSearchResult">
                  <span>
                    <x-button @click.native="addToTree(item)">{{item.name}}</x-button>
                  </span>
        </li>
      </ul>
    </div>

    <el-tree id="checkType"
             :data="treeData"
             :props="treeProps"
             ref="tree"
             node-key="id"
             show-checkbox
             @check-change="getCheckedNodes">
    </el-tree>

  </div>
</template>

<script>
  import { Group, Cell, CellBox, Flexbox, FlexboxItem } from 'vux'
  import Vue from 'vue'

  var HomeListCom = Vue.extend({})

  Vue.component('home-list', HomeListCom)

  export default {
    name: 'HomeList',
    components: {
      Group,
      Cell,
      CellBox,
      Flexbox,
      FlexboxItem
    }
  }
</script>

<style scoped lang="less">
  .flex-demo img{
    width: 60px;
    vertical-align: middle;
  }
  p{
    color: #000000;
  }

</style>

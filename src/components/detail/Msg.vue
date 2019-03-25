<template>

  <div id="detail-msg">
    <timeline>
      <timeline-item v-for="(item,key) in auditData" :key="key">
        <h4 :class="[item.stepStatus==1?'current-node':'']"> {{item.stepName}} </h4>
        <div class="timeline-part">
          <h4>
            {{item.operators[0]}} {{item.opinion}} {{item.workEndDate}}
          </h4>
          <p v-if="item.works.length>0">
            <h5 v-for="(childItem,key) in item.works">
          <p>
            {{childItem.operators[0]}} {{childItem.opinion}} {{childItem.workEndDate}}
          </p>
          </h5>
          </p>
        </div>
      </timeline-item>
    </timeline>
  </div>

</template>

<script>
  import { Flow, FlowState, FlowLine, Timeline, TimelineItem } from 'vux'
  import Vue from 'vue'

  var DetailMsgCom = Vue.extend({})

  Vue.component('detail-msg', DetailMsgCom)

  export default {
    name: 'DetailMsg',
    props: {
      auditData: Array
    },
    components: {
      Flow,
      FlowState,
      FlowLine,
      Timeline,
      TimelineItem
    },
    data () {
      return {
        baseUrl: this.$store.state.url
      }
    },
    mounted () {
    },
    methods: {

    }
  }
</script>

<style scoped lang="less">
  #detail-msg{
    width: 100%;
    margin-bottom: 56px;
    z-index: 1;
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

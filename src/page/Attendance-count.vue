<template>
    <div>
      <x-header :left-options="{showBack: true}">
        我的打卡记录
        <a slot="right" @click="goLogin()" v-if="!userName">
          <img class="icon" slot="label" src="../assets/icon/user-white.png" width="18" height="18">
          <!--<i class="iconfont icon-user1"></i>-->
        </a>
        <a slot="right" @click="goLogin()" v-if="userName">
          {{userName}}
        </a>
      </x-header>

      <div style="padding-top: 46px">
        <flexbox>
          <flexbox-item>
            <div class="flex-demo">
              {{thisWeek}}
              <br>
              {{thisWeekLabel}}     {{dateType|dateTypeFormatter}}     <!--通勤-->
            </div>
          </flexbox-item>
          <flexbox-item :span="2">
            <div class="text-center">
              <x-icon type="ios-search" size="30" @click.native="showPlugin"></x-icon>
            </div>
          </flexbox-item>
        </flexbox>
        <div class="timeline-demo">
          <timeline>
            <timeline-item v-for="(item,key) in attendanceRecordList" :key="key">
              <h4>{{item.signType|signType}}</h4>
              <p>打卡时间：{{item.signTime|time}}</p>
              <p>打卡地点：{{item.areaName}}</p>
              <!--   <p>备       注：{{item.remark}}</p>-->
              <p>打卡来源：{{item.source_from|source}}</p>
            </timeline-item>
          </timeline>
        </div>
        <div class="nodata" v-if="nodata">暂无数据</div>
      </div>

    </div>
</template>

<script>
  import { Flexbox, FlexboxItem, Divider, Timeline, TimelineItem, Datetime, XHeader,CellBox, Group, } from 'vux'
import { formatDateTime } from '../utils/utils'
export default {
    name: 'Attendance-count',
    data () {
      return {
        value9: true,
        thisWeek: '',
        thisWeekLabel: '',
        dateType: '',
        pluginMax: '',
        attendanceRecordList: [],
        eventOffDuty: {},  // 下班时间
        eventOnDuty: {},   // 上班时间
        nodata: false
      }
    },
    filters: {
      // 来源 0:电脑打卡 1:网络摄像头打卡 2:手机APP打卡 3:微信打卡 100:考勤机(密码)打卡 101:考勤机(指纹)打卡 102:考勤机(刷卡)打卡 115:考勤机(人脸)打卡 9001:系统检测
      source: function (value) {
        let result = ''
        if (value == '0') {
          result = '电脑打卡'
        } else if (value == '1') {
          result = '网络摄像头打卡'
        } else if (value == '2') {
          result = '手机APP打卡'
        } else if (value == '3') {
          result = '微信打卡'
        } else if (value == '100') {
          result = '考勤机(密码)打卡'
        } else if (value == '101') {
          result = '考勤机(指纹)打卡'
        } else if (value == '102') {
          result = '考勤机(刷卡)打卡'
        } else if (value == '115') {
        result = '考勤机(人脸)打卡'
      } else if (value == '9001') {
          result = '系统检测'
        }
        return result
      },
      time: function (value) {
        let time = formatDateTime(value)
        return time
      },
      signType: function (value) {
        // 打卡类型 8001:上午上班正常打卡 8002:上午上班迟到打卡 8003:下午上班正常打卡 8004:下午上班迟到打卡 8005:下午下班正常打卡 8041:上午早退 8042:下午早退 8051:上午旷工 8052:下午旷工 8061:工作日加班 8062:周末加班 8063:法定日加班 8091:未签到 8092:未签退
        let result = ''
        if (value == '8001') {
          result = '上午上班正常打卡'
        } else if (value == '8002') {
          result = '上午上班迟到打卡'
        } else if (value == '8003') {
          result = '下午上班正常打卡'
        } else if (value == '8004') {
          result = '下午上班迟到打卡'
        } else if (value == '8005') {
          result = '下午下班正常打卡'
        } else if (value == '8041') {
          result = '上午早退'
        } else if (value == '8042') {
          result = '下午早退'
        } else if (value == '8051') {
        result = '上午旷工'
      } else if (value == '8052') {
          result = '下午旷工'
        } else if (value == '8061') {
          result = '工作日加班'
        } else if (value == '8062') {
          result = '周末加班'
        } else if (value == '8063') {
          result = '法定日加班'
        } else if (value == '8091') {
          result = '未签到'
        } else if (value == '8092') {
          result = '未签退'
        }
        return result
      },
      dateTypeFormatter: function (value) {
        console.log(value)
        // 日期类型，1正常工作日，2正常周末，3法定假期，4法定上班
        let result = ''
        if (value == '1') {
          result = '正常工作日'
        } else if (value == '2') {
          result = '正常周末'
        } else if (value == '3') {
          result = '法定假期'
        } else if (value == '4') {
          result = '法定上班'
        }
        return result
      }
    },
    components: {
      Flexbox,
      FlexboxItem,
      Divider,
      Timeline,
      TimelineItem,
      Datetime, XHeader, CellBox, Group,
    },
    mounted () {
      let time = (new Date()).valueOf()
      this.pluginMax = this.thisWeek = formatDateTime(time).split(' ')[0]
      this.changeDate()
      this.getUserAttendanceRecordList()
  },
    methods: {
      showPlugin () {
        let that = this
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: this.thisWeek,
          endDate: this.pluginMax,
          onConfirm (val) {
            console.log('plugin confirm', val)
            that.thisWeek = val
            that.changeDate()
            that.getUserAttendanceRecordList()
          },
          onShow () {
            console.log('plugin show')
          },
          onHide () {
            console.log('plugin hide')
          }
        })
      },
      changeDate () {
        let getDate = new Date(this.thisWeek)
        let dateArray = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')
        let week = getDate.getDay()
        this.thisWeekLabel = dateArray[week]
      },
      // 获取信息

      getUserAttendanceRecordList () {
        this.$vux.loading.show({
          text: '加载中'
        })
        this.axios({
          url: this.$store.state.url + '/wechat/login/user',
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          console.log(response.data.account.id)
          this.axios({
            url: this.$store.state.url + '/app/getUserAttendanceRecordList?userId=' + response.data.account.id + '&year=' + this.thisWeek.split('-')[0] + '&month=' + this.thisWeek.split('-')[1] + '&day=' + this.thisWeek.split('-')[2],
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response) => {
            this.attendanceRecordList = response.data.attendanceRecordList
            this.dateType = response.data.dateType.type
            if (this.attendanceRecordList.length > 0) {
              this.nodata = false
            } else {
              this.nodata = true
            }
            this.$vux.loading.hide()
          }).catch((response) => {
            this.$vux.loading.hide()
          })
        }).catch((response) => {
          console.log(response)
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .vux-header{
    z-index: 100;
    position: fixed !important;
    top: 0;
    width: 100%;
  }

  .text-center{
     text-align: center;
    .vux-x-icon{
      fill: #459FFB;
    }
  }
  .flex-demo{
    padding: 5px 5px 5px 15px;
  }
  .vux-flexbox{
    background-color: white;
  }
  .nodata{
    text-align: center;
    line-height: 300px;
  }
</style>

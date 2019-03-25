<template>
    <div>
      <div :class="{allmapFixed : attendanceType}">
        <div id="allmap" ref="allmap" :style="{height: mapHeight + 'px'}"></div>
      </div>

      <div :style="{paddingTop: attendanceType ? '250px' : '0px'}">
        <div class="attendanceText">考勤打卡</div>
        <group>
          <!--   <cell title="姓名" :value="userName"></cell>
             <cell :title="timeLabel" :value="timeValue"></cell>-->
          <cell-box is-link @click.native="changeArea()">
            <flexbox>
              <flexbox-item :span="4"><div class="flex-demo home-list-title">
                <p class="item-p">考勤地点</p>
              </div>
              </flexbox-item>
              <flexbox-item><div class="flex-demo home-list-date">{{popupData}}</div></flexbox-item>
            </flexbox>
          </cell-box>
        </group>
        <group class="loactionAttendance" v-if="attendanceType">
          <cell :title='item.title' v-for="item in attendanceNearArea" @click.native="selectThisArea(item)">
            <div>
              <x-icon type="ios-checkmark-empty" size="30" :style="{opacity: item.select ? '1' : '0'}"></x-icon>
            </div>
          </cell>

        </group>

      </div>

      <!--<p class="text-center">定位：{{selectArea}} <a class="link" @click="reGetLocation()">重新定位</a></p>-->
      <div class="attendanceFooter">
        <flexbox>
          <flexbox-item>
            <div class="attendanceSelectWrapper" @click="reGetLocation()">
              <img class="attendanceIcon" src="../../assets/icon/address.png">
              重新定位
            </div>

          </flexbox-item>
          <flexbox-item style="text-align: center">
            <x-button mini type="primary" @click.native="appSign()">打卡</x-button>
            <x-button mini :link="{path:'/attendanceCount'}">记录</x-button>
          </flexbox-item>
        </flexbox>
      </div>


      <div v-transfer-dom>
        <popup v-model="areaCtrl">
          <!-- group already has a top border, so we need to hide header's bottom border-->
          <popup-header
            title="选择附近的考勤地点"
            :show-bottom-border="false"
            @on-click-left="areaCtrl = false"
            @on-click-right="areaCtrl = false"></popup-header>
          <group gutter="0">
            <radio :options="nearbyAddress" v-model="popupData" :title="nearbyAddress" @on-change="changePlace"></radio>
          </group>
        </popup>
      </div>
    </div>
</template>

<script>
  import { PopupHeader, Popup, XHeader, Group, Cell, CellBox, Flexbox, FlexboxItem, TransferDom, Radio, XTextarea, XButton, Tabbar, TabbarItem } from 'vux'
import { formatDateTime } from '../../utils/utils'
export default {
    name: 'Attendance-compoment',
    directives: {
      TransferDom
    },
    components: {
      XHeader, Group, Cell, CellBox, Flexbox, FlexboxItem, Radio, PopupHeader, Popup, XTextarea, XButton, Tabbar, TabbarItem
    },
    data () {
      return {
        baseUrl: this.$store.state.url,
        userName: false,
        lng: 113.35131293562,    // 经度
        lat: 23.147133650274,    // 纬度
        nearbyAddress: [],     // 保存在选择器里面的数据
        attendancePlaceList: [],   // 保存考勤地点的数据
        selectArea: {},
        areaCtrl: false,
        popupData: '',
        nowDate: '',
        timestamp: 0,
        timestampInterval: {},
        thisWeek: '',
        thisPlace: {},  // 选择的考勤地点
        thisPlaceHasChange: false,
        eventOffDuty: {},  // 下班时间
        eventOnDuty: {},   // 上班时间
        timeLabel: '',
        timeValue: '',  // 显示的时间
        canAppSign: false,  // 能否打卡
        userId: '',
        mapHeight: 0,  // 地图高度
        attendanceType: false, // 打卡类型  false位考勤打卡  true为不限范围打卡
        attendanceNearArea: [], // 定位打卡附近的地点
      }
    },
    mounted () {
      this.mapHeight = window.innerHeight - 187
      if (this.$store.state.userInfo.accounts) {
        this.userName = this.$store.state.userInfo.accounts
      };
       // this.getAttendanceInfo()

      this.axios({
        url: this.$store.state.url + '/wechat/login/user',
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((response) => {
        this.userId = response.data.account.id
         this.getLocation()
        //this.getAttendanceInfo()
      }).catch((response) => {
        console.log(response)
      })
      // this.getAttendanceInfo();
    },
    methods: {
      getLocation () {
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: (res) => {
            var ggPoint = new BMap.Point(res.longitude, res.latitude)
            var convertor = new BMap.Convertor()
            var pointArr = []
            pointArr.push(ggPoint)
            convertor.translate(pointArr, 1, 5, (data) => {
              if (data.status === 0) {
                console.log(data)
                this.lng = data.points[0].lng
                this.lat = data.points[0].lat
                this.getAttendanceInfo()
              }
            })
          },
          cancel: function (res) {
            console.log('去你的cancel', res)
          },
          fail: (res) => {
            console.log('去死fail', res)
          }
        })
      },
      goLogin () {
        this.$router.push({ name: 'Login'})
      },
        // 获取信息
      getAttendanceInfo () {
        console.log(this.lng, this.lat)
        this.$vux.loading.show({
          text: '加载中'
        })
        this.axios({
          url: this.$store.state.url + '/app/getAttendanceInfo?userId=' + this.userId,
          method: 'get',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          this.attendancePlaceList = response.data.attendancePlaceList
          this.eventOffDuty = response.data.eventOffDuty
          this.eventOnDuty = response.data.eventOnDuty
          response.data.attendancePlaceList.forEach((item, index) => {
            if (index == 0) {
              this.nearbyAddress.push(item.name)
              this.popupData = item.name
              this.thisPlace = item
            } else {
              this.nearbyAddress.push(item.name)
            }
          })
          this.changeMapHeight()

          this.$vux.loading.hide()
        }).catch((response) => {
          this.$vux.loading.hide()
        })
      },
        // 显示地图
      init_map () {
        let that = this
        var ggPoint = new BMap.Point(this.lng, this.lat)
        // 地图初始化
        that.bMap = new BMap.Map(this.$refs.allmap)
        that.bMap.centerAndZoom(ggPoint, 18)
        that.bMap.addControl(new BMap.NavigationControl())

        var pointArr = []
        pointArr.push(ggPoint)
        var marker = new BMap.Marker({lng: this.lng, lat: this.lat})
        var circle = new BMap.Circle({lng: that.thisPlace.longitude, lat: that.thisPlace.latitude}, that.thisPlace.hitCardDistance, {strokeColor: '#459FFB', fillColor: '#459FFB', strokeWeight: 1, strokeOpacity: 0.3}) // 创建圆
        that.bMap.addOverlay(marker)
        that.bMap.addOverlay(circle)            // 增加圆
        that.bMap.setCenter([{lng: this.lng, lat: this.lat}])
        var ggPointAfter = new BMap.Point(this.lng, this.lat)

        var gc = new BMap.Geocoder()
        that.attendanceNearArea = []
        gc.getLocation(ggPointAfter, function (rs) {
          console.log(rs)
          let building = ''
          if (rs.surroundingPois.length > 0) {
            building = rs.surroundingPois[0].title
          }
          //that.selectArea = rs.addressComponents.province + rs.addressComponents.city + rs.addressComponents.district + rs.addressComponents.street + building
          rs.surroundingPois.forEach((item, index) => {
            if (index == 0) {
              that.attendanceNearArea.push({
                select: true,
                title: item.title
              })
              that.nearAreaText = item.title
              that.selectArea = item.title
            } else {
              that.attendanceNearArea.push({
                select: false,
                title: item.title
              })
            }
          })
        })
        this.isIntoCircle()
      },
      changeArea () {
        this.areaCtrl = true
      },
        // 重新定位
      reGetLocation () {
        this.init_map()
      },
      changePlace (value, label) {
        if (!this.thisPlaceHasChange) {
          this.thisPlaceHasChange = true
          var ggPoint = new BMap.Point(this.lng, this.lat)
          this.bMap.centerAndZoom(ggPoint, 18)
        } else {
          this.popupData = value
          this.attendancePlaceList.forEach((item) => {
            if (item.name == value) {
              this.thisPlace = item
            }
          })
          this.changeMapHeight()
          this.areaCtrl = false
          this.bMap.clearOverlays()
          var marker = new BMap.Marker({lng: this.lng, lat: this.lat})
          var circle = new BMap.Circle({lng: this.thisPlace.longitude, lat: this.thisPlace.latitude}, this.thisPlace.hitCardDistance, {strokeColor: '#459FFB', fillColor: '#459FFB', strokeWeight: 1, strokeOpacity: 0.3}) // 创建圆
          this.bMap.addOverlay(marker)
          this.bMap.addOverlay(circle)            // 增加圆
          var ggPoint = new BMap.Point(this.lng, this.lat)
          this.bMap.centerAndZoom(ggPoint, 18)
          this.isIntoCircle()
        }
      },
        // 判断是否在圆里面
      isIntoCircle () {
        if (this.thisPlace.hitCardDistance == 0) {
          this.canAppSign = true
        } else {
          var pt = new BMap.Point(this.lng, this.lat)// 测试点
          var c = new BMap.Point(this.thisPlace.longitude, this.thisPlace.latitude) // 圆心
          var circle = new BMap.Circle(c, this.thisPlace.hitCardDistance)// 测试圆

          var result = BMapLib.GeoUtils.isPointInCircle(pt, circle)
          if (result) {
            this.canAppSign = true
          } else {
            this.canAppSign = false
          }
        }
      },
        // 打卡操作
      appSign () {
        if (!this.canAppSign) {
          this.$vux.alert.show({
            title: '您未进入考勤范围',
            content: '您未进入考勤范围'
          })
        } else {
          this.$vux.loading.show({
            text: '正在打卡中'
          })
          let area_name = ''
          if (this.thisPlace.hitCardDistance == 0) {
            area_name = this.popupData + '+' + this.selectArea
          } else {
            area_name = this.popupData
          }
          this.axios({
            url: this.$store.state.url + '/app/appSign?userId=' + this.userId + '&phone=' + '&source_from=3&longitude=' + this.lng + '&latitude=' + this.lat + '&area_name=' + area_name + '&remark=',
            method: 'get',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then((response) => {
            this.$vux.loading.hide()
            if (response.data.result == '0000') {
              this.$vux.alert.show({
                title: '打卡成功',
                content: '打卡成功'
              })
            } else {
              this.$vux.alert.show({
                title: '打卡失败',
                content: '打卡失败'
              })
            }
            console.log(response.data)
          }).catch((response) => {
            console.log(response)
          })
        }
      },
      // 看下是否选择了不限打卡范围
      changeMapHeight () {
        console.log(this.thisPlace)
        if (this.thisPlace.hitCardDistance != 0) {
          this.mapHeight = window.innerHeight - 187
          this.attendanceType = false
        } else {
          this.mapHeight = 250
          this.attendanceType = true
        }
        this.init_map()
      },
      // 选择了附近的某个地点
      selectThisArea (data) {
        this.attendanceNearArea.forEach((item) => {
          item.select = false
        })
        data.select = true
        this.selectArea = data.title
      },

    }
  }
</script>

<style scoped>
  .weui-cells{
    margin-top: 0 !important;
  }

  #allmap{
    height: 400px;
    overflow: hidden;
  }
  .vux-header{
    z-index: 9;
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
  .link{
    color: #45a8fb;
    display: inline-block;
  }
  .attendanceFooter{
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: white;
    padding: 5px 0;
  }
  .attendanceFooter .weui-btn_mini{
    margin-top: 2px;
  }
  .attendanceIcon{
    width: 30px;
    height: 30px;
    display: inline-block;
  }
  .attendanceSelectWrapper{
    position: relative;
    line-height: 45px;
    margin-left: 15px;
    padding-left: 35px;
  }
  .attendanceSelectWrapper img{
    width: 30px;
    height: 30px;
    display: inline-block;
    position: absolute;
    top: 7px;
    left: 0;
  }
  .attendanceText{
    background-color: white;
    padding: 10px 0 10px 15px;
    font-weight: bold;
  }
  .vux-x-icon {
    fill: green;
  }
  .cell-x-icon {
    display: block;
    fill: green;
  }
  .loactionAttendance .weui-cell{
    padding: 5px 15px;
  }
  .allmapFixed{
    position: fixed;
    height: 250px;
    z-index: 111;
    width: 100%;
    top: 46px
  }

</style>

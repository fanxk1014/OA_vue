import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home'
import Login from '@/page/Login'
import Ecms from '@/page/Ecms'
import Notice from '@/page/Notice'
import News from '@/page/News'
import Todo from '@/page/Todo'
import Done from '@/page/Done'
import Launch from '@/page/Launch'
import LaunchPages from '@/page/launchPages'
import Chart from '@/page/Chart'
import DonePages from '@/components/detail/DonePages'
import Detail from '@/page/Detail'
import Content from '@/page/Content'
import Seefile from '@/page/Seefile'
import Attendance from '@/page/Attendance'
import AttendanceCount from '@/page/Attendance-count'

Vue.use(Router)

export default new Router({
  routes: [
    {// 首页
      path: '/',
      name: 'Home',
      component: Home
    },
    {// 登录页
      path: '/login',
      name: 'Login',
      component: Login
    },
    {// ECMS系统
      path: '/ecms',
      name: 'Ecms',
      meta: {
        requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
      },
      component: Ecms
    },
    {// 通知公告
      path: '/notice',
      name: 'Notice',
      meta: {
        requireAuth: true
      },
      component: Notice
    },
    {// 新闻
      path: '/news',
      name: 'News',
      component: News
    },
    {// 通知公告、新闻-内容页
      path: '/content',
      name: 'Content',
      // meta: {
      //   requireAuth: true
      // },
      component: Content
    },
    {// 管理员驾驶舱
      path: '/chart',
      name: 'Chart',
      meta: {
        requireAuth: true
      },
      component: Chart
    },
    {// 待办事宜
      path: '/todo',
      name: 'Todo',
      meta: {
        requireAuth: true
      },
      component: Todo
    },
    {// 已办事宜
      path: '/done',
      name: 'Done',
      meta: {
        requireAuth: true
      },
      component: Done
    },
    {// 发起流程Menu
      path: '/launch',
      name: 'Launch',
      meta: {
        requireAuth: true
      },
      component: Launch
    },
    {// 发起流程内容页
      path: '/launchPages',
      name: 'LaunchPages',
      meta: {
        requireAuth: true
      },
      component: LaunchPages
    },
    {// 详情列表、流程意见、查看附件
      path: '/detail',
      name: 'Detail',
      meta: {
        requireAuth: true
      },
      component: Detail
    },
    {// 用于已办，仅显示已办内容
      path: '/donePages',
      name: 'donePages',
      meta: {
        requireAuth: true
      },
      component: DonePages
    },
    {//附件预览界面
      path: '/seefile',
      name: 'Seefile',
      meta: {
        requireAuth: true
      },
      component: Seefile
    },{//打卡
      path: '/attendance',
      name: 'Attendance',
      meta: {
        requireAuth: true
      },
      component: Attendance
    },{//打卡列表
      path: '/attendanceCount',
      name: 'AttendanceCount',
      meta: {
        requireAuth: true
      },
      component: AttendanceCount
    }

  ]
})

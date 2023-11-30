import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import User from '@/components/User'
import UserCurrent from '@/components/UserCurrent'
Vue.use(Router)

export default new Router({
  //history 需配置base
  mode: 'history',
  base: '/apps/supos-javademo',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/user/list',
      name: '用户列表',
      component: User
    },
    {
      path: '/user/current',
      name: '当前用户信息',
      component: UserCurrent
    }
  ]
})

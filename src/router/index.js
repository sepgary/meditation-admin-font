import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

  export const constantRoutes = [
    {
      path: '/login',
      component: () => import('@/views/login/index'),
      hidden: true
    },
  
    {
      path: '/404',
      component: () => import('@/views/404'),
      hidden: true
    },
  
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [{
        path: 'dashboard',
        name: '控制台',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '控制台', icon: 'dashboard' }
      }]
    },
    
    {
      path: '/user',
      component: Layout,
      redirect: '/user/list',
      meta: { title: '用户管理', icon: 'el-icon-s-tools' },
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('@/views/user/list'),
          meta: { title: '用户列表', icon: 'el-icon-s-tools' },
        },
        {
          path: 'userEvent',
          name: 'userEvent',
          component: () => import('@/views/user/userEvent'),
          meta: { title: '用户行为', icon: 'el-icon-s-tools' }
        },
        {
          path: 'userEvent',
          name: 'userEvent',
          component: () => import('@/views/user/userEvent'),
          meta: { title: '埋点统计', icon: 'el-icon-s-tools' }
        },
        {
          path: 'experiment',
          name: 'experiment',
          component: () => import('@/views/user/experiment'),
          meta: { title: '个性配置', icon: 'el-icon-s-tools' }
        }
      ]
    },

    {
      path: '/type',
      component: Layout,
      redirect: '/type/list',
      children: [
        {
          path: 'list',
          name: 'list',
          component: () => import('@/views/type/list'),
          meta: { title: '类型管理', icon: 'el-icon-s-tools' },
        },
        {
          path: 'typeData/:id(\\d+)',
          name: 'typeData',
          component: () => import('@/views/type/typeData'),
          meta: { title: '类型管理', icon: 'el-icon-s-tools' },
          hidden: true
        }
      ]
    },

    {
      path: '/course',
      component: Layout,
      redirect: '/course/list',
      children: [{
        path: 'list',
        name: 'list',
        component: () => import('@/views/course/list'),
        meta: { title: '课程管理', icon: 'el-icon-s-tools' }
      },
      {
        path: 'courseVoice/:id(\\d+)',
        name: 'courseVoice',
        component: () => import('@/views/course/courseVoice'),
        meta: { title: '课程管理', icon: 'el-icon-s-tools' },
        hidden: true
      }]
    },{
      path: '/voice',
      component: Layout,
      redirect: '/voice/list',
      children: [{
        path: 'list',
        name: 'list',
        component: () => import('@/views/voice/list'),
        meta: { title: '音频管理', icon: 'el-icon-s-tools' }
      }]
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
  ]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

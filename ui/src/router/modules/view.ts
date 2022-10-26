import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const viewRouter: RouteConfig = {
  path: '/views',
  component: Layout,
  redirect: '/views/SAS',
  name: 'Views',
  meta: {
    title: 'views',
    icon: 'nested'
  },
  children: [
    {
      path: 'SAS',
      redirect: '/views/SAS/SALES_FORECAST',
      name: 'SAS',
      meta: {
        title: 'SAS'
      },
      children: [
        {
          path: 'SALES_FORECAST',
          component: () => import('@/views/view/index.vue'),
          name: 'SALES_FORECAST',
          meta: {
            title: 'SALES_FORECAST',
            roles: ['M22'] // or you can only set roles in sub nav
          }
        },
        {
          path: 'test',
          component: () => import('@/views/view/index.vue'),
          name: 'test',
          meta: {
            title: 'test',
            roles: ['M22'] // or you can only set roles in sub nav
          }
        }
      ]
    },
    {
      path: 'CDR',
      redirect: '/viewRoutes/CDR',
      name: 'CDR',
      meta: {
        title: 'CDR'
      },
      children: [
        {
          path: 'test',
          component: () => import(/* webpackChunkName: "menu1-3" */ '@/views/view/index.vue'),
          name: 'test',
          meta: {
            title: 'test1',
            roles: ['M22'] // or you can only set roles in sub nav
          }
        },
        {
          path: 'test2',
          component: () => import(/* webpackChunkName: "menu1-3" */ '@/views/view/index.vue'),
          name: 'test2',
          meta: {
            title: 'test2',
            roles: ['M22'] // or you can only set roles in sub nav
          }
        }
      ]
    }
  ]
}

export default viewRouter

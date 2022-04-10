import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/plate/0',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      title: "岛民岛"
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/post/:postId',
    name: 'Post',
    component: () => import('../views/Post.vue'),
    meta: {
      title: "看串中"
    }
  },
  {
    path: '/plate/:plateId',
    name: 'Plate',
    component: () => import('../views/Plate.vue'),
    meta: {
      title: "岛民岛"
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: "在？看看饼？"
    }
  },
  {
    path: '/sageList',
    name: 'SageList',
    component: () => import('../views/SageList.vue'),
    meta: {
      title: "看看你都干了什么？"
    }
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('../views/404.vue'),
    meta: {
      title: "你想看什么辣！"
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string
  next()
})

export default router

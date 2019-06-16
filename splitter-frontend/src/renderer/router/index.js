import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/pages/Index').default
    },
    {
      path: 'upload',
      name: 'upload',
      component: require('@/pages/Upload').default
    },
    {
      path: 'gallery',
      component: require('@/pages/Gallery').default,
      name: 'gallery',
      meta: {
        keepAlive: true
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

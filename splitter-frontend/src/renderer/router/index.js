import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: require('@/pages/IndexPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

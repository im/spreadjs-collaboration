import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Spread from 'components/views/spread'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'index',
        redirect: '/spread'
    },
    {
        path: '/spread',
        name: 'spread',
        component: Spread
    }
]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router

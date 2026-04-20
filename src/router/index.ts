import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PointsView from '../views/PointsView.vue'
import GoalieLeadersView from '../views/GoalieLeadersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/points',
      name: 'points',
      component: PointsView
    },
    {
      path: '/goalies',
      name: 'goalies',
      component: GoalieLeadersView
    }
  ]
})

export default router

import router from '@/router'
import { getTokenInCookie } from './auth'
// 权限判断

const WHITE_LIST = ['/login', '/404']
router.beforeEach((to, from, next) => {
  const token = getTokenInCookie()
  if (token) {
    next()
    return
  }
  if (WHITE_LIST.includes(to.path)) {
    next()
    return
  }

  next('/login')
})

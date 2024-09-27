
import { loginAPI } from '@/api/user'
import { setTokenInCookie, getTokenInCookie, removeTokenInCookie } from '@/utils/auth'

export default {
  namespaced: true, // 命名空间
  state: () => {
    return {
      userInfo: null,
      token: getTokenInCookie() || ''
    }
  },
  mutations: {
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    clearUserInfo(state) {
      state.userInfo = null
      state.token = ''
    },
    getTokenInVuex(state) {
      return state.token
    },
    setTokenInVuex(state, token) {
      state.token = token
    },
    // 设置token
    setUserToken(state, token) {
      // 一份存vuex
      state.token = token
      console.log(state.token)
      // 一份存cookie
      setTokenInCookie(token)
    },
    // 清除token
    clearUserToken(state) {
      state.token = ''
      removeTokenInCookie()
    }

  },
  actions: {
    async userLoginAction(ctx, data) {
      const res = await loginAPI(data)
      ctx.commit('setUserToken', res.data.token)
    }
  }
}

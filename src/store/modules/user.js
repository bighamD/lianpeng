import { getToken } from '@/api/common'
import { setToken } from '@/utils/auth'
import { userInfo } from '@/api/user'

const state = {
  token: '',
  userId: undefined,
  userData: null
}

const mutations = {
  SET_USER: (state, data) => {
    state.userData = data
    state.userId = data.id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  setAuthUrl({ commit }, url) {
    var appid = 'wx5e1ff4040197f1f1'
    window.location.href =
            'https://open.weixin.qq.com/connect/oauth2/authorize?' +
            'appid=' +
            appid +
            '&redirect_uri=' +
            url +
            '&response_type=code&' +
            'scope=snsapi_userinfo&state=123&connect_redirect=1#wechat_redirect'
  },
  getSecurityData({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      getToken(data).then(async response => {
        console.log(response)
        if (response.data.code === 1) {
          commit('SET_TOKEN', response.data.data.token)
          setToken({
            token: response.data.data.token,
            store_id: data.store_id
          })
          try {
            await dispatch('getUserData')
            resolve()
          } catch (e) {
            console.log('错误' + e)
          }
        } else {
          console.log('SET_TOKEN失败' + response.data)
          reject(response.data)
        }
      })
    })
  },
  // 获取用户信息
  getUserData({ commit }) {
    return new Promise((resolve, reject) => {
      userInfo({}).then(response => {
        if (response.data.code === 1) {
          commit('SET_USER', response.data.data)
          console.log('进入用户信息', response.data.data)
          resolve(response.data.data)
        } else {
          console.log('用户信息BUG', response.data)
          reject(response.data)
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

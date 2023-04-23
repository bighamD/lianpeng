import { storeDetails } from '@/api/store'

const state = {
  storeData: null
}

const mutations = {
  SET_DATA: (state, data) => {
    state.storeData = data
  }
}

const actions = {
  // 获取商户信息
  getStoreData({ commit }) {
    return new Promise((resolve, reject) => {
      storeDetails({}).then(response => {
        if (response.data.code === 1) {
          commit('SET_DATA', response.data.data)
          console.log('商户信息', response.data.data)
          resolve(response.data.data)
        } else {
          console.log('进入商户信息BUG', response.data)
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

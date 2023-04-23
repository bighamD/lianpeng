const state = {
  routeName: '',
  headList: ''
}

const mutations = {
  SET_ROUTE: (state, data) => {
    state.routeName = data
  },
  SET_HEAD_LIST: (state, list) => {
    state.headList = list
  }
}

const actions = {
  updateRoute({ commit }, name) {
    commit('SET_ROUTE', name) // 路由名称
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

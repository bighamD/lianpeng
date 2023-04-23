const getters = {
  token: state => state.user.token,
  userData: state => state.user.userData,
  userId: state => state.user.userId,
  routeName: state => state.route.routeName,
  headList: state => state.route.headList,
  storeData: state => state.index.storeData
}
export default getters

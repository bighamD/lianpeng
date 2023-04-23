import cache from '@/utils/cache'
const TokenKey = 'User-Token-V6'

export function getToken() {
  return cache.getItem(TokenKey)
  // var test = { store_id: 'hyhwlm', token: 'BB8C5CE8C-C893-7476-80D4-4CFC5778D9CE' } // 账号1 id: oXE8Z4xhb1BbL1jl_OG-93hdjXFA_29 队员
  // return test
}

export function setToken(token) {
  return cache.setItem({
    name: TokenKey,
    value: token,
    expires: 259200 // 3天
    // expires: 10
  })
}

export function removeToken() {
  return cache.removeItem(TokenKey)
}

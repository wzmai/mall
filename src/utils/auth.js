import Cookies from 'js-cookie'

const TokenKey = 'Member-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  // 清掉session数据
  sessionStorage.clear()
  return Cookies.remove(TokenKey)
}

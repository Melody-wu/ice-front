import {
  removeCookie
} from './cookie';
import {
  ACCESS_TOKEN,
  TOKEN_TYPE
} from '../common/constant'
/**
 * 登出
 */
export const logout = () => {

  const token = getToken();

  if (token) {
    removeAccessToken();
    localStorage.clear();
    sessionStorage.clear();
    console.log('logout === ', `${API_HOST}/oauth/logout?${ACCESS_TOKEN}=${token}`)
    window.location = `${API_HOST}/oauth/logout?${ACCESS_TOKEN}=${token}`;
  } else {
    console.log('登录token => 无')
  }

};
/**
 * 移除token
 */
export const removeAccessToken = () => {
  const option = {
    path: '/',
  };
  removeCookie(ACCESS_TOKEN, option);
  removeCookie(TOKEN_TYPE, option);
};


const TONKEN_NAME =  "zf_token";

// 获取token
const getToken = () => localStorage.getItem(TONKEN_NAME);

// 设置token
const setToken = (value) => localStorage.setItem(TONKEN_NAME, value);

// 删除token
const removeToken = () => localStorage.removeItem(TONKEN_NAME);

// 是否登录
const isAuth = () => !!getToken();

export {getToken, setToken, isAuth, removeToken}
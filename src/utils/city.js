const TOKEN_NAME = "zf_city";

// 获取当前定位城市
const getCity = () => JSON.parse(localStorage.getItem(TOKEN_NAME)) || {};

// 设置当前定位城市
const setCity = (value) => JSON.stringify(localStorage.setItem(TOKEN_NAME, value));

export { getCity, setCity };

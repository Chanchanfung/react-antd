import axios from "axios";
import {BASE_URL} from './url';
import {getToken, removeToken} from "./auth";


const API = axios.create({
    baseURL: BASE_URL,
});

// 添加请求拦截器
API.interceptors.request.use(config => {
    const { url } = config;
    if (
        url.startsWith("/user") &&
        !url.startsWith("/user/login") &&
        !url.startsWith("/user/registered")
    ) {
        // 添加请求头
        config.headers.Authorization = getToken();
    }
    return config;
});

// 添加响应拦截器
API.interceptors.response.use( response => {
    const { status } = response.data;
    if (status === 400 ) {
        // token失效
        removeToken();
    }
    return response;
})

export {API};


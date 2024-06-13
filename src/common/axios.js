import axios from "axios";
import qs from "qs";
import auth from "./auth";
import { getBaseUrl } from "../common/utils";
import { MessageBox, Message } from "element-ui";

// axios 配置
axios.defaults.timeout = 5000;
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
//axios.defaults.baseURL = 'http://localhost:8008';
axios.defaults.baseURL = getBaseUrl(window.location.href);
axios.defaults.headers.common[ 'authUid' ] = auth.getUid();
axios.defaults.headers.common[ 'authSid' ] = auth.getSid();

//POST传参序列化
axios.interceptors.request.use((config) => {
  // if (config.method === 'post') {
  //   config.data = qs.stringify(config.data);
  // }
  return config;
},
  (error) => {
  return Promise.reject(error);
});

axios.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 假设你使用的是JWT token
  }
  return config;
}, error => {
  // 处理请求错误
  return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    Message({ type:"error", message: error.response.data.message});
    return Promise.reject(error);
  });

export function fetch (url, config = { method: 'get' }) {
  return axios.request({ ...config, url })
  // return new Promise((resolve, reject) => {
  //   axios.request({ ...config, url })
  //     .then(response => {
  //       resolve(response.data);
  //     }, err => {
  //       reject(err);
  //     })
  //     .catch((error) => {
  //       reject(error)
  //     })
  // })
}

export default axios

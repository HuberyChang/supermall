import Axios from "axios";

const token = window.sessionStorage.getItem('token')

// request返回一个promise对象
export function request(config) {
  const instance = Axios.create({
    baseURL: "http://152.136.185.210:8000/api/w6",
    timeout: 5000,
    headers: {
      Authorization: token
    }
  })

  // axios 的拦截器
  // 请求拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => {
    console.log(err);
  })

  // 响应拦截器
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  // 查看源码，返回promise对象
  return instance(config)
}

import axios, {type AxiosResponse} from "axios";//响应回来数据的类型
import {ElMessage, ElMessageBox} from "element-plus";
import pinia from "@/stores/index";
import {useUserInfoStore} from "@/stores/userInfo";

/* 定义response对象的data接口 */
interface ResponseData<T> {
  code: number;
  data: T;
  message: string;
}

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL,//根路径
  timeout: 50000,
});


// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    //获取pinia中的token
    const userInfoStore = useUserInfoStore();
    const token: string = userInfoStore.token;
    //将token添加到请求头上
    if (token) {
      (<any>config.headers)["token"] = token;
    }
    return config;
  },
);

// 添加响应拦截器
service.interceptors.response.use(
  /* 约束一下response */
  async (response: AxiosResponse<ResponseData<any>>) => {
    // 对响应数据做点什么
    const res = response.data;
    if (res.code !== 20000 && res.code !== 200) { /* 成功数据的code值为20000/200 */
      // 统一的错误提示
      ElMessage({
        message: (typeof res.data == "string" && res.data) || res.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // `token` 过期或者账号已在别处登录
      if (response.status === 401) {
        const storeUserInfo = useUserInfoStore(pinia);
        await storeUserInfo.reset();
        window.location.href = "/"; // 去登录页
        await ElMessageBox.alert("你已被登出，请重新登录", "提示", {});
        // .then(() => {
        // })
        // .catch(() => {
        // });
      }
      return Promise.reject(service.interceptors.response);
    } else {
      return res.data; /* 返回成功响应数据中的data属性数据 */
    }
  },
  (error) => {
    // 对响应错误做点什么
    if (error.message.indexOf("timeout") != -1) {
      ElMessage.error("网络超时");
    } else if (error.message == "Network Error") {
      ElMessage.error("网络连接错误");
    } else {
      if (error.response.data) ElMessage.error(error.response.statusText);
      else ElMessage.error("接口路径找不到");
    }
    return Promise.reject(error);
  },
);

export default service;

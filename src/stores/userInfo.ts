import {defineStore} from "pinia";
import {getToken, removeToken, setToken} from "@/utils/token-utils";//本地token
import type {UserInfoState} from "./interface";//引入用户信息对象的类型，实际上是一个接口
import {ElMessage} from "element-plus";
import {staticRoutes} from "@/router/routes";//引入静态路由
import {loginApi, logoutApi, getUserInfoApi} from "@/api/acl/login";
import type {userInfoModel} from "@/api/acl/model/loginModel";

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore("userInfo", {

  state: (): UserInfoState => ({
    token: getToken() as string,
    name: "",
    avatar: "",
    // menuRoutes: [],
    menuRoutes: staticRoutes,
  }),

  actions: {
    //用户登录
    async login(username: string, password: string) {
      const result = await loginApi(username, password);
      const token = result.token;
      setToken(token);
      this.token = token;
    },

    //获取用户信息
    async getInfo() {
      const userInfo: userInfoModel = await getUserInfoApi();
      this.name = userInfo.name;
      this.avatar = userInfo.avatar;
      ElMessage({//提示信息
        message: "获取用户信息成功",
        type: "success",
      });
    },
    //退出
    async reset() {
      if (this.name) {
        await logoutApi();
        // 删除local中保存的token
        removeToken();
        // 提交重置用户信息的mutation
        this.token = "";
        this.name = "";
        this.avatar = "";
      } else {
        // 删除local中保存的token
        removeToken();
        // 提交重置用户信息的mutation
        this.token = "";
        this.name = "";
        this.avatar = "";
      }

    },
  },
});

import router from "@/router";
import {cloneDeep} from "lodash";
import {defineStore} from "pinia";
import {getToken, removeToken, setToken} from "@/utils/token-utils";//本地token
import type {RouteRecordRaw} from "vue-router";
import type {UserInfoState} from "./interface";//引入用户信息对象的类型，实际上是一个接口
import {ElMessage} from "element-plus";
import {allAsyncRoutes, staticRoutes, anyRouter} from "@/router/routes";//引入静态路由
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
    menuRoutes: [],
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
      const userAllAsyncRoute = cloneDeep(allAsyncRoutes);//lodash深拷贝，防止切换用户时出现路由不匹配的情况
      const userInfo: userInfoModel = await getUserInfoApi();//获取用户信息，包含用户路由权限信息
      const userRouters = this.getAllAsyncRoutes(userInfo.routes as string[], userAllAsyncRoute);//得到用户的路由信息
      this.addRouters([...userRouters, ...anyRouter]);//动态添加路由
      this.menuRoutes = [...staticRoutes, ...userRouters];//赋值
      this.name = userInfo.name;
      this.avatar = userInfo.avatar;
    },
    //退出
    async reset() {
      if (this.name) {
        await logoutApi();
      }
      // 删除local中保存的token
      removeToken();
      // 提交重置用户信息的mutation
      this.token = "";
      this.name = "";
      this.avatar = "";
    },

    /**
     * 动态获取路由
     * @param routes 用户路由权限，后台返回的数组
     * @param allAsyncRoutes 本地配置的异步路由
     */
    getAllAsyncRoutes(routes: string[], allAsyncRoutes: RouteRecordRaw[]) {
      return allAsyncRoutes.filter((route) => {
        if (routes.indexOf(route.name as string) == -1) {//返回用户匹配的路由
          return false;
        }
        if (route.children && route.children.length > 0) {//有没有子路由
          route.children = this.getAllAsyncRoutes(routes, route.children);
        }
        return true;
      });
    },
    /**
     * 动态添加路由
     * @param routers 路由数组
     */
    addRouters(routers: RouteRecordRaw[]) {
      routers.forEach((route: RouteRecordRaw) => {
        router.addRoute(route);//addRoute方法
      });
    },
  },
});

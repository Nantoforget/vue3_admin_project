//定义api接口函数
import request from "@/utils/request";//引入封装的axios
import type {userInfoModel, loginModel} from "@/api/acl/model/loginModel";//引入返回数据的类型

//使用枚举的方式定义接口地址
enum Api {
  Login = "/admin/acl/index/login",//登陆地址
  Logout = "/admin/acl/index/logout",//登出地址
  GetUserInfo = "/admin/acl/index/info", //获取用户信息
}

//api接口函数,请求方式的范式<>，第二项填写返回数据的类型，及自己定义的接口类型
//request.post<any,这里写返回值的类型>()

//登录
export const loginApi = (username: string, password: string) => request.post<any, loginModel>(Api.Login, {username, password});

//登出
export const logoutApi = () => request.post<any, void>(Api.Logout);

//获取用户信息
export const getUserInfoApi = () => request.get<any, userInfoModel>(Api.GetUserInfo);

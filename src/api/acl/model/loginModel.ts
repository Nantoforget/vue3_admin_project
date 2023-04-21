//定义接口

//用户登录
export interface loginModel {
  token: string;
}

//用户信息
export interface userInfoModel {
  name: string,//用户名字昵称
  avatar: string,//头像信息
  //以下三个是权限相关的数组
  buttons: string[],//按钮名字数组
  roles: string[],//角色信息数组
  routes: string[],//路由名字信息数组

}

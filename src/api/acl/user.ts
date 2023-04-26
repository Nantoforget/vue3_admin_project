//引入封装的axios
import type {doAssignRoleModel, userAndAllRoleModel, userModel, useRolesModel, UserPageLimitModel} from "@/api/acl/model/userModel";
import request from "@/utils/request";

//枚举请求地址
enum Api {
  DeleteUser = "/admin/acl/user/batchRemove",//根据id列表删除用户（批量删除）
  DoAssignRole = "/admin/acl/user/doAssignRole",//根据用户分配角色
  GetUserById = "/admin/acl/user/get",//获取用户信息
  RemoveUserById = "/admin/acl/user/remove",//删除用户
  SaveUser = "/admin/acl/user/save",//添加用户
  GetUserDoAssign = "/admin/acl/user/toAssign",//根据用户id获取用户角色信息
  UpdateUser = "/admin/acl/user/update",//修改用户信息
  GetUserPageLimit = "/admin/acl/user",//根据分页获取全部用户信息
}


//请求函数

//根据id列表删除用户（批量删除）
export const deleteUserByIdsApi = (ids: string[]) => request.delete<any, null>(Api.DeleteUser, ids as any);
//根据用户分配角色
export const doAssignRoleWithUserApi = (userRole: doAssignRoleModel) => request.post<any, null>(Api.DoAssignRole, userRole);
//获取用户信息
export const getUserByUserIdApi = (id: string) => request.get<any, useRolesModel>(Api.GetUserById + `/${id}`);
//删除用户
export const removeUserByUserIdApi = (id: string) => request.delete<any, null>(Api.RemoveUserById + `/${id}`);
//添加用户
export const saveUserApi = (userInfo: userModel) => request.post<any, null>(Api.SaveUser, userInfo);
//根据用户id获取用户角色信息
export const getUserDoAssignByUserIdApi = (userId: string) => request.get<any, userAndAllRoleModel>(Api.GetUserDoAssign + `/${userId}`);
//修改用户信息
export const updateUserApi = (userInfo: userModel) => request.put<any, null>(Api.UpdateUser, userInfo);
//根据分页获取全部用户信息
export const getUserByPageLimitApi = (page: number, limit: number, username?: string) => request.get<any, UserPageLimitModel>(Api.GetUserPageLimit + `/${page}/${limit}?username=${username ? username : ""}`);



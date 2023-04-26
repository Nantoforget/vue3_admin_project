//引入二次封装的axios
import type {roleByIdModel, roleModel, rolePageLimitModel} from "@/api/acl/model/roleModel";
import request from "@/utils/request";


//根据id列表删除角色
export const batchRemoveByIdsApi = (ids: string[]) => {
  return request.delete<any, null>(`/admin/acl/role/batchRemove`, ids as any);
};

//获取角色
export const getRoleByIdApi = (id: string) => {
  return request.get<any, roleByIdModel>(`/admin/acl/role/get/${id}`);
};

//删除角色
export const removeRoleByIdApi = (id: string) => {
  return request.delete<any, null>(`/admin/acl/role/remove/${id}`);
};

//修改角色或新增角色
export const saveOrUpdateRoleApi = (role: roleModel) => {
  if (role?.id) {
    return request.put<any, null>(`/admin/acl/role/update`, role);
  } else {
    return request.post<any, null>(`/admin/acl/role/save`, role);
  }
};


//获取角色分页列表
export const getRoleListByPageLimitApi = (page: number, limit: number, keyword?: string) => {
  return request.get<any, rolePageLimitModel>(`/admin/acl/role/${page}/${limit}?roleName=${keyword ? keyword : ""}`);
};

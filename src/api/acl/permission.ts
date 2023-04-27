import type {doAssignMoAclModel, getPermissionModel, permissionListModel, permissionModel} from "@/api/acl/model/permissionModel";
import request from "@/utils/request";


//获取菜单
export const getPermissionApi = () => {
  return request.get<any, getPermissionModel>(`/admin/acl/permission`);
};
//给角色分配权限
export const doAssignApi = (permissionVo: doAssignMoAclModel) => {
  return request.post<any, null>(`/admin/acl/permission/doAssign?roleId=${permissionVo.roleId}&permissionId=${permissionVo.permissionIdString}`);
};

//递归删除菜单
export const removePermissionApi = (id: string) => {
  return request.delete<any, null>(`/admin/acl/permission/remove/${id}`);
};

//新增菜单
export const savePermissionApi = (data: permissionModel) => {
  return request.post<any, null>(`/admin/acl/permission/save`, data);
};
//根据角色获取菜单
export const toAssignByRoleId = (roleId: string) => {
  return request.get<any, getPermissionModel>(`/admin/acl/permission/toAssign/${roleId}`);
};
//修改菜单
export const updatePermissionApi = (data: permissionModel) => {
  return request.put<any, null>(`/admin/acl/permission/update`, data);
};
//添加或修改
export const saveOrUpdateApi = (data: permissionModel) => {
  if (data.id) {
    return request.put<any, null>(`/admin/acl/permission/update`, data);
  } else {
    return request.post<any, null>(`/admin/acl/permission/save`, data);
  }
};


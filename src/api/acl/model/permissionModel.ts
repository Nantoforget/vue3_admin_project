//菜单数据类型

//菜单对象的数据类型
export interface permissionModel {
  id?: string,
  gmtCreate?: string,
  gmtModified?: string,
  deleted?: boolean,
  pid?: string,//菜单id
  name: string,//名称
  code: string,
  toCode?: string,
  type?: number,
  status?: string,
  level: number,//几级菜单
  children?: permissionListModel,//子菜单
  select?: boolean,
}

//菜单对象数组
export type permissionListModel = permissionModel[];

//获取菜单数组
export interface getPermissionModel {
  children: permissionListModel;
}

//分配角色的数据类型
export interface doAssignMoAclModel {
  permissionIdList: string[],
  roleId: string
}

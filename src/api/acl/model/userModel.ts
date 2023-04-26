//用户权限数据类型

//用户对象数据类型
export interface userModel {
  id?: string,
  gmtCreate?: string,//创建时间
  gmtModified?: string,//更新时间
  deleted?: boolean,//是否删除
  username: string,//用户名
  password?: string,//用户密码
  nickName: string,//用户昵称
  salt?: null,
  token?: null,
  roleName?: string,//用户角色
}

//用户对象数组数据类型
export type userListModel = userModel[]


//分页数据类型
export interface UserPageLimitModel {
  total: number,//总条数
  items: userListModel//用户数组
}

//用户角色信息对象类型
export interface userRoleModel {
  id?: string,
  gmtCreate: string,//创建时间
  gmtModified: string,//更新时间
  deleted: boolean,//删除
  roleName: string,//用户角色(多个角色拼接在一起成为string，中间用逗号(,)分开)
  remark: null,
  isChecked?: number
}

//用户角色信息对象数组类型
export type userRolesListModel = userRoleModel[];

//用户的角色和全部角色
export interface userAndAllRoleModel {
  assignRoles: userRolesListModel,//用户角色
  allRolesList: userRolesListModel//全部角色
}

//管理用户角色权限数据类型
export interface useRolesModel {
  item: userModel;//只是用户自己的
}

//根据用户分配角色
export interface doAssignRoleModel {
  roleIdList: string[],//角色名称
  userId: string//用户id
}



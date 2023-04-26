//角色数据类型

//角色信息对象数据类型
export interface roleModel {
  id?: string,//角色id
  gmtCreate?: string,//船舰时间
  gmtModified?: string,//修改时间
  deleted?: false,
  roleName: string,//名称
  remark?: null,
  showIn?: boolean,//用于显示input框，自定义的
  value?: string,//用于绑定input框的值，自定义的
}

//角色对象数组
export type roleListModel = roleModel[]

//分页数据类型
export interface rolePageLimitModel {
  total: number,//总条数
  items: roleListModel
}

//根据id获得角色对象
export interface roleByIdModel {
  item: roleModel;
}


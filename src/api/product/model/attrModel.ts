//商品属性数据的类型

//商品属性类型
export interface attrModel {
  id?: number,
  valueName: string,
  attrId?: number
}

//商品属性值的类型
export type attrValueListModel = attrModel[]

//商品信息的类型
export interface attrInfoListModel {
  id?: number,
  attrName: string,
  categoryId: number,
  categoryLevel: number,
  attrValueList: attrValueListModel
}

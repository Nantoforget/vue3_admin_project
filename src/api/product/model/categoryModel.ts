//定义商品分类的数据类型

export interface categoryModel {//分类数据的类型
  id: number,
  name: string,
  category1Id?: number | undefined,
  category2Id?: number | undefined,
  category3Id?: number | undefined
  hasChild?: boolean,//是否有子分类
  level?: number,//分类级别的数字表示
}

export type categoryListModel = categoryModel[];//分类数据数组的数据类型

//spu页面数据的类型

//spu属性对象
export interface spuAttrModel {
  id: number,//属性id
  name: string,//属性名称
}

//spu属性对象数组
export type spuAttrListModel = spuAttrModel[];

//spu数据对象
export interface spuInfoModel {
  id?: number,//spu信息数据id
  spuName: string,//名字
  description: string,//spu描述
  category3Id: number,//3级分类的id
  tmId?: number,//品牌id
  // tmName?: string,//品牌名称
  spuSaleAttrList: spuSaleAttrListModel,//销售属性列表
  spuImageList: spuImageListModel//图片列表
}

//spu数据对象数组
export type spuInfoListModel = spuInfoModel[];

//spu销售属性对象
export interface spuSaleAttrModel {
  id?: number,//id
  spuId: number,//spu的id
  baseSaleAttrId: number,//销售属性id
  saleAttrName: string,//名字
  spuSaleAttrValueList: spuSaleAttrValueListModel//销售属性列表
  value?: string,//选择的值，自己定义的，提交数据时要删除
}

//spu销售属性对象数组
export type spuSaleAttrListModel = spuSaleAttrModel[]

//spu销售属性值对象
export interface spuSaleAttrValueModel {
  baseSaleAttrId: number,//销售属性id
  id?: number,//id
  isChecked: null,//是否选中
  saleAttrName: string,//属性名称
  saleAttrValueName: string,//属性值名称
  spuId: number,//spuId
}

//spu销售属性值对象数组
export type spuSaleAttrValueListModel = spuSaleAttrValueModel[]

//spu数据图片对象
export interface spuImageModel {
  id?: number,//id
  imgName: string,//图片名称
  imgUrl: string,//图片地址
  spuId: number//spuId
  isDefault?: string,//是否是默认图片，自定义的
  spuImgId?: number,//spuId自定义的
}

//spu数据图片对象数组
export type spuImageListModel = spuImageModel[]

//分页列表数据类型
export interface pageModel {
  records: spuInfoListModel,//spu数据列表
  total: number,//总条数
  size: number,//每页多少条
  current: number,//当前第几页
  searchCount: boolean,//能否被搜索
  pages: number//总共多少页
}


//sku数据类型

//sku对象
export interface skuInfoModel {
  id?: number,
  spuId: number,
  price: number,//价格
  skuName: string,//sku名称
  skuDesc: string,//描述
  weight: string,//重量
  tmId: number,//品牌id
  category3Id: number,//三级id
  skuDefaultImg: string,//sku默认图片
  isSale: number,//上架下架
  createTime?: string,//创建时间
  skuImageList: skuImageListModel,//图片列表
  skuAttrValueList: skuAttrValueListModel,//属性值列表
  skuSaleAttrValueList: skuSaleAttrValueListModel//销售属性值列表
}

//sku对象数组
export type skuInfoListModel = skuInfoModel[]

//sku图片对象
export interface skuImageModel {
  id?: number,
  skuId?: number,
  imgName: string,
  imgUrl: string,
  spuImgId: number,//spu图片id
  isDefault: string//是否默认图片
}

//sku图片对象数组
export type skuImageListModel = skuImageModel[]

//sku属性值对象
export interface skuAttrValueModel {
  id?: number,
  attrId: number,
  valueId: number,
  skuId?: number,
  attrName: string,//属性名称
  valueName: string//属性值名称
}

//sku属性值对象数组
export type skuAttrValueListModel = skuAttrValueModel[]

//sku销售属性值对象
export interface skuSaleAttrValueModel {
  id?: number,
  skuId?: number,
  spuId: number,
  saleAttrValueId: number,
  saleAttrId: number,
  saleAttrName: string,
  saleAttrValueName: string
}

//sku销售属性值对象数组
export type skuSaleAttrValueListModel = skuSaleAttrValueModel[]

//sku分页数据类型
export interface skuPageLimitMode {
  records: skuInfoListModel,
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number
}

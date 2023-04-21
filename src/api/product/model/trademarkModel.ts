//品牌管理接口类型

//一个品牌数据的类型
export interface trademarkModel {
  id?: number,//id
  tmName: string,//品牌名字
  logoUrl: string//图片地址
}

//获取品牌数据信息的类型(关键字搜索，id搜索)
export interface trademarkPageLimitModel {
  records: trademarkModel[],
  total?: number
}

//

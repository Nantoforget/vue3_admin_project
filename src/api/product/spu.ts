//引入axios
import type {pageModel, spuAttrListModel, spuInfoListModel, spuInfoModel} from "@/api/product/model/spuModel";
import request from "@/utils/request";

//枚举列举请求地址
enum Api {
  GetBaseSaleAttrList = "/admin/product/baseSaleAttrList",//获取销售属性列表
  DeleteSpuBySpuId = "/admin/product/deleteSpu",//根据spuId删除spu
  FindSpuInfoByKeyword = "/admin/product/findSpuInfoByKeyword",//根据关键字查找
  GetSpuInfoById = "/admin/product/getSpuById",//根据spuId获取数据
  FindSpuInfoBySpuIdList = "/admin/product/inner/findSpuInfoBySpuIdList",//根据spuId列表查找
  SaveSpuInfo = "/admin/product/saveSpuInfo",//添加
  UpdateSpuInfo = "/admin/product/updateSpuInfo",//修改
  PageLimit = "/admin/product",//分页
}

/**
 * 获取销售属性的请求
 */
export const getBaseSaleAttrListApi = () => request.get<any, spuAttrListModel>(Api.GetBaseSaleAttrList);
/**
 * 根据spuId删除spu
 * @param spuId spuId
 */
export const deleteSpuBySpuIdApi = (spuId: number) => request.delete<any, null>(`${Api.DeleteSpuBySpuId}/${spuId}`);
/**
 * 根据关键字获取spu
 * @param keyword 关键字
 */
export const findSpuInfoByKeywordApi = (keyword: string) => request.get<any, spuInfoListModel>(`${Api.FindSpuInfoByKeyword}/${keyword}`);
/**
 * 根据spuId获取spu数据
 * @param spuId spuId
 */
export const getSpuInfoByIdApi = (spuId: number) => request.get<any, spuInfoModel>(`${Api.GetSpuInfoById}/${spuId}`);
/**
 * 根据spuId列表获取spu
 * @param spuIdList spu的spuId的列表数据
 */
export const findSpuInfoBySpuIdListApi = (spuIdList: spuInfoListModel) => request.post<any, spuInfoListModel>(Api.FindSpuInfoBySpuIdList, spuIdList);
/**
 * 添加spu数据
 * @param spuInfo 要添加的spu数据
 */
export const saveSpuInfoApi = (spuInfo: spuInfoModel) => request.post<any, null>(Api.SaveSpuInfo, spuInfo);
/**
 * 修改spu数据
 * @param spuInfo 要修改的spu数据
 */
export const updateSpuInfoApi = (spuInfo: spuInfoModel) => request.post<any, null>(Api.UpdateSpuInfo, spuInfo);
/**
 * 使用分页获取spu数据
 * @param page 第几页
 * @param limit 每页多少条数据
 */
export const getInfoByPageLimitApi = ({
                                        page,
                                        limit,
                                        category3Id,
                                      }: spuPage) => request.get<any, pageModel>(`${Api.PageLimit}/${page}/${limit}?category3Id=${category3Id}`);

//分页请求参数的类型
interface spuPage {
  page: number,
  limit: number,
  category3Id?: number
}

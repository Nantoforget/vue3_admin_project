//引入封装的axios
import request from "@/utils/request";
import type {spuImageListModel, spuSaleAttrListModel} from "@/api/product/model/spuModel";
import type {skuInfoListModel, skuInfoModel, skuPageLimitMode} from "@/api/product/model/skuModel";

export const cancelSaleApi = (skuId: number) => request.get<any, null>(`/admin/product/cancelSale/${skuId}`);

export const deleteSkuBySkuIdApi = (skuId: number) => request.delete<any, null>(`/admin/product/deleteSku/${skuId}`);

export const findSkuInfoBySpuIdfApi = (spuId: number) => request.get<any, skuInfoListModel>(`/admin/product/findBySpuId/${spuId}`);

export const getSkuInfoBySkuIdApi = (skuId: number) => request.get<any, skuInfoModel>(`/admin/product/getSkuById/${skuId}`);

export const findSkuInfoByKeywordApi = (keyword: string) => request.get<any, skuInfoListModel>(`/admin/product/inner/findSkuInfoByKeyword/${keyword}`);

export const findSkuInfoBySkuIdListApi = (skuIdList: []) => request.post<any, skuInfoListModel>("/admin/product/inner/findSkuInfoBySkuIdList", skuIdList);


interface pageModel {
  page: number,
  limit: number
}

export const skuPageLimitApi = ({page, limit}: pageModel) => request.get<any, skuPageLimitMode>(`/admin/product/list/${page}/${limit}`);

export const isOnSaleApi = (skuId: number) => request.get<any, null>(`/admin/product/onSale/${skuId}`);

export const saveSkuInfoApi = (skuInfo: skuInfoModel) => request.post<any, null>(`/admin/product/saveSkuInfo`, skuInfo);

export const getSpuImageListApi = (spuId: number) => request.get<any, spuImageListModel>(`/admin/product/spuImageList/${spuId}`);

export const getSpuSaleAttrListApi = (spuId: number) => request.get<any, spuSaleAttrListModel>(`/admin/product/spuSaleAttrList/${spuId}`);

export const updateSkuInfoApi = (skuInfo: skuInfoModel) => request.post<any, null>(`/admin/product/updateSkuInfo`);

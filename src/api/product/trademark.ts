//品牌管理的接口

//引入二次封装的axios
import request from "@/utils/request";
//引入返回数据的类型
import type {trademarkModel, trademarkPageLimitModel} from "@/api/product/model/trademarkModel";

//枚举方法列举请求地址
enum Api {
  findTrademarkByKeyword = "/admin/product/baseTrademark/findBaseTrademarkByKeyword",//根据关键字搜索
  getTrademarkById = "/admin/product/baseTrademark/get",//根据Id获取
  getTrademarkList = "/admin/product/baseTrademark/getTrademarkList",//获取列表
  findTrademarkByTrademarkIdList = "/admin/product/baseTrademark/inner/findBaseTrademarkByTrademarkIdList",//批量查找
  removeTrademarkById = "/admin/product/baseTrademark/remove",//根据Id删除
  saveTrademark = "/admin/product/baseTrademark/save",//添加
  updateTrademark = "/admin/product/baseTrademark/update",//修改
  getTrademarkListByPage = "/admin/product/baseTrademark"//分页列表
}

//请求方法
//根据关键字搜索
export const findByIdApi = (keyword: string) => request.get<any, trademarkPageLimitModel>(`${Api.findTrademarkByKeyword}/${keyword}`);

//根据Id获取
export const getByIdApi = (id: number) => request.get<any, trademarkModel>(`${Api.getTrademarkById}/${id}`);

//获取列表
export const getListApi = () => request.get<any, trademarkModel[]>(Api.getTrademarkList);

//批量查找
export const findByTrademarkIdListApi = (ids: []) => request.post<any, trademarkPageLimitModel>(Api.findTrademarkByTrademarkIdList, ids);

//根据Id删除
export const removeByIdApi = (id: number) => request.delete<any, null>(`${Api.removeTrademarkById}/${id}`);

//添加
// export const saveApi = (data: trademarkModel) => request.post<any, null>(Api.saveTrademark, data);

//修改
// export const updateApi = (data: trademarkModel) => request.put<any, null>(Api.updateTrademark, data);

//分页列表
export const getListByPageApi = (page: number, limit: number) => request.get<any, trademarkPageLimitModel>(`${Api.getTrademarkListByPage}/${page}/${limit}`);

//将添加和修改合并
export const saveOrUpdateApi = (data: trademarkModel) => {
  if (data.id) {
    return request.put<any, null>(Api.updateTrademark, data);
  } else {
    return request.post<any, null>(Api.saveTrademark, data);
  }
};

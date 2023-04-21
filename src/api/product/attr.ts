import type {attrInfoListModel, attrValueListModel} from "@/api/product/model/attrModel";
import request from "@/utils/request";

//获取分类列表的信息数据
export const getAttrInfoListApi = (category1Id: number, category2Id: number, category3Id: number) => request.get<any, attrInfoListModel[]>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`);

//根据id删除
export const deleteAttrByIdApi = (attrId: number) => request.delete<any, null>(`/admin/product/deleteAttr/${attrId}`);

//根据id获取
export const getAttrValueListApi = (attrId: number) => request.get<any, attrValueListModel>(`/admin/product/getAttrValueList/${attrId}`);

//保存修改数据
export const saveAttrInfoApi = (data: attrInfoListModel) => request.post<any, attrInfoListModel>("/admin/product/saveAttrInfo", data);

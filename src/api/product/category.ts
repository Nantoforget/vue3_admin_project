//引入request
import request from "@/utils/request";
//引入数据类型
import type {categoryModel, categoryListModel} from "@/api/product/model/categoryModel";

//枚举请求地址
enum Api {
  GetStair = "/admin/product/get/category1",//获取一级分类
  GetSecondary = "/admin/product/get/category2",//获取二级分类
  GetThreeLevel = "/admin/product/get/category3",//获取三级分类
  GetStairList = "/admin/product/getCategory1",//获取一级分类列表
  GetSecondaryList = "/admin/product/getCategory2",//获取二级分类列表
  GetThreeLevelList = "/admin/product/getCategory3",//获取三级分类列表
  GetThreeLevelBy3IdList = "/admin/product/inner/findBaseCategory3ByCategory3IdList",//根据i的列表获取信息
  RemoveCategory1 = "/admin/product/removeCategory1",//删除一级分类
  RemoveCategory2 = "/admin/product/removeCategory2",//删除二级分类
  RemoveCategory3 = "/admin/product/removeCategory3",//删除三级分类
  SaveCategory1 = "/admin/product/saveCategory1",//新增一级分类
  SaveCategory2 = "/admin/product/saveCategory2",//新增二级分类
  SaveCategory3 = "/admin/product/saveCategory3",//新增三级分类
  updateCategory1 = "/admin/product/updateeCategory1",//修改一级分类
  updateCategory2 = "/admin/product/updateeCategory2",//修改二级分类
  updateCategory3 = "/admin/product/updateeCategory3",//修改三级分类
}


//请求方法

//获取分类数据
export const getStairApi = (id: number) => request.get<any, categoryModel>(`${Api.GetStair}/${id}`);
export const getSecondaryApi = (id: number) => request.get<any, categoryModel>(`${Api.GetSecondary}${id}`);
export const getThreeLevelApi = (id: number) => request.get<any, categoryModel>(`${Api.GetThreeLevel}${id}`);

//获取分类列表数据
export const getStairListApi = () => request.get<any, categoryListModel>(Api.GetStairList);
export const getSecondaryListApi = (category1Id: number) => request.get<any, categoryListModel>(`${Api.GetSecondaryList}/${category1Id}`);
export const getThreeLevelListApi = (category2Id: number) => request.get<any, categoryListModel>(`${Api.GetThreeLevelList}/${category2Id}`);

export const findCategory3ByCategory3IdListApi = (data: number[]) => request.post<any, categoryListModel>(Api.GetThreeLevelBy3IdList);

//删除
export const removeCategory1Api = (id: number) => request.delete<any, null>(`${Api.RemoveCategory1}/${id}`);
export const removeCategory2Api = (id: number) => request.delete<any, null>(`${Api.RemoveCategory2}/${id}`);
export const removeCategory3Api = (id: number) => request.delete<any, null>(`${Api.RemoveCategory3}/${id}`);

//添加
export const saveCategory1Api = (data: categoryModel) => request.post<any, null>(Api.SaveCategory1, data);
export const saveCategory2Api = (data: categoryModel) => request.post<any, null>(Api.SaveCategory2, data);
export const saveCategory3Api = (data: categoryModel) => request.post<any, null>(Api.SaveCategory3, data);

//修改
export const updateCategory1Api = (data: categoryModel) => request.put<any, null>(Api.updateCategory1, data);
export const updateCategory2Api = (data: categoryModel) => request.put<any, null>(Api.updateCategory2, data);
export const updateCategory3Api = (data: categoryModel) => request.put<any, null>(Api.updateCategory3, data);


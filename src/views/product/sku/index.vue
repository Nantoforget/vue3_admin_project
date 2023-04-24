<template >
  <el-card shadow="hover" >
    <el-table v-loading="loading" :data="tableData.records" border lazy stripe >
      <el-table-column align="center" label="序号" prop="id" type="index" width="80" ></el-table-column >
      <el-table-column label="名称" prop="skuName" />
      <el-table-column label="描述" prop="skuDesc" />
      <el-table-column label="默认图片" prop="skuDefaultImg" width="160" >
        <template #default="{row}" >
          <img :alt="row.skuName" :src="row.skuDefaultImg" height="100" width="100" >
        </template >
      </el-table-column >
      <el-table-column label="重量(千克)" prop="weight" />
      <el-table-column label="价格(元)" prop="price" />
      <el-table-column label="操作" >
        <template #default="{row}" >
          <el-button v-if="row.isSale ==0" :icon="Top" size="small" type="info" @click="isOnOrUpSale(row)" ></el-button >
          <el-button v-if="row.isSale ==1" :icon="Bottom" size="small" type="success" @click="isOnOrUpSale(row)" ></el-button >
          <el-button :icon="Plus" size="small" type="primary" ></el-button >
          <el-button :icon="InfoFilled" size="small" type="info" ></el-button >
          <el-popconfirm :title="`确定要删除${row.skuName}?`" @confirm="delSku(row)" >
            <template #reference >
              <el-button :icon="Delete" size="small" type="danger" ></el-button >
            </template >
          </el-popconfirm >
        </template >
      </el-table-column >
    </el-table >
    <Pagination :pageSizes="pageSizes" :total="tableData.total" @getDate="getSkuInfoDate" />
  </el-card >
</template >

<script lang="ts" setup >
import type {skuInfoModel, skuPageLimitMode} from "@/api/product/model/skuModel";
import {cancelSaleApi, deleteSkuBySkuIdApi, isOnSaleApi, skuPageLimitApi} from "@/api/product/sku";
import type {pageModel} from "@/api/product/sku";
import Pagination from "@/components/Pagination/index.vue";
import {Delete, InfoFilled, Plus, Bottom, Top} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {reactive, ref} from "vue";

const tableData = reactive<skuPageLimitMode>({
  records: [],//数据列表
  total: 0,//总条数
  size: 0,//
  current: 0,//
  searchCount: true,
  pages: 0,//总页数
});

const pageSizes = ref<number[]>([10, 15, 20, 25]);//显示页码数

const loading = ref<boolean>(false);//加载效果
/**
 * 获取sku列表
 */
const getSkuInfoDate = async (pageDate: pageModel) => {
  loading.value = true;
  const result = await skuPageLimitApi(pageDate);
  tableData.total = result.total;
  tableData.records = result.records;
  tableData.current = result.current;
  tableData.size = result.size;
  loading.value = false;
};
/**
 * 上下架
 * @param row 列表对象
 */
const isOnOrUpSale = async (row: skuInfoModel) => {
  if (row.isSale == 1) {
    await cancelSaleApi(row.id as number);
    ElMessage.success("下架成功");
  } else {
    await isOnSaleApi(row.id as number);
    ElMessage.success("上架成功");
  }
  await getSkuInfoDate({page: tableData.current, limit: tableData.size});
};
const delSku = async (row: skuInfoModel) => {
  await deleteSkuBySkuIdApi(row.id as number);
  await getSkuInfoDate({page: tableData.current, limit: tableData.size});
};
</script >

<script lang="ts" >
export default {
  name: "Sku",
};
</script >

<style scoped >

</style >

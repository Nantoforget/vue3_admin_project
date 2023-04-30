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
          <el-button v-if="row.isSale ==0" :icon="Top" size="small" title="上架" type="info" @click="isOnOrUpSale(row)" ></el-button >
          <el-button v-if="row.isSale ==1" :icon="Bottom" size="small" title="下架" type="success" @click="isOnOrUpSale(row)" ></el-button >
          <el-button :icon="Edit" size="small" title="修改SKU" type="primary" @click="updateSku(row)" ></el-button >
          <el-button :icon="InfoFilled" size="small" title="查看SKU" type="info" @click="showSkuInfoDrawer(row.id)" ></el-button >
          <el-popconfirm :title="`确定要删除${row.skuName}?`" @confirm="delSku(row)" >
            <template #reference >
              <el-button v-hasBtn="'btn.Sku.remove'" :icon="Delete" size="small" title="删除SKU" type="danger" ></el-button >
            </template >
          </el-popconfirm >
        </template >
      </el-table-column >
    </el-table >
    <!--    pageSizes每页显示多少条数据的切换数据，是一个数组；pageSize每页多少条数据；total总条数； getDate父组件的数据获取方法-->
    <Pagination :pageSize="pageSize" :pageSizes="pageSizes" :total="tableData.total" @getDate="getSkuInfoDate" />
  </el-card >
  <!--  SKU详情-->
  <SkuInfoDrawer ref="skuInfoDrawer" ></SkuInfoDrawer >
  <!--  修改SKU-->
  <!--  <AddSkuInfo :getOneSkuInfo="spuGetSkuInfo" @cancel="cancel" ></AddSkuInfo >-->
</template >

<script lang="ts" setup >
import type {skuInfoModel, skuPageLimitMode} from "@/api/product/model/skuModel";
import {cancelSaleApi, deleteSkuBySkuIdApi, getSkuInfoBySkuIdApi, isOnSaleApi, skuPageLimitApi} from "@/api/product/sku";
import type {pageModel} from "@/api/product/sku";
import Pagination from "@/components/Pagination/index.vue";
import SkuInfoDrawer from "@/views/product/sku/components/SkuInfoDrawer/index.vue";
import {Delete, InfoFilled, Bottom, Top, Edit} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {reactive, ref} from "vue";

//sku数据
const tableData = reactive<skuPageLimitMode>({
  records: [],//数据列表
  total: 0,//总条数
  size: 0,//每页条数
  current: 0,//当前页数
  searchCount: true,
  pages: 0,//总页数
});
const pageSizes = ref<number[]>([10, 15, 20, 25]);//显示页码数
const pageSize = ref<number>(10);//每页条数
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
    await cancelSaleApi(row.id as number);//下架
    ElMessage.success("下架成功");
  } else {
    await isOnSaleApi(row.id as number);//上架
    ElMessage.success("上架成功");
  }
  await getSkuInfoDate({page: tableData.current, limit: tableData.size});//刷新数据
};

const skuInfoDrawer = ref();//获取子组件的DOM
/**
 * 显示sku列表对象的详情
 */
const showSkuInfoDrawer = async (skuId: number) => {
  await skuInfoDrawer.value.getSkuInfo(skuId);
  skuInfoDrawer.value.skuDrawer = true;//修改子组件数据
};

const skuInfo = ref([]);

const updateSku = async (row: skuInfoModel) => {
  console.log(row);
  const a = await getSkuInfoBySkuIdApi(row.id as number);
  console.log(a);
};


/**
 * 删除sku
 * @param row sku列表对象
 */
const delSku = async (row: skuInfoModel) => {
  await deleteSkuBySkuIdApi(row.id as number);//删除
  await getSkuInfoDate({page: tableData.current, limit: tableData.size});//刷新数据
};

const showUpdateSku = ref<boolean>(false);//修改SKU页面的显示与否
/**
 * 取消按钮，关闭修改或添加页面
 */
const cancel = () => {
  showUpdateSku.value = false;
};
</script >

<script lang="ts" >
export default {
  name: "Sku",
};
</script >

<style scoped >

</style >

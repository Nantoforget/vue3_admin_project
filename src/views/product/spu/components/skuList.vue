<template >
  <el-dialog v-model="dialogTableVisible" :title="`${spuName}=>SKU列表`" >
    <el-table :data="skuData" >
      <el-table-column label="名称" property="skuName" />
      <el-table-column label="价格(元)" property="price" />
      <el-table-column label="重量(千克)" property="weight" />
      <el-table-column label="默认图片" >
        <template #default="{row}" >
          <el-image :alt="row.skuName" :src="row.skuDefaultImg" lazy />
        </template >
      </el-table-column >
    </el-table >
  </el-dialog >
</template >

<script lang="ts" setup >
import type {skuInfoListModel} from "@/api/product/model/skuModel";
import {findSkuInfoBySpuIdfApi} from "@/api/product/sku";
import {ElMessage} from "element-plus";
import {ref} from "vue";

const dialogTableVisible = ref<boolean>(false);//控制sku列表页面显示与隐藏
const spuId = ref<number>(0);//选中的spuId
const spuName = ref<string>("");//spuName
/**
 * spuId请求回来的sku数据列表
 */
const getSkuInfoBySpuId = async () => {
  try {
    skuData.value = await findSkuInfoBySpuIdfApi(spuId.value);
  } catch (e) {
    ElMessage.error("加载失败");
    dialogTableVisible.value = false;
  }
};
const skuData = ref<skuInfoListModel>([]);//请求回来的sku列表

defineExpose({dialogTableVisible, spuId, getSkuInfoBySpuId, spuName});//将这个暴露给父组件，父组件通过ref操作子组件数据
</script >

<script lang="ts" >
export default {
  name: "SkuList",
};
</script >

<style scoped >

</style >

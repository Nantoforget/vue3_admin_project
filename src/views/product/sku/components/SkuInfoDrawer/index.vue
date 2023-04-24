<template >
  <el-drawer v-model="skuDrawer" :show-close="false" :with-header="false" direction="rtl" size="50%" >
    <el-form v-model="skuInfoDate" label-width="120px" style="font-weight: bold" >
      <el-form-item label="名称：" prop="skuName" >{{ skuInfoDate.skuName }}</el-form-item >
      <el-form-item label="描述：" prop="skuDesc" >{{ skuInfoDate.skuDesc }}</el-form-item >
      <el-form-item label="价格(元)：" prop="price" >{{ skuInfoDate.price }}</el-form-item >
      <el-form-item label="平台属性：" prop="" >
        <el-tag v-for="tag in skuInfoDate.skuAttrValueList" :key="tag.id" style="margin:0 5px 5px 0" type="success" >{{ tag.attrName }}-{{ tag.valueName }}</el-tag >
      </el-form-item >
      <el-form-item label="销售属性：" prop="" >
        <el-tag v-for="tag in skuInfoDate.skuSaleAttrValueList" :key="tag.id" style="margin:0 5px 5px 0" type="success" >{{ tag.saleAttrName }}-{{ tag.saleAttrValueName }}</el-tag >
      </el-form-item >
      <el-form-item label="商品图片：" prop="skuImageList" >
        <el-carousel style="width: 500px;height: 500px" trigger="click" >
          <el-carousel-item v-for="img in skuInfoDate.skuImageList" :key="img.id" >
            <img :alt="img.imgName" :src="img.imgUrl" height="500" width="500" />
          </el-carousel-item >
        </el-carousel >
      </el-form-item >
    </el-form >

  </el-drawer >
</template >

<script lang="ts" setup >
import type {skuInfoModel} from "@/api/product/model/skuModel";
import {getSkuInfoBySkuIdApi} from "@/api/product/sku";
import {reactive, ref} from "vue";

const skuDrawer = ref<boolean>(false);//是否显示drawer
const skuInfoDate = reactive<skuInfoModel>({
  spuId: 0,
  price: 0,//价格
  skuName: "",//sku名称
  skuDesc: "",//描述
  weight: "",//重量
  tmId: 0,//品牌id
  category3Id: 0,//三级id
  skuDefaultImg: "",//sku默认图片
  isSale: 0,//上架下架
  skuImageList: [],//图片列表
  skuAttrValueList: [],//属性值列表
  skuSaleAttrValueList: [],//销售属性值列表
});//保存请求回来的sku数据
/**
 * 根据skuId获取sku数据
 * @param skuId sku的id
 */
const getSkuInfo = async (skuId: number) => {
  const result = await getSkuInfoBySkuIdApi(skuId);
  skuInfoDate.spuId = result.spuId;
  skuInfoDate.price = result.price;
  skuInfoDate.skuName = result.skuName;
  skuInfoDate.skuDesc = result.skuDesc;
  skuInfoDate.weight = result.weight;
  skuInfoDate.tmId = result.tmId;
  skuInfoDate.category3Id = result.category3Id;
  skuInfoDate.skuDefaultImg = result.skuDefaultImg;
  skuInfoDate.isSale = result.isSale;
  skuInfoDate.skuImageList = result.skuImageList;
  skuInfoDate.skuAttrValueList = result.skuAttrValueList;
  skuInfoDate.skuSaleAttrValueList = result.skuSaleAttrValueList;
  console.log(skuInfoDate);
};
defineExpose({skuDrawer, getSkuInfo});//暴露给父组件
</script >

<script lang="ts" >
export default {
  name: "SkuInfoDrawer",
};
</script >

<style scoped >
:deep(.el-carousel__item is-active) {
  width: 500px;
}

:deep(.el-carousel__container) {
  width: 100%;
  height: 100%;
}

:deep(.el-carousel__item) {
  width: 500px;
  height: 500px;
}

</style >

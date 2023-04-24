import {getAttrInfoListApi} from "@/api/product/attr";
import type {attrInfoListModel} from "@/api/product/model/attrModel";
import type {spuSaleAttrListModel, spuImageListModel} from "@/api/product/model/spuModel";
import {getSpuImageListApi, getSpuSaleAttrListApi} from "@/api/product/sku";
import {getSpuInfoByIdApi} from "@/api/product/spu";
import {defineStore} from "pinia";
import {ref} from "vue";

//创建仓库，setup语法的
export const useAddSKuStore = defineStore("addSku", () => {

  const skuAttr = ref<attrInfoListModel[]>([]);//平台属性
  const skuSaleAttr = ref<spuSaleAttrListModel>([]);//销售属性
  const skuImg = ref<spuImageListModel>([]);//图片列表
  /**
   * 获取平台属性
   *
   */
  const getSkuAttrList = async (id1: number, id2: number, id3: number) => {
    skuAttr.value = await getAttrInfoListApi(id1, id2, id3);
    skuAttr.value.forEach((ele) => {
      ele.value = "";
    });
  };
  /**
   * 获取销售属性
   */
  const getSKuSaleAttrList = async (spuId: number) => {
    skuSaleAttr.value = await getSpuSaleAttrListApi(spuId);
    // await getSpuInfoByIdApi(spuId);
    skuSaleAttr.value.forEach((ele) => {
      ele.value = "";
    });
  };
  /**
   * 获取图片列表
   */
  const getSkuImgList = async (spuId: number) => {
    skuImg.value = await getSpuImageListApi(spuId);
    // console.log(skuImg.value);
    skuImg.value.forEach(ele => {
      ele.isDefault = "0";
    });
    skuImg.value[0].isDefault = "1";
  };


  return {skuAttr, skuSaleAttr, skuImg, getSkuAttrList, getSKuSaleAttrList, getSkuImgList};
});

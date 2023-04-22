import type {skuInfoListModel} from "@/api/product/model/skuModel";
import {findSkuInfoBySpuIdfApi} from "@/api/product/sku";
import {getSpuInfoByIdApi} from "@/api/product/spu";
import {defineStore} from "pinia";
import {ref} from "vue";

//创建仓库，setup语法的
export const useAddSKuStore = defineStore("addSku", () => {

  const skuInfo = ref<skuInfoListModel>([]);

  const getSkuBuSpuId = async (spuId: number) => {
    skuInfo.value = await findSkuInfoBySpuIdfApi(spuId);
    const a = await getSpuInfoByIdApi(skuInfo.value[0].spuId);
    console.log(a);
  };
  return {getSkuBuSpuId};
});

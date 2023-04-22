<template >
  <el-card shadow="hover" ></el-card >
</template >

<script lang="ts" setup >
import {useAddSKuStore} from "@/stores/product/skuStore";
import {onMounted, ref} from "vue";

const props = defineProps(["spuGetSkuById"]);//接受父组件传递的spuId
//提取数据
const addSkuStore = useAddSKuStore();
onMounted(() => {
  addSkuStore.getSkuBuSpuId(props.spuGetSkuById);
});

</script >

<script lang="ts" >
export default {
  name: "AddSkuInfo",
};
</script >

<style scoped >

</style >

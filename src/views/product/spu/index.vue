<template >
  <CategorySelector :isDisabled="isDisabled" @clearList="clearList" @getCategoryList="getCategoryList" ></CategorySelector >
</template >

<script lang="ts" setup >

import CategorySelector from "@/components/CategorySelector/index.vue";
import {ref} from "vue";

//保存选中三个分类列表的id
const category1Id = ref<number>(0);
const category2Id = ref<number>(0);
const category3Id = ref<number>(0);
/**
 * 根据三个分类列表的id，发送求情得到属性对象数组
 * @param id1 第一级id
 * @param id2 第二级id
 * @param id3 第三级id
 */
const getCategoryList = async (id1?: number, id2?: number, id3?: number) => {
  if (id3) {//判断是否是送三级列表一次选择的，是的话，表示第一次获取数据，保存三级列表的id
    category1Id.value = id1 as number;
    category2Id.value = id2 as number;
    category3Id.value = id3 as number;
  }
  //将数据保存
};
/**
 * 没有三级列表数据，数据不展示
 */
const clearList = () => {
  //清空数据
  category3Id.value = 0;//重置category3Id
};

const isDisabled = ref<boolean>(true);
</script >

<script lang="ts" >
export default {
  name: "Spu",
};
</script >

<style scoped >

</style >

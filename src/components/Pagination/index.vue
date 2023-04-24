<template >
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizes" :pager-count="7" :total="props.total" background layout="prev, pager, next, jumper,->,total, sizes" style="margin-top: 20px" @size-change="(val)=>emits('getDate',{page: currentPage, limit: val})" @current-change="(val)=>emits('getDate',{page:val,limit:pageSize})" />
</template >

<script lang="ts" setup >
import {onMounted, ref} from "vue";

const props = defineProps(["pageSizes", "total"]);//父组件传来的属性
const emits = defineEmits(["getDate"]);//父组件传来的方法
const currentPage = ref<number>(1);//当前页数
const pageSize = ref<number>(10);//显示的连续页数

// eslint-disable-next-line vue/no-setup-props-destructure
const pageSizes: number[] = props.pageSizes;//一页显示多少条（开始从父组件获取）

const getDateList = () => {
  emits("getDate", {page: currentPage.value, limit: pageSize.value});
};
onMounted(() => {
  getDateList();
});
</script >

<script lang="ts" >
export default {
  name: "Pagination",
};
</script >

<style scoped >

</style >

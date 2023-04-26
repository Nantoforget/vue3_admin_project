<template >
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizes" :pager-count="7" :total="props.total" background layout="prev, pager, next, jumper,->,total, sizes" style="margin-top: 20px" @size-change="(val)=>emits('getDate',{page:currentPage,limit:val})" @current-change="(val)=>emits('getDate',{page:val,limit:pageSize})" />
</template >

<script lang="ts" setup >
import {onMounted, ref} from "vue";

const props = defineProps(["pageSizes", "total", "pageSize"]);//父组件传来的属性
const emits = defineEmits(["getDate"]);//父组件传来的方法
const currentPage = ref<number>(1);//当前页数
// eslint-disable-next-line vue/no-setup-props-destructure
const pageSize = props.pageSize;//显示的连续页数
// eslint-disable-next-line vue/no-setup-props-destructure
const pageSizes: number[] = props.pageSizes;//一页显示多少条（开始从父组件获取）

const getDateList = () => {
  emits("getDate", {page: currentPage.value, limit: pageSize});
};
onMounted(() => {
  getDateList();
});

/*    15
 1  2  3  4   5
 5 10 15 20  25         5   3
 10 20 30 40 50        10   2
 * */

</script >

<script lang="ts" >
export default {
  name: "Pagination",
};
</script >

<style scoped >

</style >

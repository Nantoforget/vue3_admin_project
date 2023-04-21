<template >
  <el-card shadow="hover" style="margin-bottom: 30px;" >
    <span style="margin-right: 15px;font-weight: bold" >一级分类</span >
    <el-select v-model="value1" :disabled="!isDisabled" placeholder="请选择" style="margin-right: 30px" @change="select($event,category1)" >
      <el-option v-for="item in category1" :key="item.id" :disabled="!isDisabled" :label="item.name" :value="item.name" />
    </el-select >
    <span style="margin-right: 15px;font-weight: bold" >二级分类</span >
    <el-select v-model="value2" :disabled="!isDisabled" placeholder="请选择" style="margin-right: 30px" @change="select($event,category2)" >
      <el-option v-for="item in category2" :key="item.id" :disabled="!isDisabled" :label="item.name" :value="item.name" />
    </el-select >
    <span style="margin-right: 15px;font-weight: bold" >三级分类</span >
    <el-select v-model="value3" :disabled="!isDisabled" placeholder="请选择" style="margin-right: 30px" @change="select($event,category3)" >
      <el-option v-for="item in category3" :key="item.id" :disabled="!isDisabled" :label="item.name" :value="item.name" />
    </el-select >
  </el-card >
</template >

<script lang="ts" setup >
import {getSecondaryListApi, getStairListApi, getThreeLevelListApi} from "@/api/product/category";
import type {categoryListModel, categoryModel} from "@/api/product/model/categoryModel";
import {ref, onMounted, watch} from "vue";

defineProps(["isDisabled"]);
const emits = defineEmits(["getCategoryList", "clearList"]);
//三个下拉框的初始值
const value1 = ref<any>("");
const value2 = ref<any>("");
const value3 = ref<any>("");

//保存各级列表数据
const category1 = ref<categoryListModel>([]);
const category2 = ref<categoryListModel>([]);
const category3 = ref<categoryListModel>([]);

//保存三级分类列表选中的id
const id1 = ref<number>(0);
const id2 = ref<number>(0);
const id3 = ref<number>(0);
/**
 * 查找选中的数据对象
 * @param val 目标
 * @param attrList 查找的对象
 * @return 返回找到目标所在的对象
 */
const category = (val: string, attrList: categoryListModel) => {
  return attrList.find((ele) => {
    return ele.name == val;
  });
};
//分类列表选中某一项
const select = async (val: string, attrList: categoryListModel) => {
  const item = category(val, attrList); //接受查找完毕的对象
  if ((item as categoryModel).category1Id) {//判断是否含有category1Id，有表示是二级列表
    id2.value = (item as categoryModel).id;//保存第二层选择的id
    value3.value = "";//当重新选择某一项时，后面的都要初始化
    id3.value = 0;
    category3.value = await getThreeLevelListApi((item as categoryModel).id);//发送请求去获取数据//将数据保存
  } else if ((item as categoryModel).category2Id) {//判断是否含有category2Id，有表示是三级列表
    id3.value = (item as categoryModel).id;
    // emits("getCategoryList", id1.value, id2.value, id3.value);
  } else {//以上两种都不是，则选中的是一级列表的数据
    id1.value = (item as categoryModel).id;
    value2.value = "";
    id2.value = 0;
    value3.value = "";
    id3.value = 0;
    category2.value = await getSecondaryListApi((item as categoryModel).id);
  }
};
//获取一级列表数据
const getStair = async () => {
  category1.value = await getStairListApi();
};

//监视三级分类的id
watch(() => id3.value, (val) => {
  if (val > 0) {//三级分类选中了数据
    emits("getCategoryList", id1.value, id2.value, id3.value);
  } else {//没有选中数据
    emits("clearList");
  }
});
//生命周期
onMounted(() => {
  getStair();//加载完毕获取一级列表数据
});

</script >

<script lang="ts" >
export default {
  name: "CategorySelector",
};
</script >

<style scoped >

</style >

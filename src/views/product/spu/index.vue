<template >
  <!--  三级列表-->
  <CategorySelector :isDisabled="isDisabled" @clearList="clearList" @getCategoryList="getCategoryList" ></CategorySelector >
  <!--  sup数据列表-->
  <el-card v-if="showCard ==0" shadow="hover" >
    <el-button :disabled="!isDisabled" :icon="Plus" style="margin-bottom: 20px" type="primary" @click="addOrUpdateSpu" >添加SPU</el-button >
    <el-table v-loading="loading" :data="spuDate.records" border row-key="id" style="width: 100%" >
      <el-table-column align="center" label="序号" prop="id" type="index" width="100" />
      <el-table-column label="SPU名称" prop="spuName" />
      <el-table-column label="SPU描述" prop="description" />
      <el-table-column label="操作" >
        <template #default="{row,$index}" >
          <el-button :icon="Plus" type="primary" ></el-button >
          <el-button :icon="Edit" type="primary" @click="addOrUpdateSpu(row)" ></el-button >
          <el-button :icon="InfoFilled" type="info" ></el-button >
          <el-button :icon="Delete" type="danger" ></el-button >
        </template >
      </el-table-column >
    </el-table >
    <!--分页器-->
    <el-pagination v-model:current-page="current" v-model:page-size="pageSize" :page-sizes="[3,5,7,9]" :small="false" :total="spuDate.total" background layout=", prev, pager, next, jumper,->,sizes,total" style="margin-top: 30px" @size-change="val=>getSpuInfoListByPageLimit(current,val)" @current-change="val=>getSpuInfoListByPageLimit(val,pageSize)" />
  </el-card >
  <!--  添加或修改-->
  <el-card v-else-if="showCard==1" shadow="hover" >
    <!--    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :size="formSize" class="demo-ruleForm" label-width="120px" status-icon ></el-form >-->
    <el-form :model="spuInfo" :rules="rules" >
      <el-form-item label="SPU名称" prop="spuName" >
        <el-input v-model="spuInfo.spuName" />
      </el-form-item >
      <el-form-item label="SPU品牌" prop="tmId" >
        <el-select v-model="tmName" placeholder="请选择品牌" @change="selectTmValue" >
          <el-option v-for="item in records" :key="item.id" :label="item.tmName" :value="item.tmName" />
        </el-select >
      </el-form-item >
    </el-form >
    <div style="margin-top: 30px" >
      <el-button type="primary" >保存</el-button >
      <el-button @click="cancel" >取消</el-button >
    </div >
  </el-card >
</template >

<script lang="ts" setup >

import type {pageModel, spuInfoModel} from "@/api/product/model/spuModel";
import type {trademarkModel} from "@/api/product/model/trademarkModel";
import {getInfoByPageLimitApi} from "@/api/product/spu";
import {getByIdApi, getListApi} from "@/api/product/trademark";
import CategorySelector from "@/components/CategorySelector/index.vue";
import {Delete, Edit, Plus, InfoFilled} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import type {FormRules} from "element-plus";
import {reactive, ref} from "vue";
//三级菜单的数据**************************************************
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
  console.log(category3Id.value);
  await getSpuInfoListByPageLimit();
};
/**
 * 没有三级列表数据，数据不展示
 */
const clearList = () => {
  spuDate.records = [];//清空数据
  category3Id.value = 0;//重置category3Id
};
const isDisabled = ref<boolean>(true);//没有三级列表数据，按钮无效

//第二个卡片card的数据**********************************
//保存spu数据
const spuDate = reactive<pageModel>({
  records: [],//spu数据列表
  total: 0,//总条数
  size: 0,//每页多少条
  current: 0,//当前第几页
  searchCount: true,//能否被搜索
  pages: 0,//总共多少页
});

//分页数据
const current = ref<number>(1);//当前页数
const pageSize = ref<number>(3);//每页条数
/**
 * 页码数的请求方法，得到spu数据
 * @param curr 可选，当前页码数
 * @param size 可选，每页条数
 */
const getSpuInfoListByPageLimit = async (curr?: number, size?: number) => {
  if (curr) {//判断是否改变了页数或每页条数
    current.value = curr as number;
    pageSize.value = size as number;
  }
  try {
    //开启加载效果;
    loading.value = true;
    //发送请求，保存数据
    const result = await getInfoByPageLimitApi({page: current.value, limit: pageSize.value, category3Id: category3Id.value});
    spuDate.records = result.records;
    spuDate.total = result.total;
    spuDate.size = result.size;
    spuDate.current = result.current;
    spuDate.searchCount = result.searchCount;
    spuDate.pages = result.pages;
    loading.value = false;//取消加载效果
    ElMessage.success("获取SPU数据成功");//成功提示信息
  } catch (e) {
    ElMessage.error(`获取SPU数据失败,失败信息：${e}`);//失败提示信息
  }
};
//加载效果
const loading = ref(false);
//显示那个卡片card
const showCard = ref<number>(0);//0:spu数据页面；1：添加或修改spu页面；2：添加sku页面
/**
 * spu的添加或修改的页面
 */
const addOrUpdateSpu = async (row: spuInfoModel) => {
  isDisabled.value = false;
  spuInfo.category3Id = category3Id.value;//不管添加还是修改，都要有category3Id
  if (row.id) {//有id代表修改
    //回显数据
    spuInfo.id = row.id;
    spuInfo.spuName = row.spuName;
    spuInfo.description = row.description;
    spuInfo.spuSaleAttrList = row.spuSaleAttrList;
    spuInfo.spuImageList = row.spuImageList;
    // spuInfo.category3Id = row.category3Id;
    spuInfo.tmId = row.tmId;
    //根据tmId获取品牌信息
    await getTrademarkOrList(row.tmId as number);
  } else {//没有id为修改
    //重置对象
    spuInfo.spuName = "";
    spuInfo.description = "";
    spuInfo.spuSaleAttrList = [];
    spuInfo.spuImageList = [];
  }
  showCard.value = 1;
};
//第二个卡片card添加或修改的卡片card***********************
//添加或修改的临时spu对象
const spuInfo = reactive<spuInfoModel>({
  id: undefined,//spu信息数据id
  spuName: "",//名字
  description: "",//spu描述
  category3Id: 0,//3级分类的id
  spuSaleAttrList: [],//销售属性列表
  spuImageList: [],//图片列表
  tmId: undefined,//品牌id
});
//保存品牌名称
const tmName = ref<string>("");
//保存品牌列表
const records = ref<trademarkModel[]>([]);
//表单验证规则
const rules = reactive<FormRules>({
  spuName: [
    {required: true, message: "必须输入SPU名称", trigger: "blur"},
    {min: 1, message: "必须输入SPU名称", trigger: "blur"},
  ],
  tmId: [
    {required: true, message: "必须选择一个品牌", trigger: "blur"},
  ],
});

/**
 * 根据tmId获取品牌信息
 * @param id 品牌id
 */
const getTrademarkOrList = async (id: number) => {
  try {
    const result = await getByIdApi(id);
    tmName.value = result.tmName;//改变select的值
    records.value = await getListApi();
    ElMessage.success("获取数据成功");
  } catch (e) {
    ElMessage.error("获取数据失败");
  }
};

/**
 * 选中某个品牌，将其品牌id保存到spuInfo对象中
 * @param val 选中的值
 */
const selectTmValue = (val: string) => {
  //找到对应的品牌id
  records.value.forEach((ele) => {
    if (ele.tmName == val) {
      spuInfo.tmId = ele.id;//保存品牌id
    }
  });
  console.log(spuInfo);
};
/**
 * 取消按钮，关闭修改或添加页面
 */
const cancel = () => {
  showCard.value = 0;
};
</script >

<script lang="ts" >
export default {
  name: "Spu",
};
</script >

<style scoped >

</style >

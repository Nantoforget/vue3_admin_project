<template >
  <el-input :model-value="route.query.roleName" disabled style="margin-bottom: 20px" />
  <el-tree :data="permissionData" :default-checked-keys="isSelect" :props="defaultProps" default-expand-all node-key="id" show-checkbox @check-change="getCheckedKeys" />
  <div style="margin-top: 10px" >
    <el-button type="primary" @click="okSave" >保存</el-button >
    <el-button >取消</el-button >
  </div >
</template >

<script lang="ts" setup >

import {toAssignByRoleId} from "@/api/acl/permission";
import type {permissionListModel} from "@/api/acl/model/permissionModel";
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute();//路由

const permissionData = ref<permissionListModel>([]);//菜单数组
/**
 * 根据roleId获取菜单
 */
const getUserPermission = async () => {
  const res = await toAssignByRoleId(route.query.id as string);
  permissionData.value = res.children;//保存菜单
  unfold(res.children);//默认展开
};


/**
 * 生命周期获取菜单
 */
onBeforeMount(() => {
  getUserPermission();
});

const defaultProps = {
  children: "children",
  label: "name",
};//展示的标识

const isSelect = ref<string[]>([]);//默认显示，收集的是id
/**
 * 默认展开解构,默认显示
 * @param arr 树结构的数据
 */
const unfold = (arr: permissionListModel) => {
  arr.forEach((ele) => {
    const child = ele.children && ele.children.length > 0;//是否有子节点且长度大于0
    if (ele.select && !child) {//如果select属性且没有子节点，说明是最后的等级
      isSelect.value.push(ele.id as string);//显示选中
    }
    if (child) {//如果有子元素且长度不为0
      unfold(ele.children as permissionListModel);//递归执行
    }
  });
};

const getCheckedKeys = (a: any, b: any, c: any, d: any) => {
  console.log(a);
  console.log(b);
  console.log(c);
  console.log(d);
};

const okSave = () => {
};
</script >

<script lang="ts" >
export default {
  name: "roleAuth",
};
</script >

<style scoped >

</style >

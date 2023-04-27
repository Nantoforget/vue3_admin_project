<template >
  <el-input :model-value="route.query.roleName" disabled style="margin-bottom: 20px" />
  <el-tree :data="permissionData" :default-checked-keys="isSelect" :props="defaultProps" default-expand-all node-key="id" show-checkbox @check="getCheckedKeys" />
  <div style="margin-top: 10px" >
    <el-button type="primary" @click="okSave" >保存</el-button >
    <el-button @click="cancel" >取消</el-button >
  </div >
</template >

<script lang="ts" setup >

import {doAssignApi, toAssignByRoleId} from "@/api/acl/permission";
import type {doAssignMoAclModel, permissionListModel, permissionModel} from "@/api/acl/model/permissionModel";
import {ElMessage} from "element-plus";
import {onBeforeMount, reactive, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();//路由
const router = useRouter();//路由器

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
//保存菜单，请求参数
const saveSelectArgument = reactive<doAssignMoAclModel>({
  permissionIdList: [],//菜单Id
  roleId: "",//角色Id
  permissionIdString: "",//菜单id组成的字符串
});


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

/**
 * 点击节点复选框之后触发;共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
 * @param selectObject 属性的数组中该节点所对应的对象
 * @param allSelectObject 目前的选中状态对象含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
 */
const getCheckedKeys = (selectObject: permissionModel, allSelectObject: any) => {
  saveSelectArgument.permissionIdList = [];//初始化
  (allSelectObject.checkedNodes as permissionListModel).forEach((ele) => {//遍历得到数组
    saveSelectArgument.permissionIdList.push(ele.id as string);
  });
};

/**
 * 保存分配菜单
 */
const okSave = async () => {
  saveSelectArgument.roleId = route.query.id as string;//保存角色Id
  if (saveSelectArgument.permissionIdList.length != 0) {
    //将id数组组成字符串
    saveSelectArgument.permissionIdString = saveSelectArgument.permissionIdList.reduce((prev, next) => {
      return prev + "," + next;
    });
    await doAssignApi(saveSelectArgument);//操作菜单了，发送请求保存
  }
  //如果没有操作菜单，直接点击确定，直接进行路由跳转转返回;
  ElMessage.success("操作成功");
  cancel();
};


/**
 * 取消
 */
const cancel = () => {
  router.push({name: "Role"});
};

</script >

<script lang="ts" >
export default {
  name: "roleAuth",
};
</script >

<style scoped >

</style >

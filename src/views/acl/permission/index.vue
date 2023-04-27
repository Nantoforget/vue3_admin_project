<template >
  <el-table id v-loading="loading" :data="PermissionData" :expand-row-keys="defaultExpanded" border row-key="id" stripe style="width: 100%" >
    <el-table-column label="名称" prop="name" ></el-table-column >
    <el-table-column label="权限值" prop="code" ></el-table-column >
    <el-table-column label="跳转权限值" prop="toCode" ></el-table-column >
    <el-table-column label="操作" >
      <template #default="{row}" >
        <el-button :disabled="row.level==4" :icon="Plus" :title="row.level>2?'添加功能':'添加菜单'" size="small" type="primary" @click="add(row)" ></el-button >
        <el-button :disabled="row.id =='1'" :icon="Edit" :title="row.type==2?'修改功能':'修改菜单'" size="small" type="primary" @click="updatePermission(row)" ></el-button >
        <el-button :disabled="row.id =='1'" :icon="Delete" size="small" title="删除" type="danger" @click="delPermission(row)" ></el-button >
      </template >
    </el-table-column >
  </el-table >

  <!--  删除对话框-->
  <el-dialog v-model="delDialog" :icon="InfoFilled" align-center title="提示" width="30%" @close="closeDelDialog" >
    <span style="font-size: 28px;font-weight: bold;color: red" >此操作将永久删除该纪录，是否继续？</span >
    <template #footer >
      <span class="dialog-footer" >
        <el-button @click="delDialog = false" >取消</el-button >
        <el-button type="primary" @click="okDelDialog" >确定</el-button >
      </span >
    </template >
  </el-dialog >

  <!--  修改对话框-->
  <el-dialog v-model="updateDialog" :title="permissionInfo.type==1?'修改菜单':'修改功能'" @close="closeAddOrUpdateDialog" >
    <el-form ref="ruleFormRef" :model="permissionInfo" :rules="rules" >
      <el-form-item label="名称" label-width="120px" prop="name" >
        <el-input v-model="permissionInfo.name" autocomplete="off" />
      </el-form-item >
      <el-form-item label="功能权限值" label-width="120px" prop="code" >
        <el-input v-model="permissionInfo.code" autocomplete="off" />
      </el-form-item >
      <el-form-item v-if="permissionInfo.type==2" label="跳转路由权限值" label-width="120px" >
        <el-input v-model="permissionInfo.toCode" autocomplete="off" />
      </el-form-item >
    </el-form >
    <template #footer >
      <span class="dialog-footer" >
        <el-button @click="updateDialog = false" >取消</el-button >
        <el-button type="primary" @click="okAddUpdateDialog" >确定</el-button >
      </span >
    </template >
  </el-dialog >
  <!--  添加对话框-->
  <el-dialog v-model="addDialog" :title="permissionInfo.level!=4?'添加菜单':'添加功能'" @close="closeAddOrUpdateDialog" >
    <el-form ref="ruleFormRef" :model="permissionInfo" :rules="rules" >
      <el-form-item label="名称" label-width="120px" prop="name" >
        <el-input v-model="permissionInfo.name" autocomplete="off" />
      </el-form-item >
      <el-form-item label="功能权限值" label-width="120px" prop="code" >
        <el-input v-model="permissionInfo.code" autocomplete="off" />
      </el-form-item >
      <el-form-item v-if="permissionInfo.level==4" label="跳转路由权限值" label-width="120px" >
        <el-input v-model="permissionInfo.toCode" autocomplete="off" />
      </el-form-item >
    </el-form >
    <template #footer >
      <span class="dialog-footer" >
        <el-button @click="addDialog = false" >取消</el-button >
        <el-button type="primary" @click="okAddUpdateDialog" >确定</el-button >
      </span >
    </template >
  </el-dialog >
</template >

<script lang="ts" setup >

import type {permissionListModel, permissionModel} from "@/api/acl/model/permissionModel";
import {getPermissionApi, removePermissionApi, saveOrUpdateApi, updatePermissionApi} from "@/api/acl/permission";
import {Delete, Edit, InfoFilled, Plus} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";
import {onBeforeMount, reactive, ref} from "vue";

const loading = ref<boolean>(false);//加载效果
const defaultExpanded = ref<string[]>([]);//默认展开，菜单的id
const PermissionData = ref<permissionListModel>([]);//菜单数组
/**
 * 获取菜单列表
 */
const getPermission = async () => {
  loading.value = true;//记载效果
  let res = await getPermissionApi();
  res.children.forEach((ele) => {//默认展开，菜单的id
    defaultExpanded.value.push(ele.id as string);
  });
  PermissionData.value = res.children;
  loading.value = false;//记载效果
};
/**
 * 生命周期
 */
onBeforeMount(() => {
  getPermission();
});

//************************修改菜单或功能
const updateDialog = ref<boolean>(false);//修改菜单或功能对话框

//修改添加功能的form管理数据，临时存储菜单信息
const permissionInfo = reactive<permissionModel>({
  name: "",//名称
  code: "",//权限值
  toCode: "",//跳转权限值
  pid: "",//父级Id
  type: 1,//1:菜单；2：功能
  level: 0,//第几级
});
/**
 *修改菜单或者功能
 * @param row 菜单对象
 */
const updatePermission = (row: permissionModel) => {
  //数据回显
  permissionInfo.id = row.id;
  permissionInfo.name = row.name;
  permissionInfo.code = row.code;
  permissionInfo.toCode = row.toCode;
  permissionInfo.type = row.type;
  permissionInfo.pid = row.pid;
  permissionInfo.level = row.level;

  updateDialog.value = true;//开启修改对话框
};


//************************添加菜单或功能
const addDialog = ref<boolean>(false);//添加菜单或功能对话框
/**
 * 添加菜单或功能
 * @param row 点击的菜单对象
 */
const add = (row: permissionModel) => {
  permissionInfo.name = "";
  permissionInfo.code = "";
  permissionInfo.toCode = "";
  permissionInfo.type = 1;
  permissionInfo.level = row.level as number + 1;//保存等级
  permissionInfo.pid = row.id;//保存父级id
  if (row.level == 3) {//如果添加的是功能，type=2
    permissionInfo.type = 2;
  }
  addDialog.value = true;//开启对话框
};

/**
 * 修改菜单或功能对话框的确认
 */
const okAddUpdateDialog = async () => {
  if (!ruleFormRef.value) return;
  await ruleFormRef.value.validate(async (valid, fields) => {//验证通过后才能保存
    if (valid) {
      // console.log("submit!");
      await saveOrUpdateApi(permissionInfo);//修改添加的请求
      ElMessage.success("操作成功");
      updateDialog.value = false;//关闭对话框
      addDialog.value = false;//关闭对话框
    } else {
      // console.log("error submit!", fields);
      ElMessage.warning("请输入正确的信息");
    }
  });
};

/**
 * 添加或修改的对话框关闭回调，（对话框关闭后就会执行）
 */
const closeAddOrUpdateDialog = () => {
  console.log(123);
  //重置
  delete permissionInfo.id;//删除临时数据的id
  console.log(456);
  console.log(permissionInfo);
  getPermission();//刷新数据
  //清楚验证信息
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();

};


//*************************删除
const delDialog = ref<boolean>(false);//删除对话框的显示与隐藏
const delId = ref<string>("");//删除的菜单Id
/**
 * 递归删除菜单
 * @param row 菜单对象
 */
const delPermission = (row: permissionModel) => {
  delDialog.value = true;//开启删除对话框
  delId.value = row.id as string;//保存菜单Id
};
/**
 * 删除对话框的确定
 */
const okDelDialog = async () => {
  await removePermissionApi(delId.value);
  ElMessage.success("删除成功");
  delDialog.value = false;
};
/**
 * 对话框关闭的回调
 */
const closeDelDialog = () => {
  delId.value = "";//重置
  getPermission();//刷新数据
};

//************表单验证
const ruleFormRef = ref<FormInstance>();//form节点
//表单验证规则
const rules = reactive<FormRules>({
  name: [
    {required: true, message: "名称必须输入", trigger: "blur"},
  ],
  code: [
    {required: true, message: "权限值必须输入", trigger: "blur"},
  ],
});
</script >

<script lang="ts" >
export default {
  name: "Permission",
};
</script >

<style scoped >

</style >

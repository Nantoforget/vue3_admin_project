<template >
  <el-dialog v-model="dialogVisible" draggable title="设置角色" width="50%" @close="closeDialog" >
    <el-form label-width="80px" >
      <el-form-item label="用户名" >
        <el-input :disabled="true" :value="userName" />
      </el-form-item >
      <el-form-item label="角色列表" style="margin-bottom: 0" >
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" >全选</el-checkbox >
        <el-checkbox-group v-model="assignRoles" @change="handleCheckedRoleChange" >
          <el-checkbox v-for="role in allRolesList" :key="role.id" :checked="role.isChecked===1" :label="role.id" >
            {{ role.roleName }}
          </el-checkbox >
        </el-checkbox-group >
      </el-form-item >
    </el-form >
    <template #footer >
      <span class="dialog-footer" >
        <el-button @click="dialogVisible=false" >取消</el-button >
        <el-button type="primary" @click="ok" >确定</el-button >
      </span >
    </template >
  </el-dialog >
</template >

<script lang="ts" setup >
import type {doAssignRoleModel, userRolesListModel} from "@/api/acl/model/userModel";
import {doAssignRoleWithUserApi} from "@/api/acl/user";
import {ElMessage} from "element-plus";
import {reactive, ref, watch} from "vue";

const emits = defineEmits(["noShowUserRole"]);//自定义事件
const dialogVisible = ref<boolean>(true);//是否显示对话框

const assignRoles = ref<string[]>([]);//角色已分配的角色，id数组
const allRolesList = ref<userRolesListModel>([]);//全部角色，对象数组
const userName = ref<string>("");//用户名
const userId = ref<string>("");//用户id

//多选状态
const checkAll = ref(false);//全选
const isIndeterminate = ref(false);//将checkbox变为多选框
/**
 * 全选状态
 * @param val 全选与否的标识，true全选中，false全不选
 */
const handleCheckAllChange = (val: boolean) => {
  console.log(checkAll.value);
  assignRoles.value = [];//重置
  if (val) {
    allRolesList.value.forEach((ele) => {
      assignRoles.value.push(ele.id as string);
    });
  }
  isChecked(allRolesList.value, assignRoles.value);
  isIndeterminate.value = false;
};

/**
 * 单选
 * @param value 选中的id数组
 */
const handleCheckedRoleChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === allRolesList.value.length;//判断是否全部选中了
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRolesList.value.length;
};

//用户的角色与全部角色比较，相同的选中
const isChecked = (all: userRolesListModel, user: string[]) => {
  all.forEach((a) => {
    a.isChecked = 0;
    user.forEach((b) => {
      if (a.id == b) {
        a.isChecked = 1;
      }
    });
  });
};

/**
 * 监视全部角色数组的变化，当有用户有角色，默认选中，且全选状态变为横线
 */
watch(() => allRolesList.value, () => {
  //找到选中的下标
  const all = allRolesList.value.findIndex((ele) => {
    return ele.isChecked == 1;
  });
  //如果有，将全选框变为没有全选的样式
  if (all != -1) {
    isIndeterminate.value = true;
  }
});

//发送请求需要的数据类型
const okUserRoles = reactive<doAssignRoleModel>({
  roleIdList: [],//角色名称
  userId: "",//用户id
});
/**
 * 保存选中的角色
 */
const ok = async () => {
  //数据整合
  okUserRoles.roleIdList = assignRoles.value;
  okUserRoles.userId = userId.value;
  await doAssignRoleWithUserApi(okUserRoles);//保存请求
  dialogVisible.value = false;//关闭对话框
};

/**
 * 关闭分配用户角色的对话框
 */
const closeDialog = () => {
  ElMessage.success("操作成功");
  emits("noShowUserRole");
};
//暴露给父组件
defineExpose({
  assignRoles,
  allRolesList,
  userName,
  userId,
  isChecked,
});
</script >

<script lang="ts" >
export default {
  name: "UserRole",
};
</script >

<style scoped >

</style >

<template >
  <el-card shadow="always" >
    <el-form >
      <el-form-item >
        <el-input v-model="searchText" placeholder="用户名" style="width: 200px;margin-right: 30px" ></el-input >
        <el-button :icon="Search" type="primary" @click="searchUser" >查询</el-button >
        <el-button @click="clearSearch" >清空</el-button >
      </el-form-item >
      <el-form-item style="margin-top: 40px" >
        <el-button type="primary" @click="showAddOrUpdateDialog" >添加</el-button >
        <el-button :disabled="multipleSelection.length==0" type="danger" @click="batchRemove" >批量删除</el-button >
        <el-table ref="multipleTableRef" v-loading="loading" :data="userList.items" border row-key="id" stripe style="width: 100%;margin-top: 30px;font-weight: bold" @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="55" />
          <!--          1,5 1 2 3 4 5
                        2,5 6 7 8 9 10-->
          <el-table-column align="center" label="序号" type="index" width="80" >
            <template #default="{$index}" >
              {{ (currentPage - 1) * pageSize + $index + 1 }}
            </template >
          </el-table-column >
          <el-table-column label="用户名" property="username" width="200" />
          <el-table-column label="用户名称" property="nickName" />
          <el-table-column label="角色列表" property="roleName" width="240" />
          <el-table-column label="创建时间" property="gmtCreate" width="200" />
          <el-table-column label="更新时间" property="gmtModified" width="200" />
          <el-table-column label="操作" width="200" >
            <template #default="{row}" >
              <el-button :icon="UserFilled" title="分配角色" type="info" @click="userRoleDialog(row)" ></el-button >
              <el-button :icon="Edit" title="修改用户" type="primary" @click="showAddOrUpdateDialog(row)" ></el-button >
              <el-popconfirm :title="`确定删除${row.username}?`" @confirm="deleteUser(row)" >
                <template #reference >
                  <el-button :icon="Delete" title="删除" type="danger" ></el-button >
                </template >
              </el-popconfirm >
            </template >
          </el-table-column >
        </el-table >
      </el-form-item >
    </el-form >
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5,10,15,20]" :total="userList.total" background layout=" prev, pager, next, jumper, ->,sizes,total" @size-change="changeSize" @current-change="(val)=>getUserDate(val,pageSize)" />
    <el-dialog v-model="dialogVisible" :title="userInfo.id?'修改用户':'添加用户'" draggable width="50%" @close="closeDialog" >
      <el-form ref="ruleFormRef" :model="userInfo" :rules="rules" label-width="120px" >
        <el-form-item label="用户名" prop="username" >
          <el-input v-model="userInfo.username" ></el-input >
        </el-form-item >
        <el-form-item label="用户昵称" prop="nickName" >
          <el-input v-model="userInfo.nickName" ></el-input >
        </el-form-item >
        <el-form-item v-if="!userInfo.id" label="用户密码" prop="password" >
          <el-input v-model="userInfo.password" ></el-input >
        </el-form-item >
      </el-form >
      <template #footer >
        <span class="dialog-footer" >
          <el-button @click="dialogVisible = false;" >返回</el-button >
          <el-button type="primary" @click="okAddOrUpdate(ruleFormRef)" >确认</el-button >
        </span >
      </template >
    </el-dialog >
    <UserRole v-if="showUserRole" ref="userRoleRef" @noShowUserRole="userRoleDialog" ></UserRole >
  </el-card >
</template >

<script lang="ts" setup >

import type {userListModel, userModel, UserPageLimitModel} from "@/api/acl/model/userModel";
import {deleteUserByIdsApi, getUserByPageLimitApi, getUserDoAssignByUserIdApi, removeUserByUserIdApi, saveUserApi, updateUserApi} from "@/api/acl/user";
import UserRole from "@/views/acl/user/components/userRole.vue";
import {UserFilled, Delete, Edit, Search} from "@element-plus/icons-vue";
import {ElMessage, ElTable} from "element-plus";
import type {FormRules, FormInstance} from "element-plus";
import {nextTick, onMounted, reactive, ref} from "vue";

const loading = ref<boolean>(false);//表格中的加载效果
const multipleTableRef = ref<InstanceType<typeof ElTable>>();//表格Dom
const multipleSelection = ref<userListModel>([]);//保存选中的用户对象数组
const idList = ref<string[]>([]);//多选的id数组，批量删除使用
/**
 * 表格中选中的用户对象
 * @param val 选中的用户对象组成的数组
 */
const handleSelectionChange = (val: userListModel) => {
  multipleSelection.value = val;
  idList.value = [];
  multipleSelection.value.forEach((ele) => {
    idList.value.push(ele.id as string);
  });
};

const batchRemove = async () => {
  ElMessage.warning("此功能不可用，接口错误");
  await deleteUserByIdsApi(idList.value);
  await getUserDate();
};

const searchText = ref<string>("");//搜索框文本
/**
 * 根据关键字搜索用户，分页请求
 */
const searchUser = () => {
  getUserDate(currentPage.value, pageSize.value, searchText.value);
};
/**
 * 清空搜索，返回全部用户数据
 */
const clearSearch = () => {
  searchText.value = "";
  getUserDate();
};
//分页请求回来的数据
const userList = reactive<UserPageLimitModel>({
  items: [],//用户列表
  total: -1,//总条数
});

/**
 * 分页获取用户列表
 * @param page 页数
 * @param limit 每页条数
 * @param username 搜索的关键字
 */
const getUserDate = async (page = currentPage.value, limit = pageSize.value, username = searchText.value) => {
  loading.value = true;//加载
  username = username.trim();//去除空格
  const result = await getUserByPageLimitApi(page, limit, username);
  userList.items = result.items;
  userList.total = result.total;
  loading.value = false;
};
//分页
const pageSize = ref<number>(5);//每页条数
const currentPage = ref<number>(1);//页码数
/**
 * 改变每页条数时触发
 * @param val 改变后的值
 */
const changeSize = (val: number) => {
  const lastPage = Math.ceil(userList.total / val);//计算最后一页
  if (lastPage < currentPage.value) {//判断改变每页条数时，当前页是否大于最后一页
    currentPage.value = lastPage;//大于的话，将请求的页数改为第最后一页
  }
  getUserDate(currentPage.value, val);
};
/**
 * 生命周期发送请求
 */
onMounted(() => {
  getUserDate();
});
/**
 * 根据Id删除某一项用户
 * @param row 用户对象
 */
const deleteUser = async (row: userModel) => {
  await removeUserByUserIdApi(row.id as string);//删除
  await getUserDate();//刷新数据
};


//添加或修改
const dialogVisible = ref<boolean>(false);
/**
 * 点击修改或添加按钮，显示对话框
 * @param row 用户对象
 */
const showAddOrUpdateDialog = (row: userModel) => {
  //判断是添加还是修改
  if (row.id) {//修改
    userInfo.id = row.id;
    userInfo.username = row.username;
    userInfo.nickName = row.nickName;
  } else {//添加
    userInfo.password = "";
    userInfo.username = "";
    userInfo.nickName = "";
  }
  dialogVisible.value = true;//打开对话框
};


//用户文本
const userInfo = reactive<userModel>({
  username: "",//用户名
  nickName: "",//用户昵称
});

//表单验证
const ruleFormRef = ref<FormInstance>();
//表单验证规则
const rules = reactive<FormRules>({
  username: [
    {required: true, message: "请输入正确的用户名", trigger: "blur"},
    {min: 4, message: "用户名不能小于4位", trigger: "blur"},
  ],
  password: [
    {required: true, message: "必须输入密码", trigger: "blur"},
    {min: 6, max: 18, message: "密码长度要在6-18位之间", trigger: "blur"},
  ],
});

/**
 * 点击对话框的确认按钮
 * @param formEl 表单DOM，用于验证表单验证
 */
const okAddOrUpdate = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;//如果表单验证没有通过直接return
  await formEl.validate(async (valid, fields) => {//valid：验证成功的标识；fields：验证失败的信息
    if (valid) {
      await saveOrUpdateUserInfo();//请求
      dialogVisible.value = false;//关闭对话框
    } else {
      console.log("error submit!", fields);//打印没有通过的验证信息
      ElMessage.warning("请按要求填写");
    }
  });
};

/**
 * 判断是添加还是修改请求
 */
const saveOrUpdateUserInfo = async () => {
  if (userInfo.id) {//修改
    await updateUserApi(userInfo);
    ElMessage.success("操作成功");
    return;
  }
  await saveUserApi(userInfo);//添加
  ElMessage.success("操作成功");
};

/**
 * 对话框关闭的回调
 * 清楚验证信息，初始化userInfo
 */
const closeDialog = () => {
  if (!ruleFormRef.value) return;//验证
  ruleFormRef.value.resetFields();//验证
  delete userInfo.id;//删除userInfo的id属性
  delete userInfo.password;//删除userInfo的password属性
  getUserDate();//刷新数据
};


const userRoleRef = ref();//子组件DOM

const showUserRole = ref<boolean>(false);//是否显示分配角色对话框
/**
 * 分配角色，给子组件传递数据
 * @param row
 */
const userRoleDialog = async (row: userModel) => {
  showUserRole.value = !showUserRole.value;
  if (row?.id) {
    const res = await getUserDoAssignByUserIdApi(row.id);
    await nextTick(() => {
      userRoleRef.value.userId = row.id;
      userRoleRef.value.userName = row.username;
      res.assignRoles.forEach((ele) => {
        userRoleRef.value.assignRoles.push(ele.id);
      });
      userRoleRef.value.allRolesList = res.allRolesList;
      userRoleRef.value.isChecked(userRoleRef.value.allRolesList, userRoleRef.value.assignRoles);
    });
    return;
  }
  await getUserDate();
};
</script >

<script lang="ts" >
export default {
  name: "User",
};
</script >

<style scoped >

</style >

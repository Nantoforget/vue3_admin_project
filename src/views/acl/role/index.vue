<template >
  <el-form label-width="5px" style="margin-top: 10px" >
    <el-form-item >
      <el-input v-model="keyword" placeholder="角色名称" style="width: 200px;margin-right: 20px" />
      <el-button :icon="Search" type="primary" @click="searchRole" >查询</el-button >
      <el-button @click="clearKeyword" >清空</el-button >
    </el-form-item >
    <el-form-item style="margin-top: 40px" >
      <el-button type="primary" @click="addRole" >添加</el-button >
      <el-button :disabled="roleIdList.length==0" type="danger" @click="batchRemove" >批量删除</el-button >
    </el-form-item >
    <el-form-item >
      <el-table ref="roleTableRef" v-loading="loading" :data="roleDate.items" border stripe style="width: 80%;font-weight: bold" @selection-change="handleSelectionChange" >
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" label="序号" type="index" width="100" >
          <template #default="{$index}" >{{ (currentPage - 1) * pageSize + $index + 1 }}</template >
        </el-table-column >
        <el-table-column label="角色名称" >
          <template #default="{row}" >
            <span v-if="!row.showIn" >{{ row.roleName }}</span >
            <span v-else >
              <el-input ref="roleInputRef" v-model="row.value" style="height: 30px" />
              <el-button :icon="Select" style="height: 20px;margin-top: 2px" type="primary" @click="okUpdateRole(row)" >确认</el-button >
              <el-button :icon="Refresh" style="height: 20px;margin-top: 2px" type="warning" @click="cancelRole(row)" >取消</el-button >
            </span >
          </template >
        </el-table-column >
        <el-table-column align="center" label="操作" width="500" >
          <template #default="{row}" >
            <el-tooltip content="分配权限" effect="dark" placement="left" >
              <el-button :icon="InfoFilled" type="info" @click="roleAuth(row)" ></el-button >
            </el-tooltip >
            <el-tooltip content="确定修改" effect="dark" placement="top" >
              <el-button :icon="Select" type="primary" @click="okUpdateRole(row)" ></el-button >
            </el-tooltip >
            <el-tooltip content="修改角色" effect="dark" placement="top" >
              <el-button :icon="Edit" type="primary" @click="updateRole(row)" ></el-button >
            </el-tooltip >
            <el-tooltip content="删除角色" effect="dark" placement="right" >
              <el-button :icon="Delete" type="danger" @click="deleteRole(row)" ></el-button >
            </el-tooltip >
          </template >
        </el-table-column >
      </el-table >
    </el-form-item >
  </el-form >
  <!--  分页器-->
  <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="pageSizes" :total="roleDate.total" background layout=" prev, pager, next, jumper,->,total ,sizes," @size-change="(size)=>getRole(currentPage,size)" @current-change="(page)=>getRole(page,pageSize)" />
  <!--  删除roel对话框-->
  <el-dialog v-model="deleteRoleDialog" :title="isDelOrAdd==2?'添加角色':'提示'" width="30%" @close="closeDialog" >
    <span v-if="isDelOrAdd==0" style="font-weight: bold" >确定删除{{ delRole.roleName }}吗？</span >
    <span v-else-if="isDelOrAdd==1" style="font-weight: bold" >此操作将永久删除该记录, 是否继续?</span >
    <div v-else >
      <span style="font-weight: bold" >请输入新名称</span >
      <el-input v-model="addRoleInfo.roleName" />
    </div >
    <template #footer >
      <span class="dialog-footer" >
        <el-button @click="deleteRoleDialog = false" >取消</el-button >
        <el-button type="primary" @click="deleteRoleOk" >确认</el-button >
      </span >
    </template >
  </el-dialog >
</template >

<script lang="ts" setup >
import type {roleListModel, roleModel, rolePageLimitModel} from "@/api/acl/model/roleModel";
import {toAssignByRoleId} from "@/api/acl/permission";
import {batchRemoveByIdsApi, getRoleListByPageLimitApi, removeRoleByIdApi, saveOrUpdateRoleApi} from "@/api/acl/role";
import {Delete, Edit, InfoFilled, Search, Select, Refresh} from "@element-plus/icons-vue";
import {ElMessage, ElTable} from "element-plus";
import {nextTick, onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();//路由器

const roleTableRef = ref<InstanceType<typeof ElTable>>();//table节点
const roleDate = reactive<rolePageLimitModel>({
  total: 0,//总条数
  items: [],//role数组
},
);//角色数据
const roleIdList = ref<string[]>([]);//选中的角色Id（批量删除使用）
/**
 * 选中的role对象，提取role对象的id
 * @param val 选中的role对象组成的数组
 */
const handleSelectionChange = (val: roleListModel) => {
  roleIdList.value = [];//初始化idList
  val.forEach((ele) => {
    roleIdList.value.push(ele.id as string);//将role对象的id，全部拷贝到idList中
  });
};
/**
 * 批量删除（接口不可用）
 */
const batchRemove = () => {
  isDelOrAdd.value = 1;//改变标识
  deleteRoleDialog.value = true;//打开对话框
};

/**
 * 分页获取role数据
 * @param page 当前页数
 * @param limit 当前每页显示条数
 * @param keyword 搜索关键字
 */
const getRole = async (page: number = currentPage.value, limit: number = pageSize.value, keyword?: string) => {
  loading.value = true;//开启加载效果
  const res = await getRoleListByPageLimitApi(page, limit, keyword);//请求
  roleDate.total = res.total;//保存总条数
  roleDate.items = res.items;//保存role列表
  loading.value = false;//关闭加载效果
  roleDate.items.forEach((ele) => {//给所有的role对象添加showIn和value属性
    ele.showIn = false;//用于显示input框
    ele.value = "";//用于关联input值
  });
};
//生命周期获取数据
onMounted(() => {
  getRole();
});
const loading = ref<boolean>(false);//加载效果

//分页数据
const currentPage = ref<number>(1);//当前页
const pageSize = ref<number>(5);//每页数据条数
const pageSizes = ref<number[]>([5, 10, 20, 30]);//每页条数组

//搜索的input框
const keyword = ref<string>("");
/**
 * 搜索角色
 */
const searchRole = () => {
  keyword.value = keyword.value.trim();//清楚前后空格
  getRole(currentPage.value, pageSize.value, keyword.value);
};
/**
 * 清空搜索
 */
const clearKeyword = () => {
  keyword.value = "";
  getRole();
};


//添加role的数据
const addRoleInfo = reactive<roleModel>({
  roleName: "",
});
/**
 * 添加角色
 */
const addRole = () => {
  isDelOrAdd.value = 2;//改变对话框标识
  deleteRoleDialog.value = true;//打开对话框
};


//修改role,用于请求参数
const roleInfo = reactive<roleModel>({
  id: "",
  roleName: "",
});
const roleInputRef = ref();//input节点
/**
 * 点击修改按钮，显示input框和两个按钮（确认、取消）
 * @param row role对象
 */
const updateRole = (row: roleModel) => {
  row.value = row.roleName;//input回显role名称
  row.showIn = true;//显示input框
  nextTick(() => {
    console.log(roleInputRef.value);
    roleInputRef.value.focus();
  });
};
/**
 * 修改的确认按钮
 * @param row role对象
 */
const okUpdateRole = async (row: roleModel) => {
  if (row.value) {//判断是是不是在value为空的时确认的
    row.showIn = false;//关闭input框
    row.roleName = row.value as string;//改变显示的值
    roleInfo.id = row.id;//保存roleId
    roleInfo.roleName = row.value as string;//保存改变后的值
    await saveOrUpdateRoleApi(roleInfo);
    ElMessage.success("角色修改成功");
  }
  isRefresh();//判断是否刷新
};
/**
 * 取消角色修改
 * @param row 角色对象
 */
const cancelRole = (row: roleModel) => {
  row.showIn = false;//关闭input框
  ElMessage.warning("取消角色修改成功");
  isRefresh();
};
/**
 * 判断修改是否都完毕了，都完毕以后刷新数据
 */
const isRefresh = () => {
  const showIndex = roleDate.items.findIndex((ele) => {
    return ele.showIn == true;
  });
  if (showIndex == -1) {//如果这次是最后一个关闭input框的，刷新数据
    getRole();
  }
};

const deleteRoleDialog = ref<boolean>(false);//删除的对话框

const isDelOrAdd = ref<number>(-1);//用来标识对话框的作用；0:单个删除；1：批量删除；2：添加
//删除使用的请求id，显示使用的roleName
const delRole = reactive<roleModel>({
  id: "",
  roleName: "",
});
/**
 * 点击表格的删除按钮，显示删除对话框
 * @param row role对象
 */
const deleteRole = (row: roleModel) => {
  isDelOrAdd.value = 0;
  delRole.roleName = row.roleName;//保存role名称
  deleteRoleDialog.value = true;//开启删除对话框
  delRole.id = row.id;//保存id
};
/**
 * 删除对话框确认
 */
const deleteRoleOk = async () => {
  if (isDelOrAdd.value == 0) {//单项删除
    await removeRoleByIdApi(delRole.id as string);//删除请求
    delRole.id = "";//清空保存的Id
  } else if (isDelOrAdd.value == 1) {//批量删除
    await batchRemoveByIdsApi(roleIdList.value);
  } else {//添加角色
    if (!addRoleInfo.roleName) {
      ElMessage.error("请添加角色名");
      return;
    }
    await saveOrUpdateRoleApi(addRoleInfo);
    addRoleInfo.roleName = "";//清空input框的值
  }
  deleteRoleDialog.value = false;//关闭删除对话框
  ElMessage.success("操作成功");
  await getRole();//刷新数据
};
/**
 * 对话框关闭后的回调
 */
const closeDialog = () => {
  isDelOrAdd.value = -1;
};
/**
 * 给角色分配权限
 * @param row role对象
 */
const roleAuth = (row: roleModel) => {
  //路由跳转
  router.push({
    name: "RoleAuth",
    query: {
      id: row.id,
      roleName: row.roleName,
    },
  });
};
</script >

<script lang="ts" >
export default {
  name: "Role",
};
</script >

<style scoped >

</style >

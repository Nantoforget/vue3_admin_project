<template >
  <el-card class="box-card" shadow="hover" >
    <!--        添加-->
    <template #header >
      <el-button :icon="Plus" type="primary" @click="addTrademark" >添加</el-button >
    </template >
    <!--        表格数据-->
    <el-table v-loading="loading" :data="trademarkList" border row-key="id" stripe style="width: 100%;margin-top: 20px" >
      <el-table-column align="center" label="序号" prop="id" type="index" width="100" />
      <el-table-column label="品牌名称" prop="tmName" />
      <el-table-column label="品牌LOGO" lazy >
        <template #default="{row}" >
          <img :alt="row.tmName" :src="row.logoUrl" style="width: 100px;height: 60px;" >
        </template >
      </el-table-column >
      <!--            操作，有两个功能按钮-->
      <el-table-column label="操作" >
        <template #default="{row}" >
          <el-tooltip content="修改" effect="dark" placement="top-start" >
            <el-button :icon="Edit" size="small" type="warning" @click="updateTrademark(row)" ></el-button >
          </el-tooltip >
          <el-tooltip content="删除" effect="dark" placement="top-start" >
            <el-button :icon="Delete" size="small" type="danger" @click="deleteTrademark(row)" ></el-button >
          </el-tooltip >
        </template >
      </el-table-column >
    </el-table >
    <!--分页器-->
    <el-pagination v-model:current-page="current" v-model:page-size="pageSize" :page-sizes="[3,5,7,9]" :small="false" :total="total" background layout=", prev, pager, next, jumper,->,sizes,total" style="margin-top: 20px" @size-change="val=>getTrademarkList(current,val)" @current-change="val=>getTrademarkList(val,pageSize)" />
  </el-card >
  <!--    添加或修改的页面-->
  <el-dialog v-model="outerVisible" :title="trademark.id? '修改品牌':'添加品牌'" draggable >
    <!--        form表单-->
    <el-form ref="ruleFormRef" :model="trademark" :rules="rules" label-width="100px" style="width: 80%;" >
      <el-form-item label="品牌名称" label-width="140px" prop="tmName" >
        <el-input v-model="trademark.tmName" autocomplete="off" />
      </el-form-item >
      <el-form-item label="品牌LOGO" label-width="140px" prop="logoUrl" >
        <!--文件上传-->
        <el-upload :action="`${BASE_URL}/admin/product/fileUpload`" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess" :show-file-list="false" class="avatar-uploader" >
          <!--加载效果-->
          <el-icon v-if="uploadLoading" class="avatar-uploader-icon" >
            <Loading />
          </el-icon >
          <!--图片显示-->
          <img v-else-if="trademark.logoUrl" :alt="trademark.tmName" :src="trademark.logoUrl" class="avatar" />
          <!--加号图标-->
          <el-icon v-else class="avatar-uploader-icon" >
            <Plus />
          </el-icon >
          <!--tip插槽，显示文字-->
          <template #tip >
            <div class="el-upload__tip" >只能上传jpg/png文件，且不超过50kb</div >
          </template >
        </el-upload >
      </el-form-item >
    </el-form >
    <!--        底部部分，显示取消与确认-->
    <template #footer >
      <div class="dialog-footer" >
        <el-button @click="outerVisible = false" >取消</el-button >
        <el-button type="primary" @click="ok" >确认</el-button >
        <!--                <el-dialog v-model="innerVisible" append-to-body title="Inner Dialog" width="30%" />-->
      </div >
    </template >
  </el-dialog >
</template >

<script lang="ts" setup >
import {getListByPageApi, removeByIdApi, saveOrUpdateApi} from "@/api/product/trademark";
import {Plus, Edit, Delete, Loading} from "@element-plus/icons-vue";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import {onMounted, reactive, ref} from "vue";
import type {trademarkModel} from "@/api/product/model/trademarkModel";
import type {UploadProps, FormInstance, FormRules} from "element-plus";
//定义根路径图片地址
const BASE_URL = import.meta.env.VITE_API_URL;

//上传图片
const uploadLoading = ref<boolean>(false);//上传图片的加载效果
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {//上传图片成功的方法
  uploadLoading.value = false;
  trademark.logoUrl = response.data;

};
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {//上传图片的限制
  const isJpgOrPng = ["image/jpeg", "image/png"].includes(rawFile.type);
  if (!isJpgOrPng) {
    ElMessage.error("只能上传png或jpg格式的图片");
    return false;
  }
  if (rawFile.size / 1024 > 100) {
    ElMessage.error("上传的图片不能大于100k!");
    return false;
  }
  uploadLoading.value = true;
  return true;
};


//表单验证
// 定义与表单form关联的对象
const trademark = reactive<trademarkModel>({
  tmName: "",//品牌名字
  logoUrl: "",//品牌图片地址
});
const ruleFormRef = ref<FormInstance>();//获取form表单结构
const rules = reactive<FormRules>({//验证规则
  tmName: [
    {required: true, message: "必须要输入品牌名称", trigger: "blur"},
    {min: 2, max: 10, message: "品牌名称在2到10个字之间", trigger: "blur"},
  ],
  logoUrl: [
    {required: true, message: "必须上传一张图片", trigger: "blur"},
  ],
});


//Dialog 对话框是否显示
const outerVisible = ref(false);
// const innerVisible = ref(false);


//表格数据
const trademarkList = ref<trademarkModel[]>([]);

//加载效果
const loading = ref<boolean>(false);

//分页器数据
let current = ref<number>(1);//当前是第几页
let pageSize = ref<number>(3);//每页几条数据
let total = ref<number>(0);//总共有多少条数据



//发送求情，获取数据
const getTrademarkList = async (page: number = current.value, limit: number = pageSize.value) => {
  try {
    loading.value = true;//加载效果
    let result = await getListByPageApi(page, limit);//发送求情得到数据
    trademarkList.value = result.records;//保存数据
    total.value = result.total || 0;
    loading.value = false;//关闭loading
    pageSize.value = limit;//重新赋值
    current.value = page;
    ElMessage({//提示信息
      message: "获取品牌数据成功",
      type: "success",
    });
  } catch (e) {
    ElMessage({
      message: `获取品牌数据失败,${e}`,
      type: "warning",
    });
  }
};


//添加
const addTrademark = () => {
  trademark.tmName = "";//清空表单数据
  trademark.logoUrl = "";
  trademark.id = undefined;//添加没有id
  outerVisible.value = true;//显示对话框
  if (!ruleFormRef.value) return;//判断是否有验证没有通过的信息，没有直接return
  ruleFormRef.value.resetFields();//有的话，清除信息
};
//修改
const updateTrademark = (row: trademarkModel) => {
  //数据反显
  trademark.id = row.id;
  trademark.tmName = row.tmName;
  trademark.logoUrl = row.logoUrl;
  outerVisible.value = true;//显示对话框
};
//删除
const deleteTrademark = async (row: trademarkModel) => {
  try {
    await ElMessageBox.confirm(`你确定要删除${row.tmName}吗?`, "Warning", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const loading = ElLoading.service({//开启loading
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)",
    });
    await removeByIdApi(row.id as number);//删除请求
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    loading.close();
    if (trademarkList.value.length === 1 && current.value > 1) {//判断数据所在页面是否只有一条
      current.value -= 1;
    }
    await getTrademarkList();//刷新页面
  } catch (e) {
    ElMessage({
      type: "info",
      message: "删除失败",
    });
  }
}
;

//确认保存/添加
const ok = () => {
  if (!ruleFormRef.value) return;//如果表单验证不通过，直接return
  ruleFormRef.value.validate(async (valid, fields) => {//valid布尔值,都验证通过为true,fields为没有通过的对象
    if (valid) {
      const loading = ElLoading.service({//开启loading
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      await saveOrUpdateApi(trademark);//修改或添加的请求
      loading.close();//关闭loading
      ElMessage({//提示
        message: "操作成功",
        type: "success",
      });
      outerVisible.value = false;//关闭Dialog 对话框
      await getTrademarkList(current.value, pageSize.value);//重新获取数据
    }
  });

};

//生命周期函数
onMounted(() => {
  getTrademarkList();
});
</script >

<script lang="ts" >
export default {
  name: "Trademark",
};
</script >

<style scoped >
.avatar-uploader .avatar {
  display: block;
  width: 178px;
  height: 178px;
}

/*.el-form-item__content {*/
/*    flex-direction: row;*/
/*}*/
</style >

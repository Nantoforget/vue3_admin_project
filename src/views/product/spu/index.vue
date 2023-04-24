<template >
  <!--  三级列表-->
  <CategorySelector :isDisabled="isDisabled" @clearList="clearList" @getCategoryList="getCategoryList" ></CategorySelector >
  <!--  sup数据列表-->
  <el-card v-if="showCard ==0" shadow="hover" >
    <el-button :disabled="category3Id==0" :icon="Plus" style="margin-bottom: 20px" type="primary" @click="addOrUpdateSpu" >添加SPU</el-button >
    <el-table v-loading="loading" :data="spuDate.records" border row-key="id" style="width: 100%" >
      <el-table-column align="center" label="序号" prop="id" type="index" width="100" />
      <el-table-column label="SPU名称" prop="spuName" />
      <el-table-column label="SPU描述" prop="description" />
      <el-table-column label="操作" >
        <template #default="{row}" >
          <el-button :icon="Plus" type="primary" @click="addSku(row)" ></el-button >
          <el-button :icon="Edit" type="primary" @click="addOrUpdateSpu(row)" ></el-button >
          <el-button :icon="InfoFilled" type="info" @click="skuListPage(row.id,row.spuName)" ></el-button >
          <el-popconfirm :title="`你确定要删除${row.spuName}?`" @confirm="deleteSpu(row.id)" >
            <template #reference >
              <el-button :icon="Delete" type="danger" ></el-button >
            </template >
          </el-popconfirm >
        </template >
      </el-table-column >
    </el-table >
    <!--分页器-->
    <el-pagination v-model:current-page="current" v-model:page-size="pageSize" :page-sizes="[3,5,7,9]" :small="false" :total="spuDate.total" background layout=", prev, pager, next, jumper,->,sizes,total" style="margin-top: 30px" @size-change="val=>getSpuInfoListByPageLimit(current,val)" @current-change="val=>getSpuInfoListByPageLimit(val,pageSize)" />
  </el-card >
  <!--  添加或修改-->
  <el-card v-else-if="showCard==1" v-loading="loadingAddOrUpdate" shadow="hover" >
    <el-form :model="spuInfo" :rules="rules" >
      <el-form-item label="SPU名称" prop="spuName" >
        <el-input v-model="spuInfo.spuName" />
      </el-form-item >
      <el-form-item label="SPU品牌" prop="tmId" >
        <el-select v-model="tmName" placeholder="请选择品牌" >
          <el-option v-for="item in records" :key="item.id" :label="item.tmName" :value="item.tmName" @click="selectTmValue(item.id)" />
        </el-select >
      </el-form-item >
      <el-form-item label="SPU描述" prop="description" >
        <el-input v-model="spuInfo.description" :rows="4" placeholder="请输入SPU描述信息" type="textarea" />
      </el-form-item >
      <el-form-item label="SPU图片" prop="spuImageList" >
        <el-upload v-model:file-list="fileList" :action="`${BASE_URL}/admin/product/fileUpload`" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleAvatarSuccess" list-type="picture-card" show-file-list >
          <el-icon >
            <Plus />
          </el-icon >
        </el-upload >
        <el-dialog v-model="dialogVisible" >
          <img :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog >
      </el-form-item >
      <el-form-item label="销售属性" prop="spuSaleAttrList" >
        <el-select v-model="saleValue" :placeholder="`还有${hasSaleAttrList.length}个未选择`" class="m-2" >
          <el-option v-for="item in hasSaleAttrList" :key="item.id" :label="item.name" :value="item.name" @click="selectSaleAttrValue(item.id,item.name)" />
        </el-select >
        <el-button :disabled="addSaleBtn" :icon="Plus" style="margin:0 0 0 20px" type="primary" @click="addSaleValueList" >添加销售属性</el-button >
        <el-table :data="saleTableDateList" border row-key="id" style="margin-top: 20px" >
          <el-table-column align="center" label="序号" prop="id" type="index" width="80" ></el-table-column >
          <el-table-column label="属性名" prop="saleAttrName" width="120" ></el-table-column >
          <el-table-column label="属性值名称列表" prop="spuSaleAttrValueList" >
            <template #default="{row}" >
              <el-tag v-for="tag in row.spuSaleAttrValueList" :key="tag.id" closable style="margin:0 5px" type="success" @close="handleClose(tag,row)" >
                {{ tag.saleAttrValueName }}
              </el-tag >
              <el-input v-if="inputVisible1==row.baseSaleAttrId && inputVisible" ref="InputRef" v-model="inputValue" size="small" style="width: 60px;" @blur="handleInputConfirm(row)" @keyup.enter="handleInputConfirm(row)" />
              <el-button v-else :icon="Plus" size="small" @click="showInput(row)" ></el-button >
            </template >
          </el-table-column >
          <el-table-column label="操作" prop="" width="120" >
            <template #default="{row}" >
              <el-button :icon="Delete" type="danger" @click="deleteValueList(row)" ></el-button >
            </template >
          </el-table-column >
        </el-table >
      </el-form-item >
    </el-form >
    <div style="margin-top: 30px" >
      <el-button type="primary" @click="saveSpu" >保存</el-button >
      <el-button @click="cancel" >取消</el-button >
    </div >
  </el-card >
  <!--  SKU列表v-if="dialogTableVisible"-->
  <SkuList ref="skuList" v-loading="loadingSkuList" ></SkuList >
  <!--  添加sku-->
  <AddSkuInfo v-if="showCard==2" :spuGetSkuInfo="spuGetSkuInfo" @cancel="cancel" ></AddSkuInfo >
</template >

<script lang="ts" setup >

import type {
  pageModel,
  spuAttrListModel,
  spuInfoModel,
  spuSaleAttrListModel, spuSaleAttrModel,
  spuSaleAttrValueModel,
} from "@/api/product/model/spuModel";
import type {trademarkModel} from "@/api/product/model/trademarkModel";
import {getSpuImageListApi, getSpuSaleAttrListApi} from "@/api/product/sku";
import {deleteSpuBySpuIdApi, getBaseSaleAttrListApi, getInfoByPageLimitApi, saveSpuInfoApi, updateSpuInfoApi} from "@/api/product/spu";
import {getByIdApi, getListApi} from "@/api/product/trademark";
import CategorySelector from "@/components/CategorySelector/index.vue";
import AddSkuInfo from "@/views/product/spu/components/addSkuInfo.vue";
import {Delete, Edit, Plus, InfoFilled} from "@element-plus/icons-vue";
import {ElInput, ElMessage} from "element-plus";
import type {FormRules, UploadProps, UploadUserFile} from "element-plus";
import {nextTick, reactive, ref} from "vue";
import {BASE_URL} from "@/main";//定义根路径图片地址
import {cloneDeep} from "lodash";
import SkuList from "../spu/components/skuList.vue";
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
const loading = ref(false);//加载效果
const showCard = ref<number>(0);//显示那个卡片card;0:spu数据页面；1：添加或修改spu页面；2：添加sku;
/**
 * spu的添加或修改的页面
 */
const addOrUpdateSpu = async (row: spuInfoModel) => {
  if (row.id) {//有id代表修改
    //回显数据
    spuInfo.id = row.id;
    spuInfo.spuName = row.spuName;
    spuInfo.description = row.description;
    spuInfo.spuSaleAttrList = row.spuSaleAttrList;
    spuInfo.spuImageList = row.spuImageList;
    spuInfo.tmId = row.tmId;

    await getSpuImgList(row.id);//根据spuId获取spu图片列表
    await getSaleAttrValueList();//获取销售属性值列表
  } else {//没有id为修改
    //重置对象
    reset();
  }
  await getTrademarkOrList(row.tmId as number);//根据tmId获取品牌信息
  isDisabled.value = false;//将三级分类下拉框禁用
  spuInfo.category3Id = category3Id.value;//不管添加还是修改，都要有category3Id
  await getSaleAttrList();//获取销售属性
  hasSaleAttr();//计算可用的销售属性
  showCard.value = 1;//显示修改或添加的页面卡片
};
/**
 * 删除spu对象
 * @param spuId spuId
 */
const deleteSpu = async (spuId: number) => {
  try {
    await deleteSpuBySpuIdApi(spuId);
    ElMessage.success("删除成功");
    await getSpuInfoListByPageLimit();
  } catch (e) {
    ElMessage.error("出现问题了");
  }
};
const skuList = ref<any>();//获取子组件节点
const loadingSkuList = ref<boolean>(false);//加载效果
/**
 * 显示sku列表
 */
const skuListPage = async (spuId: number, spuName: string) => {
  //将这个暴露给父组件，父组件通过ref操作子组件数据
  loadingSkuList.value = true;//加载效果
  skuList.value.spuId = spuId;//给子组件spuId
  skuList.value.spuName = spuName;//给子组件spuName
  await skuList.value.getSkuInfoBySpuId();//触发子组件方法
  loadingSkuList.value = false;//关闭加载效果
  skuList.value.dialogTableVisible = true;//开启sku列表页面
};

//添加sku数据时穿给子组件的数据
const spuGetSkuInfo = reactive({
  spuName: "",
  spuId: 0,
  category1Id: 0,
  category2Id: 0,
  category3Id: 0,
  tmId: 0,
});
/**
 * 添加sku
 * @param row 列表数据对象
 */
const addSku = (row: spuInfoModel) => {
  isDisabled.value = false;
  spuGetSkuInfo.spuName = row.spuName;
  spuGetSkuInfo.spuId = row.id as number;
  spuGetSkuInfo.category1Id = category1Id.value;
  spuGetSkuInfo.category2Id = category2Id.value;
  spuGetSkuInfo.category3Id = category3Id.value;
  spuGetSkuInfo.tmId = row.tmId as number;
  showCard.value = 2;
};
//第三个卡片card添加或修改的卡片card***********************
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
  description: [
    {required: true, message: "必须输入SPU描述", trigger: "blur"},
    {min: 1, message: "必须输入SPU名称", trigger: "blur"},
  ],
  spuImageList: [
    {required: true, message: "必须上传SPU图片", trigger: "blur"},
  ],
  spuSaleAttrList: [
    {required: true, message: "必须添加SPU销售属性", trigger: "blur"},
  ],
});

/**
 * 根据tmId获取品牌信息
 * @param tmId 品牌id
 */
const getTrademarkOrList = async (tmId: number) => {
  try {
    const result = await getByIdApi(tmId);//根据id获取品牌数据
    if (result) {
      tmName.value = result.tmName;//成功的话，去名称
    } else {
      tmName.value = tmId as any;//不成功的话取品牌id
    }
    records.value = await getListApi();//获取全部品牌数据
  } catch (e) {
    ElMessage.error();
  }
};
/**
 * 根据spuId获取图片列表
 * @param spuId spuId
 */
const getSpuImgList = async (spuId: number) => {
  const result = await getSpuImageListApi(spuId);
  fileList.value = [];//重置，防止出现bug
  result.forEach((ele) => {
    fileList.value.push(cloneDeep({url: ele.imgUrl, name: ele.imgName}));//复制数据
  });
};

/**
 * 选中某个品牌，将其品牌id保存到spuInfo对象中
 * @param id 选中的值的id
 */
const selectTmValue = (id: any) => {
  spuInfo.tmId = id;//保存品牌id
};

//上传图片
const dialogImageUrl = ref("");//大图的图片路径
const dialogVisible = ref(false);//显示大图的对话框
const fileList = ref<UploadUserFile[]>([]);//用于显示图片的数组
/**
 * 移除图片的操作(有两个参数,没有用到) uploadFile 移出的那一张图片uploadFiles 剩下的图片（数组）
 */
const handleRemove: UploadProps["onRemove"] = () => {
  spuInfo.spuImageList = [];//清空
  fileList.value.forEach((ele) => {//将最后的图片保存在spu的图片列表中，用于请求的参数
    spuInfo.spuImageList.push(cloneDeep({imgName: ele.name, imgUrl: ele.url as string, spuId: spuInfo.id as number, status: ele.status, uid: ele.uid}));
  });
};
/**
 * 图片上传成功的操作，将图片保存
 * @param response 图片的地址
 * @param uploadFile 上传的信息，包含response
 */
const handleAvatarSuccess: UploadProps["onSuccess"] = (response, uploadFile) => {
  spuInfo.spuImageList = [];//清空
  fileList.value.forEach((ele) => {//将最后的图片保存在spu的图片列表中，用于请求的参数
    spuInfo.spuImageList.push(cloneDeep({imgName: ele.name, imgUrl: (ele.response as any || {}).data, spuId: spuInfo.id as number, status: ele.status, uid: ele.uid}));
  });
};
/**
 * 点击放大镜，放大图片
 * @param uploadFile 选中的图片信息
 */
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url as any;//显示大图
  dialogVisible.value = true;//打开大图所在的对话框
};

//销售属性
const saleAttrList = ref<spuAttrListModel>([]);//存储请求回来的销售属性
const hasSaleAttrList = ref<spuAttrListModel>([]);//还剩得销售属性
const saleValue = ref<string>("");//选择的销售属性
const addSaleBtn = ref<boolean>(true);//控制添加销售属性按钮是否可用
const inputVisible = ref<boolean>(false);//input框是否显示
const inputVisible1 = ref<number>(-1);//input框在那行显示
const inputValue = ref<string>("");//input关联的
const InputRef = ref();//获取inputDOM节点
const saleTableDateList = ref<spuSaleAttrListModel>([]);//销售属性表格数据
//属性对象
const saleAttr = reactive<spuSaleAttrModel>({
  spuId: 0,//spu的id
  baseSaleAttrId: 0,//销售属性id
  saleAttrName: "",//名字
  spuSaleAttrValueList: [],//销售属性列表
});
const saleAttrValue = reactive<spuSaleAttrValueModel>({//属性值对象
  baseSaleAttrId: 0,//销售属性id
  isChecked: null,//是否选中
  saleAttrName: "",//属性名称
  saleAttrValueName: "",//属性值名称
  spuId: 0,//spuId
});
/**
 * 获取销售属性
 */
const getSaleAttrList = async () => {
  saleAttrList.value = await getBaseSaleAttrListApi();//保存
};
/**
 * 获取某一项的销售属性值列表
 */
const getSaleAttrValueList = async () => {
  saleTableDateList.value = await getSpuSaleAttrListApi(spuInfo.id as number);
};
/**
 * 计算可选择的销售属性还有多少
 */
const hasSaleAttr = () => {
  hasSaleAttrList.value = [];
  saleAttrList.value.forEach(item => {
    let d = 0;
    saleTableDateList.value.forEach(ele => {
      if (item.id == ele.baseSaleAttrId) {
        d++;
      }
    });
    if (d == 0) {
      hasSaleAttrList.value.push(item);
    }
  });
};
/**
 * 选择销售属性进行添加
 * @param id 销售属性的id
 * @param name 销售属性的名字
 */
const selectSaleAttrValue = (id: number, name: string) => {
  addSaleBtn.value = false;
  selectId.value = id;
  selectName.value = name;
};
const selectId = ref<number>(0);//选中销售属性的id
const selectName = ref<string>("");//选中销售属性的名称
/**
 * 添加销售属性
 */
const addSaleValueList = () => {
  addSaleBtn.value = true;//禁用按钮
  saleAttr.spuId = spuInfo.id as number;//保存数据
  saleAttr.baseSaleAttrId = selectId.value;
  saleAttr.saleAttrName = selectName.value;
  saleTableDateList.value.push(cloneDeep(saleAttr));//深拷贝
  hasSaleAttr();//重新进行剩余属性值计算
  saleValue.value = "";//重置
  saleAttr.spuId = 0;
  saleAttr.baseSaleAttrId = 0;
  saleAttr.saleAttrName = "";
};


/**
 * 添加属性值，出现input框
 */
const showInput = (row: spuSaleAttrModel) => {
  inputValue.value = "";//每次都重置input框的值
  inputVisible1.value = row.baseSaleAttrId as number;//保存将要显示input框的id
  inputVisible.value = true;//显示input框
  nextTick(() => {//DOM更新后，input自动获取焦点
    InputRef.value.focus();
  });
};
/**
 * input框失去焦点或回车，input框消失
 */
const handleInputConfirm = (row: spuSaleAttrModel) => {
  inputVisible.value = false;//input框消失
  inputValue.value = inputValue.value.trim();//去掉空格
  if (inputValue.value.length) {//判断用户输入的是否为空
    saleAttrValue.baseSaleAttrId = row.baseSaleAttrId;//保存数据到临时对象
    saleAttrValue.saleAttrName = row.saleAttrName;
    saleAttrValue.spuId = row.spuId;
    saleAttrValue.saleAttrValueName = inputValue.value;
    const attrIndex = seek(row);//找到操作的对象的下标
    saleTableDateList.value[attrIndex].spuSaleAttrValueList.push(cloneDeep(saleAttrValue));//深拷贝
  } else {
    ElMessage.warning("请输入内容");
  }

};
/**
 * 属性值点×删除
 * @param tag 删除的这一项
 * @param row 删除的父亲
 */
const handleClose = (tag: spuSaleAttrValueModel, row: spuSaleAttrModel) => {
  const {attrId, attrValueId} = seek(row, tag);
  saleTableDateList.value[attrId].spuSaleAttrValueList.splice(attrValueId, 1);//删除
};
/**
 * 找到所属的下标
 * @param tag 删除的这一项
 * @param row 删除的父亲
 */
const seek = (row: spuSaleAttrModel, tag?: spuSaleAttrValueModel) => {
  const attrId: any = saleTableDateList.value.findIndex((ele) => {
    return ele.baseSaleAttrId == row.baseSaleAttrId;
  });//动的是那个属性里的
  if (tag) {
    const attrValueId: any = saleTableDateList.value[attrId].spuSaleAttrValueList.findIndex((ele) => {
      return ele.id == (tag as spuSaleAttrValueModel).id;
    });//动的是属性里那个属性值
    return {attrId, attrValueId};
  }
  return attrId;
};
/**
 * 删除销售属性的一项
 * @param row 某一项销售属性
 */
const deleteValueList = (row: spuSaleAttrModel) => {
  //找到要删除的下标
  const delIndex = saleTableDateList.value.findIndex((ele) => {
    return ele.baseSaleAttrId == row.baseSaleAttrId;
  });
  saleTableDateList.value.splice(delIndex, 1);//删除
  hasSaleAttr();
};
/**
 * 重置数据
 */
const reset = () => {
  //spu对象
  spuInfo.spuName = "";
  spuInfo.description = "";
  spuInfo.spuSaleAttrList = [];
  spuInfo.spuImageList = [];

  tmName.value = "";//品牌名称
  fileList.value = [];//图片列表
  saleValue.value = "";//选择的销售属性
  addSaleBtn.value = true;//控制添加销售属性按钮是否可用
  saleTableDateList.value = [];////销售属性表格数据

  //销售属性对象
  saleAttr.spuId = 0;
  saleAttr.saleAttrName = "";
  saleAttr.spuSaleAttrValueList = [];
  saleAttr.baseSaleAttrId = 0;

  //销售属性值对象
  saleAttrValue.baseSaleAttrId = 0;
  saleAttrValue.saleAttrName = "";
  saleAttrValue.saleAttrValueName = "";
  saleAttrValue.spuId = 0;
};
const loadingAddOrUpdate = ref<boolean>(false);
//保存
const saveSpu = async () => {
  loadingAddOrUpdate.value = true;//loading效果
  //整合数据
  spuInfo.spuSaleAttrList = saleTableDateList.value;
  try {
    if (spuInfo.id) {//修改
      await updateSpuInfoApi(spuInfo);
    } else {//添加
      await saveSpuInfoApi(spuInfo);
    }
    ElMessage.success("操作成功");
  } catch (e) {
    ElMessage.error("操作失败");
  }
  showCard.value = 0;//关闭修改添加页面
  loadingAddOrUpdate.value = false;//loading效果关闭
  await getSpuInfoListByPageLimit();//重新获取数据
  isDisabled.value = true;
};
/**
 * 取消按钮，关闭修改或添加页面
 */
const cancel = () => {
  showCard.value = 0;
  isDisabled.value = true;
};

</script >

<script lang="ts" >
export default {
  name: "Spu",
};
</script >

<style scoped >

</style >

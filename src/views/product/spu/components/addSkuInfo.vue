<template >
  <el-card shadow="hover" >
    <el-form ref="ruleFormRef" :model="skuInfo" :rules="rules" label-width="120px" >
      <el-form-item label="SPU名称" >
        {{ getOneSkuInfo.spuName }}
      </el-form-item >
      <el-form-item label="SKU名称" prop="skuName" >
        <el-input v-model="skuInfo.skuName" placeholder="请输入SKU名称" />
      </el-form-item >
      <el-form-item label="价格(元)" prop="price" >
        <el-input-number v-model="skuInfo.price" controls-position="right" style="width: 100%;" />
      </el-form-item >
      <el-form-item label="重量(千克)" prop="weight" >
        <el-input-number v-model="skuInfo.weight" :precision="2" controls-position="right" style="width: 100%; " text-align="left" />
      </el-form-item >
      <el-form-item label="规格描述" prop="skuDesc" >
        <el-input v-model="skuInfo.skuDesc" :rows="4" placeholder="请输入SKU规格描述" type="textarea" />
      </el-form-item >
      <el-form-item label="平台属性" prop="skuAttrValueList" >
        <div v-for="attr in addSkuStore.skuAttr" :key="attr.id" style="margin: 0 30px 15px 0" >
          <span style="font-weight: bold;margin-right: 15px" >{{ attr.attrName }}</span >
          <el-select v-model="attr.value" placeholder="请选择" style="width: 240px" @change="attrSelect(attr)" >
            <el-option v-for="item in attr.attrValueList" :key="item.id" :label="item.valueName" :value="item.valueName" />
          </el-select >
        </div >
      </el-form-item >
      <el-form-item label="销售属性" prop="skuSaleAttrValueList" >
        <div v-for="sale in addSkuStore.skuSaleAttr" :key="sale.id" style="margin-right: 30px" >
          <span style="font-weight: bold;margin-right: 15px" >{{ sale.saleAttrName }}</span >
          <el-select v-model="sale.value" placeholder="请选择" style="width: 240px" @change="saleSelect(sale)" >
            <el-option v-for="item in sale.spuSaleAttrValueList" :key="item.id" :label="item.saleAttrValueName" :value="item.saleAttrValueName" />
          </el-select >
        </div >
      </el-form-item >
      <el-form-item label="图片列表" prop="skuImageList" >
        <el-table ref="multipleTableRef" :data="addSkuStore.skuImg" :row-key="getImgId" border style="width: 100%" @selection-change="handleSelectionChange" >
          <el-table-column :reserve-selection="true" type="selection" width="55" />
          <el-table-column label="图片" >
            <template #default="{row}" >
              <img :alt="row.imgName" :src="row.imgUrl" height="100" width="100" />
            </template >
          </el-table-column >
          <el-table-column label="名称" property="imgName" />
          <el-table-column label="操作" show-overflow-tooltip >
            <template #default="{row}" >
              <el-tag v-if="row.isDefault==='1'" type="success" >默认</el-tag >
              <el-button v-else type="primary" @click="isDefault(row)" >设为默认</el-button >
            </template >
          </el-table-column >
        </el-table >
      </el-form-item >
      <el-form-item >
        <template #default="{}" >
          <el-button type="primary" @click="saveSkuInfo(ruleFormRef)" >保存</el-button >
          <el-button @click="emits('cancel')" >取消</el-button >
        </template >
      </el-form-item >
    </el-form >
  </el-card >
</template >

<script lang="ts" setup >
import type {attrInfoListModel} from "@/api/product/model/attrModel";
import type {skuAttrValueModel, skuInfoModel, skuSaleAttrValueModel} from "@/api/product/model/skuModel";
import type {spuImageListModel, spuImageModel} from "@/api/product/model/spuModel";
import type {spuSaleAttrModel} from "@/api/product/model/spuModel";
import {saveSkuInfoApi} from "@/api/product/sku";
import {useAddSKuStore} from "@/stores/product/skuStore";
import {ElMessage, ElTable} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";
import {cloneDeep} from "lodash";
import {nextTick, onMounted, reactive, ref} from "vue";

const props = defineProps(["getOneSkuInfo"]);//接受父组件传递的spuId
const emits = defineEmits(["cancel"]);//接受父组件传递的取消方法
//提取数据
const addSkuStore = useAddSKuStore();
/**
 * 发送请求得到skuInfo
 */
const getSkuInfo = () => {
  addSkuStore.getSKuSaleAttrList(props.getOneSkuInfo.spuId);//销售属性
  addSkuStore.getSkuAttrList(props.getOneSkuInfo.category1Id, props.getOneSkuInfo.category2Id, props.getOneSkuInfo.category3Id);//平台属性
};
/**
 * 获取图片
 */
const getImgListAndDefault = async () => {
  await addSkuStore.getSkuImgList(props.getOneSkuInfo.spuId);//图片列表
  checked();//默认选中操作
};
/**
 * 默认选中
 */
const checked = () => {
  nextTick(() => {
    addSkuStore.skuImg.forEach((ele) => {
      if (addSkuStore.skuImg.length > 0 && ele.isDefault == "1") {
        (multipleTableRef.value as any).toggleRowSelection(ele, true);//将默认的图片选中
      }
    });
  });
};

onMounted(() => {
  console.log(props.getOneSkuInfo);
  getSkuInfo();//获取数据
  getImgListAndDefault();//获取图片
});
/**
 * 设为默认操作
 * @param row 设为默认的列表对象
 */
const isDefault = (row: spuImageModel) => {
  //排他
  addSkuStore.skuImg.forEach((ele) => {
    ele.isDefault = "0";
  });
  row.isDefault = "1";
  skuInfo.skuDefaultImg = row.imgUrl;
  checked();//如果设置的是没有选中的，则选中
};

//平台属性
const skuAttr = reactive<skuAttrValueModel>({
  // id:0,
  attrId: 0,
  valueId: 0,
  attrName: "",//属性名称
  valueName: "",//属性值名称
});
/**
 * 保存sku的频台属性
 * @param attr 每个平台属性对象
 */
const attrSelect = (attr: attrInfoListModel) => {
  //保存所选数据
  skuAttr.attrId = attr.id as number;
  skuAttr.attrName = attr.attrName;
  skuAttr.valueName = attr.value as string;
  //属性值id
  attr.attrValueList.forEach((ele) => {
    if (attr.value == ele.valueName) {
      skuAttr.valueId = ele.id as number;
    }
  });
  //判断是否修改的同一个平台属性，每个平台属性只能选一个值，更换需要将前一个删除
  const isIas = skuInfo.skuAttrValueList.findIndex((ele) => {
    return skuAttr.attrId == ele.attrId;
  });
  //如果不等于-1说明已经选择了这个平台属性的属性值，需要删除前一个
  if (isIas != -1) {
    skuInfo.skuAttrValueList.splice(isIas, 1);
  }
  skuInfo.skuAttrValueList.push(cloneDeep(skuAttr));//拷贝
};
//销售属性
const skuSaleAttr = reactive<skuSaleAttrValueModel>({
  // id: 0,
  // skuId: 0,
  spuId: 0,
  saleAttrValueId: 0,
  saleAttrId: 0,
  saleAttrName: "",
  saleAttrValueName: "",
});
/**
 * 获取sku的销售属性
 * @param sale 销售属性对象
 */
const saleSelect = (sale: spuSaleAttrModel) => {
  //保存所选数据
  skuSaleAttr.spuId = sale.spuId;
  skuSaleAttr.saleAttrId = sale.id as number;
  skuSaleAttr.saleAttrName = sale.saleAttrName;
  skuSaleAttr.saleAttrValueName = sale.value as string;
  //属性值id
  sale.spuSaleAttrValueList.forEach((ele) => {
    if (sale.value == ele.saleAttrValueName) {
      skuSaleAttr.saleAttrValueId = ele.id as number;
    }
  });
  //判断是否修改的同一个平台属性，每个平台属性只能选一个值，更换需要将前一个删除
  const isIas = skuInfo.skuSaleAttrValueList.findIndex((ele) => {
    return skuSaleAttr.saleAttrId == ele.saleAttrId;
  });
  //如果不等于-1说明已经选择了这个平台属性的属性值，需要删除前一个
  if (isIas != -1) {
    skuInfo.skuSaleAttrValueList.splice(isIas, 1);
  }
  skuInfo.skuSaleAttrValueList.push(cloneDeep(skuSaleAttr));//拷贝
};

const multipleTableRef = ref<InstanceType<typeof ElTable>>();//表格DOM
/**
 * 获取表格中列表的id
 * @param row 列表对象
 */
const getImgId = (row: any) => {
  return row.id;
};
/**
 * 表格数据选中状态变化时触发
 * @param selection 每一项数据对象
 */
const handleSelectionChange = (selection: spuImageListModel) => {
  selection.forEach((ele) => {
    ele.spuImgId = ele.spuId;
  });
  skuInfo.skuImageList = selection as any;//保存数据
};

/**
 * 保存skuInfo
 */
const saveSkuInfo = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      skuInfo.category3Id = props.getOneSkuInfo.category3Id;
      skuInfo.spuId = props.getOneSkuInfo.spuId;
      skuInfo.tmId = props.getOneSkuInfo.tmId;
      if (!skuInfo.skuDefaultImg) {
        skuInfo.skuDefaultImg = addSkuStore.skuImg[0].imgUrl;
      }
      try {
        await saveSkuInfoApi(skuInfo);
        emits("cancel");
        ElMessage.success("操作成功");
      } catch (e) {
        ElMessage.error("操作失败");
      }
    } else {
      // console.log("error submit!", fields);
      ElMessage.warning("请按验证填写数据");
    }
  });
};


//初始的sku数据
const skuInfo = reactive<skuInfoModel>({
  category3Id: 0,
  isSale: 0,
  price: 0,
  skuAttrValueList: [],
  skuDefaultImg: "",
  skuDesc: "",
  skuImageList: [],
  skuName: "",
  skuSaleAttrValueList: [],
  spuId: 0,
  tmId: 0,
  weight: "",
});

//表单验证
const ruleFormRef = ref<FormInstance>();
//验证规则
const rules = reactive<FormRules>({
  skuName: [{required: true, message: "必须填写SKU名称", trigger: "blur"}],
  price: [{required: true, type: "number", min: 1, message: "必须填写价格,且大于0", trigger: "blur"}],
  weight: [{required: true, type: "number", min: 0.001, message: "必须填写重量,且大于0", trigger: "blur"}],
  skuDesc: [{required: true, message: "必须填写规格描述", trigger: "blur"}],
  skuAttrValueList: [{required: true, type: "array", message: "至少选择选择一个平台属性", trigger: "change"}],
  skuSaleAttrValueList: [{required: true, type: "array", message: "至少选择选择一个销售属性", trigger: "change"}],
  skuImageList: [{required: true, type: "array", message: "至少选择选择一个图片", trigger: "change"}],
});
</script >

<script lang="ts" >
export default {
  name: "AddSkuInfo",
};
</script >

<style scoped >
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style >

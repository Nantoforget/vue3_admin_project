<template >
  <CategorySelector :isDisabled="isDisabled" @clearList="clearList" @getCategoryList="getCategoryList" ></CategorySelector >
  <!--    第二张card卡片-->
  <el-card v-if="isDisabled" shadow="hover" >
    <!--        添加按钮-->
    <el-button :disabled="category3Id==0" :icon="Plus" type="primary" @click="saveOrUpdate" >添加属性</el-button >
    <!--        表格数据（商品属性值）-->
    <el-table :data="attrsList" border row-key="id" stripe style="width: 100%;margin-top: 20px" >
      <el-table-column align="center" label="序号" type="index" width="80" />
      <el-table-column label="属性名称" prop="attrName" width="180" />
      <el-table-column label="属性值列表" >
        <template v-slot:default="{row}" >
          <el-tag v-for="tag in row.attrValueList" :key="tag.id" style="margin-right: 10px" type="success" >
            {{ tag.valueName }}
          </el-tag >
        </template >
      </el-table-column >
      <el-table-column label="操作" width="200" >
        <template #default="{row}" >
          <el-tooltip content="修改" effect="dark" placement="top" >
            <el-button :icon="Edit" type="primary" @click="saveOrUpdate(row)" ></el-button >
          </el-tooltip >
          <el-tooltip content="删除" effect="dark" placement="top" >
            <el-popconfirm :title="`确定要删除${row.attrName}吗？`" @confirm="deleteAttr(row.id)" >
              <template #reference >
                <el-button :icon="Delete" type="danger" ></el-button >
              </template >
            </el-popconfirm >
          </el-tooltip >
        </template >
      </el-table-column >
    </el-table >
  </el-card >
  <!--    第三张卡片，添加或修改-->
  <el-card v-else shadow="hover" style="margin-top: 30px" >
    <el-row :gutter="20" style="margin-bottom: 20px" >
      <span style="text-align: center;height: 30px;line-height: 30px;margin-right: 20px;font-weight: bold" >属性名</span >
      <el-input v-model="atName" style="width: 200px;" />
    </el-row >
    <el-button :disabled="atName==''" :icon="Plus" type="primary" @click="addAttr" >添加属性值</el-button >
    <el-button @click="cancel" >取消</el-button >
    <el-table :data="attrValues" border row-key="id" stripe style="width: 100%;margin-top: 20px;margin-bottom: 20px" >
      <el-table-column align="center" label="序号" type="index" width="80" />
      <el-table-column label="属性值名称" prop="valueName" >
        <template #default="{row,$index}" >
          <div style="width: 100%;" @click="cellClick($index)" >
            <span v-if="spanInputShow===$index" >
              <el-input ref="input" v-model="row.valueName" @blur="blurInput(row,$index)" />
            </span >
            <span v-else >{{ row.valueName }}</span >
          </div >
        </template >
      </el-table-column >
      <el-table-column label="操作" width="800" >
        <template #default="{row,$index}" >
          <el-tooltip content="删除" effect="dark" placement="top" >
            <el-popconfirm :title="`确定要删除${row.valueName}吗？`" @confirm="delAttrValue($index)" >
              <template #reference >
                <el-button :icon="Delete" type="danger" ></el-button >
              </template >
            </el-popconfirm >
          </el-tooltip >
        </template >
      </el-table-column >
    </el-table >
    <el-button :disabled="atName=='' || attrValues.length==0" type="primary" @click="save" >保存</el-button >
    <el-button @click="cancel" >取消</el-button >
  </el-card >
</template >

<script lang="ts" setup >

import {deleteAttrByIdApi, getAttrInfoListApi, getAttrValueListApi, saveAttrInfoApi} from "@/api/product/attr";
import type {attrInfoListModel, attrModel, attrValueListModel} from "@/api/product/model/attrModel";
import CategorySelector from "@/components/CategorySelector/index.vue";
import {ElMessage} from "element-plus";
import {Delete, Edit, Plus} from "@element-plus/icons-vue";
import {nextTick, reactive, ref} from "vue";

//第一个card卡片的逻辑业务************************************************************************
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
  attrsList.value = await getAttrInfoListApi(category1Id.value, category2Id.value, category3Id.value);//将数据保存
};
/**
 * 没有三级列表数据，数据不展示
 */
const clearList = () => {
  attrsList.value = [];//清空数据
  category3Id.value = 0;//重置category3Id
};


//第二个card卡片的逻辑业务************************************************************************

const attrsList = ref<attrInfoListModel[]>([]);//表格数据,当第三层的列表选择完毕后发送求救获取数据保存到这里
const saveAttrList = reactive<attrInfoListModel>({//保存或添加属性的全部数据的对象
  attrName: "",//属性名
  categoryId: -1,//
  categoryLevel: 3,
  attrValueList: [],
});
/**
 * 该函数是修改或添加按钮的实现，打开一个新的卡片card
 */
const saveOrUpdate = async (row: attrInfoListModel) => {
  if (row.id) {//修改
    isDisabled.value = false;//修改页面显示
    atName.value = row.attrName;//将表单数据显示其名字
    attrValueId.value = row.id;//保存id，属性值对象中要用到
    attrValues.value = await getAttrValueListApi(row.id);
  } else {//添加
    atName.value = "";//将表单数据显示其名字
    attrValueId.value = 0;
    attrValues.value = [];//将其初始化
    isDisabled.value = false;//修改页面显示
  }
};
/**
 * 根据id删除属性对象
 * @param attrId 该属性对象的id
 */
const deleteAttr = async (attrId: number) => {
  try {
    await deleteAttrByIdApi(attrId);//删除
    ElMessage.success("操作成功");
    await getCategoryList();//重新获取数据
  } catch (e) {
    ElMessage.error("操作失败");
  }
};

//第三个card卡片************************************************************************
const atName = ref<string>("");//与input框绑定的属性名称
const attrValues = ref<attrValueListModel>([]);//修改的某一项数据
const isDisabled = ref<boolean>(true);//控制修改或删除页面的显示

/**
 * 取消功能，添加或修改功能的取消
 */
const cancel = () => {
  isDisabled.value = true;//显示input框
  spanInputShow.value = -1;//重置那个显示input框的初始值
};
/**
 * 添加属性值，点击出现input框
 */
const addAttr = () => {
  const last = attrValues.value.at(-1);//判断数组有没有值
  if (attrValues.value.length == 0) {//如果为0，则为添加，直接push一个对象
    attrValues.value.push({
      valueName: "",
      attrId: attrValueId.value,
    });
  } else if ((last as attrModel).valueName) {//如果最后一个还没有添加名字，则不进行push
    attrValues.value.push({
      valueName: "",
      attrId: attrValueId.value,
    });
  }
  cellClick(attrValues.value.length - 1);//显示input框并自动获取焦点
};

const spanInputShow = ref<number>(-1);//那个显示input框的标识
const input = ref<any>();//获取input框的DOM节点

/**
 * 点击某一个，显示input框，input框显示后自动获取焦点
 * @param index，索引值下标
 */
const cellClick = async (index: number) => {
  spanInputShow.value = index;//显示索引值为index的input框
  await nextTick(() => {//在DOM更新后，获取input的DOM节点
    input.value.focus();//自动获取焦点
  });
};

/**
 * 作用是，当input框失去焦点时，input框隐藏
 * @param row 失去焦点时的对象
 * @param index 当前对象的下标
 */
const blurInput = (row: attrModel, index: number) => {
  const hasSpace = row.valueName.trim();//得到去除空格的数据
  if (hasSpace) {//当前存在名字
    row.valueName = hasSpace;//显示没有空格的数据
    spanInputShow.value = -1;//初始化显示input的标识
  } else {
    attrValues.value.splice(index, 1);//不存在名字删除，删除空行
  }
};

const attrValueId = ref<number>(0);//保存属性对象的id

/**
 * 删除属性值对象中的属性值
 * @param index 传来的下标
 */
const delAttrValue = (index: number) => {
  attrValues.value.splice(index, 1);
};

/**
 * 保存添加或修改的数据
 */
const save = async () => {
  if (attrValueId.value) {//判断是否有id，有的话为修改，没有为添加
    saveAttrList.id = attrValueId.value;//有id，将属性值对象中的attrId等于属性对象的id
  }
  await saveByHasId();//请求的封装函数
};
/**
 * 封装的保存和刷新的请求函数，修改和添加的共同部分
 */
const saveByHasId = async () => {
  saveAttrList.attrName = atName.value;//获取属性名
  saveAttrList.attrValueList = attrValues.value;//属性值列表数组
  saveAttrList.categoryId = category3Id.value;//三级列表的id
  try {//成功
    await saveAttrInfoApi(saveAttrList);//保存
    ElMessage.success("操作成功");//提示
    isDisabled.value = true;//关闭修改或添加页面
    await getCategoryList();//刷新数据
  } catch (e) {//失败
    ElMessage.error("操作失败");//提示
  }
};
</script >

<script lang="ts" >
export default {
  name: "Attr",
};
</script >

<style scoped >

</style >

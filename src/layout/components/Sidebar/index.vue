<template >
  <div :class="{'has-logo':showLogo}" >
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper" >
      <el-menu :collapse="isCollapse" :collapse-transition="false" :default-active="activeMenu" :unique-opened="false" active-text-color="#409EFF" background-color="#304156" mode="vertical" text-color="#bfcbd9" >
        <sidebar-item v-for="route in userInfoStore.menuRoutes" :key="route.path" :base-path="route.path" :item="route" />
      </el-menu >
    </el-scrollbar >
  </div >
</template >

<script lang="ts" >
export default {
  name: "Sidebar",
};
</script >

<script lang="ts" setup >
import {computed} from "vue";
import {useRoute} from "vue-router";
import Logo from "./Logo.vue";
import SidebarItem from "./SidebarItem.vue";
import {useAppStore} from "@/stores/app";
import {useUserInfoStore} from "@/stores/userInfo";
import {useSettingsStore} from "@/stores/settings";

const route = useRoute();
const settingsStore = useSettingsStore();
const appStore = useAppStore();
const userInfoStore = useUserInfoStore();

const activeMenu = computed(() => {
  const {meta, path} = route;
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});

const showLogo = computed(() => settingsStore.sidebarLogo);
const isCollapse = computed(() => !appStore.sidebar.opened);

</script >

<template >
  <section class="app-main" >
    <router-view :key="$route.path" v-slot="{ Component }" >
      <transition mode="out-in" name="fade-transform" >
        <div >
          <component :is="Component" />
        </div >
      </transition >
    </router-view >
  </section >
</template >

<script lang="ts" >
export default {
  name: "AppMain",
};
</script >

<style scoped >
.app-main {
  /*50 = navbar  */
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: calc(100vh - 50px);
  padding: 20px;
}

.fixed-header + .app-main {
  padding-top: 50px;
}
</style >

<style lang="scss" >
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style >

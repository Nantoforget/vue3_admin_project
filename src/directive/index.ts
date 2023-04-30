import type {App} from "vue";

import {useUserInfoStore} from "@/stores/userInfo";

const userInfoStore = useUserInfoStore();

export default (app: App) => {
  app.directive("hasBtn", (el, binding) => {
    if (!userInfoStore.authBtnList.includes(binding.value)) {
      el.parentNode.removeChild(el);//删除自己节点
    }
  });
}

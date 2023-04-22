import {createApp} from "vue";
import pinia from "./stores";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "@/router";
import "./styles/index.scss";
import ElSvg from "./components/SvgIcon/ElSvg";
import "./permission";

//定义根路径图片地址
export const BASE_URL = import.meta.env.VITE_API_URL;
const app = createApp(App);
ElSvg(app);
app
  .use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");


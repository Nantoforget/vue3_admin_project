<template >
  <div class="login-container" >
    <el-form ref="formRef" :model="loginForm" :rules="loginRules" auto-complete="on" class="login-form" label-position="left" >
      <div class="title-container" >
        <h3 class="title" >尚品汇后台管理</h3 >
      </div >
      <el-form-item prop="username" >
        <span class="svg-container" >
          <svg-icon name="ele-UserFilled" />
        </span >
        <el-input ref="username" v-model="loginForm.username" auto-complete="on" name="username" placeholder="Username" tabindex="1" type="text" />
      </el-form-item >
      <el-form-item prop="password" >
        <span class="svg-container" >
          <svg-icon name="ele-Lock" />
        </span >
        <el-input :key="passwordType" ref="passwordRef" v-model="loginForm.password" :type="passwordType" auto-complete="on" name="password" placeholder="Password" tabindex="2" @keyup.enter="handleLogin" />
        <span class="show-pwd" @click="showPwd" >
          <svg-icon :name="passwordType === 'password' ? 'ele-Hide' : 'ele-View'" />
        </span >
      </el-form-item >
      <el-button :loading="loading" style="width: 100%; margin-bottom: 30px; height: 40px" type="primary" @click.prevent="handleLogin" >登 陆
      </el-button >
    </el-form >
  </div >
</template >

<script lang="ts" >
export default {
  name: "Login",
};
</script >

<script lang="ts" setup >
import SvgIcon from "@/components/SvgIcon/index.vue";
import {useUserInfoStore} from "@/stores/userInfo";
import type {FormInstance} from "element-plus";
import {nextTick, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";

const userInfoStore = useUserInfoStore();
const route = useRoute();
const router = useRouter();
const loginForm = ref({
  username: "admin",
  password: "111111",
});
const loading = ref(false);
const passwordType = ref("password");
const redirect = ref("");
const passwordRef = ref<HTMLInputElement>();
const formRef = ref<FormInstance>();

const validateUsername = (rule: any, value: any, callback: any) => {
  if (value.length < 4) {
    callback(new Error("用户名长度不能小于4位"));
  } else {
    callback();
  }
};
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6) {
    callback(new Error("密码长度不能小于6位"));
  } else {
    callback();
  }
};

const loginRules = {
  username: [{required: true, validator: validateUsername}],
  password: [{required: true, trigger: "blur", validator: validatePassword}],
};

//监视路由变化
watch(
  route,
  //可以实现在哪退出登录的，再次登陆后跳转上次的路由
  () => {
    redirect.value = route.query && (route.query.redirect as string);
  },
  {immediate: true},
);

/* 
切换密码的显示/隐藏
*/
const showPwd = () => {
  if (passwordType.value === "password") {
    passwordType.value = "text";
  } else {
    passwordType.value = "password";
  }
  nextTick(() => {
    passwordRef.value?.focus();
  });
};

/* 
点击登陆的回调
*/
const handleLogin = async () => {
  //form表单DOM
  await formRef.value?.validate();
  //加载....
  loading.value = true;
  const {username, password} = loginForm.value;
  try {
    await userInfoStore.login(username, password);
    router.push({path: redirect.value || "/"});
  } finally {
    loading.value = false;
  }
};
</script >

<style lang="scss" >
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url(../../assets/bg.jpg);
  background-color: #2d3a4b;
  background-size: cover;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    .el-input__wrapper {
      width: 100%;
      background-color: transparent;
      box-shadow: none;

      input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style >

<style lang="scss" scoped >
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style >


<template>
    <div id="app">
      <BasicLayout />
    </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
// import {healthUsingGet} from "@/api/mainController";
// import {userLoginUserStore} from "@/stores/userLoginUserStore";
//已经改为在权限校验文件中获取
// const loginUserStore = userLoginUserStore()
// loginUserStore.fetchLoginUser()
//
// healthUsingGet().then((res) => {
//   console.log(res)
// })
</script>

<style></style>

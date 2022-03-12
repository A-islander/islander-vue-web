<template>
  <div class="container">
    <el-affix :offset="0">
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          active-text-color="#63acb5"
        >
          <el-sub-menu
            index="plate"
            style="color: #63acb5;"
            v-if="!mobileStatus"
          >
            <template #title>
              <el-icon style="color: #63acb5"><location /></el-icon>
              <span style="color: #63acb5">板块</span>
            </template>
            <router-link to="/">
              <el-menu-item index="1" style="color: #63acb5">
                <el-icon><house /></el-icon>
                <div>首页</div>
              </el-menu-item>
            </router-link>
            <div v-for="(item, index) in plateList" :key="index">
              <router-link :to="'/plate/' + item.id">
                <el-menu-item
                  :index="'plate-' + item.id"
                  style="color: #63acb5"
                >
                  <el-icon><guide /></el-icon>
                  <div>{{ item.name }}</div>
                </el-menu-item>
              </router-link>
            </div>
          </el-sub-menu>
          <el-menu-item index="login" style="color: #63acb5">
            <router-link to="/login">{{ cookieName }}</router-link>
          </el-menu-item>
        </el-menu>
      </el-header>
    </el-affix>
    <el-container class="body-container">
      <el-aside width="200px" v-if="mobileStatus">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="false"
        >
          <div>
            <img alt="Vue logo" src="./assets/logo.png" style="width: 100%" />
          </div>
          <router-link to="/">
            <el-menu-item index="1" style="color: #63acb5">
              <el-icon><house /></el-icon>
              <div>首页</div>
            </el-menu-item>
          </router-link>
          <el-sub-menu index="2">
            <template #title>
              <el-icon style="color: #63acb5"><location /></el-icon>
              <span style="color: #63acb5">板块</span>
            </template>
            <div v-for="(item, index) in plateList" :key="index">
              <router-link :to="'/plate/' + item.id">
                <el-menu-item
                  :index="'plate-' + item.id"
                  style="color: #63acb5"
                >
                  <el-icon><guide /></el-icon>
                  <div>{{ item.name }}</div>
                </el-menu-item>
              </router-link>
            </div>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { provide, reactive, ref, toRefs } from "vue";
import store from "./store";
export default {
  setup() {
    let width = document.body.clientWidth;
    let mobileStatus = ref(false);
    if (width > 1024) {
      mobileStatus.value = true;
    }
    let cookieName = ref(store.getters.getName);
    if (cookieName.value == "" || cookieName.value == null) {
      cookieName.value = "获取饼干";
    }
    let updateCookieName = (name: string) => {
      cookieName.value = name;
    };
    provide("updateCookieName", updateCookieName);
    let res = reactive({
      plateList: [],
    });
    let GetPlate = () => {
      axios.get("plate/get").then((response) => {
        res.plateList = response.data.data;
        store.commit("setPlate", res.plateList);
      });
    };
    GetPlate();
    const activeIndex = ref("1");
    const handleSelect = (key: string, keyPath: string[]) => {
      // console.log(key, keyPath)
    };
    return {
      ...toRefs(res),
      handleSelect,
      activeIndex,
      cookieName,
      mobileStatus,
    };
  },
};
</script>

<style>
html,
body,
#app {
  /* width: 90%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  background-color: #374954; */
}

.body-container {
  width: 90%;
  height: 100%;
  margin: 0 auto;
  /* text-align: center; */
  /* background-color: #374954; */
}
.router-link-active {
  text-decoration: none;
  color: black;
}
a {
  text-decoration: none;
  color: rgb(85, 54, 54);
}
p {
  margin: 0 auto;
}
</style>

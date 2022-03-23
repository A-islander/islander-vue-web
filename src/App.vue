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
          menu-trigger="click"
        >
          <el-sub-menu
            index="plate"
            style="color: #63acb5"
            v-if="!mobileStatus"
          >
            <template #title>
              <el-icon style="color: #63acb5"><location /></el-icon>
              <span style="color: #63acb5">板块</span>
            </template>
            <router-link to="/">
              <el-menu-item
                index="1"
                style="color: #63acb5"
                @click="closeSubMenu($event)"
              >
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
    <el-container :class="bodyStyle">
      <el-aside width="200px" v-if="mobileStatus">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="false"
        >
          <div>
            <img
              alt="Vue logo"
              src="https://s3.bmp.ovh/imgs/2022/03/7898d4008b6154e2.png"
              style="width: 100%"
            />
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
          <a href="https://github.com/A-islander/post-backup" target="_blank">
            <el-menu-item index="3" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>串备份地址</div>
            </el-menu-item>
          </a>
          <a
            href="https://docs.apipost.cn/preview/b58077f3ebc9caeb/6a197cc600cf6f5c"
            target="_blank"
          >
            <el-menu-item index="4" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>接口文档</div>
            </el-menu-item>
          </a>
          <a href="http://bog.ac" target="_blank">
            <el-menu-item index="5" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>bog岛</div>
            </el-menu-item>
          </a>
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
    let openSubMenu = ref([]);
    let closeSubMenu = (menuItem: any) => {
      console.log(menuItem.$parent);
      if (menuItem.$parent && menuItem.$parent.$options.name === "ElSubmenu") {
        menuItem.$parent.handleMouseleave();
      }
    };
    let width = document.body.clientWidth;
    let bodyStyle = ref("");
    let mobileStatus = ref(false);
    if (width > 1024) {
      mobileStatus.value = true;
      bodyStyle = ref("body-container");
    } else {
      bodyStyle = ref("body-container-mobile");
    }
    let cookieName = ref(store.getters.getName);
    if (cookieName.value == "" || cookieName.value == null) {
      cookieName.value = "获取饼干";
    }
    let updateCookieName = (name: string) => {
      cookieName.value = name;
    };
    provide("updateCookieName", updateCookieName);
    provide("closeSubMenu", closeSubMenu);
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
      bodyStyle,
      openSubMenu,
      closeSubMenu,
    };
  },
};
</script>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.body-container {
  width: 80%;
  height: 100%;
  margin: 0 auto;
}

.body-container-mobile {
  width: 95%;
  height: 100%;
  margin: 0 auto;
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

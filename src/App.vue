<template>
  <div class="container">
    <el-affix :offset="0">
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          active-text-color="#63acb5"
          menu-trigger="click"
        >
          <el-menu-item
            index="plate"
            style="color: #63acb5"
            v-if="!mobileStatus"
            @click="mobileDrawerStatus = true"
          >
            <span>板块选择</span>
          </el-menu-item>
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
            <!-- <img alt="Vue logo" src="./assets/logo.jpg" style="width: 100%" /> -->
            <img alt="Vue logo" src="https://island-image.oss-cn-beijing.aliyuncs.com/banner/k4zb5lu_10.jpg" style="width: 100%" />
          </div>
          <router-link to="/home">
            <el-menu-item index="1" style="color: #63acb5">
              <el-icon><house /></el-icon>
              <div>首页</div>
            </el-menu-item>
          </router-link>
          <router-link :to="'/plate/0/page/1'">
            <el-menu-item :index="'plate-' + 0" style="color: #63acb5">
              <el-icon><guide /></el-icon>
              <div>时间线</div>
            </el-menu-item>
          </router-link>
          <el-sub-menu index="2">
            <template #title>
              <el-icon style="color: #63acb5"><location /></el-icon>
              <span style="color: #63acb5">板块</span>
            </template>
            <div v-for="(item, index) in plateList" :key="index">
              <router-link :to="'/plate/' + item.id + '/page/1'">
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
          <router-link to="/sageList">
            <el-menu-item index="sageList" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>sage串展示</div>
            </el-menu-item>
          </router-link>
          <a href="http://gitea.islander.top" target="_blank">
            <el-menu-item index="3" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>岛民hub</div>
            </el-menu-item>
          </a>
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
          <a href="https://www.nmbxd.com" target="_blank">
            <el-menu-item index="8" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>x岛（三酱岛）</div>
            </el-menu-item>
          </a>
          <a href="https://www.naodong.fun" target="_blank">
            <el-menu-item index="5" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>脑洞</div>
            </el-menu-item>
          </a>
          <a href="http://bog.ac" target="_blank">
            <el-menu-item index="6" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>bog岛</div>
            </el-menu-item>
          </a>
          <a href="https://huanleegao.com/t" target="_blank">
            <el-menu-item index="7" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>欢乐恶狗岛</div>
            </el-menu-item>
          </a>
          <a href="https://mszym.top/" target="_blank">
            <el-menu-item index="7" style="color: #63acb5">
              <el-icon><location /></el-icon>
              <div>钉幕石之音</div>
            </el-menu-item>
          </a>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive include="plate,login">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </div>
  <el-drawer v-model="mobileDrawerStatus" size="50%" direction="ltr">
    <template #title>
      <span style="color: #63acb5">板块选择</span>
    </template>
    <el-menu
      default-active="2"
      class="el-menu-mobile"
      :collapse="false"
      style="border-right: 0"
    >
      <div>
        <img alt="Vue logo" src="https://island-image.oss-cn-beijing.aliyuncs.com/banner/k4zb5lu_10.jpg" style="width: 100%" />
      </div>
      <router-link to="/home" @click="mobileDrawerStatus = false">
        <el-menu-item index="1" style="color: #63acb5">
          <el-icon><house /></el-icon>
          <div>首页</div>
        </el-menu-item>
      </router-link>
      <router-link :to="'/plate/0/page/1'" @click="mobileDrawerStatus = false">
        <el-menu-item :index="'plate-' + 0" style="color: #63acb5">
          <el-icon><guide /></el-icon>
          <div>时间线</div>
        </el-menu-item>
      </router-link>
      <el-sub-menu index="2">
        <template #title>
          <el-icon style="color: #63acb5"><location /></el-icon>
          <span style="color: #63acb5">板块</span>
        </template>
        <div v-for="(item, index) in plateList" :key="index">
          <router-link
            :to="'/plate/' + item.id + '/page/1'"
            @click="mobileDrawerStatus = false"
          >
            <el-menu-item :index="'plate-' + item.id" style="color: #63acb5">
              <el-icon><guide /></el-icon>
              <div>{{ item.name }}</div>
            </el-menu-item>
          </router-link>
        </div>
      </el-sub-menu>
      <router-link to="/sageList" @click="mobileDrawerStatus = false">
        <el-menu-item index="sageList" style="color: #63acb5">
          <el-icon><location /></el-icon>
          <div>sage串展示</div>
        </el-menu-item>
      </router-link>
      <a href="http://gitea.islander.top" target="_blank">
        <el-menu-item index="3" style="color: #63acb5">
          <el-icon><location /></el-icon>
          <div>岛民hub</div>
        </el-menu-item>
      </a>
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
      <a href="https://www.nmbxd.com" target="_blank">
        <el-menu-item index="8" style="color: #63acb5">
          <el-icon><location /></el-icon>
          <div>x岛（三酱岛）</div>
        </el-menu-item>
      </a>
      <a href="https://www.naodong.fun" target="_blank">
        <el-menu-item index="5" style="color: #63acb5">
          <el-icon><location /></el-icon>
          <div>脑洞</div>
        </el-menu-item>
      </a>
      <a href="http://bog.ac" target="_blank">
        <el-menu-item index="6" style="color: #63acb5">
          <el-icon><location /></el-icon>
          <div>bog岛</div>
        </el-menu-item>
      </a>
      <a href="https://huanleegao.com/t" target="_blank">
        <el-menu-item index="7" style="color: #63acb5">
          <el-icon><location /></el-icon>
          <div>欢乐恶狗岛</div>
        </el-menu-item>
      </a>
      <a href="https://mszym.top/" target="_blank">
        <el-menu-item index="7" style="color: #63acb5">
          <el-icon><location /></el-icon>
          <div>钉幕石之音</div>
        </el-menu-item>
      </a>
    </el-menu>
  </el-drawer>
</template>

<script lang="ts">
import axios from "axios";
import { provide, reactive, ref, toRefs } from "vue";
import store from "./store";
export default {
  setup() {
    let width = document.body.clientWidth;
    let bodyStyle = ref("");
    let mobileStatus = ref(false);
    let mobileDrawerStatus = ref(false);
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
    return {
      ...toRefs(res),
      activeIndex,
      cookieName,
      mobileStatus,
      mobileDrawerStatus,
      bodyStyle,
    };
  },
};
</script>

<style>
html,
#app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

body {
  margin: 0px;
}

.body-container {
  width: 80%;
  height: 100%;
  margin: 0 auto;
}

.body-container-mobile {
  width: 100%;
  height: 100%;
  font-size: 14px;
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

.el-menu {
  border-right: 0;
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-row>
            <el-col :span="8">
              <span>饼干信息</span>
            </el-col>
            <el-col :span="8" :offset="8" style="text-align: right">
              <el-button :disabled="tokenStatus" @click="getUserToken()">
                领取饼干
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <div class="text item">饼干名：{{ res.name }}</div>
      <div class="text item">饼干：{{ token }}</div>
    </el-card>
  </div>
  <div v-for="(item, index) in userPostList.list" :key="index" class="plate-class">
    <PostNode :postNode="item" :userId="res.id"></PostNode>
  </div>
</template>
<script lang="ts">
import { inject } from "vue-demi";

import axios from "axios";
import { defineComponent, ref, reactive } from "vue";
import store from "../store";
import PostNode from "../components/PostNode.vue"

export default defineComponent({
  components: {
    PostNode,
  },
  setup() {
    let userPostList = reactive({
      list: Object,
      count: Number,
    });
    let updateCookieName: any = inject("updateCookieName");
    let tokenStatus = ref(false);
    let token = ref("");
    let res = reactive({
      id: 0,
      name: "",
      registerTime: 0,
    });
    token.value = store.getters.getAuthToken;
    let getUserToken = () => {
      axios.defaults.baseURL = "http://user-api.islander.top/";
      axios.get("user/register").then((response) => {
        store.commit("setAuthToken", response.data.data.token);
        token.value = response.data.data.token;
        getUserInfo();
        tokenStatus.value = true;
      });
      axios.defaults.baseURL = "http://forum-api.islander.top/";
    };
    let getUserInfo = () => {
      axios.defaults.baseURL = "http://user-api.islander.top/";
      axios.defaults.headers.common["Authorization"] = token.value;
      axios.get("user/get").then((response) => {
        if (response.data.code != 200) {
          // getUserToken();
          // alert("请领取饼干");
          token.value = "未领取";
          res.name = "n98";
        } else {
          res.name = response.data.data.name;
          res.id = response.data.data.id;
          store.commit("setName", res.name);
          store.commit("setUserId", res.id);
          updateCookieName(res.name);
          tokenStatus.value = true;
        }
      });
      axios.defaults.baseURL = "http://forum-api.islander.top/";
    };
    let getUserPostList = (page: number, size: number) => {
      axios.defaults.headers.common["Authorization"] = token.value;
      axios.get("forum/userList?page" + page + "&size=" + size).then((response) => {
        userPostList.list = response.data.data.list;
        userPostList.count = response.data.data.count;
        console.log(userPostList);
      })
    }
    getUserPostList(0, 10);
    getUserInfo();
    return {
      userPostList,
      token,
      res,
      tokenStatus,
      getUserToken,
    };
  },
});
</script>
<template>
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
  <PostNode
    v-for="(item, index) in userPostList.list"
    :key="index"
    :postNode="item"
    :userId="res.id"
    @click="
      if (item.followId !== 0) gotoPost(item.followId);
      else gotoPost(item.id);
    "
  ></PostNode>

  <el-pagination
    layout="prev, pager, next"
    :page-size="pageRes.size"
    :page-count="Math.ceil(userPostList.count / pageRes.size)"
    :hide-on-single-page="Math.ceil(userPostList.count / pageRes.size) == 1"
    v-model:current-page="pageRes.page"
  ></el-pagination>
</template>
<script lang="ts">
import { inject } from "vue-demi";

import axios from "axios";
import { defineComponent, ref, reactive, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import store from "../store";
import PostNode from "../components/PostNode.vue";

export default defineComponent({
  name: "login",
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
      id: store.getters.getUserId,
      name: store.getters.getName,
      registerTime: 0,
    });
    let pageRes = reactive({
      page: 1,
      size: 20,
    });
    token.value = store.getters.getAuthToken;
    let getUserToken = () => { // 注册饼干
      axios.defaults.baseURL = "http://user-api.islander.top/";
      axios.get("user/register").then((response) => {
        store.commit("setAuthToken", response.data.data.token);
        token.value = response.data.data.token;
        getUserInfo();
        tokenStatus.value = true;
        ElMessage({
          type: "success",
          message: "饼干获取成功",
        });
      });
      axios.defaults.baseURL = "http://forum-api.islander.top/";
    };
    let getUserInfo = () => { // 获取用户信息
      axios.defaults.baseURL = "http://user-api.islander.top/";
      axios.defaults.headers.common["Authorization"] = token.value;
      axios.get("user/get").then((response) => {
        if (response.data.code != 200) {
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
      axios
        .get("forum/userList?page=" + page + "&size=" + size)
        .then((response) => {
          userPostList.list = response.data.data.list;
          userPostList.count = response.data.data.count;
        });
    };
    let router = useRouter();
    let gotoPost = (postId: number) => {
      ElMessageBox.confirm("确定要查看原串吗?", "查看原串", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      }).then(() => {
        ElMessage({
          type: "success",
          message: "到达原串",
        });
        router.push("/post/" + postId);
      });
    };
    if (token.value == null) {
      getUserToken();
    } else {
      getUserPostList(pageRes.page - 1, pageRes.size);
      tokenStatus.value = true;
    }
    watch(token, () => { // 触发页面更新
      pageRes.size = 10;
    });
    watch(pageRes, () => {
      let obj = document.getElementById("body-container") as HTMLInputElement;
      // obj.scrollTop = 0;
      getUserPostList(pageRes.page - 1, pageRes.size);
    });
    return {
      gotoPost,
      pageRes,
      userPostList,
      token,
      res,
      tokenStatus,
      getUserToken,
    };
  },
});
</script>
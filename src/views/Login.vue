<template>
  <div style="border: 10px solid white">
    <div style="font-size: 40px; color: #63acb5; margin-bottom: 5px">
      我的饼干
    </div>
    <div style="font-size: 20px; color: #63acb5; margin-bottom: 5px">
      看看自己说了啥
      <el-button @click="clearInputBuff()" size="small" type="primary" color="#63acb5"> 清除草稿 </el-button>
    </div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-row>
            <el-col :span="8">
              <span>饼干信息</span>
            </el-col>
            <el-col :span="8" :offset="8" style="text-align: right">
              <el-button
                :disabled="tokenStatus"
                @click="getUserToken()"
                size="small"
              >
                领取饼干
              </el-button>
            </el-col>
          </el-row>
        </div>
      </template>
      <div class="text item">饼干名：{{ res.name }}</div>
      <div class="text item">
        <el-row>
          <el-col :span="20">
            <el-input v-model="inputToken" placeholder="Please input" />
          </el-col>
          <el-col :span="4">
            <el-button @click="changeToken(inputToken)"> 切换 </el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <div v-for="(item, index) in userPostList.list" :key="index">
      <br />
      <PostNode
        :postNode="item"
        :userId="res.id"
        @click="
          if (item.followId !== 0) gotoPost(item.followId);
          else gotoPost(item.id);
        "
      ></PostNode>
    </div>

    <el-pagination
      layout="prev, pager, next"
      :page-size="pageRes.size"
      :page-count="Math.ceil(userPostList.count / pageRes.size)"
      :hide-on-single-page="Math.ceil(userPostList.count / pageRes.size) == 1"
      v-model:current-page="pageRes.page"
    ></el-pagination>
  </div>
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
    let inputToken = ref(token.value);
    let getUserToken = () => {
      // 注册饼干
      axios.defaults.baseURL = "http://user-api.islander.top/";
      axios.get("user/register").then((response) => {
        store.commit("setAuthToken", response.data.data.token);
        token.value = response.data.data.token;
        inputToken.value = token.value;
        getUserInfo();
        tokenStatus.value = true;
        ElMessage({
          type: "success",
          message: "饼干获取成功",
        });
      });
      axios.defaults.baseURL = "http://forum-api.islander.top/";
    };
    let getUserInfo = () => {
      // 获取用户信息
      axios.defaults.baseURL = "http://user-api.islander.top/";
      axios.defaults.headers.common["Authorization"] = token.value;
      axios.get("user/get").then((response) => {
        if (response.data.code != 200) {
          // token.value = "未领取";
          // res.name = "n98";
          ElMessage({
            type: "warning",
            message: "无此饼干",
          });
        } else {
          res.name = response.data.data.name;
          res.id = response.data.data.id;
          store.commit("setAuthToken", token.value);
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
          if (response.data.code == 200) {
            userPostList.list = response.data.data.list;
            userPostList.count = response.data.data.count;
          } else {
            userPostList.list = [] as any;
            userPostList.count = 0 as any;
          }
        });
    };
    let changeToken = (inputToken: string) => {
      ElMessageBox.confirm("确定要更改饼干吗?", "更改饼干", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          token.value = inputToken;
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消成功",
          });
        });
    };
    let router = useRouter();
    let gotoPost = (postId: number) => {
      ElMessageBox.confirm("确定要查看原串吗?", "查看原串", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          ElMessage({
            type: "success",
            message: "到达原串",
          });
          router.push("/post/" + postId + "/page/1");
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "取消成功",
          });
        });
    };
    if (token.value == null) {
      getUserToken();
    } else {
      getUserPostList(pageRes.page - 1, pageRes.size);
      tokenStatus.value = true;
    }
    watch(token, () => {
      // 触发页面更新
      if (pageRes.page == 1) {
        getUserPostList(0, pageRes.size);
      } else {
        pageRes.page = 1;
      }
      getUserInfo();
      ElMessage({
        type: "success",
        message: "切换成功",
      });
    });
    watch(pageRes, () => {
      let obj = document.getElementById("body-container") as HTMLInputElement;
      // obj.scrollTop = 0;
      getUserPostList(pageRes.page - 1, pageRes.size);
    });
    let clearInputBuff = () => {
      console.log(localStorage);
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let index = key?.indexOf("InputBuff");
        if (index != -1) {
          if (key != null) {
            localStorage.removeItem(key);
          }
        }
        console.log(index);
      }
    };
    return {
      gotoPost,
      pageRes,
      userPostList,
      token,
      inputToken,
      res,
      tokenStatus,
      getUserToken,
      changeToken,
      clearInputBuff,
    };
  },
});
</script>
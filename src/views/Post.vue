<template>
  <div style="border: 10px solid white">
    <el-input
      v-model="replyInput.value"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="来说点什么吧"
      style="padding-bottom: 5px"
    >
    </el-input>
    <div style="text-align: right">
      <el-button
        type="primary"
        @click="replyForumPost(postId, replyInput.value)"
        color="#63acb5"
      >
        回复
      </el-button>
    </div>
  </div>
  <div style="border: 10px solid white">
    <PostNode :postNode="res.main" />
  </div>
  <div>
    <div
      v-for="(item, index) in res.list"
      :key="index"
      style="border: 10px solid white"
    >
      <PostNode :postNode="item" />
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent, ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import PostNode from "../components/PostNode.vue";
import store from "../store";

export default defineComponent({
  components: {
    PostNode,
  },
  setup() {
    let replyInput = reactive({
      value: "",
    });
    let postId = ref();
    let res = reactive({
      main: {},
      list: [],
      count: 0,
    });
    const route = useRoute();
    postId.value = route.params.postId;
    let getMain = (postId: number) => {
      axios.get("forum/get?postId=" + postId).then((response) => {
        console.log(response);
        res.main = response.data.data;
      });
    };
    let getPost = (postId: number, page: number, size: number) => {
      axios
        .get("forum/list?postId=" + postId + "&page=" + page + "&size=" + size)
        .then((response) => {
          console.log(response);
          res.list = response.data.data.list;
          res.count = response.data.data.count;
        });
    };
    let replyForumPost = (followId: number, value: string) => {
      axios.defaults.headers.common["Authorization"] =
        store.getters.getAuthToken;
      axios
        .post("forum/reply", {
          value: value,
          followId: Number(followId),
          replyArr: [],
          mediaUrl: "",
        })
        .then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            replyInput.value = "";
          } else {
            alert("请领取饼干");
          }
        });
    };
    getMain(postId.value);
    getPost(postId.value, 0, 10);
    onMounted(() => {});
    return {
      res,
      replyInput,
      postId,
      replyForumPost,
    };
  },
});
</script>

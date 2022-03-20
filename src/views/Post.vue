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
  <div>
    <div
      v-for="(item, index) in res.list"
      :key="index"
      style="border: 10px solid white"
    >
      <PostNode :postNode="item" />
    </div>
  </div>
  <div>
    <el-pagination
      layout="prev, pager, next"
      :page-size="pageRes.size"
      :page-count="Math.ceil(res.count / pageRes.size)"
      :hide-on-single-page="Math.ceil(res.count / pageRes.size) == 1"
      v-model:current-page="pageRes.page"
    ></el-pagination>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
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
    let pageRes = reactive({
      page: 1,
      size: 20,
    });
    let res = reactive({
      list: [],
      count: 0,
    });
    const route = useRoute();
    postId.value = route.params.postId;
    let getPost = (postId: number, page: number, size: number) => {
      axios
        .get("forum/list?postId=" + postId + "&page=" + page + "&size=" + size)
        .then((response) => {
          res.list = response.data.data.list;
          res.count = response.data.data.count;
          window.scrollTo(0, 0);
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
          // console.log(response);
          if (response.data.code === 200) {
            getPost(postId.value, pageRes.page - 1, pageRes.size);
            replyInput.value = "";
          } else {
            alert("请领取饼干");
          }
        });
    };
    getPost(postId.value, pageRes.page - 1, pageRes.size);
    onMounted(() => {});
    watch(pageRes, () => {
      let obj = document.getElementById('body-container') as HTMLInputElement
      obj.scrollTop = 0
      getPost(postId.value, pageRes.page - 1, pageRes.size);
    });
    return {
      res,
      replyInput,
      postId,
      replyForumPost,
      pageRes,
    };
  },
});
</script>

<template>
  <div style="border: 10px solid white">
    <div style="font-size: 40px; color: #63acb5">
      {{ plateName }}
    </div>
    <el-input
      v-model="postInput.value"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="来说点什么吧"
      style="padding-bottom: 5px"
    >
    </el-input>
    <div style="text-align: right">
      <el-button
        type="primary"
        @click="postForumPost(plateId, postInput.value, postInput.title)"
        color="#63acb5"
      >
        回复
      </el-button>
    </div>
  </div>
  <div>
    <div v-for="(item, index) in res.list" :key="index" class="plate-class">
      <router-link :to="'/post/' + item.id">
        <PostNode :postNode="item" />
      </router-link>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent, onUpdated, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PostNode from "../components/PostNode.vue";
import store from "../store";

export default defineComponent({
  components: {
    PostNode,
  },
  setup() {
    let postInput = reactive({
      value: "",
      title: "",
    });
    let plateId = ref();
    let plateName = ref();
    let res = reactive({
      list: [],
      count: 0,
    });
    let getIndex = (plateId: number, page: number, size: number) => {
      axios
        .get(
          "forum/index?plateId=" + plateId + "&page=" + page + "&size=" + size
        )
        .then((response) => {
          res.list = response.data.data.list;
          res.count = response.data.data.count;
        });
    };
    let postForumPost = (plateId: number, value: string, title: string) => {
      axios.defaults.headers.common["Authorization"] =
        store.getters.getAuthToken;
      axios
        .post("forum/post", {
          value: value,
          title: title,
          replyArr: [],
          plateId: Number(plateId),
          mediaUrl: "",
        })
        .then((response) => {
          console.log(response);
          if (response.data.code == 200) {
            getIndex(plateId, 0, 10);
          } else {
            alert("请领取饼干");
          }
          postInput.value = "";
          postInput.title = "";
        });
    };
    const route = useRoute();
    plateId.value = route.params.plateId;
    getIndex(plateId.value, 0, 10);
    watch(plateId, () => {
      getIndex(plateId.value, 0, 10);
    });
    onUpdated(() => {
      plateId.value = route.params.plateId;
      plateName.value = store.getters.getPlateName(Number(plateId.value));
    });
    return {
      plateId,
      res,
      postInput,
      postForumPost,
      plateName,
    };
  },
});
</script>
<style>
.plate-class {
  border: 10px solid white;
}
</style>

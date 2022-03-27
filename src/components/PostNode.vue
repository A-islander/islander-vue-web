<template>
  <div id="post-node-contanier">
    <el-card class="box-card" style="">
      <template #header>
        <slot name="post-head">
          <PostNodeHead :postNode="postNode" />
        </slot>
      </template>
      <div class="text item" style="white-space: pre-wrap">
        <template v-for="(item, index) in postList" :key="index">
          <div style="margin-bottom: 10px" v-if="item.showStatus">
            <PostNode :postNode="item" />
          </div>
        </template>
        <PostText :text="postNode.value" />
        <div v-for="(item, index) in mediaUrl" :key="index">
          <el-image
            style="width: 150px; height: 150px"
            :src="item.thumbnailUrl"
            :preview-src-list="[item.url]"
            :initial-index="1"
            :hide-on-click-modal="true"
            fit="cover"
          >
          </el-image>
        </div>
        <slot name="sage-name">
        </slot>
        <div style="text-align: right; font-size: 10px; color: #63acb5">
          <div @click="sageAdd()">支持SAGE：{{ postNode.sageAddCount }}</div>
          <div>反对SAGE：{{ postNode.sageSubCount }}</div>
          <!-- <el-icon :size="20" :color="'#63acb5'"><edit /></el-icon> -->
        </div>
      </div>
      <div
        v-for="(item, index) in postNode.lastReplyArr"
        :key="index"
        class="card-reply"
      >
        {{ item.name }}: {{ item.value }}
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent, provide, reactive, ref, toRefs, watch } from "vue";
import PostText from "./PostText.vue";
import PostNodeHead from "./PostNodeHead.vue";
import store from "../store";
interface PostNode {
  id: number;
}
export default defineComponent({
  name: "PostNode",
  components: {
    PostText,
    PostNodeHead,
  },
  props: {
    postNode: Object,
  },
  setup(props) {
    let res = reactive({
      postList: [] as PostNode[],
    });
    let getPostNode = (postId: number) => {
      let ok = false;
      for (let i = 0; i < res.postList.length; i++) {
        if (res.postList[i]["id"] === Number(postId)) {
          ok = true;
          // 清除展示
          res.postList.splice(i, 1);
        }
      }
      if (ok === false) {
        // 缓存查找
        let post = store.getters.getPost(Number(postId));
        if (post === null) {
          axios.get("forum/get?postId=" + postId).then((response) => {
            res.postList.push(response.data.data);
            res.postList[res.postList.length - 1]["showStatus"] = true;
            store.commit("addPost", res.postList[res.postList.length - 1]);
          });
        } else {
          res.postList.push(post);
          res.postList[res.postList.length - 1]["showStatus"] = true;
        }
      }
    };
    let mediaUrl = ref([]);
    let getMediaUrl = () => {
      if (props.postNode !== undefined) {
        if (props.postNode.mediaUrl !== "") {
          mediaUrl.value = eval("(" + props.postNode.mediaUrl + ")");
        } else {
          mediaUrl.value = [];
        }
      }
    };
    getMediaUrl();
    provide("getPostNode", getPostNode);
    let sageAdd = () => {
      console.log("ok");
    };
    watch(props, () => {
      getMediaUrl();
    });
    return {
      ...toRefs(props),
      sageAdd,
      ...toRefs(res),
      getPostNode,
      mediaUrl,
    };
  },
});
</script>
<style>
#post-node-contanier div.card-header {
  font-size: 10px;
  color: #63acb5;
}

#post-node-contanier div.card-reply {
  font-size: 10px;
  color: #63acb5;
  margin-bottom: 5px;
}
/* #post-node-contanier div.el-card__body {
  min-height: 50px;
  padding-bottom: 5px;
} */
</style>

<template>
  <div id="post-node-contanier">
    <el-card class="box-card" style="">
      <template #header>
        <div class="card-header">
          <el-row :gutter="20">
            <el-col :span="12">
              <span>
                {{ timeMiddleware(postNode.time) }}
                <br />
                {{ postNode.name }}
              </span>
            </el-col>
            <el-col :span="4" :offset="8" style="text-align: right">
              <span>No.{{ postNode.id }}</span>
            </el-col>
          </el-row>
        </div>
      </template>
      <div class="text item" style="white-space: pre-wrap">
        <template v-for="(item, index) in postList" :key="index">
          <div style="margin-bottom: 10px" v-if="item.showStatus">
            <PostNode :postNode="item" />
          </div>
        </template>
        <!-- <div>{{ postNode.value }}</div> -->
        <PostText :text="postNode.value" />
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
import { defineComponent, provide, reactive, toRefs } from "vue";
import PostText from "./PostText.vue";
interface PostNode {
  id: number;
}

export default defineComponent({
  name: "PostNode",
  components: {
    PostText,
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
          if (res.postList[i]["showStatus"]) {
            res.postList[i]["showStatus"] = false;
          } else {
            res.postList[i]["showStatus"] = true;
          }
        }
      }
      if (ok === false) {
        axios.get("forum/get?postId=" + postId).then((response) => {
          res.postList.push(response.data.data);
          res.postList[res.postList.length - 1]["showStatus"] = true;
        });
      }
    };
    provide("getPostNode", getPostNode);
    let sageAdd = () => {
      console.log("ok");
    };
    let timeMiddleware = (time: string) => {
      return new Date(parseInt(time) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    };
    return {
      ...toRefs(props),
      sageAdd,
      timeMiddleware,
      ...toRefs(res),
      getPostNode,
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

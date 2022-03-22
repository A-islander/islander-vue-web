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
        <!-- <div v-html="textMiddleware(postNode.value)"></div> -->
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
import { defineComponent, toRefs } from "vue";
import PostText from "./PostText.vue";

export default defineComponent({
  components: {
    PostText,
  },
  props: {
    postNode: Object,
  },
  setup(props) {
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

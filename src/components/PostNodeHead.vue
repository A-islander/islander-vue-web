<template>
  <div class="card-header">
    <el-row :gutter="20">
      <el-col :span="12">
        <span>
          {{ timeMiddleware(postNode.time) }}
          <br />
          {{ postNode.name }}
        </span>
      </el-col>
      <el-col :span="6" :offset="6" style="text-align: right">
        <slot name="post-head-number">
          <span>No.{{ postNode.id }}</span>
        </slot>
        <br />
        <slot name="post-head-tag"></slot>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, toRefs } from "vue";

export default defineComponent({
  props: {
    postNode: Object,
  },
  setup(props) {
    let timeMiddleware = (time: string) => {
      return new Date(parseInt(time) * 1000)
        .toLocaleString()
        .replace(/:\d{1,2}$/, " ");
    };
    return {
      ...toRefs(props),
      timeMiddleware,
    };
  },
});
</script>

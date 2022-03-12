<template>
  <div id="post-node-contanier">
    <el-card class="box-card" style="">
      <template #header>
        <div class="card-header">
          <el-row :gutter="20">
            <el-col :span="12">
              <span
                >{{
                  new Date(parseInt(postNode.time) * 1000)
                    .toLocaleString()
                    .replace(/:\d{1,2}$/, " ")
                }}<br />{{ postNode.name }}</span
              >
            </el-col>
            <el-col :span="4" :offset="8" style="text-align: right">
              <span>No.{{ postNode.id }}</span>
            </el-col>
          </el-row>
        </div>
      </template>
      <div class="text item" style="white-space: pre-wrap;">
        <div class="grid-content bg-purple">
          {{ postNode.value }}
        </div>
        <div style="text-align: right">
          <el-icon :size="20" :color="'#63acb5'"><edit /></el-icon>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";

export default defineComponent({
  props: {
    postNode: Object,
  },
  setup(props) {
    return {
      ...toRefs(props),
    };
  },
});
</script>
<style>
#post-node-contanier div.card-header {
  font-size: 10px;
  color: #63acb5;
}
/* #post-node-contanier div.el-card__body {
  min-height: 50px;
  padding-bottom: 5px;
} */
</style>

<template>
  <div style="border: 10px solid white">
    <div style="font-size: 40px; color: #63acb5; margin-bottom: 5px">
      sage串展示
    </div>
    <div style="font-size: 20px; color: #63acb5; margin-bottom: 5px">
      看看你做的好事
    </div>
  </div>
  <div>
    <div v-for="(item, index) in res.list" :key="index" class="plate-class">
      <PostNode :postNode="item" :userId="userId">
        <!-- <template #post-head>
          <router-link :to="'/post/' + item.id">
            <PostNodeHead :postNode="item" />
          </router-link>
        </template> -->
        <template #sage-name>
          支持sage: {{ item.sageAddUser }}
          反对sage: {{ item.sageSubUser }}
        </template>
      </PostNode>
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
import { defineComponent, reactive, ref } from "vue";
import PostNode from "../components/PostNode.vue";
import store from "../store";

export default defineComponent({
  components: {
    PostNode,
  },
  setup() {
    let res = reactive({
      list: [],
      count: 0,
    });
    let pageRes = reactive({
      page: 1,
      size: 20,
    });
    let getList = (page: number, size: number) => {
      axios
        .get("forum/sage/list?page=" + page + "&size=" + size)
        .then((response) => {
          res.list = response.data.data.list;
          res.count = response.data.data.count;
        });
    };
    getList(0, 10);
    let userId = ref(store.getters.getUserId);
    return {
      userId,
      res,
      pageRes,
    };
  },
});
</script>

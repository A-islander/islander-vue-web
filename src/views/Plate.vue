<template>
  <div style="border: 10px solid white">
    <div style="font-size: 40px; color: #63acb5; margin-bottom: 5px">
      {{ plateData.name }}
    </div>
    <div style="font-size: 20px; color: #63acb5; margin-bottom: 5px">
      {{ plateData.value }}
    </div>
    <el-input
      v-model="postInput.value"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="来说点什么吧"
      style="padding-bottom: 5px"
    >
    </el-input>
    <el-row>
      <el-col :span="12">
        <div style="text-align: left">
          <el-upload
            class="upload-demo"
            action="https://imgurl.org/upload/aws_s3"
            multiple
            :on-success="
              (response) => {
                getUploadInfo(response);
              }
            "
            :on-remove="delUploadInfo"
            :limit="5"
          >
            <el-button type="primary" color="#63acb5">
              <el-icon><film /></el-icon>
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                图片大小需小于500kb。
              </div>
            </template>
          </el-upload>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="text-align: right">
          <el-button-group>
            <el-popover
              placement="bottom"
              :width="600"
              trigger="click"
              v-model:visible="emoVisible"
            >
              <template #reference>
                <el-button
                  type="primary"
                  color="#63acb5"
                  @click="emoVisible = !emoVisible"
                >
                  (`ヮ´ )
                </el-button>
              </template>
              <el-row style="text-align: center">
                <el-col
                  :span="4"
                  @click="postAdd(item)"
                  v-for="(item, index) in emoji"
                  :key="index"
                  style="height: 40px"
                >
                  <el-button type="text" style="color: #63acb5">
                    {{ item }}
                  </el-button>
                </el-col>
              </el-row>
            </el-popover>
            <el-button
              type="primary"
              @click="postForumPost(plateId, postInput.value, postInput.title, postInput.mediaUrl)"
              color="#63acb5"
            >
              回复
            </el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
  </div>
  <div>
    <div v-for="(item, index) in res.list" :key="index" class="plate-class">
      <router-link :to="'/post/' + item.id">
        <PostNode :postNode="item" />
      </router-link>
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
import { defineComponent, onUpdated, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PostNode from "../components/PostNode.vue";
import store from "../store";
import emoji from "../assets/emoji";

export default defineComponent({
  components: {
    PostNode,
  },
  setup() {
    let emoVisible = ref(false);
    let postInput = reactive({
      value: "",
      title: "",
      mediaUrl: [] as Array<{ id: string; url: string; thumbnailUrl: string }>,
    });
    let postAdd = (str: string) => {
      postInput.value += str;
      emoVisible.value = false;
    };
    let plateId = ref();
    let plateData = reactive({
      name: "",
      value: "",
    });
    let res = reactive({
      list: [],
      count: 0,
    });
    let pageRes = reactive({
      page: 1,
      size: 20,
    });
    let getIndex = (plateId: number, page: number, size: number) => {
      axios
        .get(
          "forum/index?plateId=" + plateId + "&page=" + page + "&size=" + size
        )
        .then((response) => {
          res.list = response.data.data.list;
          res.count = response.data.data.count;
          window.scrollTo(0, 0);
        });
    };
    let postForumPost = (plateId: number, value: string, title: string, mediaUrl:Array<{id: string; url: string; thumbnailUrl:string}>) => {
      axios.defaults.headers.common["Authorization"] =
        store.getters.getAuthToken;
      axios
        .post("forum/post", {
          value: value,
          title: title,
          replyArr: [],
          plateId: Number(plateId),
          mediaUrl: JSON.stringify(mediaUrl),
        })
        .then((response) => {
          if (response.data.code == 200) {
            getIndex(plateId, pageRes.page - 1, pageRes.size);
          } else {
            alert("请领取饼干");
          }
          postInput.value = "";
          postInput.title = "";
        });
    };
    let getUploadInfo = (response: any) => {
      postInput.mediaUrl.push({
        id: response.id,
        url: response.url,
        thumbnailUrl: response.thumbnail_url,
      });
    };
    let delUploadInfo = (file: any, uploadFiles: any) => {
      for (let i = 0; i < postInput.mediaUrl.length; i++) {
        if (file.response.id === postInput.mediaUrl[i].id) {
          postInput.mediaUrl.splice(i, 1);
        }
      }
    };
    const route = useRoute();
    plateId.value = route.params.plateId;
    getIndex(plateId.value, pageRes.page - 1, pageRes.size);
    watch(plateId, () => {
      pageRes.page = 1;
      getIndex(plateId.value, pageRes.page - 1, pageRes.size);
    });
    watch(pageRes, () => {
      getIndex(plateId.value, pageRes.page - 1, pageRes.size);
    });
    onUpdated(() => {
      plateId.value = route.params.plateId;
      let data = store.getters.getPlateData(Number(plateId.value));
      plateData.name = data.name;
      plateData.value = data.value;
    });
    return {
      plateId,
      res,
      postInput,
      postForumPost,
      pageRes,
      plateData,
      postAdd,
      emoVisible,
      emoji,
      getUploadInfo,
      delUploadInfo,
    };
  },
});
</script>
<style>
.plate-class {
  border: 10px solid white;
}
</style>

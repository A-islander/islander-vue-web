<template>
  <div style="border: 10px solid white">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/plate/' + plateData.id + '/page/1' }">
        <div style="font-size: 20px; color: #63acb5; margin-bottom: 5px">
          {{ plateData.name }}
        </div>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <div style="font-size: 20px; color: #63acb5; margin-bottom: 5px">
          No.{{ postId }}
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-input
      id="reply-input"
      v-model="replyInput.value"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="来说点什么吧"
      style="padding-bottom: 5px"
      @input="setInputBuff(Number(postId), replyInput.value)"
    >
    </el-input>
    <el-row>
      <el-col :span="12">
        <div style="text-align: left">
          <el-upload
            class="upload-demo"
            action="https://forum-api.islander.top/img/upload"
            :headers="{ Authorization: authToken }"
            multiple
            :on-success="
              (response) => {
                getUploadInfo(response);
              }
            "
            :on-remove="delUploadInfo"
            :limit="5"
            ref="upload"
          >
            <el-button type="primary" color="#63acb5">
              <el-icon><film /></el-icon>
            </el-button>
            <template #tip>
              <div class="el-upload__tip">图片大小需小于500kb。</div>
            </template>
          </el-upload>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="text-align: right">
          <el-button-group>
            <el-button
              type="primary"
              color="#63acb5"
              @click="drawInfo.status = true"
            >
              (`ヮ´ )
            </el-button>
            <el-button
              type="primary"
              @click="
                replyForumPost(postId, replyInput.value, replyInput.mediaUrl)
              "
              color="#63acb5"
              :loading="postingStatus"
            >
              回复
            </el-button>
          </el-button-group>
        </div>
      </el-col>
    </el-row>
  </div>
  <div>
    <div
      v-for="(item, index) in res.list"
      :key="index"
      style="border: 10px solid white"
      v-loading="loadingStatus"
    >
      <PostNode :postNode="item" :userId="userId">
        <template #post-head>
          <PostNodeHead :postNode="item">
            <template #post-head-number>
              <div @click="replyAdd('No.' + item.id)">No.{{ item.id }}</div>
            </template>
          </PostNodeHead>
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
  <el-drawer
    v-model="drawInfo.status"
    :direction="drawInfo.direction"
    :size="drawInfo.size"
  >
    <template #title>
      <span style="color: #63acb5"> 选择你的颜文字酱！ </span>
    </template>
    <template #default>
      <el-row style="text-align: center">
        <el-col
          :span="4"
          @click="replyAdd(item)"
          v-for="(item, index) in emoji"
          :key="index"
          style="height: 50px"
        >
          <el-button type="text" style="color: #63acb5">
            {{ item }}
          </el-button>
        </el-col>
      </el-row>
    </template>
  </el-drawer>
</template>
<script lang="ts">
import axios from "axios";
import { defineComponent, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import PostNode from "../components/PostNode.vue";
import PostNodeHead from "../components/PostNodeHead.vue";
import store from "../store";
import emoji from "../assets/emoji";
import { ElMessage } from "element-plus";

export default defineComponent({
  components: {
    PostNode,
    PostNodeHead,
  },
  setup() {
    let postId = ref();
    const route = useRoute();
    postId.value = route.params.postId;
    let drawInfo = reactive({
      status: false,
      direction: "rtl",
      size: "45%",
    });
    let width = document.body.clientWidth;
    // 手机和电脑设置
    if (width > 1024) {
    } else {
      drawInfo.direction = "btt";
      drawInfo.size = "50%";
    }
    let setInputBuff = (postId: number, str: string) => {
      if (str.length > 0) {
        localStorage.setItem("postInputBuff" + String(postId), str);
      } else {
        removeInputBuff("postInputBuff" + String(postId));
      }
    };
    let removeInputBuff = (key: string) => {
      localStorage.removeItem(key);
    };
    let getInputBuff = (postId: number) => {
      let str = localStorage.getItem("postInputBuff" + String(postId));
      if (str == null) {
        return "";
      } else {
        return str;
      }
    };
    let replyInput = reactive({
      value: getInputBuff(Number(postId.value)),
      mediaUrl: [] as Array<{ id: string; url: string; thumbnailUrl: string }>,
    });
    let replyAdd = (str: string) => {
      let input = document.getElementById("reply-input");
      let inputStart = 0;
      if (input != null) {
        inputStart = (input as any).selectionStart;
      }
      if (replyInput.value == null) {
        replyInput.value = "";
      }
      replyInput.value =
        replyInput.value.slice(0, inputStart) +
        str +
        replyInput.value.slice(inputStart);
      drawInfo.status = false;
      ElMessage({
        type: "success",
        message: "添加成功",
      });
    };
    let pageRes = reactive({
      page: 1,
      size: 20,
    });
    let res = reactive({
      list: [] as Array<{ plateId: number }>,
      count: 0,
    });
    let plateData = reactive({
      name: "",
      id: 1,
    });
    let getPlate = () => {
      let data = store.getters.getPlateData(Number(res.list[0].plateId));
      plateData.name = data.name;
      plateData.id = data.id;
    };
    pageRes.page = Number(route.params.page);
    let loadingStatus = ref(false);
    let getPost = (postId: number, page: number, size: number) => {
      loadingStatus.value = true;
      axios
        .get("forum/list?postId=" + postId + "&page=" + page + "&size=" + size)
        .then((response) => {
          res.list = response.data.data.list;
          res.count = response.data.data.count;
          window.scrollTo(0, 0);
          getPlate();
          loadingStatus.value = false;
        })
        .catch((error) => {
          loadingStatus.value = false;
        });
    };
    let postingStatus = ref(false);
    let replyForumPost = (
      followId: number,
      value: string,
      mediaUrl: Array<{ id: string; url: string; thumbnailUrl: string }>
    ) => {
      postingStatus.value = true;
      axios.defaults.headers.common["Authorization"] =
        store.getters.getAuthToken;
      axios
        .post("forum/reply", {
          value: value,
          followId: Number(followId),
          replyArr: [],
          mediaUrl: JSON.stringify(mediaUrl),
        })
        .then((response) => {
          if (response.data.code === 200) {
            getPost(postId.value, pageRes.page - 1, pageRes.size);
            replyInput.value = "";
            replyInput.mediaUrl = [];
            removeInputBuff("postInputBuff" + String(postId.value));
            upload.value.clearFiles();
          } else if (response.data.code == 403) {
            alert("请领取饼干");
          } else if (response.data.code == 404) {
            alert("总得说点什么吧");
          }
          postingStatus.value = false;
        });
    };
    let getUploadInfo = (response: any) => {
      if (response.data.success === true) {
        replyInput.mediaUrl.push({
          id: response.data.RequestId,
          url: response.data.data.url,
          thumbnailUrl: response.data.data.url,
        });
      } else {
        replyInput.mediaUrl.push({
          id: response.data.RequestId,
          url: response.data.images,
          thumbnailUrl: response.data.images,
        });
      }
    };
    let delUploadInfo = (file: any, uploadFiles: any) => {
      if (file.response !== undefined) {
        for (let i = 0; i < replyInput.mediaUrl.length; i++) {
          if (file.response.data.RequestId === replyInput.mediaUrl[i].id) {
            replyInput.mediaUrl.splice(i, 1);
          }
        }
      }
    };

    getPost(postId.value, pageRes.page - 1, pageRes.size);
    watch(pageRes, () => {
      let obj = document.getElementById("body-container") as HTMLInputElement;
      // obj.scrollTop = 0;
      getPost(postId.value, pageRes.page - 1, pageRes.size);
      updateUrl(pageRes.page);
    });
    let updateUrl = (page: number) => {
      var url = window.location.href;
      var arr = url.split("/");
      arr.pop();
      arr.push(String(page));
      var newUrl = arr.join("/");
      history.pushState("", "", newUrl);
    };
    let userId = ref(store.getters.getUserId);
    let authToken = store.getters.getAuthToken;
    const upload: any = ref(null);
    return {
      loadingStatus,
      upload,
      authToken,
      userId,
      res,
      replyInput,
      postId,
      replyForumPost,
      pageRes,
      replyAdd,
      emoji,
      getUploadInfo,
      delUploadInfo,
      plateData,
      drawInfo,
      setInputBuff,
      postingStatus,
    };
  },
});
</script>

<template>
  <div style="border: 10px solid white">
    <div style="font-size: 40px; color: #63acb5; margin-bottom: 5px">
      {{ plateData.name }}
    </div>
    <div style="font-size: 20px; color: #63acb5; margin-bottom: 5px">
      {{ plateData.value }}
    </div>
    <el-input
      id="plate-input"
      v-model="postInput.value"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="来说点什么吧"
      style="padding-bottom: 5px"
      v-if="plateId != 0"
      @input="setInputBuff(postInput.value)"
    >
    </el-input>
    <el-row v-if="plateId != 0">
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
                postForumPost(
                  plateId,
                  postInput.value,
                  postInput.title,
                  postInput.mediaUrl
                )
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
      class="plate-class"
      v-loading="loadingStatus"
    >
      <PostNode :postNode="item" :userId="userId">
        <template #post-head>
          <router-link :to="'/post/' + item.id + '/page/1'">
            <PostNodeHead :postNode="item">
              <template #post-head-tag v-if="plateId == 0">
                {{ getPlateData(item.plateId).name }}
              </template>
            </PostNodeHead>
          </router-link>
        </template>
        <template #reply-count>
          <div style="font-size: 10px; color: #63acb5">
            还有{{ item.replyCount }}条串
          </div></template
        >
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
          @click="postAdd(item)"
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
import { defineComponent, onUpdated, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import PostNode from "../components/PostNode.vue";
import PostNodeHead from "../components/PostNodeHead.vue";
import store from "../store";
import emoji from "../assets/emoji";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "plate",
  components: {
    PostNode,
    PostNodeHead,
  },
  setup() {
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
    let setInputBuff = (str: string) => {
      if (str.length > 0) {
        localStorage.setItem("plateInputBuff", str);
      } else {
        removeInputBuff("plateInputBuff");
      }
    };
    let removeInputBuff = (key: string) => {
      localStorage.removeItem(key);
    };
    let getInputBuff = () => {
      let str = localStorage.getItem("plateInputBuff");
      if (str == null) {
        return "";
      } else {
        return str;
      }
    };
    let postInput = reactive({
      value: getInputBuff(),
      title: "",
      mediaUrl: [] as Array<{ id: string; url: string; thumbnailUrl: string }>,
    });
    let postAdd = (str: string) => {
      let input = document.getElementById("plate-input");
      let inputStart = 0;
      if (input != null) {
        inputStart = (input as any).selectionStart;
      }
      if (postInput.value == null) {
        postInput.value = "";
      }
      postInput.value =
        postInput.value.slice(0, inputStart) +
        str +
        postInput.value.slice(inputStart);
      drawInfo.status = false;
      ElMessage({
        type: "success",
        message: "添加成功",
      });
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
    let loadingStatus = ref(false);
    let getIndex = (plateId: number, page: number, size: number) => {
      loadingStatus.value = true;
      if (Number(plateId) !== 0) {
        axios
          .get(
            "forum/index?plateId=" + plateId + "&page=" + page + "&size=" + size
          )
          .then((response) => {
            res.list = response.data.data.list;
            res.count = response.data.data.count;

            // 拼接省略字符串
            for (let i = 0; i < res.list.length; i++) {
              for (
                let j = 0;
                j < (res.list[i] as any).lastReplyArr.length;
                j++
              ) {
                if ((res.list[i] as any).lastReplyArr[j].value.length > 20) {
                  (res.list[i] as any).lastReplyArr[j].value =
                    (res.list[i] as any).lastReplyArr[j].value.slice(0, 20) +
                    "...";
                }
              }
            }
            window.scrollTo(0, 0);
            loadingStatus.value = false;
          })
          .catch((error) => {
            loadingStatus.value = false;
          });
      } else {
        axios
          .get("forum/indexLast?page=" + page + "&size=" + size)
          .then((response) => {
            res.list = response.data.data.list;
            res.count = response.data.data.count;

            // 拼接省略字符串
            for (let i = 0; i < res.list.length; i++) {
              for (
                let j = 0;
                j < (res.list[i] as any).lastReplyArr.length;
                j++
              ) {
                if ((res.list[i] as any).lastReplyArr[j].value.length > 20) {
                  (res.list[i] as any).lastReplyArr[j].value =
                    (res.list[i] as any).lastReplyArr[j].value.slice(0, 20) +
                    "...";
                }
              }
            }
            window.scrollTo(0, 0);
            loadingStatus.value = false;
          })
          .catch((error) => {
            loadingStatus.value = false;
          });
      }
    };
    let postingStatus = ref(false);
    let postForumPost = (
      plateId: number,
      value: string,
      title: string,
      mediaUrl: Array<{ id: string; url: string; thumbnailUrl: string }>
    ) => {
      if (plateId != 0) {
        postingStatus.value = true;
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
              postInput.mediaUrl = [];
              upload.value.clearFiles();
            } else if (response.data.code == 403) {
              alert("请领取饼干");
            } else if (response.data.code == 404) {
              alert("总得说点什么吧");
            }
            postInput.value = "";
            postInput.title = "";
            removeInputBuff("plateInputBuff");
            postingStatus.value = false
          });
      } else {
        alert("去选一下板块吧");
      }
    };
    let getUploadInfo = (response: any) => {
      if (response.data.success === true) {
        postInput.mediaUrl.push({
          id: response.data.RequestId,
          url: response.data.data.url,
          thumbnailUrl: response.data.data.url,
        });
      } else {
        postInput.mediaUrl.push({
          id: response.data.RequestId,
          url: response.data.images,
          thumbnailUrl: response.data.images,
        });
      }
    };
    let delUploadInfo = (file: any, uploadFiles: any) => {
      if (file.response !== undefined) {
        for (let i = 0; i < postInput.mediaUrl.length; i++) {
          if (file.response.data.RequestId === postInput.mediaUrl[i].id) {
            postInput.mediaUrl.splice(i, 1);
          }
        }
      }
    };
    const route = useRoute();
    plateId.value = route.params.plateId;
    pageRes.page = Number(route.params.page);
    getIndex(plateId.value, pageRes.page - 1, pageRes.size);
    watch(plateId, () => {
      pageRes.page = 1;
      getIndex(plateId.value, pageRes.page - 1, pageRes.size);
    });
    watch(pageRes, () => {
      getIndex(plateId.value, pageRes.page - 1, pageRes.size);
      route.params.page = String(pageRes.page);
      updateUrl(pageRes.page);
    });
    let getPlateData = store.getters.getPlateData;
    onUpdated(() => {
      plateId.value = route.params.plateId;
      let data = getPlateData(Number(plateId.value));
      if (Number(plateId.value) !== 0) {
        plateData.name = data.name;
        plateData.value = data.value;
      } else {
        plateData.name = "时间线";
        plateData.value = "就是时间线辣";
      }
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
    let load = () => {
      console.log("load");
    };
    return {
      load,
      loadingStatus,
      upload,
      authToken,
      userId,
      getPlateData,
      plateId,
      res,
      postInput,
      postForumPost,
      pageRes,
      plateData,
      postAdd,
      emoji,
      getUploadInfo,
      delUploadInfo,
      drawInfo,
      setInputBuff,
      postingStatus,
    };
  },
});
</script>
<style>
.plate-class {
  border: 10px solid white;
}
</style>

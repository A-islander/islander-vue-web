<template>
  <div class="home" style="margin-left: 20px; margin-right: 20px;">
    <div style="margin: 0 auto">
      <img alt="Vue logo" src="../assets/logo.jpg" style="width: 100%" v-if="mobileStatus"/>
    </div>
    <div>
      <div style="font-size: 40px; color: #63acb5">欢迎来到岛民岛</div>
      <p>
        这里是岛民岛，就跟字面意思一样，是属于岛民的岛。<br />
        这里没有红名，所有岛民拥有相同的权力（如果说直接通过修改数据库去权限的话，还是有一个红名的）。<br />
        暂时还没有什么复杂规则，不过在现阶段应该有不少岛民是来自于a岛，作为岛民的岛，自然每位岛民都拥有提出和制定规则的权力，在未来大家一起遵守！<br />
        岛民岛的串将定时备份至github，所有岛民都拥有clone的权力：<br />
        <a href="https://github.com/A-islander/post-backup">备份地址</a><br />
        岛民岛的代码全部公开于github，所有岛民都拥有clone的权力：<br />
        <a href="https://github.com/A-islander/readme">
          项目说明
        </a>
        <br />
        <a href="https://github.com/A-islander/islander-forum-system">
          论坛系统
        </a>
        <br />
        <a href="https://github.com/A-islander/islander-user-system">
          用户系统
        </a>
        <br />
        <a href="https://github.com/A-islander/islander-backup-system">
          用户系统 </a
        ><br />
        如果有岛民想要二次开发的话，接口文档在这里：<br />
        <a
          href="https://docs.apipost.cn/preview/b58077f3ebc9caeb/6a197cc600cf6f5c"
        >
          接口文档
        </a>
        <br />
        每位岛民都可以拿着这套系统重新构建起岛民岛，但是，岛民岛有一个精神，那便是岛民岛的一切是属于所有岛民的。<br />
        若是有人，拿着这套系统和数据构建后数据闭源搞权限岛，我想,如果在未经全体岛民同意的情况下，大约的确违背了上述精神吧。<br />
        顺便，后续有将岛民岛建设成分布式的念头。<br />
        最后借用一下鲁迅先生的话：<br />
        “有一分热，发一分光，就令萤火一般，也可以在黑暗里发一点光，不必等候炬火。此后如竟没有炬火，我便是唯一的光。”
      </p>
    </div>
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import PostNode from "../components/PostNode.vue";

export default defineComponent({
  name: "Home",
  components: {
    PostNode,
  },
  setup(){
    let width = document.body.clientWidth;
    let mobileStatus = ref(true);
    if (width > 1024) {
      mobileStatus.value = false;
    }
    return {
      mobileStatus
    }
  }
});
</script>

<style>
.home a {
  color: #63acb5;
}
</style>

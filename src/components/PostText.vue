<script lang="ts">
import { defineComponent, h, inject, toRefs } from "vue";

let textRender = (str: String | undefined) => {
  let getPostNode = inject("getPostNode") as Function;
  if (str === undefined) {
    str = "";
  }
  let urlReg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)|No.[0-9]+/g;
  let data = str.match(urlReg);
  let nodeArr = [];
  let start = 0; // 截取起点
  let end = 0; // 截取终点
  let seg = ""; // 截取内容
  if (data !== null) {
    // 生成渲染树
    for (let i = 0; i < data.length; i++) {
      end = str.slice(start, str.length).indexOf(data[i]);
      seg = str.slice(start, start + end); // 前段
      nodeArr.push(seg);
      if (data[i].indexOf("http") !== -1) {
        nodeArr.push(
          h(
            "a",
            { href: data[i], style: "color: #63acb5", target: "_blank" },
            "链接"
          )
        );
      } else if (data[i].indexOf("No.") !== -1) {
        let num = data[i].replace(/No./, "");
        nodeArr.push(
          h(
            "el-button",
            {
              onclick: () => {
                getPostNode(num);
              },
              style: "color: #63acb5",
            },
            data[i]+" "
          )
        );
      }
      start = start + end + data[i].length;
    }
  }
  nodeArr.push(str.slice(start, str.length));
  let contanier = h("div", { style: "white-space: pre-wrap" }, nodeArr);
  return contanier;
};

export default defineComponent({
  name: "PostText",
  props: {
    text: String,
  },
  setup(props) {
    // let str = "2022-03-20日更新\n1. 新增议事厅板块，用以讨论岛民以及岛内务\n2. 新增界面图标，看起来正常一点了\n3. 新增串备份和接口文档地址，方便岛民查询和使用\n4. 更新readme.md，新增搭建教程：http://baidu.com 你好 http://baidu.com http://baidu.com http://baidu.com No.123";
    return { ...toRefs(props) };
  },
  render() {
    // 在渲染中执行函数，setup在启动后便无法返回更新的text数据
    return textRender(this.text);
  },
});
</script>

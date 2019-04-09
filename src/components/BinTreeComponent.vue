<template>
  <div v-if="node" style="display:flex; justify-content:center; position:relative">
    <svg width="100%" height="500" class="behind">
      <line
        v-if="node.left"
        :x1="nodeCenter[0]"
        :y1="nodeCenter[1]"
        :x2="leftChild[0]"
        :y2="leftChild[1]"
        stroke="red"
      ></line>
      <line
        v-if="node.right"
        :x1="nodeCenter[0]"
        :y1="nodeCenter[1]"
        :x2="rightChild[0]"
        :y2="rightChild[1]"
        stroke="black"
      ></line>
    </svg>
    <div class="flex-column">
      <div>
        <div class="node card shadow rounded m-1 p-1" ref="node">{{node.val}}</div>
      </div>
      <div class="flex kids">
        <div v-if="node.left" ref="left" class="kid">
          <BinTreeComponent ref="vue-left" :node="node.left"/>
        </div>
        <div v-else-if="node.onlyRight" :style="styleObj"></div>
        <div v-if="node.right" ref="right" class="kid">
          <BinTreeComponent ref="vue-right" :node="node.right"/>
        </div>
        <div v-else-if="node.onlyLeft" :style="styleObj"></div>
      </div>
    </div>

    <!-- <svg width="500" height="500" style="z-index:-1"> -->
    <!-- <line x1="50" y1="50" x2="350" y2="50" stroke="red"></line> -->
    <!-- </svg> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BinTree from "@/BinTree";

@Component
export default class BinTreeComponent<T> extends Vue {
  @Prop() private node!: BinTree<T>;
  styleObj = {
    width: "2.4em",
    color: "red"
  };
  nodeCenter: [number, number] = [0, 0];
  leftChild: [number, number] = [0, 0];
  rightChild: [number, number] = [0, 0];
  calcCenter(elem: HTMLElement): [number, number] {
    const n = elem;
    const l = n.offsetLeft;
    const r = n.offsetLeft + n.offsetWidth;
    const t = n.offsetTop;
    const b = n.offsetTop + n.offsetHeight;
    return [Math.round((l + r) / 2), Math.round((t + b) / 2)];
  }
  setNodeCenter() {
    const n = this.$refs["node"] as HTMLElement;
    if (n) {
      this.nodeCenter = this.calcCenter(n);
    }
  }
  redrawLines() {
    const l = this.$refs["vue-left"] as BinTreeComponent<T>;
    if (l) {
      l.redrawLines();
    }
    const r = this.$refs["vue-right"] as BinTreeComponent<T>;
    if (r) {
      r.redrawLines();
    }
    //now do my own.
    this.setNodeCenter();
    this.setLeftChild();
    this.setRightChild();
  }
  setLeftChild() {
    const n = this.$refs["left"] as HTMLElement;
    if (n) {
      // console.log("left child exists!!!", n);
      this.leftChild = this.calcCenter(n);
      const vueE = this.$refs["vue-left"] as BinTreeComponent<T>;
      // console.log(
      //   "this.leftChild[1] was",
      //   this.leftChild[1],
      //   "setting to",
      //   vueE.nodeCenter
      // );
      this.leftChild[1] = this.nodeCenter[1] + vueE.nodeCenter[1] * 2; //;
    }
  }
  setRightChild() {
    const n = this.$refs["right"] as HTMLElement;
    if (n) {
      this.rightChild = this.calcCenter(n);
      const vueE = this.$refs["vue-right"] as BinTreeComponent<T>;
      this.rightChild[1] = this.nodeCenter[1] + vueE.nodeCenter[1] * 2; //;
    }
  }
  mounted() {
    this.setNodeCenter();
    this.setLeftChild();
    this.setRightChild();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.center {
  text-align: center;
}
.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.node {
  border: 1px;
  border-style: solid;
  width: min-content;
}
.kids {
  /* border: 1px;
  border-color: green;
  border-style: solid; */
}
.flex {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
}
.behind {
  z-index: -1;
  position: absolute;
  top: 0%;
  left: 0%;
}
</style>

<template>
  <div id="app" style="position:relative">
    <div style="position:relative">
      <BinTreeComponent style="position:relative" ref="bintreecomp" :node="myTree"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import BinTreeComponent from "./BinTreeComponent.vue";
import BinTree from "@/BinTree";

@Component({
  components: {
    BinTreeComponent
  }
})
export default class BinTreeViewer extends Vue {
  @Prop() tree!: BinTree<number> | null;
  myTree: BinTree<number> | null = null;
  treeComp: BinTreeComponent<number> = this.$refs[
    "bintreecomp"
  ] as BinTreeComponent<number>;
  mounted() {
    (window as any).viewer = this;
    console.log("just set viewer");
    this.myTree = this.tree;
    this.treeComp = this.$refs["bintreecomp"] as BinTreeComponent<number>;
    this.redraw();
  }
  @Watch("tree")
  newTreeProp(val: BinTree<number> | null, oldVal: BinTree<number> | null) {
    this.myTree = val;
    this.cleanup();
  }
  reset(nums: number[], balance: boolean = false) {
    this.myTree = (balance ? BinTree.fromListSort : BinTree.fromList)(nums);
    this.cleanup();
  }
  insert(n: number) {
    if (!this.myTree) return;
    this.myTree.insert(n);
    this.pushHist();
    this.cleanup();
  }
  pushHist() {
    if (!this.myTree) return;
    this.$router.push({
      name: "binTreeView",
      query: { tree: JSON.stringify(this.myTree.toList()) }
    });
  }
  delete(n: number) {
    if (!this.myTree) return;
    this.myTree.delete(n, bn => (this.myTree = bn));
    this.pushHist();
    this.cleanup();
  }
  cleanup() {
    setTimeout(this.treeComp.redrawLines, 0);
  }
  redraw() {
    this.cleanup();
  }
}
</script>

<style>
.behind {
  z-index: -1;
  position: absolute;
  top: 0%;
  left: 0%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

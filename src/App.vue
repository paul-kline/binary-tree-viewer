<template>
  <div id="app" style="position:relative">
    <div style="position:relative">
      <router-view :tree="tree"></router-view>
      <!-- <BinTreeComponent style="position:relative" ref="bintreecomp" :node="tree"/> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
// import BinTreeComponent from "./components/BinTreeComponent.vue";
import BinTreeViewer from "./components/BinTreeViewer.vue";
import BinTree from "@/BinTree";

@Component({
  components: {
    // BinTreeComponent
    BinTreeViewer
  }
})
export default class App extends Vue {
  ls1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 54, 31, 27, 79];
  tree: BinTree<number> | null = BinTree.fromListSort(
    this.ls1,
    (a, b) => a - b
  );
  @Watch("$route")
  onrouteChanged() {
    console.log("new route!!!");
    this.setTreeFromQuery();
  }
  setTreeFromQuery() {
    const q = this.$route.query;
    if (q.tree) {
      const s = q.sort && JSON.parse(q.sort as string);
      console.log("setting tree@@");
      this.tree = (s ? BinTree.fromListSort : BinTree.fromList)(
        JSON.parse(q.tree as string)
      );
    }
  }
  mounted() {
    this.setTreeFromQuery();
    console.log(this.$route);
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

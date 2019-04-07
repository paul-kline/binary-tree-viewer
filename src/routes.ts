import Router from "vue-router";
import BinTreeViewer from "./components/BinTreeViewer.vue";
import BinTree from "./BinTree";
export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "binTreeView",
      component: BinTreeViewer
    }
  ]
});

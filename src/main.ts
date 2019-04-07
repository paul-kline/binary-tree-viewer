import Vue from "vue";
import App from "./App.vue";
import BinTree from "./BinTree";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import router from "./routes";

Vue.use(VueRouter);

Vue.use(BootstrapVue);

(window as any).BinTree = BinTree;
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

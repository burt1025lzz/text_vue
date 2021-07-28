import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: () =>
      import(/* webpackChunkName: "index" */ "../views/Index.vue"),
  },
  {
    path: "/search/:type",
    name: "Search",
    component: () =>
      import(/* webpackChunkName: "search" */ "../views/Search.vue"),
  },
  {
    path: "/content/:title",
    name: "Content",
    component: () =>
      import(/* webpackChunkName: "content" */ "../views/Content.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;

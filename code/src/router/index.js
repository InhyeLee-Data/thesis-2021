import { createRouter, createWebHashHistory } from "vue-router";
import Intro from "../views/Intro.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    redirect: "/intro",
  },
  {
    path: "/intro",
    name: "Intro",
    component: Intro,
  },
  {
    path: "/combinedview",
    name: "CombinedView",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CombinedView.vue"),
  },
  {
    path: "/map",
    name: "Map",
    component: () => import(/* webpackChunkName: "about" */ "../views/Map.vue"),
  },
  {
    path: "/findings",
    name: "Findings",
    component: () => import(/* webpackChunkName: "about" */ "../views/Findings.vue"),
  },
  {
    path: "/storysegment",
    name: "StorySegment",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/StorySegment.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // https://next.router.vuejs.org/guide/migration/#moved-the-base-option
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

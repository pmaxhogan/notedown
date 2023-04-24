import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "about",
      component: () => "..views/AboutView.vue",
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/MarkdownView.vue"),
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("../views/LogoutView.vue"),
    },
    {
      // path example /view/abcd/1234
      path: "/viewdoc/:uid/:docid",
      name: "viewdoc",
      component: () => import("../views/ViewDocView.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "PageNotFound",
      component: () => import("../views/PageNotFound.vue"),
    },
  ],
});

export default router;

<!-- eslint-disable no-unused-vars -->
<!--suppress CssUnusedSymbol -->
<script setup>
import { RouterView, useRoute, useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useCurrentUser } from "vuefire";
import { onMounted, watch } from "vue";

const router = useRouter();
const route = useRoute();
const user = useCurrentUser();

console.log("app");
// we don"t need this watcher on server
onMounted(() => {
  watch(user, (user, prevUser) => {
    console.log("user changed", user, prevUser);
    if (!user && route.path !== "/login") {
      // user logged out
      router.push("/login");
    } else if (route.path === "/login" && user) {
      // user logged in
      router.push("/");
    } else if (route.path === "/login" && !user) {
      router.push("/login");
    }
  });
});
</script>

<template>
  <AppHeader />
  <RouterView />
  <AppFooter />
</template>

<style></style>

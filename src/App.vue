<!-- eslint-disable no-unused-vars -->
<!--suppress CssUnusedSymbol -->
<script setup>
import { RouterView, useRoute, useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import { useCurrentUser } from "vuefire";
import { onMounted, watch } from "vue";

const router = useRouter();
const route = useRoute();
const user = useCurrentUser();

onMounted(() => {
  watch(user, (user, prevUser) => {
    console.log("user changed", user, prevUser);
    if (!user && route.path !== "/about") {
      // user logged out
      router.push("/about");
    }
  });
});
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <!-- <AppFooter /> -->
</template>

<style>
body,
html {
  min-height: 100%;
  background: #322467;
}

main {
  width: min(80%, 100vw);
  background: white;
  margin: 0 auto;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
</style>

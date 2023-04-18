<!-- eslint-disable no-unused-vars -->
<!--suppress CssUnusedSymbol -->
<script setup>
import { RouterView, useRoute, useRouter } from "vue-router";
import AppHeader from "@/components/AppHeader.vue";
import { useCurrentUser } from "vuefire";
import { onMounted, watch } from "vue";
import Footer from "@/components/AppFooter.vue";

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
  <Footer></Footer>
</template>

<style>
body,
html {
  min-height: 100%;
  background: #322467;
}

main{

  background: rgb(254, 252, 255);
  margin: 0 auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 5px 5px;
}
</style>

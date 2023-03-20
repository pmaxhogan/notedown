<!-- eslint-disable no-unused-vars -->
<!--suppress CssUnusedSymbol -->
<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
</script>

<template>
  <AppHeader />
  <RouterView />
  <AppFooter />
</template>

<style></style>

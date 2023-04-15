<template>
  <div class="login">Logging out...</div>
</template>

<script setup>
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();

const auth = getAuth();
signOut(auth).then(() => {
  router.push("/about");
});
</script>

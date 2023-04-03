<template>
  <div class="login">
    <LoginForm />
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script setup>
import LoginForm from "@/components/LoginForm.vue";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

async function loginWithGoogle() {
  await signInWithPopup(auth, provider);
}
</script>

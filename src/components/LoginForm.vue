<template>
  <form action="" id="form">
    <div v-if="error && error.length">
      <p v-for="e in error" :key="e.id">{{ e }}</p>
    </div>
    <label for="email">Email:</label>
    <br />
    <input type="email" id="email" v-model="email" />
    <div class="error"></div>
    <br />
    <label for="password">Password:</label>
    <br />
    <input type="password" id="password" v-model="password" />
  </form>
  <button type="submit" @click="login">Log in</button>
</template>

<script setup>
import { ref } from "vue";

const error = ref([]);
const email = ref("");
const password = ref("");

function login() {
  error.value = [];
  if (!email.value) {
    error.value.push("Invalid email");
  }
  if (!password.value) {
    error.value.push("Invalid password");
  }
  if (error.value.length <= 0) {
    window.location.href = "/";
  }
}
</script>

<script setup>
import { useCollection } from "vuefire";
import { db } from "@/main.js";
import { collection } from "firebase/firestore";

const todos = useCollection(collection(db, "todos"));
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.content }}
      </li>
    </ul>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

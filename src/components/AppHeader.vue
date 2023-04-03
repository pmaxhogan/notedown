<script setup>
import { useCurrentUser, useDocument } from "vuefire";
import { db } from "@/main";
import { collection, doc } from "firebase/firestore";
import { onMounted, ref, watch } from "vue";

const user = useCurrentUser();

// ref that stores the user document as an object from firebase, or null if not logged in etc
let userDocRef = ref(null);

console.log(userDocRef?.value, user?.value?.uid);

onMounted(() => {
  watch(user, (user) => {
    if (user?.uid) {
      userDocRef.value = useDocument(doc(collection(db, "users"), user.uid));
    } else {
      userDocRef.value = null;
    }
  });
});
</script>

<template>
  <header>
    <h3>Welcome to NoteDown</h3>
    <nav>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/about">About</RouterLink></li>
        <li><RouterLink to="/markdown">Markdown</RouterLink></li>
        <li>
          <img
            v-if="userDocRef?.value?.photoURL"
            :alt="userDocRef?.value?.name"
            :src="userDocRef?.value?.photoURL"
          />
          <span v-text="userDocRef?.value?.name ?? 'Not Logged In'" />
        </li>
        <li>
          <RouterLink v-if="!user" to="/login">Login</RouterLink>
          <RouterLink v-else to="/logout">Logout</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

...
<style lang="scss">
img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #0e1315;
  vertical-align: middle;
  margin: 0 0.5rem;
  border: 1px solid black;
}

header {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  max-height: 100vh;

  h3 {
    margin-left: 1rem;
    text-align: start;
  }
}

nav {
  margin-left: auto;
  text-align: end;
  font-size: 14px;

  ul {
    list-style: none;

    li {
      align-items: center;
      display: inline-flex;
      margin-left: 1rem;
      vertical-align: middle;
    }
  }
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
</style>

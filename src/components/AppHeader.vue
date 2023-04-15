<script setup>
import { useCurrentUser, useDocument } from "vuefire";
import { db } from "@/main";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { onMounted, ref, watch } from "vue";
// eslint-disable-next-line no-unused-vars

//LOGIN
const provider = new GoogleAuthProvider();
const auth = getAuth();

const user = useCurrentUser();

// here we can export reusable database references

async function loginWithGoogle() {
  await signInWithPopup(auth, provider);
  const userDocRef = doc(collection(db, "users"), user?.value?.uid ?? "");
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      name: user?.value?.displayName,
      email: user?.value?.email,
      photoURL: user?.value?.photoURL,
    });
  }
}

//DROPDOWN
function dropdown() {
  const element = document.getElementById("dropdown");
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}

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
    <h1>NoteDown <font-awesome-icon icon="fa-solid fa-pen-to-square" /></h1>
    <nav class="navigation-items">
      <ul>
        <li><RouterLink v-if="user" class="text" to="/">Home</RouterLink></li>
        <li><RouterLink to="/about" class="text">About</RouterLink></li>
        <li>
          <RouterLink v-if="user" class="text" to="/markdown"
            >Markdown</RouterLink
          >
        </li>
        <li v-if="user">
          <img
            v-if="userDocRef?.value?.photoURL"
            :alt="userDocRef?.value?.name"
            :src="userDocRef?.value?.photoURL"
          />
        </li>
        <li>
          <div v-if="!user">
            <div class="userProfile">
              <font-awesome-icon
                class="icon"
                icon="fa-solid fa-user"
                @click="dropdown()"
              />
            </div>

            <div class="dropdown-wrapper" id="dropdown">
              <div class="dropdown">
                <button type="submit" @click="loginWithGoogle()">
                  Sign in with
                  <font-awesome-icon icon="fa-brands fa-google" class="brand" />
                </button>
                <button type="submit">
                  Sign in with
                  <font-awesome-icon icon="fa-brands fa-github" class="brand" />
                </button>
              </div>
            </div>
          </div>
          <RouterLink v-else to="/logout" class="text">Logout</RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

...
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Courgette&family=Montserrat:wght@300;400;500&family=Poppins:wght@200;400;500&family=Raleway:wght@400;500&family=Rubik&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #fff9fe;
}
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
  justify-content: space-between;
  background-color: #a982c6;
  align-items: center;
  height: 6.4vh;
  padding-left: 28px;
  padding-right: 28px;
  .icon {
    font-size: 20px;
  }
  h1 {
    font-family: "Courgette", cursive;
    font-size: 27px;
    margin: 0;
  }
  nav ul {
    list-style-type: none;
  }
  nav ul li {
    display: inline-block;
    margin-left: 42px;
    font-size: 16px;
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
  }
  .text:hover {
    color: #fff9fe;
  }
  .text {
    text-decoration: none;
    color: black;
  }
  .userProfile {
    cursor: pointer;
  }
}
.dropdown-wrapper {
  display: none;
  background-color: #e5d0f5;
  border-radius: 10px;
  height: 160px;
  width: 240px;
  position: absolute;
  top: 58px;
  right: 25px;

  .dropdown {
    display: block;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    button {
      display: flex;
      justify-content: center;
      align-items: center;

      margin-bottom: 10px;
      margin-top: 10px;
      width: 180px;
      height: 38px;
      border-radius: 20px;
      border: none;
      background-color: #322467;
      color: #ffff;
      font-size: 16px;
      font-family: "Montserrat", sans-serif;
      font-weight: 500;
      cursor: pointer;

      .brand {
        padding-left: 7px;
      }
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

<template>
  <div class="login">
    <LoginForm />
    <button @click="loginWithGoogle">Login with Google</button>
  </div>
</template>

<script setup>
import LoginForm from "@/components/LoginForm.vue";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCurrentUser } from "vuefire";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/main";

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
</script>

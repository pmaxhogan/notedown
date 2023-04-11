<template>
  <h1></h1>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useCurrentUser } from "vuefire";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/main";

const provider = new GoogleAuthProvider();
const auth = getAuth();

const user = useCurrentUser();

// here we can export reusable database references

// eslint-disable-next-line no-unused-vars
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

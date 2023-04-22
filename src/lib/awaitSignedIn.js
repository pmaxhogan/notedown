import { getAuth } from "firebase/auth";

const auth = getAuth();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function awaitSignedIn() {
  const change = new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((_) => {
      unsubscribe();
      resolve();
    });
  });

  return auth.currentUser ? Promise.resolve() : change;
}

import { getAuth } from "firebase/auth";

const auth = getAuth();

// eslint-disable-next-line no-unused-vars
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

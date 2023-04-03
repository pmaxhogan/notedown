import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

import "primevue/resources/themes/soho-light/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "./assets/main.css";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { VueFire, VueFireAuth } from "vuefire";
// ... other firebase imports

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyCF5sbB4BmE12HB-lh2bytiQmuH0W7O7jA",
  authDomain: "notedown-web.firebaseapp.com",
  projectId: "notedown-web",
  storageBucket: "notedown-web.appspot.com",
  messagingSenderId: "153264433971",
  appId: "1:153264433971:web:9c0bbec8fb473221feac46",
  measurementId: "G-ZBY9KG9HS9",
});

// used for the firestore refs
const db = getFirestore(firebaseApp);

// here we can export reusable database references
// export const todosRef = collection(db, 'todos')

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);

app.use(router);

app.use(VueFire, {
  // imported above but could also just be created here
  firebaseApp,
  modules: [
    // we will see other modules later on
    VueFireAuth(),
  ],
});

app.mount("#app");

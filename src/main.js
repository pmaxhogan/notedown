import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import "@/assets/styles/gradient-background.scss";


import "primevue/resources/themes/soho-light/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "./assets/main.css";

import { initializeApp } from "firebase/app";
import { VueFire, VueFireAuth } from "vuefire";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(firebaseApp);

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

import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

app.component("font-awesome-icon", FontAwesomeIcon);
app.component('font-awesome-layers', FontAwesomeLayers)
app.component('font-awesome-layers-text', FontAwesomeLayersText)

library.add(faPenToSquare);
library.add(faUser);
library.add(faGithub);
library.add(faGoogle);



app.mount("#app");

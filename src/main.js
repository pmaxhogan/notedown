import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

import "primevue/resources/themes/soho-light/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "./assets/main.css";
import { VueFire, VueFireAuth } from "vuefire";
import { getFirestore } from "firebase/firestore";
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import initFirebase from "@/lib/initFirebase";

// ... other firebase imports

export const firebaseApp = initFirebase();

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

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("font-awesome-layers", FontAwesomeLayers);
app.component("font-awesome-layers-text", FontAwesomeLayersText);

library.add(faPenToSquare);
library.add(faUser);
library.add(faGithub);
library.add(faGoogle);
library.add(faRightFromBracket)

app.mount("#app");

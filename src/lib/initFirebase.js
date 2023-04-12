import { initializeApp } from "firebase/app";

export default function initFirebase() {
  return initializeApp({
    apiKey: "AIzaSyCF5sbB4BmE12HB-lh2bytiQmuH0W7O7jA",
    authDomain: "notedown-web.firebaseapp.com",
    projectId: "notedown-web",
    storageBucket: "notedown-web.appspot.com",
    messagingSenderId: "153264433971",
    appId: "1:153264433971:web:9c0bbec8fb473221feac46",
    measurementId: "G-ZBY9KG9HS9",
  });
}

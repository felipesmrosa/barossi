import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCztIgdp8yWANUJNHoYBIMXHYKZKOuuqZw",
  authDomain: "academybarossi.firebaseapp.com",
  projectId: "academybarossi",
  storageBucket: "academybarossi.appspot.com",
  messagingSenderId: "563906480315",
  appId: "1:563906480315:web:a3defa038e597a6d90419e",
});

export const bancoDeDados = getFirestore(firebaseApp);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseApp = initializeApp({
  apiKey: "AIzaSyCztIgdp8yWANUJNHoYBIMXHYKZKOuuqZw",
  authDomain: "academybarossi.firebaseapp.com",
  projectId: "academybarossi",
});


export const bancoDeDados = getFirestore(firebaseApp)
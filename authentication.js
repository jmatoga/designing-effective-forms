// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZZ4TpCc-570Fw4SImQRkhYsx7Mu19eGA",
  authDomain: "tpf4-f2921.firebaseapp.com",
  projectId: "tpf4-f2921",
  storageBucket: "tpf4-f2921.firebasestorage.app",
  messagingSenderId: "94214366272",
  appId: "1:94214366272:web:5fd1050cfd804f2b5beba5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

const userSignOut = async () => {
  signOut(auth)
    .then(() => {
      alert("You have been signed out!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    alert("You are authenticated with Google");
    console.log(user);

    // Wstrzykujemy dane do formularza
    const firstNameField = document.getElementById("firstName");
    const lastNameField = document.getElementById("lastName");
    const emailField = document.getElementById("email");

    const displayName = user.displayName || "";
    const email = user.email || "";

    const [firstName = "", lastName = ""] = displayName.split(" ");

    firstNameField.value = firstName;
    lastNameField.value = lastName;
    emailField.value = email;
  }
});

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);

<svelte:head>
	<title>Login</title>
	<meta name="description" content="Login Arco Trailers" />
</svelte:head>


<script lang="ts">
    import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { initializeApp } from 'firebase/app';
    import { getFirestore, collection, addDoc, query, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

import { onAuthStateChanged } from 'firebase/auth';



const firebaseConfig = {
  // your config here
  apiKey: "AIzaSyBzM5OnMUdBrGWBcZotDxlRh0qEnwLvtNk",
    authDomain: "arco-trailers.firebaseapp.com",
    projectId: "arco-trailers",
    storageBucket: "arco-trailers.appspot.com",
    messagingSenderId: "557877308737",
    appId: "1:557877308737:web:1aaaed23f6537f4ca585c0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
  
    let email: string = "";
    let password: string = "";
  
    async function login() {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    goto('/taskmanager'); // Redirect to the dashboard or another protected route
  } catch (error) {
    if (error instanceof Error) {
      console.error("Login failed:", error.message);
    } else {
      console.error("Login failed:", error);
    }
    // Handle errors here
  }
}

  </script>
  
  <div class="container mx-auto p-6">
    <div class="flex justify-center">
      <div class="bg-white p-8 rounded shadow-lg w-full md:w-1/2">
        <h1 class="text-2xl mb-4 text-center text-blue-700">Login</h1>
        <div class="mb-4">
          <input
            type="text"
            placeholder="Email"
            bind:value={email}
            class="p-2 w-full rounded border border-gray-300 focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            bind:value={password}
            class="p-2 w-full mt-2 rounded border border-gray-300 focus:border-blue-500"
          />
          <button
            on:click={login}
            class="p-2 w-full mt-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
  
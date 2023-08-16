<script lang="ts">
	import { initializeApp } from 'firebase/app';
	import {
		getAuth,
		signInWithEmailAndPassword,
		signOut,
		type User,
		onAuthStateChanged,
		signInWithPopup,
		GoogleAuthProvider,
		GithubAuthProvider
	} from 'firebase/auth';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let user: User | null;

	const firebaseConfig = {
		apiKey: "AIzaSyBzM5OnMUdBrGWBcZotDxlRh0qEnwLvtNk",
    authDomain: "arco-trailers.firebaseapp.com",
    projectId: "arco-trailers",
    storageBucket: "arco-trailers.appspot.com",
    messagingSenderId: "557877308737",
    appId: "1:557877308737:web:1aaaed23f6537f4ca585c0"
	};

	const app = initializeApp(firebaseConfig);

	const login = () => {
		const auth = getAuth(app);
		signInWithEmailAndPassword(auth, email, password).catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(errorCode, errorMessage);
		});
	};

	const loginWithGoogle = () => {
		const auth = getAuth(app);
		signInWithPopup(auth, new GoogleAuthProvider());
	};

	const loginWithGithub = () => {
		const auth = getAuth(app);
		signInWithPopup(auth, new GithubAuthProvider());
	};

	const logout = async () => {
		const auth = getAuth(app);
		signOut(auth);
	};

	onMount(async () => {
		const auth = getAuth(app);
		onAuthStateChanged(auth, (newUser) => {
			console.log(user);
			user = newUser;
		});
	});
</script>

{#if user}
	<p>Signed in with {user.providerData[0].providerId}!</p>
	<button on:click={logout}>Logout</button>
{:else}
	<input type="email" id="email" placeholder="email" bind:value={email} />
	<input type="password" id="password" placeholder="password" bind:value={password} />
	<button on:click={login}>Login</button>
	<button on:click={loginWithGoogle}>Login with Google</button>
	<button on:click={loginWithGithub}>Login with Github</button>
{/if}
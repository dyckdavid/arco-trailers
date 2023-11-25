<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/Arco.png';
	import github from '$lib/images/github.svg';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';


	let scrolled = false;

onMount(() => {
  function handleScroll() {
	scrolled = window.scrollY > 1;
  }
  window.addEventListener('scroll', handleScroll);
  return () => {
	window.removeEventListener('scroll', handleScroll);
  }
});
	
</script>

<svelte:head>
  <style>
    header {
      position: fixed;
      width: 100%;
      top: 0;
      z-index: 1;
      background-color: transparent;
    }

    header.scrolled {
      box-shadow: 0 10px 10px -10px rgba(0, 0, 0, 0.3);
	  background-color: rgba(211, 211, 211, 0.5);
	  
    }

    header::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 0px;
      background: black;
      
    }

    header.scrolled::before {
      width: 100%;
	  
    }
  </style>
</svelte:head>

<header class:scrolled={scrolled}>
	<div class="corner">
		<a href="/">
			<img src={logo} alt="SvelteKit" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">INICIO</a>
			</li>

			<li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
				<a href="/about">ACERCA NOSOTROS</a>
			</li>
<li aria-current={$page.url.pathname === '/taskmanager' ? 'page' : undefined}>
				<a href="/taskmanager">Admin</a>
			</li>


			
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		
	</div>
</header>

<style>
	header {
		display: flex;
		
		justify-content: space-between;
		position: sticky;
    top: 0;
    z-index: 1000; /* Ensure navbar is above other content */
     /* Ensure the navbar has a background */
	}


	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
<script>
	import welcome_fallback from '$lib/images/trailer1.png';
</script>

<svelte:head>
	<title>Remolques</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<h1>Remolques</h1>

	<section>
        <h1>
            <span class="welcome">
                <picture>

                    <img src={welcome_fallback} alt="Welcome" />
                </picture>
            </span>
    
           
        </h1>
    
        
    </section>

    
	
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 300%;
		height: auto;
		padding: 0 0 calc(300% * 1080 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: auto;
		top: 0;
		display: block;
	}
</style>


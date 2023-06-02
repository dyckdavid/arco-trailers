<script>
	import trailer_one from '$lib/images/trailer1.png';
</script>

<svelte:head>
	<title>Remolques - Arco Trailers</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="flex items-center h-screen space-x-4 pl-10">
    <img src={trailer_one} class="w-78 h-78 object-cover -ml-80" alt="Description">
    <div class="text-right flex-grow">
        <h1 class="text-4xl font-bold mb-2">Remolque 1</h1>
        <p>Descripcion del Remolque no. 1</p>
    </div>
</div>


<div class="flex items-center h-screen space-x-4 px-4 md:flex-row flex-col md:px-4 px-2">
    <img src={trailer_one} class="w-78 h-78 object-cover -ml-80 mx-auto md:mx-0" alt="Description">
    <div class="text-center md:text-right flex-grow">
        <h1 class="text-4xl font-bold mb-2">Remolque 2</h1>
        <p>Descripcion del Remolque no. 2</p>
    </div>
</div>


<div class="flex flex-col items-center md:items-start h-screen space-x-0 md:space-x-4 px-4 md:flex-row">
    <img src={trailer_one} class="w-48 h-48 object-cover md:-ml-12 mx-auto" alt="Description">
    <div class="text-center md:text-right flex-grow">
        <h1 class="text-4xl font-bold mb-2">Remolque 3</h1>
        <p>Descripcion del Remolque no. 3</p>
    </div>
</div>
<script>
	import trailer_one from '$lib/images/trailer1.png';
    import trailer_video from '$lib/images/introvideo.mp4';
</script>

<svelte:head>
	<title>Remolques - Arco Trailers</title>
	<meta name="description" content="About this app" />
</svelte:head>
<div class="video-background">
    <video autoplay muted playsinline  loop class="absolute top-0 left-0 w-full h-full object-cover">
        <source src={trailer_video} type="video/mp4">
    </video>
</div>

<div class="video-spacer"></div>

<div class="flex items-center h-screen space-x-4 pl-10">
    <img src={trailer_one} class="w-78 h-78 object-cover -ml-80" alt="Description">
    <div class="text-right flex-grow">
        <h1 class="text-4xl font-bold mb-2">Remolque de 24'</h1>
        <p>Descripcion del Remolque no. 1</p>
    </div>
</div>


<div class="flex items-center h-screen space-x-4 px-4 md:flex-row flex-col md:px-4 px-2">
    <img src={trailer_one} class="w-78 h-78 object-cover -ml-80 mx-auto md:mx-0" alt="Description">
    <div class="text-center md:text-right flex-grow">
        <h1 class="text-4xl font-bold mb-2">Remolque de 16'</h1>
        <p>Descripcion del Remolque no. 2</p>
    </div>
</div>


<div class="flex flex-col items-center md:items-start h-screen space-x-0 md:space-x-4 px-4 md:flex-row">
    <img src={trailer_one} class="w-48 h-48 object-cover md:-ml-12 mx-auto" alt="Description">
    <div class="text-center md:text-right flex-grow">
        <h1 class="text-4xl font-bold mb-2">Remolque 14'</h1>
        <p>Descripcion del Remolque no. 3</p>
    </div>
</div>

<style>


	h1 {
		width: 100%;
	}


  .video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .video-background video {
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .video-spacer {
    height: 100vh; /* This should match the height of your video */
  }


</style>
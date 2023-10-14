<svelte:head>
	<title>UK Balance Forecaster</title>

	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,100..700,0,0"
	/>
</svelte:head>

<div>
	<slot />
</div>

<style>
	:root {
		--lightgray1: #fbfbfb;
		--lightgray2: #ebebeb;
		--lightgray3: #e6e6e6;
		--lightgray4: #dbdbdb;

		--gray1: #7a7a7a;
		--gray2: #afafaf;

		--primary1: #067ae6;
		--primary2: #a9d4ff;
		--primary3: #c1e0f7;
		--primary4: #f0f8ff;

		--lightred: #fcd3d3;
		--red: #dc2a2a;
		--darkred: #790000;

		--lightgreen: #ccffcc;
		--green: #23cb23;
		--darkgreen: #007900;

		--orange: #f3901c;

		--lightbeige: #fffeea;
		--beige: #ede7ad;
		--darkbeige: #676306;

		--vis-axis-font-family: Barlow, sans-serif !important;
		--vis-axis-label-color: var(--gray1) !important;
		--vis-axis-tick-label-color: var(--gray1) !important;
		--vis-axis-label-font-size: 12px !important;
		--vis-tooltip-padding: 0px 6px 5px !important;
	}

	:global(body) {
		margin: 0;
		font-family: Barlow, sans-serif;
		max-width: 100vw;
	}

	div {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
	}
</style>

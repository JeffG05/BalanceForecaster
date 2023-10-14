<script lang="ts">
	import '@fontsource/barlow';
	import TitlebarBtn from '$lib/components/titlebar-btn.svelte';

	export let func: () => void;
</script>

<div class="titlebar">
	<p>UK Balance Forecaster</p>
	<div class="spacer" />
	<TitlebarBtn
		text="Return home"
		icon="home"
		fgColor="black"
		bgColor="var(--lightgray2)"
		onClick={func}
	/>
</div>

<style>
	.titlebar {
		display: flex;
		flex-direction: row;
		max-width: 100vw;
		background-color: var(--lightgray1);
		align-items: center;
		padding: 10px 32px;
		gap: 10px;
		border-bottom: 1px solid var(--lightgray3);
	}
	.titlebar p {
		font-family: Barlow, sans-serif;
		font-size: 14px;
		margin: 0;
	}
	.spacer {
		flex: 1;
	}
</style>

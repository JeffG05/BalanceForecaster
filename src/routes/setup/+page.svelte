<script lang="ts">
	import SetupViewer from '$lib/components/setup-viewer.svelte';

	let name = '';
	let balance = 0;
</script>

<SetupViewer bind:name bind:balance />

<style>
</style>

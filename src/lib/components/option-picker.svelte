<script lang="ts">
	import '@fontsource/barlow';

	export let options: string;

	$: optionArray = options.split(' ');

	export let selected;
</script>

<select bind:value={selected}>
	{#each optionArray as opt}
		<option>{opt}</option>
	{/each}
</select>

<style>
	select {
		appearance: none;
		border: 1px solid var(--lightgray2);
		border-radius: 6px;
		font-family: Barlow, sans-serif;
		font-size: 14px;
		padding: 8px 32px 8px 16px;
		cursor: pointer;
		background: url('/icons/chevron_down.svg') calc(100% - 12px) 55% / 16px no-repeat
			var(--lightgray1);
	}
</style>

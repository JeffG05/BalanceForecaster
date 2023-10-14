<script lang="ts">
	import '@fontsource/barlow';
	import Icon from '$lib/components/icon.svelte';

	export let text: string;
	export let icon: string;
	export let bgColor: string;
	export let fgColor: string;
	export let borderColor: string | null = null;
	export let onClick: () => void;

	function keydownFunc(event: KeyboardEvent, func: () => void) {
		if (event.key === 'Enter' || event.key == ' ') {
			func();
		}
	}
</script>

<div
	class="wrapper"
	style:background-color={bgColor}
	style:border={borderColor ? '1px solid ' + borderColor : 'none'}
	tabindex="0"
	role="button"
	on:click={onClick}
	on:keydown={(event) => keydownFunc(event, onClick)}
>
	<Icon name={icon} size="14px" color={fgColor} />
	<p style:color={fgColor}>{text}</p>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 6px;
		padding: 10px 20px;
		cursor: pointer;
		gap: 10px;
	}

	.wrapper p {
		margin: 0;
		font-size: 14px;
		font-family: Barlow, sans-serif;
	}
</style>

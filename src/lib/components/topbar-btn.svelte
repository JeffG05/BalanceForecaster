<script lang="ts">
	import Icon from '$lib/components/icon.svelte';

	export let icon: string;
	export let bgColor: string;
	export let fgColor: string;
	export let borderColor: string | null = null;
	export let onClick: () => void;
	export let disabled = false;

	function keydownFunc(event: KeyboardEvent, func: () => void) {
		if (event.key === 'Enter' || event.key == ' ') {
			func();
		}
	}

	function action() {
		if (!disabled) {
			onClick();
		}
	}
</script>

<div
	class="wrapper {disabled ? 'disabled' : ''}"
	style:background-color={bgColor}
	style:border={borderColor ? '1px solid ' + borderColor : 'none'}
	tabindex="0"
	role="button"
	on:click={action}
	on:keydown={(event) => keydownFunc(event, action)}
>
	<Icon name={icon} size={14} color={fgColor} />
</div>

<style>
	.wrapper {
		border-radius: 6px;
		padding: 11px;
		cursor: pointer;
	}

	.disabled {
		opacity: 0.3;
		cursor: default;
	}
</style>

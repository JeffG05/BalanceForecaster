<script lang="ts">
	import '@fontsource/barlow/500.css';
	import type { Detail } from '$lib/scripts/types';
	import Icon from '$lib/components/icon.svelte';

	export let title: string;
	export let id = '';
	export let details: Detail[] = [];
</script>

<div class="wrapper">
	<div class="container" graph={id}>
		<p class="title">{title}</p>
		<div class="graph">
			<slot />
		</div>
	</div>
	{#if details.length > 0}
		<div class="details">
			{#each details as detail}
				<div class="value-container">
					<p title={detail.description}>
						{detail.title}
						{#if detail.description}
							<Icon name="info" size={12} />
						{/if}
					</p>
					<p>{detail.value}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.graph {
		width: calc(100% - 32px);
		height: calc(100% - 62px);
		padding: 16px;
	}

	.title {
		font-family: Barlow, sans-serif;
		font-weight: 500;
		font-size: 12px;
		padding-top: 16px;
		padding-bottom: 0;
		margin: 0;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.details {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
	}

	.value-container {
		display: flex;
		flex-direction: column;
		flex: 1;
		border-top: 1px solid var(--lightgray3);
		align-items: center;
		padding: 8px;
	}

	.value-container:not(:last-child) {
		border-right: 1px solid var(--lightgray3);
	}

	.value-container p {
		font-family: Barlow, sans-serif;
		margin: 0;
	}

	.value-container p:first-child {
		font-weight: 500;
		font-size: 12px;
		margin-bottom: 4px;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4px;
	}

	.value-container p:last-child {
		font-size: 18px;
	}
</style>

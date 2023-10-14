<script lang="ts">
	import '@fontsource/barlow/500.css';

	export let title: string;
</script>

<div>
	<p>{title}</p>
	<div class="content">
		<slot />
	</div>
</div>

<style>
	p {
		margin: 0 0 16px;
		font-size: 14px;
		font-weight: 500;
	}

	div.content {
		display: flex;
		flex-direction: row;
		gap: 12px;
		align-items: end;
	}
</style>

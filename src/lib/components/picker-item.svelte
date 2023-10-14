<script lang="ts">
	export let title: string;
</script>

<div>
	<p>{title}</p>
	<slot />
</div>

<style>
	p {
		font-size: 12px;
		margin: 0 0 10px;
	}
</style>

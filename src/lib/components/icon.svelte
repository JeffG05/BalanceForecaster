<script lang="ts">
	export let name: string;
	export let size = 24;
	export let color = 'black';
</script>

<div style:width="{size}px" style:height="{size}px">
	<span class="material-symbols-rounded" style:font-size="{Math.round(size * 1.3)}px" style:color>
		{name}
	</span>
</div>

<style>
	div {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.material-symbols-rounded {
		font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
		-webkit-user-select: none;
		user-select: none;
	}
</style>

<script lang="ts">
	import '@fontsource/barlow';
	import '@fontsource/barlow/500.css';
	import TopbarBtn from '$lib/components/topbar-btn.svelte';

	const randId = Math.floor(Math.random() * 1000000).toString();
	export let title: string;
	export let value = '';
	export let showing = false;
	export let cancelable = false;
	let rawValue = '';
	let submitEnabled = false;

	$: rawValue && updateEnabled();

	function openModal() {
		rawValue = value;
		updateEnabled();
		const dialog = document.getElementById(`dialog-${randId}`) as HTMLDialogElement;
		dialog.inert = true;
		dialog.showModal();
		dialog.inert = false;
	}

	function closeModal() {
		const dialog = document.getElementById(`dialog-${randId}`) as HTMLDialogElement;
		dialog.close();
		showing = false;
	}

	function checkValidity() {
		return rawValue.trim().length != 0;
	}

	function updateEnabled() {
		submitEnabled = checkValidity();
	}

	function save() {
		if (checkValidity()) {
			value = rawValue.trim();
			closeModal();
		}
	}

	$: showing && openModal();
</script>

<dialog id="dialog-{randId}">
	<p class="title">{title}</p>
	<div class="contents">
		<input type="text" bind:value={rawValue} on:input={updateEnabled} />
		{#if cancelable}
			<TopbarBtn
				icon="close"
				fgColor="var(--darkred)"
				bgColor="var(--lightred)"
				onClick={closeModal}
			/>
		{/if}
		<TopbarBtn
			icon="check"
			fgColor="var(--darkgreen)"
			bgColor="var(--lightgreen)"
			onClick={save}
			disabled={!submitEnabled}
		/>
	</div>
</dialog>

<style>
	dialog {
		border: none;
		padding: 16px 16px;
		border-radius: 12px;
		box-shadow: 0 9px 30px 0 rgba(0, 0, 0, 0.1);
	}

	.title {
		font-family: 'Barlow', sans-serif;
		font-weight: 500;
		margin: 0 0 12px;
	}

	.contents {
		display: flex;
		flex-direction: row;
		gap: 12px;
	}

	input {
		position: relative;
		width: 50vw;
		max-width: 300px;
		min-width: 150px;
		appearance: none;
		border: 1px solid var(--lightgray2);
		border-radius: 6px;
		font-family: 'Barlow', sans-serif;
		font-weight: 400;
		font-size: 13px;
		padding: 8px 16px;
		background-color: var(--lightgray1);
	}
</style>

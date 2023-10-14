<script lang="ts">
	import '@fontsource/barlow';
	import '@fontsource/barlow/500.css';
	import PickerItem from '$lib/components/picker-item.svelte';
	import InputPicker from '$lib/components/input-picker.svelte';
	import { goto } from '$app/navigation';
	import type { BasicDetails } from '$lib/scripts/types';
	import { DateTime } from 'luxon';
	import { Account } from '$lib/scripts/account';

	export let name: string;
	export let balance: number;

	$: valid = name.trim().length > 0;

	function save() {
		if (!valid) {
			return;
		}
		const json: BasicDetails = {
			start: DateTime.now().startOf('day').toMillis(),
			end: DateTime.now().plus({ years: 1 }).startOf('day').toMillis(),
			account: new Account(name, balance).toObject()
		};
		localStorage.setItem('basicDetails', JSON.stringify(json));
		goto('/');
	}
</script>

<div class="main">
	<h1>Setup Account</h1>
	<div class="pickers">
		<PickerItem title="Account name">
			<input type="text" required pattern=".*\S+.*" bind:value={name} />
		</PickerItem>
		<PickerItem title="Starting Balance">
			<InputPicker bind:value={balance} />
		</PickerItem>
		<button tabindex="0" on:click={save} disabled={!valid ? 'disabled' : ''}>Create Account</button>
	</div>
</div>

<style>
	.main {
		display: flex;
		flex-direction: column;
		width: 100vw;
		flex: 1;
		overflow: scroll;
	}

	.pickers {
		margin: 24px 32px;
		width: calc(100% - 64px);
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	h1 {
		margin-top: 64px;
		margin-bottom: 22px;
		margin-left: 32px;
		font-family: Barlow, sans-serif;
		font-weight: 500;
		font-size: 31px;
	}

	input {
		position: relative;
		width: 162px;
		appearance: none;
		border: 1px solid var(--lightgray2);
		border-radius: 6px;
		font-family: 'Barlow', sans-serif;
		font-weight: 400;
		font-size: 13px;
		padding: 8px 16px;
		background-color: var(--lightgray1);
	}

	input:invalid {
		border: 1px solid var(--red);
	}

	button {
		width: 196px;
		appearance: none;
		border: 1px solid var(--lightgreen);
		border-radius: 6px;
		background-color: var(--lightgreen);
		color: var(--darkgreen);
		font-family: 'Barlow', sans-serif;
		font-weight: 400;
		font-size: 13px;
		padding: 8px 16px;
		margin-top: 24px;
		cursor: pointer;
	}

	button:disabled {
		color: white;
		background-color: var(--lightgray3);
		border: 1px solid var(--lightgray3);
		cursor: default;
	}
</style>

<script lang="ts">
	import '@fontsource/barlow';
	import '@fontsource/barlow/500.css';
	import PickerItem from '$lib/components/picker-item.svelte';
	import InputPicker from '$lib/components/input-picker.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import type { BasicDetails } from '$lib/scripts/types';
	import { Account } from '$lib/scripts/account.js';

	export let name: string;
	export let balance: number;

	const randId = Math.floor(Math.random() * 1000000).toString();

	function clearData() {
		if (confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
			localStorage.removeItem('basicDetails');
			goto(`${base}/`);
		}
	}

	function exportData() {
		const basicDetails = localStorage.getItem('basicDetails');
		if (!basicDetails) {
			alert('Unable to export your data. Please try again.');
		}
		const jsonData: BasicDetails = JSON.parse(basicDetails);
		const account = Account.fromObject(jsonData.account);

		const headers = ['name', 'amount', 'timespan', 'schedule', 'first_booking', 'last_booking'];
		const rows = account.toCSV();
		const csvData = [headers, ...rows];
		const csv = csvData.map((row) => row.join(',')).join('\n');

		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.setAttribute('href', url);
		a.setAttribute('download', 'transfers.csv');
		a.click();
	}

	async function importData(event: Event) {
		const basicDetails = localStorage.getItem('basicDetails');
		if (!basicDetails) {
			alert('Unable to export your data. Please try again.');
		}
		const jsonData: BasicDetails = JSON.parse(basicDetails);
		const account = Account.fromObject(jsonData.account);

		const fileInput = event.target as HTMLInputElement;
		if (!fileInput.files || fileInput.files.length == 0) {
			return;
		}
		const file = fileInput.files.item(0);
		try {
			const contents = await file.text();
			account.importCsv(contents);
			jsonData.account = account.toObject();
			localStorage.setItem('basicDetails', JSON.stringify(jsonData));
			goto(`${base}/`);
		} catch {
			alert('Unable to import your data. Please try again.');
		}
		fileInput.value = '';
		fileInput.blur();
	}
</script>

<div class="main">
	<h1>Account Settings</h1>
	<div class="pickers">
		<PickerItem title="Account name">
			<input type="text" bind:value={name} />
		</PickerItem>
		<PickerItem title="Starting Balance">
			<InputPicker bind:value={balance} />
		</PickerItem>
		<input id="file-{randId}" tabindex="0" type="file" accept="text/csv" on:change={importData} />
		<label for="file-{randId}">Import Transfers</label>
		<button tabindex="0" on:click={exportData}>Export Transfers</button>
		<button tabindex="0" on:click={clearData}>Clear Data</button>
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

	input[type='text'] {
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

	input[type='file'] {
		width: 0.1px;
		height: 0.1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		z-index: -1;
	}

	button {
		width: 196px;
		appearance: none;
		border: medium;
		border-radius: 6px;
		font-family: 'Barlow', sans-serif;
		font-weight: 400;
		font-size: 13px;
		padding: 8px 16px;
		cursor: pointer;
	}

	label {
		margin-top: 24px;
		width: 164px;
		border: medium;
		border-radius: 6px;
		font-family: 'Barlow', sans-serif;
		font-weight: 400;
		font-size: 13px;
		padding: 8px 16px;
		cursor: pointer;
		background-color: var(--lightgray2);
		color: black;
		text-align: center;
	}

	input[type='file']:focus-visible + label {
		outline: 3px auto;
		outline-offset: 2px;
	}

	button:not(:last-of-type) {
		background-color: var(--lightgray2);
		color: black;
	}

	button:last-of-type {
		background-color: var(--lightred);
		color: var(--darkred);
	}
</style>

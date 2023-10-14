<script lang="ts">
	import MainTitlebar from '$lib/components/titlebar-main.svelte';
	import Bottombar from '$lib/components/bottombar.svelte';
	import AccountViewer from '$lib/components/account-viewer.svelte';
	import type { PageData } from './$types';
	import type { BasicDetails } from '$lib/scripts/types';
	import { Transfer } from '$lib/scripts/transfer';

	export let data: PageData;

	const account = data.account;
	let reportStartDate = data.start;
	let reportEndDate = data.end;

	let refreshPage = false;
	let selectedTransfer: Transfer | null = null;

	function save() {
		const json: BasicDetails = {
			start: reportStartDate.toMillis(),
			end: reportEndDate.toMillis(),
			account: account.toObject()
		};
		localStorage.setItem('basicDetails', JSON.stringify(json));
	}
</script>

{#key refreshPage}
	<div>
		<MainTitlebar {account} bind:refreshPage bind:selected={selectedTransfer} />
		<AccountViewer {account} {save} bind:selected={selectedTransfer} />
		<Bottombar {save} bind:reportStartDate bind:reportEndDate />
	</div>
{/key}

<style>
	div {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100vw;
	}
</style>

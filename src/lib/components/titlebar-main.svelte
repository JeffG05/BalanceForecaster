<script lang="ts">
	import '@fontsource/barlow';
	import TitlebarBtn from '$lib/components/titlebar-btn.svelte';
	import NameDialog from '$lib/components/name-dialog.svelte';

	import { Account } from '$lib/scripts/account';
	import { Transfer } from '$lib/scripts/transfer';
	import { DateTime } from 'luxon';
	import { TransferTimespan } from '$lib/scripts/transfer-timespan';
	import { BookingSchedule } from '$lib/scripts/booking-schedule';
	import { goto } from '$app/navigation';

	let nameDialogShowing = false;
	let newName = '';
	export let account: Account;
	export let refreshPage: boolean;
	export let selected: Transfer | null;

	$: (() => {
		if (newName.trim().length > 0) {
			createNewTransfer(newName.trim());
		}
	})();

	function showNameDialog() {
		newName = '';
		nameDialogShowing = true;
	}

	function goToSettings() {
		goto('/settings');
	}

	function createNewTransfer(name: string) {
		selected = null;
		const today = DateTime.now();
		let transfer = new Transfer(
			name,
			0,
			TransferTimespan.daily,
			BookingSchedule.fromDate(today),
			today,
			today
		);
		account.addTransfer(transfer);
		refreshPage = !refreshPage;
	}
</script>

<div class="titlebar">
	<p>UK Balance Forecaster</p>
	<div class="spacer" />
	<TitlebarBtn
		text="Settings"
		icon="settings"
		fgColor="black"
		bgColor="var(--lightgray2)"
		onClick={goToSettings}
	/>
	<TitlebarBtn
		text="Add income/expense"
		icon="add"
		fgColor="white"
		bgColor="var(--primary1)"
		onClick={showNameDialog}
	/>
	<NameDialog
		title="Enter Name"
		bind:showing={nameDialogShowing}
		bind:value={newName}
		cancelable={true}
	/>
</div>

<style>
	.titlebar {
		display: flex;
		flex-direction: row;
		max-width: 100vw;
		background-color: var(--lightgray1);
		align-items: center;
		padding: 10px 32px;
		gap: 10px;
		border-bottom: 1px solid var(--lightgray3);
	}

	.titlebar p {
		font-family: Barlow, sans-serif;
		font-size: 14px;
		margin: 0;
	}
	.spacer {
		flex: 1;
	}
</style>

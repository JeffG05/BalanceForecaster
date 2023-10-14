<script lang="ts">
	import '@fontsource/barlow';
	import '@fontsource/barlow/500.css';
	import '@fontsource/fira-mono/400.css';

	import Icon from '$lib/components/icon.svelte';
	import TopbarBtn from '$lib/components/topbar-btn.svelte';
	import PickerSection from '$lib/components/picker-section.svelte';
	import PickerItem from '$lib/components/picker-item.svelte';
	import DatePicker from '$lib/components/date-picker.svelte';
	import OptionPicker from '$lib/components/option-picker.svelte';
	import InputPicker from '$lib/components/input-picker.svelte';
	import NameDialog from '$lib/components/name-dialog.svelte';

	import type { Account } from '$lib/scripts/account';
	import type { Transfer } from '$lib/scripts/transfer';
	import { DateTime } from 'luxon';
	import { TransferTimespan } from '$lib/scripts/transfer-timespan';
	import { BookingSchedule } from '$lib/scripts/booking-schedule';

	export let account: Account;
	export let save: () => void;

	export let selected: Transfer | null;

	let refreshAccount = true;
	let isEditingTitle = false;
	let editTitle = '';

	let timespan: string;
	let amount = 0;
	let startDate = DateTime.now();
	let bookingStatus: string;
	let endDate = DateTime.now();
	let recurrence: string;

	function updateSelected(func: (transfer: Transfer) => void) {
		if (selected != null) {
			func(selected);
			refreshAccount = !refreshAccount;
		}
	}

	$: updateSelected((transfer) => {
		transfer.name = editTitle;

		transfer.amount = amount;

		transfer.firstBooking = startDate;

		if (timespan === 'One-off' || bookingStatus === 'Ongoing') {
			endDate = startDate;
			if (timespan === 'One-off') {
				bookingStatus = 'Final';
			}
		}
		if (bookingStatus === 'Ongoing' && timespan !== 'One-off') {
			transfer.lastBooking = undefined;
		} else {
			transfer.lastBooking = endDate;
		}

		if (timespan === 'Yearly') {
			transfer.timespan = TransferTimespan.yearly;
		} else if (timespan === 'Monthly') {
			transfer.timespan = TransferTimespan.monthly;
		} else if (timespan === 'Daily' || timespan === 'One-off') {
			transfer.timespan = TransferTimespan.daily;
		}

		if (timespan === 'One-off') {
			recurrence = 'None';
		}
		if (recurrence === 'Yearly') {
			transfer.schedule = new BookingSchedule(`* ${startDate.month} ${startDate.day}`);
		} else if (recurrence === 'Monthly') {
			transfer.schedule = new BookingSchedule(`* * ${startDate.day}`);
		} else if (recurrence === 'Daily') {
			transfer.schedule = new BookingSchedule(`* * *`);
		} else if (recurrence === 'None') {
			transfer.schedule = new BookingSchedule(
				`${startDate.year} ${startDate.month} ${startDate.day}`
			);
		}

		save();
	});

	function selectTransfer(transfer: Transfer) {
		selected = transfer;

		editTitle = transfer.name;

		switch (transfer.timespan) {
			case TransferTimespan.yearly:
				timespan = 'Yearly';
				break;
			case TransferTimespan.monthly:
				timespan = 'Monthly';
				break;
			case TransferTimespan.daily:
				if (transfer.isOneOff) {
					timespan = 'One-off';
				} else {
					timespan = 'Daily';
				}
		}
		amount = transfer.amount;

		startDate = transfer.firstBooking;
		if (transfer.lastBooking) {
			endDate = transfer.lastBooking;
			bookingStatus = 'Final';
		} else {
			endDate = startDate;
			bookingStatus = 'Ongoing';
		}

		if (transfer.schedule.cron.toString() === `* ${startDate.month} ${startDate.day}`) {
			recurrence = 'Yearly';
		} else if (transfer.schedule.cron.toString() === `* * ${startDate.day}`) {
			recurrence = 'Monthly';
		} else if (transfer.schedule.cron.toString() === `* * *`) {
			recurrence = 'Daily';
		} else {
			recurrence = 'None';
		}
	}

	function deselectTransfer() {
		selected = null;
	}

	function formatDate(date?: DateTime): string {
		if (!date) {
			return '- -';
		}

		const days = date.startOf('day').diff(DateTime.now().startOf('day'), 'days').days;
		switch (days) {
			case -1:
				return 'Yesterday';
			case 0:
				return 'Today';
			case 1:
				return 'Tomorrow';
			default:
				return date.toFormat('LLL d, yyyy');
		}
	}

	function formatAmount(value: number): string {
		let formatted: string = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'usd'
		}).format(Math.abs(value));
		formatted = formatted.substring(1);

		if (value >= 0) {
			return formatted;
		} else {
			return '(' + formatted + ')';
		}
	}

	function formatTimespan(value: TransferTimespan, isOneOff: boolean): string {
		switch (value) {
			case TransferTimespan.yearly:
				return '/ yr';
			case TransferTimespan.monthly:
				return '/ mo';
			case TransferTimespan.daily:
				if (!isOneOff) {
					return '/ day';
				} else {
					return '';
				}
		}
	}

	function keydownFunc(event: KeyboardEvent, func: () => void) {
		if (event.key === 'Enter' || event.key == ' ') {
			func();
		}
	}

	function getRecurrenceDescription(value: string, date: DateTime): string {
		switch (value) {
			case 'Yearly':
				return `${date.day} ${date.monthLong} of every year`;
			case 'Monthly':
				return `Day ${date.day} of every month`;
			case 'Daily':
				return 'Every day';
			default:
				return '';
		}
	}
	$: recurrenceDescription = getRecurrenceDescription(recurrence, startDate);

	function editTransferTitle() {
		editTitle = selected?.name ?? '';
		isEditingTitle = true;
	}

	function deleteTransfer() {
		if (selected) {
			account.deleteTransfer(selected);
			deselectTransfer();
			save();
			refreshAccount = !refreshAccount;
		}
	}
</script>

{#if selected}
	<div class="backdrop" />
{/if}
<div class="main">
	<div class="left">
		<h1>{account.name}'s Balance Sheet</h1>
		<div class="table">
			<div class="header-row row">
				<p>Name</p>
				<p>Amount (£)</p>
				<p>Start Date</p>
				<p>End Date</p>
			</div>
			<div class="row-holder">
				{#key refreshAccount}
					{#if account.getTransfers().length === 0}
						<div class="list-placeholder">
							<p>No transfers</p>
						</div>
					{:else}
						{#each account
							.getTransfers()
							.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount)) as transfer}
							<div
								class="selection-box {selected?.id === transfer.id ? 'selected' : ''}"
								role="button"
								tabindex="0"
								on:click={() => selectTransfer(transfer)}
								on:keydown={(event) => keydownFunc(event, () => selectTransfer(transfer))}
							>
								<div class="transfer-row row">
									<p>{transfer.name}</p>
									<p>
										{formatAmount(transfer.amount)}
										<span>{formatTimespan(transfer.timespan, transfer.isOneOff)}</span>
									</p>
									<p>{formatDate(transfer.firstBooking)}</p>
									<p>{formatDate(transfer.lastBooking)}</p>
								</div>
							</div>
						{/each}
					{/if}
				{/key}
			</div>
		</div>
	</div>
	{#if selected}
		<div class="right">
			<div class="topbar">
				<div
					class="close-button"
					role="button"
					tabindex="0"
					on:click={deselectTransfer}
					on:keydown={(event) => keydownFunc(event, deselectTransfer)}
				>
					<Icon name="close" color="black" />
				</div>
				<p class="title">{editTitle}</p>
				<div class="spacer" />
				<div class="buttons">
					<TopbarBtn
						icon="edit"
						fgColor="black"
						bgColor="var(--lightgray2)"
						onClick={editTransferTitle}
					/>
					<TopbarBtn
						icon="delete"
						fgColor="var(--darkred)"
						bgColor="var(--lightred)"
						onClick={deleteTransfer}
					/>
				</div>
				<NameDialog title="Edit Name" bind:showing={isEditingTitle} bind:value={editTitle} />
			</div>
			<div class="scroll-section">
				<div class="sections">
					<PickerSection title="Amount">
						<PickerItem title="Timespan">
							<OptionPicker options="Yearly Monthly Daily One-off" bind:selected={timespan} />
						</PickerItem>
						<p class="at-divider">@</p>
						<PickerItem title="Amount">
							<InputPicker bind:value={amount} />
						</PickerItem>
					</PickerSection>
					<PickerSection title="Booking schedule">
						<PickerItem title="Start date">
							<DatePicker bind:date={startDate} max={endDate} />
						</PickerItem>
						{#if timespan !== 'One-off'}
							<PickerItem title="Status">
								<OptionPicker options="Final Ongoing" bind:selected={bookingStatus} />
							</PickerItem>
							{#if bookingStatus === 'Final'}
								<PickerItem title="End date">
									<DatePicker bind:date={endDate} min={startDate} />
								</PickerItem>
							{/if}
						{/if}
					</PickerSection>
					{#if timespan !== 'One-off'}
						<PickerSection title="Recurring rule">
							<PickerItem title="Recurrence">
								<OptionPicker options="None Yearly Monthly Daily" bind:selected={recurrence} />
							</PickerItem>
						</PickerSection>
					{/if}
				</div>
				{#if recurrence !== 'None'}
					<div class="recurrence-info">
						<p class="recurrence-info-title">Repeats on</p>
						<ul class="recurrence-info-value">
							<li>{recurrenceDescription}</li>
						</ul>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.spacer {
		flex: 1;
	}

	.at-divider {
		width: min-content;
		margin: 10px 6px;
		font-family: Barlow, sans-serif;
		font-size: 16px;
		color: var(--gray2);
	}

	.main {
		display: flex;
		flex-direction: row;
		width: 100vw;
		flex: 1;
		overflow: hidden;
	}

	.left {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
	}

	.backdrop {
		display: none;
	}

	.right {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin: 36px 32px 36px 0;
		border: 1px solid var(--lightgray3);
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 9px 30px 0 rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.right .placeholder p {
		font-family: 'Barlow', sans-serif;
		font-size: 16px;
		color: var(--gray2);
		margin: 0;
	}

	.right .scroll-section {
		overflow: scroll;
		padding-bottom: 32px;
	}

	.right .sections {
		display: flex;
		flex-direction: column;
		gap: 46px;
		margin: 32px 32px 0;
	}

	.right .recurrence-info {
		display: flex;
		flex-direction: column;
		gap: 12px;
		background-color: var(--lightbeige);
		border: 1px solid var(--beige);
		color: var(--darkbeige);
		border-radius: 8px;
		font-family: Barlow, sans-serif;
		padding: 20px;
		margin: 16px 32px 0;
	}

	.right .recurrence-info .recurrence-info-title {
		font-weight: 500;
		font-size: 12px;
		margin: 0;
	}

	.right .recurrence-info .recurrence-info-value {
		font-size: 14px;
		margin: 0;
		padding-inline-start: 24px;
	}

	h1 {
		margin-top: 64px;
		margin-bottom: 22px;
		margin-left: 32px;
		font-family: Barlow, sans-serif;
		font-weight: 500;
		font-size: 31px;
	}

	.table {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}

	.table .row {
		display: flex;
		flex-direction: row;
	}

	.table .row-holder {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: scroll;
	}

	.table .row-holder .list-placeholder {
		display: flex;
		flex-direction: column;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.table .row-holder .list-placeholder p {
		font-family: 'Barlow', sans-serif;
		font-size: 16px;
		color: var(--gray2);
		margin: 0;
	}

	.table .selection-box {
		margin-left: 12px;
		margin-right: 12px;
		padding: 0 20px;
		border-radius: 8px;
		cursor: pointer;
	}

	.table .selection-box.selected {
		margin-left: 11px;
		background-color: var(--primary4);
		border: 1px solid var(--primary3);
		cursor: default;
	}

	.table .row p {
		width: calc(20% - 17px);
		font-family: Barlow, sans-serif;
		font-size: 14px;
		margin: 0;
		padding-left: 16px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.table .row p:nth-child(1) {
		width: 33%;
		padding-left: 0;
	}

	.table .row p:nth-child(2) {
		width: calc(27% - 16px);
	}

	.table .header-row {
		margin: 0 32px;
		border-bottom: 1px solid var(--gray1);
	}

	.table .header-row p {
		border-left: 1px solid var(--lightgray4);
		font-family: Barlow, sans-serif;
		font-weight: 500;
		font-size: 14px;
		margin: 16px 0;
	}

	.table .header-row p:nth-child(1) {
		border: none;
	}

	.table .transfer-row {
		flex: 1;
		padding: 24px 0;
		border-top: 1px solid var(--lightgray3);
	}

	.table .selection-box.selected .transfer-row {
		border-top: none;
	}

	.table .selection-box:last-child.selected .transfer-row {
		padding-bottom: 23px;
	}

	.table .selection-box.selected + .selection-box .transfer-row {
		border-top: none;
	}

	.table .transfer-row p:nth-child(2) {
		font-family: 'Fira Mono', monospace;
		font-weight: 400;
		font-size: 13px;
	}

	.table .transfer-row p:nth-child(2) span {
		font-family: 'Barlow', sans-serif;
		font-weight: 400;
		font-size: 14px;
	}

	.topbar {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 21px 32px;
		border-bottom: 1px solid var(--lightgray2);
	}

	.topbar .close-button {
		cursor: pointer;
	}

	.topbar p.title {
		font-family: Barlow, sans-serif;
		font-weight: 500;
		font-size: 21px;
		margin: 0 0 0 20px;
	}

	.topbar .buttons {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;
	}

	@media screen and (max-width: 1100px) {
		.main {
			flex-direction: column;
			position: relative;
		}

		.left {
			width: 100%;
		}

		.backdrop {
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background-color: black;
			opacity: 0.1;
		}

		.right {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: 24px;
		}
	}
</style>

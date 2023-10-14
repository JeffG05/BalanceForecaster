<script lang="ts">
	import '@fontsource/barlow';
	import '@fontsource/barlow/500.css';
	import '@fontsource/barlow/600.css';
	import { DateTime } from 'luxon';
	import Icon from './icon.svelte';

	const randId = Math.floor(Math.random() * 1000000).toString();

	export let date: DateTime;
	export let min: DateTime | undefined;
	export let max: DateTime | undefined;

	$: formattedDate = date.toFormat('LLL dd, yyyy');

	let calDate = DateTime.local(date.year, date.month);
	$: calMonthFirstDay = calDate.startOf('month');
	$: calMonthLastDay = calMonthFirstDay.endOf('month');
	$: calFirstDay = calMonthFirstDay.startOf('week');
	$: calLastDay = calMonthLastDay.endOf('week');
	$: numWeeks = Math.round(calLastDay.diff(calFirstDay, 'weeks').weeks);

	function openModal() {
		calDate = DateTime.local(date.year, date.month);
		const dialog = document.getElementById(`dialog-${randId}`) as HTMLDialogElement;
		dialog.inert = true;
		dialog.showModal();
		dialog.inert = false;
	}

	function closeModal() {
		const dialog = document.getElementById(`dialog-${randId}`) as HTMLDialogElement;
		dialog.close();
	}

	function setDate(newDate: DateTime) {
		date = newDate.startOf('day');
		closeModal();
	}

	function clickDialog(event: PointerEvent) {
		if (event.currentTarget == event.target) {
			closeModal();
		}
	}

	function moveDate(target: DateTime): DateTime {
		if (target < calDate && !min) {
			return target;
		}
		if (target > calDate && !max) {
			return target;
		}

		return DateTime.min(DateTime.max(target, min ?? calDate), max ?? calDate);
	}
</script>

<button class="date-preview" tabindex="0" on:click={openModal}
	><Icon name="calendar_month" size={14} color="black" />{formattedDate}</button
>

<dialog id="dialog-{randId}" on:click={clickDialog}>
	<div class="dialog-contents">
		<div class="cal-month-picker">
			<button
				tabindex="0"
				disabled={moveDate(calDate.minus({ years: 1 })).hasSame(calDate, 'month') ? 'disabled' : ''}
				on:click={() => (calDate = moveDate(calDate.minus({ years: 1 })))}
				><Icon name="keyboard_double_arrow_left" size={18} /></button
			>
			<button
				tabindex="0"
				disabled={moveDate(calDate.minus({ months: 1 })).hasSame(calDate, 'month')
					? 'disabled'
					: ''}
				on:click={() => (calDate = moveDate(calDate.minus({ months: 1 })))}
				><Icon name="keyboard_arrow_left" size={18} /></button
			>
			<div class="spacer" />
			<p>{calMonthFirstDay.monthShort}</p>
			<p>{calMonthFirstDay.year}</p>
			<div class="spacer" />
			<button
				tabindex="0"
				disabled={moveDate(calDate.plus({ months: 1 })).hasSame(calDate, 'month') ? 'disabled' : ''}
				on:click={() => (calDate = moveDate(calDate.plus({ months: 1 })))}
				><Icon name="keyboard_arrow_right" size={18} /></button
			>
			<button
				tabindex="0"
				disabled={moveDate(calDate.plus({ years: 1 })).hasSame(calDate, 'month') ? 'disabled' : ''}
				on:click={() => (calDate = moveDate(calDate.plus({ years: 1 })))}
				><Icon name="keyboard_double_arrow_right" size={18} /></button
			>
		</div>
		<div class="cal-rows">
			{#each Array(6) as _, i}
				<div class="cal-row">
					{#each Array(7) as _, j}
						{@const btnDate = calFirstDay.plus({ days: i * 7 + j })}
						{@const isCurrent = btnDate.startOf('day').equals(date.startOf('day'))}
						{@const isInMonth = btnDate.month === calDate.month}
						{@const isOverMin = min ? btnDate.startOf('day') >= min.startOf('day') : true}
						{@const isUnderMax = max ? btnDate.startOf('day') <= max.startOf('day') : true}
						{@const isEnabled = isInMonth && isOverMin && isUnderMax}
						<div>
							{#if i === 0}
								<p>{btnDate.weekdayShort[0]}</p>
							{/if}
							<button
								style:visibility={i < numWeeks ? 'visible' : 'hidden'}
								class="cal-btn {isCurrent ? 'selected' : ''}"
								disabled={isEnabled ? '' : 'disabled'}
								tabindex="0"
								on:click={() => setDate(btnDate)}>{btnDate.day}</button
							>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</dialog>

<style>
	.date-preview {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
		background-color: var(--lightgray1);
		border: 1px solid var(--lightgray2);
		border-radius: 6px;
		font-family: Barlow, sans-serif;
		font-size: 14px;
		padding: 8px 16px;
		cursor: pointer;
	}

	.spacer {
		flex: 1;
	}

	dialog {
		border: none;
		padding: 0;
		border-radius: 12px;
		box-shadow: 0 9px 30px 0 rgba(0, 0, 0, 0.1);
	}

	.dialog-contents {
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.cal-month-picker {
		display: flex;
		flex-direction: row;
		width: calc(100% - 8px);
		justify-content: center;
		align-items: center;
		margin-bottom: 4px;
	}

	.cal-month-picker p {
		font-family: Barlow, sans-serif;
		font-weight: 500;
		font-size: 18px;
		margin: 0 2px;
	}

	.cal-month-picker button {
		font-family: Barlow, sans-serif;
		font-weight: 500;
		font-size: 18px;
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0 4px;
	}

	.cal-month-picker button:disabled {
		cursor: default;
		opacity: 0.3;
	}

	.cal-rows {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
	}

	.cal-row {
		display: flex;
		flex-direction: row;
		gap: 6px;
	}

	.cal-row div {
		display: flex;
		flex-direction: column;
		width: 32px;
		gap: 6px;
	}

	.cal-row div p {
		font-family: Barlow, sans-serif;
		font-weight: 500;
		height: 36px;
		line-height: 36px;
		margin: 0;
		text-align: center;
		font-size: 14px;
	}

	.cal-btn {
		font-family: Barlow, sans-serif;
		font-size: 14px;
		width: 36px;
		height: 36px;
		border: none;
		border-radius: 100%;
		background-color: transparent;
		cursor: pointer;
	}

	.cal-btn:disabled {
		cursor: default;
		opacity: 0.3;
		color: black;
	}

	.cal-btn.selected {
		background-color: var(--lightred);
		color: var(--darkred);
	}
</style>

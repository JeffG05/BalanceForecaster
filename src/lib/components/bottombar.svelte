<script lang="ts">
	import '@fontsource/barlow';
	import PickerItem from '$lib/components/picker-item.svelte';
	import DatePicker from '$lib/components/date-picker.svelte';
	import TitlebarBtn from '$lib/components/titlebar-btn.svelte';
	import { DateTime } from 'luxon';
	import { goto } from '$app/navigation';

	export let reportStartDate: DateTime;
	export let reportEndDate: DateTime;
	export let save: () => void;

	function buildReport() {
		save();
		goto('/report');
	}
</script>

<div class="bar">
	<PickerItem title="Report start date">
		<DatePicker bind:date={reportStartDate} max={reportEndDate} />
	</PickerItem>
	<p class="date-div">-</p>
	<PickerItem title="Report end date">
		<DatePicker bind:date={reportEndDate} min={reportStartDate} />
	</PickerItem>
	<div class="spacer" />
	<TitlebarBtn
		text="Build report"
		icon="build"
		fgColor="black"
		bgColor="white"
		borderColor="var(--lightgray4)"
		onClick={buildReport}
	/>
</div>

<style>
	.bar {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 16px 32px;
		background-color: var(--lightgray1);
		border-top: 1px solid var(--lightgray3);
	}

	.date-div {
		font-family: 'Barlow', sans-serif;
		font-size: 14px;
		margin: 24px 16px 0;
		color: var(--gray2);
	}

	.spacer {
		flex: 1;
	}
</style>

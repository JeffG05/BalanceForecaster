<script lang="ts">
	import ReportTitlebar from '$lib/components/titlebar-report.svelte';
	import ReportViewer from '$lib/components/report-viewer.svelte';
	import type { PageData } from './$types';
	import type { ReportData } from '$lib/scripts/types';
	import { onMount } from 'svelte';
	import { Diamonds } from 'svelte-loading-spinners';

	export let data: PageData;

	const getReportData = data.getReportData;
	let reportData: ReportData | undefined = undefined;

	onMount(() => {
		setTimeout(() => (reportData = getReportData()), 0);
	});
</script>

{#if reportData}
	<ReportTitlebar />
	<ReportViewer {reportData} />
{:else}
	<div class="loading-screen">
		<p>Running Calculations</p>
		<Diamonds size="40" color="var(--primary1)" />
	</div>
{/if}

<style>
	.loading-screen {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 24px;
	}

	.loading-screen p {
		font-family: Barlow, sans-serif;
		font-size: 24px;
		color: var(--gray1);
		margin: 0;
	}
</style>

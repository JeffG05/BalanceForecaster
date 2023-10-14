<script lang="ts">
	import '@fontsource/barlow';
	import '@fontsource/barlow/500.css';
	import BalanceGraph from '$lib/components/graphs/balance-graph.svelte';
	import IncomeGraph from '$lib/components/graphs/income-graph.svelte';
	import AnnualIncomeGraph from '$lib/components/graphs/income-annual-graph.svelte';
	import ExpenseGraph from '$lib/components/graphs/expense-graph.svelte';
	import AnnualExpenseGraph from '$lib/components/graphs/expense-annual-graph.svelte';
	import TaxGraph from '$lib/components/graphs/tax-graph.svelte';
	import type { ReportData } from '$lib/scripts/types';

	export let reportData: ReportData;
</script>

<div class="dashboard">
	<div class="chart-row">
		<div class="chart-container">
			<BalanceGraph graphData={reportData.balanceGraph} />
		</div>
	</div>

	<div class="chart-row double">
		<div class="chart-container">
			<IncomeGraph graphData={reportData.incomeGraph} />
		</div>
		<div class="chart-container">
			<AnnualIncomeGraph graphData={reportData.annualIncomeGraph} />
		</div>
	</div>

	<div class="chart-row double">
		<div class="chart-container">
			<ExpenseGraph graphData={reportData.expenseGraph} />
		</div>
		<div class="chart-container">
			<AnnualExpenseGraph graphData={reportData.annualExpenseGraph} />
		</div>
	</div>

	<div class="chart-row">
		<div class="chart-container">
			<TaxGraph graphData={reportData.taxGraph} />
		</div>
	</div>
</div>

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: scroll;
		gap: 32px;
		padding: 32px 32px;
	}

	.chart-row {
		display: flex;
		flex-direction: row;
		width: 100%;
		gap: 32px;
	}

	.chart-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: min-content;
		justify-content: space-around;
		border: 1px solid var(--lightgray3);
		border-radius: 12px;
		box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1);
	}

	.chart-row.double .chart-container {
		width: calc(50% - 16px);
	}

	@media screen and (max-width: 800px) {
		.chart-row.double {
			flex-direction: column;
		}
		.chart-row.double .chart-container {
			width: 100%;
		}
	}
</style>

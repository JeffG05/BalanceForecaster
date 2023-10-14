<script lang="ts">
	import { currencyFormat } from '$lib/scripts/utils';
	import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/svelte';
	import { Orientation, StackedBar } from '@unovis/ts';
	import Graph from '$lib/components/graphs/graph.svelte';
	import type { TaxGraphData, TaxGraphDataRecord } from '$lib/scripts/types';

	export let graphData: TaxGraphData;

	const x = () => 0;
	const y = graphData.data.y.map((y) => {
		return () => y;
	});
	const color = (d: TaxGraphDataRecord, i: number) => (i == 0 ? 'var(--green)' : 'var(--orange)');
	const triggers = {
		[StackedBar.selectors.bar]: (d: TaxGraphDataRecord, i: number) =>
			`<span style='font-size: 11px; font-weight: 500;'>${
				graphData.data.x[i]
			}</span><br><span style='font-size: 12px'>${currencyFormat(graphData.data.y[i], true)}</span>`
	};
</script>

<Graph title="Taxation" id="tax-graph" details={graphData.details}>
	<VisXYContainer data={[graphData.data]} height="120px">
		<VisStackedBar {x} {y} {color} roundedCorners={false} orientation={Orientation.Horizontal} />
		<VisAxis type="x" label="Amount (£)" tickFormat={(x) => currencyFormat(x)} />
		<VisTooltip {triggers} />
	</VisXYContainer>
</Graph>

<style>
	:global(div[graph='tax-graph'] path) {
		--vis-stacked-bar-stroke-width: 2px !important;
		--vis-stacked-bar-stroke-color: white !important;
	}
</style>

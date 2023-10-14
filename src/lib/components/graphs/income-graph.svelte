<script lang="ts">
	import { currencyFormat } from '$lib/scripts/utils';
	import { VisAxis, VisStackedBar, VisTooltip, VisXYContainer } from '@unovis/svelte';
	import { StackedBar } from '@unovis/ts';
	import Graph from '$lib/components/graphs/graph.svelte';
	import type { FlowGraphData, FlowGraphDataRecord } from '$lib/scripts/types';

	export let graphData: FlowGraphData;

	const x = (d: FlowGraphDataRecord, i: number) => i;
	const y = (d: FlowGraphDataRecord) => d.y;
	const triggers = {
		[StackedBar.selectors.bar]: (d: FlowGraphDataRecord) =>
			`<span style='font-size: 12px'>${currencyFormat(d.y, true)}</span>`
	};
</script>

<Graph title="Top Incomes" details={graphData.details}>
	<VisXYContainer data={graphData.data} height="250px">
		<VisStackedBar {x} {y} color="var(--green)" roundedCorners={10} barMinHeight1Px={true} />
		<VisAxis
			type="x"
			gridLine={false}
			tickLine={false}
			tickValues={graphData.data.map((_, i) => i)}
			tickFormat={(x) => graphData.data[x].x}
		/>
		<VisAxis type="y" label="Total Income (£)" tickFormat={(y) => currencyFormat(y)} />
		<VisTooltip {triggers} />
	</VisXYContainer>
</Graph>

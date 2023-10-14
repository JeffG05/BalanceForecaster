<script lang="ts">
	import { currencyFormat } from '$lib/scripts/utils';
	import {
		VisAxis,
		VisCrosshair,
		VisLine,
		VisScatter,
		VisTooltip,
		VisXYContainer
	} from '@unovis/svelte';
	import Graph from '$lib/components/graphs/graph.svelte';
	import type { AnnualFlowGraphData, AnnualFlowGraphDataRecord } from '$lib/scripts/types';

	export let graphData: AnnualFlowGraphData;

	const x = (d: AnnualFlowGraphDataRecord) => d.x;
	const y = (d: AnnualFlowGraphDataRecord) => d.y;
	const template = (d: AnnualFlowGraphDataRecord) =>
		`<span style='font-size: 11px; font-weight: 500;'>${
			d.x
		}</span><br><span style='font-size: 12px'>${currencyFormat(d.y, true)}</span>`;
</script>

<Graph title="Annual Incomes" details={graphData.details}>
	<VisXYContainer data={graphData.data} height="250px">
		<VisLine {x} {y} color="var(--green)" />
		<VisScatter {x} {y} color="var(--green)" />
		<VisAxis type="x" gridLine={false} minMaxTicksOnly={true} />
		<VisAxis type="y" label="Total Income (£)" tickFormat={(y) => currencyFormat(y)} />
		<VisCrosshair {template} color="var(--green)" />
		<VisTooltip />
	</VisXYContainer>
</Graph>

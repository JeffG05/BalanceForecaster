<script lang="ts">
	import { currencyFormat, dateFormat } from '$lib/scripts/utils';
	import { VisAxis, VisCrosshair, VisLine, VisTooltip, VisXYContainer } from '@unovis/svelte';
	import Graph from '$lib/components/graphs/graph.svelte';
	import type { BalanceGraphData, BalanceGraphDataRecord } from '$lib/scripts/types';

	export let graphData: BalanceGraphData;

	const x = (d: BalanceGraphDataRecord) => d.x;
	const y = (d: BalanceGraphDataRecord) => d.y;
	const tooltip = (d: BalanceGraphDataRecord) => {
		const date = dateFormat(d.x.getTime());
		const amount = currencyFormat(d.y, true);
		return `<span style='font-size: 11px; font-weight: 500;'>${date}</span><br><span style='font-size: 12px'>${amount}</span>`;
	};
</script>

<Graph title="Account Balance" details={graphData.details}>
	<VisXYContainer data={graphData.data} height="300px">
		<VisLine {x} {y} curveType="stepAfter" />
		<VisAxis type="x" tickFormat={dateFormat} gridLine={false} />
		<VisAxis type="y" label="Account Balance (£)" tickFormat={(x) => currencyFormat(x)} />
		<VisCrosshair template={tooltip} />
		<VisTooltip />
	</VisXYContainer>
</Graph>

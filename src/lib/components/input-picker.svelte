<script lang="ts">
	import '@fontsource/fira-mono/400.css';

	export let value;
	$: raw = formatAmount(value);

	function formatAmount(value: number): string {
		let formatted: string = new Intl.NumberFormat('en-GB', {
			style: 'currency',
			currency: 'gbp'
		}).format(Math.abs(value));
		formatted = formatted.substring(1);

		if (value >= 0) {
			return formatted;
		} else {
			return '(' + formatted + ')';
		}
	}

	function onChange() {
		let rawAccounting = raw.trim().replace(/[^0-9.\-()]/g, '');
		if (rawAccounting.startsWith('(') && rawAccounting.endsWith(')')) {
			rawAccounting = '-' + rawAccounting.replace(/[()]/g, '');
		}

		let floatValue = parseFloat(rawAccounting);
		if (isNaN(floatValue)) {
			floatValue = 0;
		}

		value = floatValue;
		raw = formatAmount(floatValue);
	}
</script>

<input bind:value={raw} on:change={onChange} />

<style>
	input {
		position: relative;
		width: 150px;
		appearance: none;
		border: 1px solid var(--lightgray2);
		border-radius: 6px;
		font-family: 'Fira Mono', monospace;
		font-weight: 400;
		font-size: 13px;
		padding: 8px 16px 8px 28px;
		background: url('/icons/currency_pound.svg') 12px 50% / 13px no-repeat var(--lightgray1);
	}
</style>

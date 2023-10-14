import { DateTime } from 'luxon';

export function dateFormat(value: number): string {
	return DateTime.fromMillis(value).toFormat('LLL dd, yyyy');
}

export function currencyFormat(value: number, includeSign = false): string {
	let formatted: string = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'gbp'
	}).format(Math.abs(value));

	if (!includeSign) {
		formatted = formatted.substring(1);
	}

	if (formatted.endsWith('.00')) {
		formatted = formatted.substring(0, formatted.length - 3);
	}

	if (value >= 0) {
		return formatted;
	} else {
		return `-${formatted}`;
	}
}

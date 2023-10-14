import { type TaxBracket, Tax } from '$lib/scripts/tax/tax';

export class IncomeTax extends Tax {
	constructor() {
		const brackets: TaxBracket[] = [
			{ size: 12570, tax: 0 },
			{ size: 50270 - 12570, tax: 0.2 },
			{ size: 125140 - 50270, tax: 0.4 },
			{ size: Infinity, tax: 0.45 }
		];
		super(brackets);
	}
}

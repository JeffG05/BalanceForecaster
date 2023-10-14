import { type TaxBracket, Tax } from '$lib/scripts/tax/tax';

export class NationalInsuranceTax extends Tax {
	constructor(category: string) {
		let brackets: TaxBracket[];
		if (['A', 'F', 'H', 'M', 'V'].includes(category)) {
			brackets = [
				{ size: 1048, tax: 0 },
				{ size: 4189 - 1048, tax: 0.12 },
				{ size: Infinity, tax: 0.02 }
			];
		} else if (['B', 'I'].includes(category)) {
			brackets = [
				{ size: 1048, tax: 0 },
				{ size: 4189 - 1048, tax: 0.0585 },
				{ size: Infinity, tax: 0.02 }
			];
		} else if (['J', 'L', 'Z'].includes(category)) {
			brackets = [
				{ size: 1048, tax: 0 },
				{ size: Infinity, tax: 0.02 }
			];
		} else {
			brackets = [{ size: Infinity, tax: 0 }];
		}

		super(brackets);
	}
}

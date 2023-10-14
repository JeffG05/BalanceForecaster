export type TaxBracket = {
	size: number;
	tax: number;
};

export class Tax {
	private brackets: TaxBracket[];

	constructor(brackets: TaxBracket[]) {
		this.brackets = brackets;
	}

	public calculate(grossIncome: number, alreadyTaxed = 0): number {
		const brackets = this.brackets;
		let tax = 0;
		let incomeLeft = grossIncome;

		if (incomeLeft < 0) {
			return 0;
		}

		while (alreadyTaxed > 0) {
			if (alreadyTaxed >= brackets[0].size) {
				const bracket = brackets.shift();
				if (bracket) {
					alreadyTaxed -= bracket.size;
				}
			} else {
				brackets[0].size -= alreadyTaxed;
				alreadyTaxed = 0;
			}
		}

		for (const bracket of brackets) {
			if (incomeLeft <= bracket.size) {
				tax += incomeLeft * bracket.tax;
				return tax;
			}

			tax += bracket.size * bracket.tax;
			incomeLeft -= bracket.size;
		}

		return tax;
	}
}

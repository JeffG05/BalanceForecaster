import { DateTime } from 'luxon';

export class StatementLine {
	public name: string;
	public amount: number;
	public date?: DateTime;

	constructor(name: string, amount: number, date?: DateTime) {
		this.name = name;
		this.amount = amount;
		this.date = date?.startOf('day');
	}
}

export class StatementLines extends Array<StatementLine> {
	constructor(...items: StatementLine[]) {
		super(...items.filter((x) => x.amount != 0));
		this.sortLines();
	}

	private sortLines() {
		this.sort(function (a, b) {
			let dateSort = 0;
			if (a.date && b.date) {
				dateSort = a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
			} else if (!a.date && b.date) {
				dateSort = -1;
			} else if (a.date && !b.date) {
				dateSort = 1;
			}

			if (dateSort != 0) {
				return dateSort;
			}

			return a.amount - b.amount;
		});
	}

	push(...items: StatementLine[]): number {
		const i = super.push(...items);
		this.sortLines();
		return i;
	}

	public getGrossIncome(): number {
		let total = 0;
		for (const line of this) {
			total += line.amount;
		}
		return total;
	}

	public getTotalIncome(): number {
		let total = 0;
		for (const line of this) {
			if (line.amount > 0) {
				total += line.amount;
			}
		}
		return total;
	}

	public getTotalExpense(): number {
		let total = 0;
		for (const line of this) {
			if (line.amount < 0) {
				total += Math.abs(line.amount);
			}
		}
		return total;
	}

	public getIncomes(): StatementLines {
		return new StatementLines(...this.filter((line) => line.amount > 0));
	}

	public getExpenses(): StatementLines {
		return new StatementLines(...this.filter((line) => line.amount < 0));
	}

	public consolidateByName(): StatementLines {
		const consolidatedAmount = new Map<string, number>();
		for (const line of this) {
			const currentAmount = consolidatedAmount.get(line.name) ?? 0;
			consolidatedAmount.set(line.name, currentAmount + line.amount);
		}
		const newLines = Array.of(...consolidatedAmount.entries()).map(
			(x) => new StatementLine(x[0], x[1])
		);
		return new StatementLines(...newLines);
	}

	public consolidateByDay(): StatementLines {
		const consolidatedAmount = new Map<number, number>();
		for (const line of this) {
			if (!line.date) {
				continue;
			}
			const currentAmount = consolidatedAmount.get(line.date.toMillis()) ?? 0;
			consolidatedAmount.set(line.date.toMillis(), currentAmount + line.amount);
		}
		const newLines = Array.of(...consolidatedAmount.entries()).map(
			(x) => new StatementLine('', x[1], DateTime.fromMillis(x[0]))
		);
		return new StatementLines(...newLines);
	}

	public consolidateByYear(): StatementLines {
		const consolidatedAmount = new Map<number, number>();
		for (const line of this) {
			if (!line.date) {
				continue;
			}
			const currentAmount = consolidatedAmount.get(line.date.year) ?? 0;
			consolidatedAmount.set(line.date.year, currentAmount + line.amount);
		}
		const newLines = Array.of(...consolidatedAmount.entries()).map(
			(x) => new StatementLine('', x[1], DateTime.local(x[0]))
		);
		return new StatementLines(...newLines);
	}
}

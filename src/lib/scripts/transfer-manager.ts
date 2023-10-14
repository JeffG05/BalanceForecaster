import type { Transfer } from '$lib/scripts/transfer';
import { DateTime } from 'luxon';
import { StatementLine, StatementLines } from '$lib/scripts/statement-line';
import { IncomeTax } from '$lib/scripts/tax/income-tax';
import { NationalInsuranceTax } from '$lib/scripts/tax/national-insurance-tax';
import type { TransferObject } from '$lib/scripts/types';

export class TransferManager {
	public transfers = new Array<Transfer>();

	public toObject(): TransferObject[] {
		return this.transfers.map((transfer) => transfer.toObject());
	}

	public get incomes(): Transfer[] {
		return this.transfers.filter((t) => t.amount > 0);
	}

	public get expenses(): Transfer[] {
		return this.transfers.filter((t) => t.amount < 0);
	}

	public addTransfer(transfer: Transfer) {
		this.transfers.push(transfer);
	}

	public deleteTransfer(transfer: Transfer) {
		this.transfers = this.transfers.filter((t) => t != transfer);
	}

	private getStatementLinesImpl(
		transfers: Transfer[],
		rangeStart: DateTime,
		rangeEnd: DateTime
	): StatementLines {
		const statementLines = transfers.flatMap(function (transfer) {
			const bookings = transfer.getBookings(rangeStart, rangeEnd);
			return bookings.map(function (bookingDate) {
				const bookingAmount = transfer.getBookingAmount(bookingDate);
				return new StatementLine(transfer.name, bookingAmount, bookingDate);
			});
		});
		return new StatementLines(...statementLines);
	}

	public getStatementLines(rangeStart: DateTime, rangeEnd: DateTime): StatementLines {
		return this.getStatementLinesImpl(this.transfers, rangeStart, rangeEnd);
	}

	public getIncomeStatementLines(rangeStart: DateTime, rangeEnd: DateTime): StatementLines {
		return this.getStatementLinesImpl(this.incomes, rangeStart, rangeEnd);
	}

	public getIncomeTax(rangeStart: DateTime, rangeEnd: DateTime): StatementLines {
		let taxYearStart = rangeStart.set({ month: 4, day: 6 });
		if (taxYearStart > rangeStart) {
			taxYearStart = taxYearStart.minus({ years: 1 });
		}

		const lines = new StatementLines();
		while (taxYearStart < rangeEnd) {
			const taxYearEnd = taxYearStart.plus({ years: 1 });

			let alreadyTaxed = 0;
			if (taxYearStart < rangeStart) {
				const alreadyTaxedLines = this.getIncomeStatementLines(taxYearStart, rangeStart);
				alreadyTaxed = alreadyTaxedLines.getGrossIncome();
			}

			const taxYearLines = this.getIncomeStatementLines(
				DateTime.max(taxYearStart, rangeStart),
				DateTime.min(taxYearEnd, rangeEnd)
			);
			const taxYearIncome = taxYearLines.getGrossIncome();
			const incomeTax = new IncomeTax().calculate(taxYearIncome, alreadyTaxed);
			lines.push(new StatementLine('Income Tax', -incomeTax, DateTime.min(rangeEnd, taxYearEnd)));
			taxYearStart = taxYearStart.plus({ years: 1 });
		}

		return lines;
	}

	public getNationalInsurance(rangeStart: DateTime, rangeEnd: DateTime): StatementLines {
		let monthStart = rangeStart.startOf('month');

		const lines = new StatementLines();
		while (monthStart < rangeEnd) {
			const monthEnd = monthStart.plus({ months: 1 });
			const monthLines = this.getIncomeStatementLines(
				DateTime.max(monthStart, rangeStart),
				DateTime.min(monthEnd, rangeEnd)
			);
			const monthIncome = monthLines.getGrossIncome();
			const nationalInsurance = new NationalInsuranceTax('A').calculate(monthIncome);
			lines.push(
				new StatementLine(
					'National Insurance',
					-nationalInsurance,
					DateTime.min(rangeEnd, monthEnd)
				)
			);
			monthStart = monthStart.plus({ months: 1 });
		}

		return lines;
	}
}

import type { PageData, PageLoad } from './$types';
import type {
	AnnualFlowGraphData,
	AnnualFlowGraphDataRecord,
	BalanceGraphData,
	BalanceGraphDataRecord,
	BasicDetails,
	Detail,
	FlowGraphData,
	ReportData,
	TaxGraphData,
	TaxGraphDataRecord
} from '$lib/scripts/types';
import { DateTime } from 'luxon';
import { Account } from '$lib/scripts/account';
import { currencyFormat } from '$lib/scripts/utils';
import type { FlowGraphDataRecord } from '$lib/scripts/types';
import type { StatementLines } from '$lib/scripts/statement-line';
import { redirect } from '@sveltejs/kit';

export const load: PageLoad = (): PageData => {
	const details = localStorage.getItem('basicDetails');
	if (!details) {
		throw redirect(300, '/setup');
	}

	const basicJson: BasicDetails = JSON.parse(details);
	const reportStart = DateTime.fromMillis(basicJson.start);
	const reportEnd = DateTime.fromMillis(basicJson.end);
	const account = Account.fromObject(basicJson.account);

	return {
		start: reportStart,
		end: reportEnd,
		account: account,
		getReportData: (): ReportData => {
			return {
				balanceGraph: getBalanceGraphData(account, reportStart, reportEnd),
				incomeGraph: getIncomeGraphData(account, reportStart, reportEnd),
				annualIncomeGraph: getAnnualIncomeGraphData(account, reportStart, reportEnd),
				expenseGraph: getExpenseGraphData(account, reportStart, reportEnd),
				annualExpenseGraph: getAnnualExpenseGraphData(account, reportStart, reportEnd),
				taxGraph: getTaxGraphData(account, reportStart, reportEnd)
			};
		}
	};
};

function getBalanceGraphData(account: Account, start: DateTime, end: DateTime): BalanceGraphData {
	const statementLines = account.getFullStatementLines(start, end).consolidateByDay();
	const records = new Array<BalanceGraphDataRecord>();

	let balance = account.startingBalance;
	let i = 0;

	for (let date = start; date <= end; date = date.plus({ days: 1 })) {
		if (i < statementLines.length && statementLines[i].date?.toMillis() == date.toMillis()) {
			const line = statementLines[i];
			balance += line.amount;
			i += 1;
		}
		records.push({ x: date.toJSDate(), y: balance });
	}

	const startingBalance = account.startingBalance;
	const netIncome = statementLines.getGrossIncome();
	const duration = end.diff(start, ['years', 'months', 'days']);
	const durationString = (() => {
		if (duration.years > 0) {
			return `${duration.years}y ${duration.months}m ${duration.days}d`;
		} else if (duration.months > 0) {
			return `${duration.months}m ${duration.days}d`;
		} else {
			return `${duration.days}d`;
		}
	})();
	const finalBalance = startingBalance + netIncome;

	const details: Detail[] = [
		{ title: 'Starting balance', value: currencyFormat(startingBalance, true) },
		{ title: 'Report length', value: durationString },
		{ title: 'Final balance', value: currencyFormat(finalBalance, true) }
	];

	return {
		data: records,
		details: details
	};
}

function getIncomeGraphData(account: Account, start: DateTime, end: DateTime): FlowGraphData {
	const statementLines = account.getStatementLines(start, end).consolidateByName();

	const records: FlowGraphDataRecord[] = statementLines
		.filter((line) => line.amount > 0)
		.reverse()
		.slice(0, 5)
		.map((line) => {
			return { x: line.name, y: line.amount };
		});

	const totalIncome = statementLines.getTotalIncome();

	const details: Detail[] = [
		{ title: 'Gross income', value: currencyFormat(totalIncome, true) },
		{ title: 'Total incomes', value: statementLines.getIncomes().length.toString() }
	];

	return {
		data: records,
		details: details
	};
}

function getAnnualIncomeGraphData(
	account: Account,
	start: DateTime,
	end: DateTime
): AnnualFlowGraphData {
	const statementLines = account.getStatementLines(start, end);

	const consolidatedLines: StatementLines = statementLines.getIncomes().consolidateByYear();

	const records = new Array<AnnualFlowGraphDataRecord>();
	for (let year = start.year; year <= end.year; year++) {
		const yearLine = consolidatedLines.find((line) => line.date?.year == year);
		if (yearLine) {
			records.push({
				x: year,
				y: yearLine.amount
			});
		} else {
			records.push({ x: year, y: 0 });
		}
	}

	const totalIncome = statementLines.getTotalIncome();
	const years = start.until(end).length('years');
	const annualIncome = totalIncome / years;

	const details: Detail[] = [
		{ title: 'Avg annual income', value: currencyFormat(annualIncome, true) }
	];

	return {
		data: records,
		details: details
	};
}

function getExpenseGraphData(account: Account, start: DateTime, end: DateTime): FlowGraphData {
	const statementLines = account.getStatementLines(start, end).consolidateByName();

	const taxLines = account.getTaxStatementLines(start, end);

	const records: FlowGraphDataRecord[] = statementLines
		.getExpenses()
		.slice(0, 5)
		.map((line) => {
			return { x: line.name, y: Math.abs(line.amount) };
		});

	const netIncome = statementLines.getTotalIncome() - taxLines.getTotalExpense();
	const totalExpense = statementLines.getTotalExpense();
	const spendingRateValue = (100 * totalExpense) / netIncome;
	const spendingRate = isNaN(spendingRateValue) ? '- - ' : spendingRateValue.toFixed(1);

	const details: Detail[] = [
		{ title: 'Total expense', value: currencyFormat(totalExpense, true) },
		{ title: 'Total expenses', value: statementLines.getExpenses().length.toString() },
		{
			title: 'Spending rate',
			value: `${spendingRate}%`,
			description: 'Total expense as a proportion of net income'
		}
	];

	return {
		data: records,
		details: details
	};
}

function getAnnualExpenseGraphData(
	account: Account,
	start: DateTime,
	end: DateTime
): AnnualFlowGraphData {
	const statementLines = account.getStatementLines(start, end);

	const consolidatedLines: StatementLines = statementLines.getExpenses().consolidateByYear();

	const records = new Array<AnnualFlowGraphDataRecord>();
	for (let year = start.year; year <= end.year; year++) {
		const yearLine = consolidatedLines.find((line) => line.date?.year == year);
		if (yearLine) {
			records.push({
				x: year,
				y: Math.abs(yearLine.amount)
			});
		} else {
			records.push({ x: year, y: 0 });
		}
	}

	const totalExpense = statementLines.getTotalExpense();
	const years = start.until(end).length('years');
	const annualExpense = totalExpense / years;

	const details: Detail[] = [
		{ title: 'Avg annual expense', value: currencyFormat(annualExpense, true) }
	];

	return {
		data: records,
		details: details
	};
}

function getTaxGraphData(account: Account, start: DateTime, end: DateTime): TaxGraphData {
	const statementLines = account.getStatementLines(start, end);
	const taxLines = account.getTaxStatementLines(start, end).consolidateByName();

	const totalIncome = statementLines.getTotalIncome();
	const totalTaxPaid = taxLines.getTotalExpense();
	const netIncome = totalIncome - totalTaxPaid;

	const taxRateValue = (100 * totalTaxPaid) / totalIncome;
	const taxRate = isNaN(taxRateValue) ? '- - ' : taxRateValue.toFixed(1);

	const record: TaxGraphDataRecord = {
		x: ['Net income'].concat(...taxLines.map((line) => line.name)),
		y: [netIncome].concat(...taxLines.map((line) => Math.abs(line.amount)))
	};
	const details: Detail[] = [
		{ title: 'Gross income', value: currencyFormat(totalIncome, true) },
		{ title: 'Total tax paid', value: currencyFormat(totalTaxPaid, true) },
		{
			title: 'Tax rate',
			value: `${taxRate}%`,
			description: 'Proportion of total income that is paid in taxes'
		},
		{ title: 'Net income', value: currencyFormat(netIncome, true) }
	];

	return {
		data: record,
		details: details
	};
}

import { TransferManager } from '$lib/scripts/transfer-manager';
import { Transfer } from '$lib/scripts/transfer';
import type { DateTime } from 'luxon';
import { StatementLines } from '$lib/scripts/statement-line';
import type { AccountObject, CSVRow } from '$lib/scripts/types';
import Papa from 'papaparse';

export class Account {
	public name: string;
	public startingBalance: number;
	private manager: TransferManager = new TransferManager();

	constructor(name: string, startingBalance = 0) {
		this.name = name;
		this.startingBalance = startingBalance;
	}

	public toObject(): AccountObject {
		return {
			name: this.name,
			startingBalance: this.startingBalance,
			transfers: this.manager.toObject()
		};
	}

	public toCSV(): CSVRow[] {
		return this.getTransfers().map((t) => t.toCSV());
	}

	public static fromObject(data: AccountObject): Account {
		const account = new Account(data.name, data.startingBalance);
		const transfers = data.transfers.map((obj) => Transfer.fromObject(obj));
		account.addTransfers(...transfers);
		return account;
	}

	public importCsv(data: string) {
		const csv = Papa.parse(data);
		const csvData = csv.data as string[][];
		csvData.shift();
		const transfers = csvData.map((row) => Transfer.fromCsv(row));
		this.addTransfers(...transfers);
	}

	public addTransfer(transfer: Transfer) {
		this.manager.addTransfer(transfer);
	}

	public addTransfers(...transfers: Transfer[]) {
		for (const transfer of transfers) {
			this.manager.addTransfer(transfer);
		}
	}

	public deleteTransfer(transfer: Transfer) {
		this.manager.deleteTransfer(transfer);
	}

	public getTransfers(): Transfer[] {
		return this.manager.transfers;
	}

	public getSortedTransfers(): Transfer[] {
		return this.manager.transfers.sort((a, b) => {
			const amountSort = b.amount - a.amount;
			if (amountSort != 0) {
				return amountSort;
			}

			return a.name.localeCompare(b.name);
		});
	}

	public getStatementLines(start: DateTime, end: DateTime): StatementLines {
		const transferLines = this.manager.getStatementLines(start, end);
		return new StatementLines(...transferLines);
	}

	public getTaxStatementLines(start: DateTime, end: DateTime): StatementLines {
		const incomeTaxLines = this.manager.getIncomeTax(start, end);
		const nationalInsuranceLines = this.manager.getNationalInsurance(start, end);
		return new StatementLines(...incomeTaxLines, ...nationalInsuranceLines);
	}

	public getFullStatementLines(start: DateTime, end: DateTime): StatementLines {
		const transferLines = this.getStatementLines(start, end);
		const taxLines = this.getTaxStatementLines(start, end);
		return new StatementLines(...transferLines, ...taxLines);
	}
}

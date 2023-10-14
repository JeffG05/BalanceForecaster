export type Detail = {
	title: string;
	value: string;
	description?: string;
};

export type BasicDetails = {
	start: number;
	end: number;
	account: AccountObject;
};

export type AccountObject = {
	name: string;
	startingBalance: number;
	transfers: TransferObject[];
};

export type TransferObject = {
	id: string;
	name: string;
	amount: number;
	timespan: number;
	schedule: BookingScheduleObject;
	firstBooking: number;
	lastBooking?: number;
};

export type BookingScheduleObject = {
	cron: string;
};

export type CSVRow = (string | number)[];

export type BalanceGraphDataRecord = { x: Date; y: number };
export type BalanceGraphData = {
	data: BalanceGraphDataRecord[];
	details: Detail[];
};

export type FlowGraphDataRecord = { x: string; y: number };
export type FlowGraphData = {
	data: FlowGraphDataRecord[];
	details: Detail[];
};

export type AnnualFlowGraphDataRecord = { x: number; y: number };
export type AnnualFlowGraphData = {
	data: AnnualFlowGraphDataRecord[];
	details: Detail[];
};

export type TaxGraphDataRecord = { x: string[]; y: number[] };
export type TaxGraphData = {
	data: TaxGraphDataRecord;
	details: Detail[];
};

export type ReportData = {
	balanceGraph: BalanceGraphData;
	incomeGraph: FlowGraphData;
	annualIncomeGraph: AnnualFlowGraphData;
	expenseGraph: FlowGraphData;
	annualExpenseGraph: AnnualFlowGraphData;
	taxGraph: TaxGraphData;
};

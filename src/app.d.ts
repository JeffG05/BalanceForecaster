// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Account } from '$lib/scripts/account';
import type { DateTime } from 'luxon';
import type { ReportData } from '$lib/scripts/types';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			start: DateTime;
			end: DateTime;
			account: Account;
			getReportData?: () => ReportData;
		}
		// interface Platform {}
	}
}

export {};

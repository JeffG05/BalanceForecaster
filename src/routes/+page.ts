import type { PageData, PageLoad } from './$types';
import type { BasicDetails } from '$lib/scripts/types';
import { Account } from '$lib/scripts/account';
import { DateTime } from 'luxon';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load: PageLoad = async (): PageData => {
	const details = localStorage.getItem('basicDetails');
	if (!details) {
		throw redirect(300, `${base}/setup`);
	}

	const basicJson: BasicDetails = JSON.parse(details);
	return {
		start: DateTime.fromMillis(basicJson.start),
		end: DateTime.fromMillis(basicJson.end),
		account: Account.fromObject(basicJson.account)
	};
};

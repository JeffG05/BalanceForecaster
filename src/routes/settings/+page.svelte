<script lang="ts">
	import SettingsTitlebar from '$lib/components/titlebar-settings.svelte';
	import SettingsViewer from '$lib/components/settings-viewer.svelte';
	import type { PageData } from './$types';
	import type { BasicDetails } from '$lib/scripts/types';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	export let data: PageData;

	const account = data.account;

	let accountName: string = account.name;
	let startingBalance: number = account.startingBalance;

	const originalName = account.name;

	function save(name, balance) {
		account.name = name.trim();
		account.startingBalance = balance;

		const json: BasicDetails = {
			start: data.start.toMillis(),
			end: data.end.toMillis(),
			account: account.toObject()
		};
		localStorage.setItem('basicDetails', JSON.stringify(json));
	}

	function goBack() {
		if (accountName.trim().length == 0) {
			save(originalName, startingBalance);
		}
		goto(`${base}/`);
	}

	$: save(accountName, startingBalance);
</script>

<SettingsTitlebar func={goBack} />
<SettingsViewer bind:name={accountName} bind:balance={startingBalance} />

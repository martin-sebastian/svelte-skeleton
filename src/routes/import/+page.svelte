<script lang="ts">
	import { onMount } from 'svelte';
	let importStatus = '';

	// Function to trigger the XML import
	async function handleImport() {
		importStatus = 'Importing...';
		try {
			const res = await fetch('/import');
			const data = await res.json();
			importStatus = data.message;
		} catch (error) {
			importStatus = 'Import failed. Check console for errors.';
			console.error(error);
		}
	}
</script>

<div class="w-full overflow-y-auto">
	<h1 class="px-4 pt-4 text-start text-3xl font-bold">Data Sync</h1>
	<div class="card m-4 p-4 preset-filled-surface-100-900">
		<h1 class="block text-5xl">Import Vehicles</h1>
		<p class="text-2xl opacity-20">
			Imports all vehicles from Dealer Spike universal vehicle XML feed.
		</p>
		<button
			type="button"
			class="btn btn-lg my-10 preset-outlined-primary-500"
			on:click={handleImport}>Start Import</button
		>
		<p>{importStatus}</p>
	</div>
</div>

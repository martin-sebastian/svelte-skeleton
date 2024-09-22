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

<div>
	<h1>Import Vehicles</h1>
	<button on:click={handleImport}>Start Import</button>
	<p>{importStatus}</p>
</div>

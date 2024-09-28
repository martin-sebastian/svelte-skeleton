<script lang="ts">
	import { onMount } from 'svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import IconUpload from 'lucide-svelte/icons/upload';

	let importStatus = '';
	let isLoading = false;
	let csvImportStatus = '';

	// Function to trigger the XML import
	async function handleXmlImport() {
		isLoading = true;
		importStatus = 'Importing... Please wait.';

		try {
			// Fetch with a timeout mechanism
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

			const res = await fetch('/import', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ type: 'xml' }),
				signal: controller.signal
			});

			clearTimeout(timeoutId); // Clear the timeout if fetch succeeds

			if (res.ok) {
				const data = await res.json();
				importStatus = data.message;
			} else {
				importStatus = 'Import failed. Server returned an error.';
				const errorText = await res.text();
				console.error('Error response:', errorText);
			}
		} catch (error) {
			if (error.name === 'AbortError') {
				importStatus = 'Import timed out. Please try again later.';
			} else {
				importStatus = 'Import failed. Check console for errors.';
				console.error(error);
			}
		} finally {
			isLoading = false;
		}
	}

	// Function to trigger the CSV import

	async function handleCsvImport() {
		csvImportStatus = 'Importing CSV... Please wait.';
		try {
			const res = await fetch('/import', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'csv' // Sending type 'csv' for CSV import
				})
			});

			if (res.ok) {
				const data = await res.json();
				csvImportStatus = data.message;
			} else {
				csvImportStatus = 'CSV Import failed. Server returned an error.';
				const errorText = await res.text();
				console.error('Error response:', errorText);
			}
		} catch (error) {
			csvImportStatus = 'CSV Import failed. Check console for errors.';
			console.error(error);
		}
	}
</script>

<div class="w-full overflow-y-auto">
	<h1 class="mt-4 px-4 text-start text-2xl font-bold">Data Sync</h1>
	<div class="card m-4 p-4 preset-filled-surface-100-900">
		<h1 class="text-2xl font-bold">Dealer Spike Vehicles Inventory</h1>
		<p class="text-2xl opacity-20">
			Imports all vehicles from Dealer Spike universal vehicle XML feed or a CSV file.
		</p>
		<p class="text-1xl opacity-60">
			Data: Year, Make, Model, Color, Type, Style, VIN, Stock Number, Price.
		</p>

		<!-- XML Import -->
		<div>
			<button
				type="button"
				class="btn my-5 preset-outlined-primary-500"
				on:click={handleXmlImport}
				disabled={isLoading}
			>
				{isLoading ? 'Importing...' : 'Start XML Sync'}
			</button>
			<p>{importStatus}</p>
		</div>
	</div>
	<div class="card m-4 p-4 preset-filled-surface-100-900">
		<h1 class="text-2xl font-bold">BRP OEM Parts Data</h1>
		<p class="text-2xl opacity-20">Imports OEM Parts list from a CSV file.</p>
		<p class="text-1xl opacity-60">
			Data: material_no, part_desc, last_yr_util, status, retail_price, dealer_price,
			distributor_price, superseded_part, superseded_by, interchangable, qty_assembly, price_uom,
			order_unit, in_package_qty, in_package_uom.
		</p>
		<!-- CSV Import -->
		<div>
			<script lang="ts">
				import { FileUpload } from '@skeletonlabs/skeleton-svelte';
				// Icons
				import IconUpload from 'lucide-svelte/icons/upload';
			</script>

			<FileUpload name="select-csv-button" accept="csv/*" onFileChange={console.log} maxFiles={2}>
				<button class="btn-primary-500 btn">
					<IconUpload class="size-4" />
					<span>Select File</span>
				</button>
			</FileUpload>
			<button type="button" class="btn my-5 preset-outlined-primary-500" on:click={handleCsvImport}>
				Start CSV Import
			</button>
			<p>{csvImportStatus}</p>
		</div>
	</div>
</div>

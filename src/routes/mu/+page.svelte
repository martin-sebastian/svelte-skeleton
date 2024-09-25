<script lang="ts">
	import '../../app.css';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { onMount } from 'svelte';
	import { Grid, createGrid } from 'ag-grid-community';
	import pb from '$lib/pocketbase';

	let gridDiv; // Bind to this div for AG-Grid
	let rowData = []; // Empty array to hold the data from PocketBase

	// Define column structure for AG-Grid
	let columnDefs = [
		{ field: 'title', sortable: true, filter: true },
		{ field: 'stockNumber', sortable: true, filter: true },
		{
			field: 'price',
			sortable: true,
			filter: true,
			valueFormatter: (params) => {
				// Format price as currency (USD)
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(params.value);
			}
		}
	];

	// Fetch data from PocketBase
	async function fetchData() {
		try {
			console.log('Fetching vehicles from PocketBase...');
			const response = await pb.collection('vehicles').getList(1, 500); // Adjust collection name and pagination as needed
			console.log('Fetched vehicles:', response.items);
			rowData = response.items.map((item) => ({
				title: item.title,
				stockNumber: item.stock_number,
				year: item.year,
				price: item.price,
				updated: item.updated
			}));
			initializeGrid(); // Initialize AG-Grid once the data is fetched
		} catch (error) {
			console.error('Error fetching data from PocketBase:', error);
		}
	}

	// Initialize AG-Grid with fetched data
	function initializeGrid() {
		createGrid(gridDiv, {
			columnDefs,
			rowData,
			defaultColDef: {
				flex: 1,
				minWidth: 100
			},
			enableRangeSelection: true, // Enable range selection for copying multiple cells
			enableClipboard: true, // Enable copy to clipboard
			clipboardCopyHeaders: false, // Set to true to copy headers as well
			pagination: true,
			paginationPageSize: 100
		});
	}

	// Call fetchData on component mount
	onMount(fetchData);
</script>

<div class="w-full overflow-y-auto">
	<h1 class="mt-4 px-4 text-start text-2xl heading-font-weight">Vehicle Inventory</h1>

	<div class="box-table m-4">
		<div class="ag-theme-alpine-dark" style="height: 87vh;" bind:this={gridDiv}></div>
	</div>
</div>

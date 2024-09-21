<script lang="ts">
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { onMount } from 'svelte';
	import { Grid } from 'ag-grid-community';
	import pb from '$lib/pocketbase'; // Import the PocketBase client

	let gridDiv; // Bind to this div for AG-Grid
	let rowData = []; // Empty array to hold the data from PocketBase

	// Define column structure for AG-Grid
	let columnDefs = [
		{ field: 'title', sortable: true, filter: true },
		{ field: 'stock_number', sortable: true, filter: true },
		{ field: 'year', sortable: true, filter: true },
		{ field: 'make', sortable: true, filter: true },
		{ field: 'model', sortable: true, filter: true },
		{ field: 'type', sortable: true, filter: true },
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
			const response = await pb.collection('vehicles').getList(1, 50); // Adjust collection name and pagination as needed
			rowData = response.items.map((item) => ({
				title: item.title,
				stock_number: item.stock_number,
				year: item.year,
				make: item.manufacturer,
				model: item.model_name,
				type: item.model_type,
				price: item.price
			}));
			initializeGrid(); // Initialize AG-Grid once the data is fetched
		} catch (error) {
			console.error('Error fetching data from PocketBase:', error);
		}
	}

	// Initialize AG-Grid with fetched data
	function initializeGrid() {
		new Grid(gridDiv, {
			columnDefs,
			rowData,
			defaultColDef: {
				flex: 1,
				minWidth: 100
			}
		});
	}

	// Call fetchData on component mount
	onMount(fetchData);
</script>

<div class="mx-auto w-full px-4 py-4">
	<h1 class="py-4 text-start text-3xl font-bold">Vehicles Example</h1>
	<!-- AG-Grid Container -->
	<div class="ag-theme-alpine-dark" style="height: 85vh; width: 100%;" bind:this={gridDiv}></div>
</div>

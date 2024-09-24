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
		{ field: 'part_number', sortable: true, filter: true },
		{ field: 'description', sortable: true, filter: true },
		{ field: 'retail_pric', sortable: true, filter: true },
		{ field: 'dealer_price', sortable: true, filter: true },
		{ field: 'distributor_price', sortable: true, filter: true },
		{ field: 'type', sortable: true, filter: true }
	];

	// Fetch data from PocketBase
	async function fetchData() {
		try {
			const response = await pb.collection('parts').getList(1, 50); // Adjust collection name and pagination as needed
			rowData = response.items.map((item) => ({
				part_number: item.part_number,
				description: item.description,
				retail_price: item.retail_price,
				dealer_price: item.dealer_price,
				distributor_price: item.distributor_price
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

<div class="mx-auto w-full">
	<h1 class="px-4 py-4 text-start text-3xl font-bold">OEM Parts</h1>

	<!-- AG-Grid Container -->
	<div class="ag-theme-alpine-dark w-full px-4" style="height: 90vh;" bind:this={gridDiv}></div>
</div>

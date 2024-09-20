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
		{ field: 'make', sortable: true, filter: true },
		{ field: 'model', sortable: true, filter: true },
		{ field: 'price', sortable: true, filter: true }
	];

	// Fetch data from PocketBase
	async function fetchData() {
		try {
			const response = await pb.collection('vehicles').getList(1, 20); // Adjust collection name and pagination as needed
			rowData = response.items.map((item) => ({
				make: item.make,
				model: item.model,
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

<!-- AG-Grid Container -->
<div class="ag-theme-alpine" style="height: 400px; width: 600px;" bind:this={gridDiv}></div>

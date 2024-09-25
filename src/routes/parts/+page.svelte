<script lang="ts">
	import '../../app.css';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { onMount } from 'svelte';
	import { Grid } from 'ag-grid-community';
	import pb from '$lib/pocketbase'; // Import the PocketBase client

	let gridDiv; // Bind to this div for AG-Grid
	let rowData = []; // Empty array to hold the data from PocketBase

	// Define column structure for AG-Grid
	let columnDefs = [
		{ field: 'material_no', sortable: true, filter: true },
		{ field: 'part_desc', sortable: true, filter: true },
		{ field: 'retail_price', sortable: true, filter: true },
		{ field: 'dealer_price', sortable: true, filter: true },
		{ field: 'distributor_price', sortable: true, filter: true },
		{ field: 'type', sortable: true, filter: true }
	];

	// Fetch data from PocketBase
	async function fetchData() {
		try {
			const response = await pb.collection('parts').getList(1, 50); // Adjust collection name and pagination as needed
			rowData = response.items.map((item) => ({
				material_no: item.material_no,
				part_desc: item.part_desc,
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

<div class="w-full overflow-y-auto">
	<h1 class="mt-4 px-4 text-start text-2xl font-bold">OEM Parts</h1>
	<div class="box-table m-4">
		<!-- AG-Grid Container -->
		<div class="ag-theme-alpine-dark" style="height: 88vh;" bind:this={gridDiv}></div>
	</div>
</div>

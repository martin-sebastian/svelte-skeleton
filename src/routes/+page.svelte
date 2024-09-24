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
		},
		{ field: 'updated', sortable: true, filter: true }
	];

	// Fetch data from PocketBase
	async function fetchData() {
		try {
			const response = await pb.collection('vehicles').getList(1, 10); // Adjust collection name and pagination as needed
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

<div class="mx-auto w-full overflow-y-auto">
	<h1 class="px-4 pt-4 text-start text-3xl font-bold">Dashboard</h1>

	<div class="card my-4 px-4">
		<div class="grid grid-cols-3 gap-4">
			<div class="box heading-font-weight"><span class="text-4xl">325</span> Vehicles</div>
			<div class="box heading-font-weight"><span class="text-4xl">02</span> OEM Parts</div>
			<div class="box heading-font-weight"><span class="text-4xl">03</span> Users</div>
			<div class="box-table col-span-2">Recent Vehicles</div>
			<div class="box">05</div>
			<div class="box-table col-span-2">
				<!-- AG-Grid Container -->
				<div class="ag-theme-alpine-dark" style="height: 50vh;" bind:this={gridDiv}></div>
			</div>
			<div class="box">06</div>
		</div>
	</div>
</div>

<style>
	.box {
		background-color: #0370f3;
		border-radius: 0.5rem;
		padding: 1rem;
	}
	.box-table {
		background-color: #222628;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow: hidden;
	}
</style>

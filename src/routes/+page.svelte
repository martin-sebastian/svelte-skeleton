<script lang="ts">
	import '../app.css';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { onMount } from 'svelte';
	import { createGrid } from 'ag-grid-community';
	import pb from '$lib/pocketbase';

	let gridDiv; // Bind to this div for vehicles AG-Grid
	let partsGridDiv; // Bind to this div for parts AG-Grid

	let rowData = []; // Array to hold vehicle data
	let partsRowData = []; // Array to hold parts data
	let totalPartsCount = 0; // Total parts count for parts collection
	let totalVehiclesCount = 0; // Total parts count for parts collection

	// AG-Grid column definitions for vehicles
	let columnDefs = [
		{ field: 'title', sortable: true, filter: true },
		{ field: 'stockNumber', sortable: true, filter: true },
		{
			field: 'price',
			sortable: true,
			filter: true,
			valueFormatter: (params) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(params.value);
			}
		},
		{
			field: 'updated',
			sortable: true,
			filter: true,
			cellRenderer: TimeAgoRenderer
		}
	];

	// AG-Grid column definitions for parts
	let partsColumnDefs = [
		{ field: 'material_no', headerName: 'Material No.', sortable: true, filter: true },
		{ field: 'part_desc', headerName: 'Description', sortable: true, filter: true },
		{ field: 'retail_price', headerName: 'Retail Price', sortable: true, filter: true }
	];

	// Custom renderer for "time ago" formatting for vehicles
	function TimeAgoRenderer(params) {
		const el = document.createElement('div');
		const timeAgo = new Date(params.value).toLocaleDateString();
		el.textContent = timeAgo;
		return el;
	}

	// Fetch both vehicles and parts data in parallel
	async function fetchData() {
		try {
			console.log('Fetching data from PocketBase...');

			// Fetch vehicles and parts in parallel
			const [vehiclesResponse, partsResponse] = await Promise.all([
				pb.collection('vehicles').getList(1, 10), // Fetch vehicles
				pb.collection('parts').getList(1, 10) // Fetch parts
			]);

			// Process vehicle data for AG-Grid
			rowData = vehiclesResponse.items.map((item) => ({
				title: item.title,
				stockNumber: item.stock_number,
				year: item.year,
				price: item.price,
				updated: item.updated
			}));

			// Process parts data for AG-Grid
			partsRowData = partsResponse.items.map((item) => ({
				material_no: item.material_no,
				part_desc: item.part_desc,
				retail_price: item.retail_price
			}));

			// Set total parts count
			totalPartsCount = partsResponse.totalItems;

			// Set total parts count
			totalVehiclesCount = vehiclesResponse.totalItems;

			// Initialize AG-Grid for vehicles and parts
			initializeGrids();
		} catch (error) {
			console.error('Error fetching data from PocketBase:', error);
		}
	}

	// Initialize both AG-Grids
	function initializeGrids() {
		createGrid(gridDiv, {
			columnDefs,
			rowData,
			defaultColDef: {
				flex: 1,
				minWidth: 100
			}
		});

		createGrid(partsGridDiv, {
			columnDefs: partsColumnDefs,
			rowData: partsRowData,
			defaultColDef: {
				flex: 1,
				minWidth: 100
			}
		});
	}

	// Fetch data on mount
	onMount(fetchData);
</script>

<div class="mx-auto w-full overflow-y-auto">
	<h1 class="mt-4 px-4 text-start text-2xl font-bold">Dashboard</h1>

	<div class="card my-4 px-4">
		<div class="grid grid-cols-3 gap-4">
			<div class="box heading-font-weight">
				<span class="text-4xl">{totalVehiclesCount}</span> Vehicles
			</div>
			<div class="box heading-font-weight">
				<span class="text-4xl">{totalPartsCount}</span> OEM Parts
			</div>
			<div class="box heading-font-weight"><span class="text-4xl">03</span> Users</div>
			<div class="box-table col-span-2"><span class="text-4xl">50</span> Recent Vehicles</div>
			<div class="box-table"><span class="text-4xl">50</span> Recent Parts</div>
			<div class="box-table col-span-2">
				<!-- AG-Grid Container for Vehicles -->
				<div class="ag-theme-alpine-dark" style="height: 40vh;" bind:this={gridDiv}></div>
			</div>
			<div class="box-table">
				<!-- AG-Grid Container for Parts -->
				<div class="ag-theme-alpine-dark" style="height: 40vh;" bind:this={partsGridDiv}></div>
			</div>
		</div>
	</div>
</div>

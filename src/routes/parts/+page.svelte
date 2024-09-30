<script lang="ts">
	import '../../app.css';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { createGrid } from 'ag-grid-community';
	import { onMount } from 'svelte';
	import pb from '$lib/pocketbase'; // Import the PocketBase client
	pb.autoCancellation(false);
	let gridApi: any;
	let gridDiv: HTMLDivElement; // Bind to this div for AG-Grid
	import type { GridApi } from 'ag-grid-community';

	let rowData = []; // Empty array to hold the data from PocketBase
	let quickFilterValue = ''; // Bind this to the input box for the quick filter

	// Define column structure for AG-Grid
	let columnDefs = [
		{
			headerCheckboxSelection: true,
			checkboxSelection: true,
			field: '',
			minWidth: 40,
			maxWidth: 50,
			sortable: false,
			filter: true
		},
		{ field: 'material_no', sortable: true, filter: true, cellRenderer: PartNumberRenderer },
		{ field: 'part_desc', sortable: true, filter: true },
		{ field: 'last_yr_util', sortable: true, filter: true },
		{
			field: 'retail_price',
			sortable: true,
			filter: true,
			valueFormatter: (params: { value: number }) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(params.value);
			}
		},
		{
			field: 'dealer_price',
			sortable: true,
			filter: true,
			valueFormatter: (params: { value: number }) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(params.value);
			}
		},
		{
			field: 'distributor_price',
			sortable: true,
			filter: true,
			valueFormatter: (params: { value: number }) => {
				return new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'USD'
				}).format(params.value);
			}
		},
		{ field: 'superseded_part', sortable: true, filter: true },
		{ field: 'superseded_by', sortable: true, filter: true },
		{ field: 'qty_assembly', sortable: true, filter: true },
		{ field: 'in_package_qty', sortable: true, filter: true },
		{ field: 'in_package_uom', sortable: true, filter: true }
	];

	// Cell Renderer for Part Number
	import type { ICellRendererParams } from 'ag-grid-community';

	function PartNumberRenderer(params: ICellRendererParams) {
		const cell = document.createElement('div');
		cell.textContent = params.value;

		// Click to copy part number to clipboard
		cell.addEventListener('click', () => {
			navigator.clipboard
				.writeText(params.value)
				.then(() => {
					console.log(`Copied to clipboard: ${params.value}`);
				})
				.catch((err) => {
					console.error('Failed to copy to clipboard:', err);
				});
		});

		cell.style.cursor = 'pointer'; // Indicate it's clickable
		return cell;
	}

	// Initialize the grid
	function initializeGrid() {
		const gridOptions = {
			columnDefs,
			defaultColDef: {
				flex: 1,
				minWidth: 150,
				filter: true // Ensure filters are enabled
			},
			rowSelection: 'multiple', // Enable multiple row selection
			pagination: true,
			paginationPageSize: 100,
			onGridReady: (params: { api: GridApi }) => {
				gridApi = params.api; // Capture the grid API
			}
		};

		createGrid(gridDiv, gridOptions); // Initialize grid once
	}

	// Quick Filter logic
	function applyQuickFilter(filterText: string) {
		if (gridApi) {
			gridApi.QuickFilter(filterText);
		}
	}

	// Fetch data from PocketBase
	async function fetchData() {
		try {
			const partsResponse = await pb.collection('parts').getList(1, 150); // Adjust collection name and pagination as needed
			rowData = partsResponse.items.map((item) => ({
				material_no: item.material_no,
				part_desc: item.part_desc,
				last_yr_util: item.last_yr_util,
				retail_price: item.retail_price,
				dealer_price: item.dealer_price,
				distributor_price: item.distributor_price,
				superseded_part: item.superseded_part,
				superseded_by: item.superseded_by,
				interchangable: item.interchangable,
				qty_assembly: item.qty_assembly,
				price_uom: item.price_uom,
				order_unit: item.order_unit,
				in_package_qty: item.in_package_qty,
				in_package_uom: item.in_package_uom
			}));
			if (gridApi) {
				gridApi.applyTransaction({ add: rowData }); // Replace existing data
			}
		} catch (error) {
			console.error('Error fetching data from PocketBase:', error);
		}
	}

	// Initialize grid on mount
	onMount(() => {
		initializeGrid(); // Initialize the grid once
		fetchData(); // Fetch data and update the grid
	});
</script>

<div class="w-full overflow-y-auto">
	<h1 class="mt-4 px-4 text-start text-2xl font-bold">OEM Parts</h1>

	<!-- Quick Filter Input -->
	<div class="m-4">
		<input
			bind:value={quickFilterValue}
			on:input={() => applyQuickFilter(quickFilterValue)}
			class="rounded border p-1"
			style="width: 300px;"
		/>
	</div>

	<div class="box-table m-4">
		<!-- AG-Grid Container -->
		<div class="ag-theme-alpine-dark" style="height: 83vh;" bind:this={gridDiv}></div>
	</div>
</div>

<style>
</style>

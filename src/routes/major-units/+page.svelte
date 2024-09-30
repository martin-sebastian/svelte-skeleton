<script lang="ts">
	import '../../app.css';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { createGrid } from 'ag-grid-community';
	import { onMount } from 'svelte';
	import pb from '$lib/pocketbase';
	pb.autoCancellation(false);

	let gridDiv;
	let gridApi;
	let rowData = [];

	// Column definitions
	let columnDefs = [
		{
			headerCheckboxSelection: true,
			checkboxSelection: true,
			field: '',
			minWidth: 40,
			maxWidth: 50,
			sortable: false,
			filter: false
		},
		{ field: 'title', minWidth: 300, maxWidth: 350, sortable: true, filter: true },
		{ field: 'stockNumber', sortable: true, filter: true, cellRenderer: StockNumberRenderer },
		{ field: 'year', sortable: true, filter: true },
		{ field: 'manufacturer', sortable: true, filter: true },
		{ field: 'model_name', sortable: true, filter: true },
		{ field: 'model_type', sortable: true, filter: true },
		{ field: 'vin', sortable: true, filter: true },
		{ field: 'condition', sortable: true, filter: true },
		{ field: 'usage', sortable: true, filter: true },
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
		}
	];

	// Cell Renderer for Stock Number
	function StockNumberRenderer(params) {
		const cell = document.createElement('div');
		cell.textContent = params.value;

		// Click to copy stock number to clipboard
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
				minWidth: 100,
				filter: true // Ensure filters are enabled
			},
			rowSelection: 'multiple', // Enable multiple row selection
			pagination: true,
			paginationPageSize: 100,
			onGridReady: (params) => {
				gridApi = params.api; // Capture the grid API
				params.api.setQuickFilter(''); // Initial empty filter
			}
		};

		createGrid(gridDiv, gridOptions); // Initialize grid once
	}

	if (gridApi) {
		gridApi.setQuickFilter(filterValue);
	} else {
		console.error('Grid API not ready.');
	}

	function onFilterChange(event) {
		const filterValue = event.target.value;
		gridApi.setQuickFilter(filterValue); // Set quick filter value
	}

	// Fetch data and update the grid
	async function fetchData() {
		try {
			console.log('Fetching data from PocketBase...');
			const vehiclesResponse = await pb.collection('vehicles').getList(1, 1000);

			rowData = vehiclesResponse.items.map((item) => ({
				title: item.title,
				stockNumber: item.stock_number,
				year: item.year,
				manufacturer: item.manufacturer,
				model_name: item.model_name,
				model_type: item.model_type,
				price: item.price,
				vin: item.vin,
				condition: item.condition,
				usage: item.usage
			}));

			if (gridApi) {
				gridApi.applyTransaction({ add: rowData });
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

<div class="h-full w-full overflow-y-hidden">
	<h1 class="mt-4 px-4 text-start text-2xl heading-font-weight">Major Units</h1>
	<div class="box-table m-4">
		<div class="ag-theme-alpine-dark" style="height: 89vh;" bind:this={gridDiv}></div>
	</div>
</div>
<div class="form p-4" style="display: none">
	<label for="filter" class="block text-sm font-medium">Filter:</label>
	<input
		id="filter"
		type="text"
		placeholder="Filter"
		class="w-full rounded border p-2 text-lg text-black"
		on:keyup={onFilterChange}
	/>
</div>

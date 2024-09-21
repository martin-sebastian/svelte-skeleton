<script lang="ts">
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { onMount } from 'svelte';
	import { createGrid } from 'ag-grid-community'; // Import createGrid method
	import pb from '$lib/pocketbase'; // Import PocketBase client

	let gridDiv; // Bind to this div for AG-Grid
	let gridApi; // Store the grid API
	let rowData = []; // Array to hold vehicle data with images

	// Define column structure for AG-Grid
	let columnDefs = [
		{
			headerName: 'Image',
			field: 'imageUrl',
			cellRenderer: (params) => {
				// Render the image in the cell
				return params.value
					? `<img src="${params.value}" alt="Vehicle Image" style="width: 100px; height: auto;">`
					: 'No Image';
			},
			sortable: false,
			filter: false
		},
		{ field: 'title', sortable: true, filter: true },
		{ field: 'year', sortable: true, filter: true },
		{ field: 'make', sortable: true, filter: true },
		{ field: 'model', sortable: true, filter: true },
		{ field: 'price', sortable: true, filter: true }
	];

	// Fetch data from PocketBase
	async function fetchData() {
		try {
			// Fetch vehicles with expanded vehicle_images relation
			const vehicles = await pb.collection('vehicles').getList(1, 150, {
				expand: 'vehicle_images'
			});

			// Process the vehicle data
			rowData = vehicles.items.map((vehicle) => {
				const images = vehicle.expand?.vehicle_images || [];

				// Get the first image URL if available
				const imageUrl =
					images.length > 0
						? `http://127.0.0.1:8090/api/files/${images[0].collectionId}/${images[0].id}/${images[0].image}`
						: null;

				return {
					title: vehicle.title,
					year: vehicle.year,
					make: vehicle.manufacturer,
					model: vehicle.model_name,
					price: vehicle.price,
					imageUrl: imageUrl // Attach image URL to the row data
				};
			});

			initializeGrid(); // Initialize AG-Grid once the data is fetched
		} catch (error) {
			console.error('Error fetching data from PocketBase:', error);
		}
	}

	// Initialize AG-Grid with fetched data using createGrid
	function initializeGrid() {
		const gridOptions = {
			columnDefs,
			rowData,
			defaultColDef: {
				flex: 1,
				minWidth: 100
			}
		};

		// Create the grid using the createGrid method
		gridApi = createGrid(gridDiv, gridOptions);
	}

	// Call fetchData on component mount
	onMount(fetchData);
</script>

<div class="mx-auto w-full">
	<div class="w-full">
		<h1 class="px-4 py-4 text-start text-3xl font-bold">Vehicles Example</h1>
	</div>
	<!-- AG-Grid Container -->
	<div class="ag-theme-alpine-dark w-full px-4" style="height: 100vh;" bind:this={gridDiv}></div>
</div>

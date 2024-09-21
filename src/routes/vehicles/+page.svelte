<script lang="ts">
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';
	import { onMount } from 'svelte';
	import { Grid } from 'ag-grid-community';
	import pb from '$lib/pocketbase'; // Import PocketBase client

	let gridDiv; // Bind to this div for AG-Grid
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
			const vehicles = await pb.collection('vehicles').getList(1, 50, {}, { autoCancel: false }); // Fetch vehicle data

			// Loop through vehicles and fetch associated images
			const vehiclesWithImages = await Promise.all(
				vehicles.items.map(async (vehicle) => {
					// Fetch the first image for each vehicle
					const images = await pb.collection('vehicle_images').getList(
						1,
						1,
						{
							filter: `vehicleid="${vehicle.id}"`,
							sort: 'created' // Fetch the first image by creation date
						},
						{ autoCancel: false }
					); // Disable auto-cancel for this request

					// Construct image URL if available
					const imageUrl =
						images.items.length > 0
							? `http://127.0.0.1:8090/api/files/${images.items[0].collectionId}/${images.items[0].id}/${images.items[0].image}`
							: null;

					// Return the vehicle data along with the first image URL
					return {
						title: vehicle.title,
						year: vehicle.year,
						make: vehicle.manufacturer,
						model: vehicle.model_name,
						price: vehicle.price,
						imageUrl: imageUrl // Attach image URL to the row data
					};
				})
			);

			rowData = vehiclesWithImages; // Assign the data to rowData
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
<div class="ag-theme-alpine" style="height: 90vh; width: 100%;" bind:this={gridDiv}></div>

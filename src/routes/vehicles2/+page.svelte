<script lang="ts">
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';

	import { onMount } from 'svelte';
	import { createGrid } from 'ag-grid-community'; // Use createGrid method
	import pb from '$lib/pocketbase'; // Import PocketBase client

	let gridDiv; // Bind to this div for AG-Grid
	let gridApi; // Store the grid API
	let rowData = []; // Array to hold vehicle data with images
	let selectedVehicleImages = []; // Store images for popup when a vehicle is clicked

	// Define column structure for AG-Grid
	let columnDefs = [
		{
			headerName: 'Image',
			field: 'imageUrl',
			cellRenderer: (params) => {
				// Render the first image in the cell
				return params.value
					? `<img class="m-1 p-0" src="${params.value}" alt="Vehicle Image" style="width: 60px; height: auto; border-radius: 6px;" onclick="openPopup(${params.data.allImages})">`
					: 'No Image';
			},
			sortable: false,
			filter: false
		},
		{ field: 'stockNumber', sortable: true, filter: true },
		{ field: 'title', sortable: true, filter: true },
		{ field: 'year', sortable: true, filter: true },
		{ field: 'make', sortable: true, filter: true },
		{ field: 'model', sortable: true, filter: true },
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
			console.log('Fetching vehicles with images from PocketBase...');

			// Fetch vehicles with expanded vehicle_images relation
			const vehicles = await pb.collection('vehicles').getList(1, 350, {
				expand: 'vehicle_images' // Expand all related images
			});

			console.log('Fetched vehicles:', vehicles); // Log the fetched data

			// Process the vehicle data
			rowData = vehicles.items.map((vehicle) => {
				const images = vehicle.expand?.vehicle_images || [];

				// Log the images for each vehicle
				console.log(`Images for vehicle ${vehicle.title}:`, images);

				// Get the first image URL from the CDN and all images
				const imageUrl = images.length > 0 ? images[0].imageurl : null;

				// Log the first image URL
				console.log(`First image URL for vehicle ${vehicle.title}:`, imageUrl);

				const allImages = images.map((img) => ({
					url: img.imageurl // Use the full URL from the database
				}));

				// Log all image URLs for the vehicle
				console.log(`All images for vehicle ${vehicle.title}:`, allImages);

				return {
					stockNumber: vehicle.stock_number,
					title: vehicle.title,
					year: vehicle.year,
					make: vehicle.manufacturer,
					model: vehicle.model_name,
					price: vehicle.price,
					imageUrl: imageUrl, // Attach first image URL to the row data
					allImages: allImages // Attach all images for the popup
				};
			});

			console.log('Processed rowData for AG-Grid:', rowData); // Log the processed rowData

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

		console.log('Initializing AG-Grid with gridOptions:', gridOptions);

		// Create the grid using the createGrid method
		gridApi = createGrid(gridDiv, gridOptions);
	}

	// Open popup with all images
	function openPopup(images) {
		selectedVehicleImages = images;
		console.log('Opening popup with images:', images);
		// Code to show the popup
	}

	// Call fetchData on component mount
	onMount(fetchData);
</script>

<div class="w-full overflow-y-auto">
	<h1 class="mt-5 px-5 text-start text-3xl heading-font-weight">Vehicle Inventory</h1>
	<div class="mx-auto">
		<div class="card m-5 preset-filled-surface-100-900">
			<!-- AG-Grid Container -->
			<div
				class="ag-theme-alpine-dark"
				style="height: 90vh; width: 100%;"
				bind:this={gridDiv}
			></div>
		</div>
	</div>
</div>
<!-- Popup for displaying all images -->
<div id="image-popup" style="display:none;">
	{#if selectedVehicleImages.length > 0}
		{#each selectedVehicleImages as image}
			<img src={image.url} alt="Vehicle Image" style="width: 200px; height: auto;" />
		{/each}
	{/if}
</div>

<style>
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-content {
		background-color: #fff;
		padding: 1em;
		border-radius: 6px;
		max-width: 80%;
		max-height: 80%;
		overflow-y: auto;
	}

	.close-button {
		float: right;
		background: none;
		border: none;
		font-size: 1.5em;
		cursor: pointer;
	}
</style>

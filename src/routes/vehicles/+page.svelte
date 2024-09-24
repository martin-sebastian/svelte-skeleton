<script lang="ts">
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';

	import { onMount } from 'svelte';
	import { createGrid } from 'ag-grid-community';

	import pb from '$lib/pocketbase';

	let gridDiv;
	let gridApi;
	let rowData = [];
	let selectedVehicleImages = [];
	let showPopup = false;

	let columnDefs = [
		{
			headerName: 'Image',
			field: 'imageUrl',
			cellRenderer: (params) => {
				const img = document.createElement('img');
				img.src = params.value;
				img.alt = 'Vehicle Image';
				img.style.width = '60px';
				img.style.height = 'auto';
				img.style.borderRadius = '6px';
				img.style.cursor = 'pointer';
				img.tabIndex = 0;

				img.addEventListener('click', () => {
					openPopup(params.data.allImages);
				});

				img.addEventListener('keydown', (event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						openPopup(params.data.allImages);
					}
				});

				return img;
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

	async function fetchData() {
		try {
			console.log('Fetching vehicles with images from PocketBase...');

			// Fetch vehicles with expanded vehicle_images relation
			const vehicles = await pb.collection('vehicles').getList(1, 50, {
				expand: 'vehicle_images' // Expand all related images
			});

			console.log('Fetched vehicles:', vehicles); // Log the fetched data

			// Process the vehicle data
			rowData = vehicles.items.map((vehicle) => {
				const images = vehicle.expand?.vehicle_images || [];

				// Get the first image URL and all images
				const imageUrl = images.length > 0 ? images[0].imageurl : null;

				const allImages = images.map((img) => ({
					url: img.imageurl // Use the full URL from the database
				}));

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

			initializeGrid();
		} catch (error) {
			console.error('Error fetching data from PocketBase:', error);
		}
	}

	function initializeGrid() {
		const gridOptions = {
			columnDefs,
			rowData,
			defaultColDef: {
				flex: 1,
				minWidth: 100
			},
			onGridReady: (params) => {
				gridApi = params.api;
			}
		};

		gridApi = createGrid(gridDiv, gridOptions);
	}

	function openPopup(images) {
		selectedVehicleImages = images;
		showPopup = true;
		console.log('Opening popup with images:', images);
	}

	function closePopup() {
		showPopup = false;
	}

	onMount(fetchData);
</script>

<div class="w-full overflow-y-auto">
	<h1 class="mt-4 px-4 text-start text-3xl heading-font-weight">Vehicle Inventory</h1>

	<div class="card m-4 preset-filled-surface-100-900">
		<!-- AG-Grid Container -->
		<div class="ag-theme-alpine-dark" style="height: 90vh; width: 100%;" bind:this={gridDiv}></div>
	</div>

	<!-- Popup for displaying all images -->
	{#if showPopup}
		<div id="image-popup" class="z-10 h-screen object-left-top preset-filled-surface-100-900">
			<button class="close-button" on:click={closePopup}>×</button>
			<div class="vehicle-images">
				{#each selectedVehicleImages as image}
					<header>
						<img src={image.url} alt="Vehicle Photograph" class="w-48" />
					</header>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.close-button {
		float: right;
		color: red;
		background: none;
		border: none;
		font-size: 3.5em;
		cursor: pointer;
	}
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

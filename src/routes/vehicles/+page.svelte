<script lang="ts">
	import pb from '$lib/pocketbase';
	import { onDestroy } from 'svelte';
	import '../../app.css';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css'; // or 'ag-theme-alpine-dark.css' for dark mode

	import { onMount } from 'svelte';
	import { createGrid } from 'ag-grid-community';

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
				img.style.margin = '5px';
				img.style.width = '50px';
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
			rowData: rowData, // Ensure rowData is passed here
			defaultColDef: {
				flex: 1,
				minWidth: 100
			},
			onGridReady: (params) => {
				gridApi = params.api;
				gridApi.setRowData(rowData); // Ensure data is set when grid is ready
			}
		};

		// Initialize the grid after rowData is fetched
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

	onMount(() => {
		fetchData(); // Fetch data when the page is mounted
	});

	onDestroy(() => {
		if (gridApi) {
			gridApi.destroy(); // Clean up AG-Grid when navigating away from this page
		}
	});
</script>

<div class="w-full overflow-y-hidden">
	<h1 class="mt-4 px-4 text-start text-2xl heading-font-weight">Vehicle Inventory</h1>

	<div class="box-table m-4">
		<!-- AG-Grid Container -->
		<div class="ag-theme-alpine-dark" style="height: 89vh; width: 100%;" bind:this={gridDiv}></div>
	</div>

	<!-- Popup for displaying all images -->
	{#if showPopup}
		<div id="image-popup" class="w-full">
			<div class="py-4">
				<div class="grid grid-cols-12 gap-4 px-5">
					<div class="col-span-11 rounded bg-primary-600 py-2 ps-5 heading-font-weight">
						<span class="text-2xl">325</span> IMAGES
					</div>
					<div class="col-span-1 rounded bg-primary-600 text-center heading-font-weight">
						<button type="button" class="btn w-full bg-primary-600 p-6" on:click={closePopup}>
							<span class="text-1xl">CLOSE</span>
						</button>
					</div>
				</div>
			</div>
			<div class="grid grid-cols-8 gap-4 px-5">
				{#each selectedVehicleImages as image}
					<div class="card card-hover w-full overflow-hidden">
						<header>
							<img src={image.url} class="object-cover" alt={image.title} />
						</header>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	#image-popup {
		position: fixed;
		top: 0;
		left: 0;
		overflow-y: auto;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		background-color: rgba(0, 0, 0, 0.95);
		z-index: 1000;
	}
</style>

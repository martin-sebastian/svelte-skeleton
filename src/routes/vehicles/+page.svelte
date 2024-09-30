<script lang="ts">
	import pb from '$lib/pocketbase';
	import { onDestroy } from 'svelte';
	import '../../app.css';
	import 'ag-grid-community/styles/ag-grid.css';
	import 'ag-grid-community/styles/ag-theme-alpine.css';

	import { onMount } from 'svelte';
	import { createGrid } from 'ag-grid-community';
	import { id } from 'date-fns/locale';

	let gridDiv;
	let gridApi;
	let rowData = [];
	let selectedVehicleImages = [];
	let showPopup = false;

	// Function to generate thumbnail URL
	function generateThumbnailUrl(imageUrl) {
		const baseThumbnailUrl = 'https://cdnmedia.endeavorsuite.com/images/ThumbGenerator/Thumb.aspx';
		const params = `?img=${encodeURIComponent(imageUrl)}&mw=300&mh=197`;
		return baseThumbnailUrl + params;
	}

	let columnDefs = [
		{
			headerName: 'Images',
			field: 'allImages',
			cellRenderer: (params) => {
				const container = document.createElement('div');
				container.style.display = 'flex'; // Use flexbox to display images horizontally
				container.style.gap = '5px'; // Add spacing between images

				// Loop through all images and render them next to each other as thumbnails
				params.value.forEach((imgData) => {
					const img = document.createElement('img');
					img.src = generateThumbnailUrl(imgData.url); // Generate thumbnail URL
					img.alt = 'Vehicle Image';
					img.style.width = '50px';
					img.style.height = 'auto';
					img.style.borderRadius = '6px';
					img.style.cursor = 'pointer';
					img.tabIndex = 0;
					img.loading = 'lazy'; // Enable lazy loading

					// Add click event to open full-size images in popup
					img.addEventListener('click', () => {
						openPopup(params.data.allImages); // All images are passed, including full size
					});

					// Add keyboard event to open popup on enter/space key
					img.addEventListener('keydown', (event) => {
						if (event.key === 'Enter' || event.key === ' ') {
							openPopup(params.data.allImages);
						}
					});

					// Append each image to the container
					container.appendChild(img);
				});

				return container;
			},
			sortable: false,
			filter: false
		},
		{
			field: 'stockNumber',
			sortable: true,
			filter: true,
			cellRenderer: (params) => {
				// Dynamically create the link using the vehicle's id and stock number
				return `<a class="btn w-full btn-sm bg-gray-700 hover:bg-blue-900" href="/vehicles/${params.data.id}" class="btn">${params.value}</a>`;
				console.log('params:', params);
			}
		},
		{ field: 'title', sortable: true, filter: true },
		{ field: 'year', sortable: true, filter: true },
		{ field: 'make', sortable: true, filter: true },
		{ field: 'model', sortable: true, filter: true },
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

	async function fetchData() {
		try {
			console.log('Fetching vehicles with images from PocketBase...');

			// Fetch vehicles with expanded vehicle_images relation
			const vehicles = await pb.collection('vehicles').getList(1, 50, {
				expand: 'vehicle_images'
			});

			console.log('Fetched vehicles:', vehicles);

			// Process the vehicle data
			rowData = vehicles.items.map((vehicle) => {
				const images = vehicle.expand?.vehicle_images || [];

				// Get all image URLs (thumbnails and full-size)
				const allImages = images.map((img) => ({
					url: img.imageurl // Use the full-size image URL
				}));

				return {
					id: vehicle.id,
					stockNumber: vehicle.stock_number,
					title: vehicle.title,
					year: vehicle.year,
					make: vehicle.manufacturer,
					model: vehicle.model_name,
					price: vehicle.price,
					allImages: allImages // Attach all images for the row
				};
			});

			console.log('Processed rowData for AG-Grid:', rowData);

			initializeGrid();
		} catch (error) {
			console.error('Error fetching data from PocketBase:', error);
		}
	}

	function initializeGrid() {
		const gridOptions = {
			columnDefs,
			rowData: rowData,
			defaultColDef: {
				flex: 1,
				minWidth: 100
			},
			onGridReady: (params) => {
				gridApi = params.api;
				gridApi.setRowData(rowData);
			}
		};

		// Initialize the grid after rowData is fetched
		gridApi = createGrid(gridDiv, gridOptions);
	}

	function openPopup(images) {
		selectedVehicleImages = images.map((image) => image.url); // Use full-size images in popup
		showPopup = true;
		console.log('Opening popup with images:', selectedVehicleImages);
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
						<span class="text-2xl">{selectedVehicleImages.length}</span> IMAGES
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
							<img src={image} class="object-cover" alt="Vehicle Product" />
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

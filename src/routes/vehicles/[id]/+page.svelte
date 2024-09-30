<script lang="ts">
	// The `data` object contains the data returned by `+page.ts`
	export let data;

	// Extract the vehicle object from the data
	let vehicle = data.vehicle;
</script>

{#if vehicle}
	<div class="h-scren w-full overflow-x-hidden">
		<div class="vehicle-detail-container container mx-4 py-4">
			<h1 class="mb-4 text-2xl font-bold">{vehicle.title}</h1>
			<div class="vehicle-images overflow-x-scroll py-2">
				{#each vehicle.expand?.vehicle_images as image}
					<img src={image.imageurl} alt={vehicle.title} class="vehicle-image" />
				{/each}
			</div>
			<div class="vehicle-info">
				<p><strong>Stock Number:</strong> {vehicle.stock_number}</p>
				<p><strong>Year:</strong> {vehicle.year}</p>
				<p><strong>Make:</strong> {vehicle.manufacturer}</p>
				<p><strong>Model:</strong> {vehicle.model_name}</p>
				<p><strong>Price:</strong> {vehicle.price}</p>
				<p><strong>Price Type:</strong> {vehicle.price_type}</p>
				<p><strong>stock number:</strong> {vehicle.stock_number}</p>
				<p><strong>vin:</strong> {vehicle.vin}</p>
				<p><strong>vin:</strong> {vehicle.model_type}</p>
				<p><strong>vin:</strong> {vehicle.model_typestyle}</p>
				<p><strong>vin:</strong> {vehicle.color}</p>
				<p><strong>vin:</strong> {vehicle.trim_name}</p>
				<p><strong>vin:</strong> {vehicle.trim_color}</p>
				<p><strong>vin:</strong> {vehicle.condition}</p>
				<p><strong>vin:</strong> {vehicle.usage}</p>
				<p><strong>vin:</strong> {vehicle.location}</p>
				<p><strong>Changed on Website:</strong> {vehicle.date_updated}</p>
				<p><strong>Changed on Website:</strong> {vehicle.metric_type}</p>
				<p><strong>Changed on Website:</strong> {vehicle.metric_value}</p>
				<p><strong>Changed on Website:</strong> {vehicle.metric_value}</p>
			</div>
		</div>
	</div>
{:else}
	<p>Vehicle not found.</p>
{/if}

<style>
	.vehicle-detail-container {
		padding: 0rem;
	}

	.vehicle-images {
		display: flex;
		gap: 10px;
	}

	.vehicle-image {
		width: 200px;
		height: auto;
		object-fit: cover;
		border-radius: 6px;
	}

	.vehicle-info {
		margin-top: 1rem;
		font-size: 1.2rem;
	}
</style>

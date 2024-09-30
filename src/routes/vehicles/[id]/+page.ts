import type { PageLoad } from './$types';
import pb from '$lib/pocketbase';

export const load: PageLoad = async ({ params }) => {
	const { id } = params;

	try {
		// Fetch the specific vehicle from PocketBase using its id
		const vehicle = await pb.collection('vehicles').getOne(id, {
			expand: 'vehicle_images' // Expand related vehicle_images if necessary
		});

		return { vehicle }; // Return the vehicle details to the page
	} catch (error) {
		console.error('Error fetching vehicle details:', error);
		return { error: 'Vehicle not found' };
	}
};

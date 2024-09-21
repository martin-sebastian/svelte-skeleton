import { redirect } from '@sveltejs/kit';
import pb from '$lib/pocketbase'; // Import PocketBase

export async function load() {
	// Check if the user is authenticated
	if (!pb.authStore.isValid) {
		// If not authenticated, redirect to login page
		throw redirect(302, '/login');
	}

	// If authenticated, return any necessary data for the protected page
	return {
		user: pb.authStore.model
	};
}

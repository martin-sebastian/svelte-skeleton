import { redirect } from '@sveltejs/kit';
import pb from '$lib/pocketbase'; // Import PocketBase client

export async function load() {
	// Check if the user is authenticated
	if (!pb.authStore.isValid) {
		throw redirect(302, '/login'); // Redirect to login if not authenticated
	}

	// Fetch user data (name, avatar, email) from the authenticated user's model
	const user = pb.authStore.model;

	return {
		user // Pass user data to the Svelte page
	};
}

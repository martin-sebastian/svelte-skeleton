import { redirect } from '@sveltejs/kit';
import pb from '$lib/pocketbase'; // Import PocketBase

export async function load({ url }) {
	const user = pb.authStore.model; // Get the authenticated user
	const currentPath = url.pathname; // Get the current path

	// If the user is not logged in and is not already on the login page, redirect them to the login page
	if (!user && currentPath !== '/login') {
		throw redirect(302, '/login');
	}

	// If logged in, pass user data to the layout
	return {
		user
	};
}

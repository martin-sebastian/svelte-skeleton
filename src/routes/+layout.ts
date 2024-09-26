import { redirect } from '@sveltejs/kit';
import pb from '$lib/pocketbase'; // Import PocketBase

export async function load({ url }) {
	const user = pb.authStore.model; // Get the authenticated user
	const currentPath = url.pathname; // Get the current path

	// List of unprotected routes that don't require authentication
	const publicRoutes = ['/login', '/register', '/forgot-password'];

	// If the user is not logged in and the route is not public, redirect to login
	if (!user && !publicRoutes.includes(currentPath)) {
		throw redirect(302, '/login');
	}

	// If logged in, pass user data to the layout
	return {
		user
	};
}

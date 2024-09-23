// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const pb = locals.pb; // Use PocketBase instance from locals
	const user = pb.authStore.model; // Get the authenticated user
	let currentPath = url.pathname;

	// Normalize the path to remove trailing slash (except for root '/')
	if (currentPath !== '/' && currentPath.endsWith('/')) {
		currentPath = currentPath.slice(0, -1);
	}

	// Define routes that don't require authentication
	const publicRoutes = ['/login', '/register', '/forgot-password'];

	// Redirect logic
	if (!user && !publicRoutes.includes(currentPath)) {
		throw redirect(302, '/login');
	}

	if (user && publicRoutes.includes(currentPath)) {
		throw redirect(302, '/');
	}

	// Pass user data to the client
	return {
		user
	};
};

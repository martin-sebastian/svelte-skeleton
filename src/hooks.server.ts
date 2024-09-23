// src/hooks.server.ts
import PocketBase from 'pocketbase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL

	// Load the authStore data from the cookies
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	// Optionally verify and refresh the authStore
	try {
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
		}
	} catch (_) {
		// Clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	// Proceed to the next handle or route
	const response = await resolve(event);

	// Set the authStore cookie in the response headers
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: false }));

	return response;
};

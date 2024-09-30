<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation'; // SvelteKit's navigation helper
	import pb from '$lib/pocketbase'; // Import PocketBase client
	// Icons
	import ShieldPlus from 'lucide-svelte/icons/shield-plus';

	let email = '';
	let password = '';
	let errorMessage = ''; // To display any error messages

	// Function to log in the user
	async function login() {
		try {
			// Attempt to authenticate with PocketBase using email and password
			const authData = await pb.collection('users').authWithPassword(email, password);

			// Log the authentication response to verify it's working
			console.log('Authenticated:', authData);

			// Redirect the user to the home page
			goto('/');
		} catch (error) {
			// If login fails, show an error message
			errorMessage = 'Login failed. Please check your credentials.';
			console.error('Login error:', error);
		}
	}

	// Redirect to dashboard if the user is already authenticated
	onMount(() => {
		if (pb.authStore.isValid) {
			goto('/');
		}
	});

	console.log('Login page loaded'); // Debugging
</script>

<div class="flex h-screen w-full items-center justify-center bg-gradient-to-r">
	<div class="card w-1/4 p-10 shadow-lg preset-filled-surface-100-900">
		<ShieldPlus size={96} color="#3B82F6" class="mx-auto mb-5" />
		<h1 class="text-1xl mb-4 text-center font-bold">DealerOps Login</h1>
		<form on:submit|preventDefault={login} class="space-y-4">
			<!-- Email Input -->
			<div>
				<label for="email" class="block text-sm font-medium opacity-60">Email:</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="Enter your email"
					class="w-full rounded border p-2 text-lg text-black"
					autocomplete="email"
				/>
			</div>

			<!-- Password Input -->
			<div>
				<label for="password" class="block text-sm font-medium opacity-60">Password:</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					placeholder="Enter your password"
					class="w-full rounded border p-2 text-lg text-black"
					autocomplete="current-password"
				/>
			</div>

			<!-- Error Message -->
			{#if errorMessage}
				<p class="text-red-500">{errorMessage}</p>
			{/if}
			<div class="pt-3">
				<!-- Login Button -->
				<button
					type="submit"
					class="w-full rounded bg-blue-500 px-4 py-3 text-white heading-font-weight hover:bg-blue-700"
				>
					LOGIN
				</button>
			</div>
		</form>
		<a href="/register" class="mt-4 block text-center text-blue-500 hover:underline">
			Don't have an account? Register here.</a
		>
		<a href="/forgot-password" class="mt-4 block text-center text-blue-500 hover:underline">
			Forgot your password? Reset it here.
		</a>
	</div>
</div>

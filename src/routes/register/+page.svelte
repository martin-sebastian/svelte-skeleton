<script lang="ts">
	import { goto } from '$app/navigation';
	import PocketBase from 'pocketbase';
	import { writable } from 'svelte/store';

	const pb = new PocketBase('http://127.0.0.1:8090'); // Adjust to your PocketBase URL

	let email = '';
	let password = '';
	let passwordConfirm = '';
	let errorMessage = '';
	let successMessage = '';

	// Create user in PocketBase
	async function registerUser() {
		// Clear messages before starting registration
		errorMessage = '';
		successMessage = '';

		// Validate passwords match
		if (password !== passwordConfirm) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		try {
			// PocketBase user registration
			const response = await pb.collection('users').create({
				email: email,
				password: password,
				passwordConfirm: passwordConfirm
			});

			successMessage = 'Registration successful! Redirecting to login...';

			// Redirect to login page after 2 seconds
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (error) {
			// Handle any error that occurs during registration
			errorMessage = error.message || 'An error occurred during registration.';
		}
	}
	// Redirect to dashboard if the user is already authenticated
	onMount(() => {
		if (pb.authStore.isValid) {
			goto('/dashboard');
		}
	});
</script>

<div class="container mx-auto mt-10 max-w-md p-4">
	<h1 class="mb-4 text-2xl font-bold">Register</h1>

	<!-- Show error message if registration fails -->
	{#if errorMessage}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{errorMessage}
		</div>
	{/if}

	<!-- Show success message when registration is successful -->
	{#if successMessage}
		<div class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
			{successMessage}
		</div>
	{/if}

	<!-- Registration Form -->
	<form on:submit|preventDefault={registerUser}>
		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="email">Email</label>
			<input
				id="email"
				type="email"
				bind:value={email}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				required
			/>
		</div>

		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="password">Password</label>
			<input
				id="password"
				type="password"
				bind:value={password}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				required
			/>
		</div>

		<div class="mb-4">
			<label class="mb-2 block text-sm font-bold text-gray-700" for="passwordConfirm"
				>Confirm Password</label
			>
			<input
				id="passwordConfirm"
				type="password"
				bind:value={passwordConfirm}
				class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
				required
			/>
		</div>

		<div class="flex items-center justify-between">
			<button
				type="submit"
				class="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
			>
				Register
			</button>
		</div>
	</form>
</div>

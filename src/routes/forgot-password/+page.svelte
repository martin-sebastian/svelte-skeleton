<script lang="ts">
	import { goto } from '$app/navigation';
	import pb from '$lib/pocketbase'; // Reuse the PocketBase client

	let email = '';
	let successMessage = '';
	let errorMessage = '';

	// Function to handle the password reset request
	async function resetPassword() {
		// Clear previous messages
		successMessage = '';
		errorMessage = '';

		try {
			// Call PocketBase's password recovery function
			await pb.collection('users').requestPasswordReset(email);

			// Display success message and redirect to login
			successMessage = 'Password reset instructions have been sent to your email.';
			setTimeout(() => {
				goto('/login');
			}, 3000);
		} catch (error) {
			// Handle error and display a message
			errorMessage = 'Failed to send reset instructions. Please check the email and try again.';
			console.error('Password reset error:', error);
		}
	}
</script>

<div class="flex h-screen w-full items-center justify-center bg-gradient-to-r">
	<div class="card w-1/4 p-10 shadow-lg preset-filled-surface-100-900">
		<div class="container mx-auto mt-10 max-w-md p-4">
			<h1 class="mb-4 text-2xl font-bold">Forgot Password</h1>

			<!-- Show error message if reset fails -->
			{#if errorMessage}
				<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					{errorMessage}
				</div>
			{/if}

			<!-- Show success message when reset instructions are sent -->
			{#if successMessage}
				<div class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
					{successMessage}
				</div>
			{/if}

			<!-- Forgot Password Form -->
			<form on:submit|preventDefault={resetPassword}>
				<label for="email" class="mb-2 block text-sm font-bold text-gray-700">Email:</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					class="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
					placeholder="Enter your email"
					required
				/>

				<button
					type="submit"
					class="focus:shadow-outline mt-4 w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				>
					Send Reset Instructions
				</button>
				<a
					href="/login"
					type="button"
					class="focus:shadow-outline mt-5 block w-full rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
				>
					Cancel
				</a>
			</form>
		</div>
	</div>
</div>

<style>
	.container {
		text-align: center;
	}
	input {
		margin-bottom: 1rem;
	}
	button {
		margin-top: 1rem;
	}
</style>

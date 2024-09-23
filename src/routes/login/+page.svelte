<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import pb from '$lib/pocketbase';

	let email = '';
	let password = '';
	let errorMessage = '';

	async function login() {
		try {
			await pb.collection('users').authWithPassword(email, password);
			goto('/');
		} catch (error) {
			errorMessage = 'Login failed. Please check your credentials.';
		}
	}
</script>

<div class="from-black-500 flex h-screen items-center justify-center bg-gradient-to-r">
	<div class="card w-96 p-10 shadow-lg preset-filled-surface-100-900">
		<h1 class="mb-6 text-2xl font-bold">Login</h1>
		<form on:submit|preventDefault={login} class="space-y-4">
			<!-- Email Input -->
			<div>
				<label for="email" class="block text-sm font-medium">Email:</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="Enter your email"
					class="w-full rounded border p-2"
					autocomplete="email"
				/>
			</div>

			<!-- Password Input -->
			<div>
				<label for="password" class="block text-sm font-medium">Password:</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					placeholder="Enter your password"
					class="w-full rounded border p-2"
					autocomplete="current-password"
				/>
			</div>

			<!-- Error Message -->
			{#if errorMessage}
				<p class="text-red-500">{errorMessage}</p>
			{/if}

			<!-- Login Button -->
			<button
				type="submit"
				class="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
			>
				Log In
			</button>
		</form>
	</div>
</div>

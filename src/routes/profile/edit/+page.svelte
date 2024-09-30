<script lang="ts">
	import { onMount } from 'svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import IconUpload from 'lucide-svelte/icons/upload';
	import pb from '$lib/pocketbase'; // Import the PocketBase client
	import { goto } from '$app/navigation';

	// Declare variables to hold form data
	let name = '';
	let email = '';
	let avatarFile = null;
	let successMessage = '';
	let errorMessage = '';

	// Fetch the current user's data on page load
	onMount(async () => {
		if (!pb.authStore.isValid) {
			// Redirect to login if not authenticated
			goto('/login');
		} else {
			// Get the current authenticated user's data
			const user = pb.authStore.model;
			name = user.name || '';
			email = user.email || '';
		}
	});

	// Handle file upload change event
	function handleFileChange(fileList) {
		if (fileList && fileList.length > 0) {
			avatarFile = fileList[0]; // Capture the selected file
		}
	}

	// Handle profile update
	async function updateProfile() {
		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('email', email);

			if (avatarFile) {
				formData.append('avatar', avatarFile); // Append avatar file if present
			}

			// Update user data in PocketBase
			const updatedUser = await pb.collection('users').update(pb.authStore.model.id, formData);

			// Display success message
			successMessage = 'Profile updated successfully!';
		} catch (error) {
			errorMessage = error.message || 'An error occurred while updating the profile.';
		}
	}
</script>

<div class="flex h-screen w-full items-center justify-center bg-gradient-to-r">
	<div class="user-profile card w-1/4 p-10 shadow-lg preset-filled-surface-100-900">
		<h1 class="text-1xl mb-4 text-center font-bold">Edit Profile</h1>
		<form on:submit|preventDefault={updateProfile} class="space-y-4">
			<div>
				<!-- Avatar File Upload -->
				<FileUpload class="w-full" accept="image/*" onFileChange={handleFileChange} maxFiles={1}>
					<button class="btn w-full preset-filled">
						<IconUpload class="size-4" />
						<span>Select Avatar</span>
					</button>
				</FileUpload>
			</div>
			<div>
				<!-- Input for Name -->
				<label for="name">Name:</label>
				<input type="text" bind:value={name} placeholder="Enter your name" />
			</div>
			<div>
				<!-- Input for Email -->
				<label for="email">Email:</label>
				<input type="email" bind:value={email} placeholder="Enter your email" />
			</div>
			<div>
				<!-- Submit Button -->
				<button type="submit">Save Changes</button>
			</div>

			<!-- Success and Error Messages -->
			{#if successMessage}
				<p class="success-message">{successMessage}</p>
			{/if}
			{#if errorMessage}
				<p class="error-message">{errorMessage}</p>
			{/if}
		</form>
	</div>
</div>

<style>
	.user-profile {
		text-align: center;
		margin-top: 2rem;
		display: block;
	}
	input {
		margin-bottom: 1rem;
		color: #111;
	}
	button {
		display: inline-block;
		margin-top: 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
	button:hover {
		background-color: #0056b3;
	}
	.success-message {
		color: green;
		margin-top: 1rem;
	}
	.error-message {
		color: red;
		margin-top: 1rem;
	}
</style>

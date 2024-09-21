<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton-svelte'; // Import Skeleton Avatar component
	import Skull from 'lucide-svelte/icons/skull'; // Fallback icon if no avatar image is available

	export let data; // Get the user data passed from +page.ts

	// Construct the avatar URL from PocketBase
	const avatarUrl = data.user.avatar
		? `http://127.0.0.1:8090/api/files/${data.user.collectionId}/${data.user.id}/${data.user.avatar}`
		: null;

	console.log('Avatar URL:', avatarUrl); // Log for debugging
</script>

<div class="user-profile">
	<h1>Welcome, {data.user.name}!</h1>

	<!-- Use Skeleton's Avatar component -->
	{#if avatarUrl}
		<Avatar src={avatarUrl} name={data.user.name} />
	{:else}
		<!-- If no avatar, show a fallback with an icon (Skull icon in this case) -->
		<Avatar name={data.user.name} background="preset-filled-primary-500">
			<Skull size={24} />
		</Avatar>
	{/if}

	<!-- Display user's name and email -->
	<p><strong>Name:</strong> {data.user.name}</p>
	<p><strong>Email:</strong> {data.user.email}</p>
</div>

<style>
	.user-profile {
		text-align: center;
		margin-top: 2rem;
	}
</style>

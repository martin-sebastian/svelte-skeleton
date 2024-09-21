<script lang="ts">
	export let data; // Get the user data from +page.ts

	// Build the avatar URL using the correct avatar field
	const avatarUrl = data.user.avatar
		? `http://127.0.0.1:8090/api/files/${data.user.collectionId}/${data.user.id}/${data.user.avatar}`
		: null;

	console.log('Avatar URL:', avatarUrl); // Log avatar URL for debugging
</script>

<div class="container">
	<div class="user-profile">
		<h1>Welcome, {data.user.name}!</h1>

		{#if avatarUrl}
			<div class="avatar-container">
				<!-- Display the user's avatar -->
				<img src={avatarUrl} alt="User Avatar" class="avatar mx-auto" width="150" height="150" />
			</div>
		{/if}

		<!-- Display user's name and email -->
		<p><strong>Name:</strong> {data.user.name}</p>
		<p><strong>Email:</strong> {data.user.email}</p>
	</div>
</div>

<style>
	.user-profile {
		text-align: center;
		margin-top: 2rem;
	}
	.avatar {
		border-radius: 50%;
		margin-bottom: 1rem;
	}
</style>

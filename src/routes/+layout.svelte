<script lang="ts">
	export let data; // Get the user data passed from the load function
	import '../app.css';
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import pb from '$lib/pocketbase'; // Import PocketBase client

	// Icons
	import IconMenu from 'lucide-svelte/icons/menu';
	import IconBike from 'lucide-svelte/icons/bike';
	import IconFolder from 'lucide-svelte/icons/folder';
	import IconImage from 'lucide-svelte/icons/image';
	import IconVideo from 'lucide-svelte/icons/video';
	import IconLogin from 'lucide-svelte/icons/circle-user-round';
	import IconLogout from 'lucide-svelte/icons/log-out';
	import IconSettings from 'lucide-svelte/icons/settings';

	let hrefHome = '/';
	let hrefVehicles = '/vehicles';
	let hrefParts = '/parts';
	let hrefVideos = '/user';
	let hrefLogin = '/login';
	let hrefSettings = '/settings';

	import { writable } from 'svelte/store';
	let isExpanded = writable(false);

	function toggleNav() {
		isExpanded.update((value) => !value);
		console.log($isExpanded); // Check if the value is changing
	}

	// Logout function
	function logout() {
		pb.authStore.clear();
		window.location.href = '/login'; // Redirect after logout
	}
</script>

<div class="card grid h-[100vh] w-full grid-cols-[auto_1fr] border-[1px] border-surface-100-900">
	<!-- Navigation Rail -->
	<Nav.Rail expanded={$isExpanded}>
		{#snippet header()}
			<Nav.Tile title="Menu" labelExpanded="">
				<button on:click={toggleNav}> <IconMenu /> </button>
			</Nav.Tile>
		{/snippet}
		{#snippet tiles()}
			<Nav.Tile id="0" labelExpanded="Home" href={hrefHome}>
				<IconBike />
			</Nav.Tile>
			<Nav.Tile id="1" labelExpanded="Vehicles" href={hrefVehicles}>
				<IconFolder />
			</Nav.Tile>
			<Nav.Tile id="2" labelExpanded="Parts" href={hrefParts}>
				<IconImage />
			</Nav.Tile>
			<Nav.Tile id="3" labelExpanded="Videos" href={hrefVideos}>
				<IconVideo />
			</Nav.Tile>
		{/snippet}
		{#snippet footer()}
			<!-- Conditionally render the login/logout option based on whether the user is logged in -->
			{#if data.user}
				<Nav.Tile id="4" labelExpanded="Logout">
					<button on:click={logout}><IconLogout /></button>
				</Nav.Tile>
			{:else}
				<Nav.Tile id="5" labelExpanded="Login" href={hrefLogin}>
					<IconLogin />
				</Nav.Tile>
			{/if}
			<Nav.Tile id="6" labelExpanded="Settings" href={hrefSettings}>
				<IconSettings />
			</Nav.Tile>
		{/snippet}
	</Nav.Rail>

	<!-- Page content -->
	<slot></slot>
</div>

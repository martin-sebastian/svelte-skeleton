<script lang="ts">
	// Get the user data passed from the load function
	export let data;

	import { page } from '$app/stores'; // Import $page store to track URL
	import '../app.css';
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import { Avatar } from '@skeletonlabs/skeleton-svelte'; // Import Skeleton Avatar component
	import pb from '$lib/pocketbase'; // Import PocketBase client
	import { writable } from 'svelte/store';

	// Icons
	import Skull from 'lucide-svelte/icons/skull';
	import IconMenu from 'lucide-svelte/icons/menu';
	import IconDashboard from 'lucide-svelte/icons/layout-dashboard';
	import IconTable from 'lucide-svelte/icons/table';
	import IconSearch from 'lucide-svelte/icons/text-search';
	import IconBarcode from 'lucide-svelte/icons/barcode';
	import IconWrench from 'lucide-svelte/icons/wrench';
	import IconSync from 'lucide-svelte/icons/database-zap';
	import IconLogin from 'lucide-svelte/icons/key-square';
	import IconLogout from 'lucide-svelte/icons/log-out';
	import IconSettings from 'lucide-svelte/icons/settings';
	import IconProfile from 'lucide-svelte/icons/square-user-round';

	let hrefHome = '/';
	let hrefVehicles = '/vehicles';
	let hrefParts = '/parts';
	let hrefService = '/service';
	let hrefImport = '/import';
	let hrefMajorUnits = '/major-units';
	let hrefLogin = '/login';
	let hrefSettings = '/settings';
	let hrefProfile = '/profile';

	let isExpanded = writable(false);

	// Construct the avatar URL from PocketBase if the avatar exists
	const avatarUrl = data?.user?.avatar
		? `http://127.0.0.1:8090/api/files/${data.user.collectionId}/${data.user.id}/${data.user.avatar}`
		: null;

	// Logout function
	function logout() {
		pb.authStore.clear();
		window.location.href = '/login'; // Redirect after logout
	}

	function toggleNav() {
		isExpanded.update((value) => !value);
	}

	$: console.log('Current path:', $page.url.pathname);
	$: console.log('User data:', data?.user);
</script>

<!-- Use $page directly -->
{#if $page.url.pathname !== '/login' && $page.url.pathname !== '/register' && $page.url.pathname !== '/forgot-password'}
	<div class="fixed w-screen">
		<div class="avatar float-end m-2 hidden">
			<!-- Show user avatar or fallback if no avatar exists -->
			{#if avatarUrl}
				<Avatar src={avatarUrl} name={data.user.name} />
			{:else}
				<!-- Fallback avatar with an icon -->
				<Avatar name={data?.user?.name || 'Guest'} background="preset-filled-primary-500">
					<Skull size={24} />
				</Avatar>
			{/if}
		</div>
		<h1 class="float-end mx-4 py-2 opacity-40 type-scale-2">
			Welcome, {data?.user?.name || 'Guest'}!
		</h1>
	</div>

	<div class="card grid h-[100vh] w-full grid-cols-[auto_1fr] border-[1px] border-surface-100-900">
		<!-- Navigation Rail -->
		<Nav.Rail expanded={$isExpanded}>
			<!-- Snippet for toggle button -->
			{#snippet header()}
				<Nav.Tile on:click={toggleNav} labelExpanded="Collapse Side Bar">
					<IconMenu />
				</Nav.Tile>
			{/snippet}

			<!-- Snippet for navigation tiles -->
			{#snippet tiles()}
				<Nav.Tile id="0" label="Home" labelExpanded="Home" href={hrefHome}>
					<IconDashboard />
				</Nav.Tile>
				<Nav.Tile id="1" label="Vehicles" labelExpanded="Vehicle Inventory" href={hrefVehicles}>
					<IconTable />
				</Nav.Tile>
				<Nav.Tile id="10" label="Major Units" labelExpanded="Major Units" href={hrefMajorUnits}>
					<IconSearch />
				</Nav.Tile>
				<Nav.Tile id="2" label="Parts" labelExpanded="OEM Parts" href={hrefParts}>
					<IconBarcode />
				</Nav.Tile>
				<Nav.Tile id="12" label="Service" labelExpanded="Service Dept." href={hrefService}>
					<IconWrench />
				</Nav.Tile>
				<Nav.Tile id="3" label="Sync" labelExpanded="Import XML Vehicles" href={hrefImport}>
					<IconSync />
				</Nav.Tile>
			{/snippet}

			{#snippet footer()}
				<!-- Conditionally show login/logout -->
				{#if data?.user}
					<button
						on:click={logout}
						on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && logout()}
						type="button"
						class="flex w-full flex-col items-center justify-center gap-1 rounded-container hover:preset-filled-surface-50-950"
						aria-label="Logout"
						style="cursor: pointer;"
					>
						<Nav.Tile id="4" label="Logout" labelExpanded="Logout">
							<IconLogout />
						</Nav.Tile>
					</button>
				{:else}
					<Nav.Tile id="5" label="Login" labelExpanded="Login" href={hrefLogin}>
						<IconLogin />
					</Nav.Tile>
				{/if}
				<Nav.Tile id="6" label="Profile" labelExpanded="Profile" href={hrefProfile}>
					<IconProfile />
				</Nav.Tile>
				<Nav.Tile id="7" labelExpanded="Settings" href={hrefSettings}>
					<IconSettings />
				</Nav.Tile>
			{/snippet}
		</Nav.Rail>
		<!-- Page content -->
		<slot></slot>
	</div>
{:else}
	<slot></slot>
{/if}

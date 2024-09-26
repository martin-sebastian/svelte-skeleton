<script lang="ts">
	export let data; // Get the user data passed from the load function
	import { page } from '$app/stores'; // Import $page store to track URL

	$: console.log('Current path:', $page.url.pathname);
	$: console.log('User data:', data.user);

	import '../app.css';
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	import pb from '$lib/pocketbase'; // Import PocketBase client

	// Icons
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
	let hrefMu = '/mu';
	let hrefLogin = '/login';
	let hrefSettings = '/settings';
	let hrefProfile = '/profile';

	import { writable } from 'svelte/store';
	let isExpanded = writable(false);

	// Logout function
	function logout() {
		pb.authStore.clear();
		window.location.href = '/login'; // Redirect after logout
	}

	function toggleNav() {
		isExpanded.update((value) => !value);
		console.log($isExpanded); // Check if the value is changing
	}
</script>

<!-- Use $page directly -->
{#if $page.url.pathname !== '/login'}
	<div class="card grid h-[100vh] w-full grid-cols-[auto_1fr] border-[1px] border-surface-100-900">
		<!-- Navigation Rail -->
		<Nav.Rail expanded={$isExpanded}>
			{#snippet header()}
				<div
					on:click={toggleNav}
					on:keydown={(e) => e.key === 'Enter' && toggleNav()}
					tabindex="0"
					role="button"
					class="flex w-full flex-col items-center justify-center gap-1 rounded-container hover:preset-filled-surface-50-950"
					style="cursor: pointer;"
					aria-label="Toggle Navigation"
				>
					<Nav.Tile labelExpanded="Collapse Side Bar">
						<IconMenu />
					</Nav.Tile>
				</div>
			{/snippet}

			{#snippet tiles()}
				<Nav.Tile id="0" label="Home" labelExpanded="Home" href={hrefHome}>
					<IconDashboard />
				</Nav.Tile>
				<Nav.Tile id="1" label="Vehicles" labelExpanded="Vehicle Inventory" href={hrefVehicles}>
					<IconTable />
				</Nav.Tile>
				<Nav.Tile id="10" label="MU" labelExpanded="Major Units" href={hrefMu}>
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
				<!-- Conditionally render the login/logout option based on whether the user is logged in -->
				{#if data.user}
					<div
						on:click={logout}
						on:keydown={(e) => e.key === 'Enter' && logout()}
						tabindex="0"
						role="button"
						class="flex w-full flex-col items-center justify-center gap-1 rounded-container hover:preset-filled-surface-50-950"
						style="cursor: pointer;"
						aria-label="Logout"
					>
						<Nav.Tile id="4" label="Logout" labelExpanded="Logout">
							<IconLogout />
						</Nav.Tile>
					</div>
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
	<!-- Only for login page -->
	<slot></slot>
{/if}

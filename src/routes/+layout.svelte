<script lang="ts">
	import '../app.css';
	import { Nav } from '@skeletonlabs/skeleton-svelte';
	// Icons
	import IconMenu from 'lucide-svelte/icons/menu';
	import IconFolder from 'lucide-svelte/icons/folder';
	import IconImage from 'lucide-svelte/icons/image';
	import IconMusic from 'lucide-svelte/icons/music';
	import IconVideo from 'lucide-svelte/icons/video';
	import IconSettings from 'lucide-svelte/icons/settings';

	let hrefExample = '#';
	let isExpanded = false; // State variable to track expansion

	// Toggle function for the Nav.Rail expanded state
	function toggleNav() {
		isExpanded = !isExpanded;
		console.log('isExpanded:', isExpanded); // Debugging statement
	}
</script>

<div class="card grid h-[100vh] w-full grid-cols-[auto_1fr] border-[1px] border-surface-100-900">
	<!-- Component -->
	<Nav.Rail {isExpanded}>
		{#snippet header()}
			<Nav.Tile href="/" title="Menu" labelExpanded="Menu" on:click={toggleNav}
				><IconMenu /></Nav.Tile
			>
		{/snippet}
		{#snippet tiles()}
			<Nav.Tile id="0" label="Files" labelExpanded="Files" href={hrefExample}>
				<IconFolder />
			</Nav.Tile>
			<Nav.Tile id="1" label="Images" labelExpanded="Images" href={hrefExample}>
				<IconImage />
			</Nav.Tile>
			<Nav.Tile id="2" label="Music" labelExpanded="Music" href={hrefExample}>
				<IconMusic />
			</Nav.Tile>
			<Nav.Tile id="3" label="Videos" labelExpanded="Videos" href={hrefExample}>
				<IconVideo />
			</Nav.Tile>
		{/snippet}
		{#snippet footer()}
			<Nav.Tile labelExpanded="Settings" href="/settings" title="settings"
				><IconSettings /></Nav.Tile
			>
		{/snippet}
	</Nav.Rail>
	<slot></slot>
</div>

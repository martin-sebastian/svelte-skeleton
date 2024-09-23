<script lang="ts">
	export let params;

	function handleClick() {
		// Call the openPopup function from the context
		params.context.openPopup(params.data.allImages);
	}
</script>

<button
	type="button"
	on:click={handleClick}
	style="background: none; border: none; padding: 0; cursor: pointer;"
	aria-label="View product photo"
>
	<img
		src={params.value}
		alt="Vehicle Product Photo"
		style="width: 60px; height: auto; border-radius: 6px;"
	/>
</button>

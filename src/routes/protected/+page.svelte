<script lang="ts">
	export let data; // Get the user data from the load function
</script>

<div>
	<h1>Welcome to the protected page, {data.user.name}!</h1>
	<!-- Content only visible to logged-in users -->
</div>

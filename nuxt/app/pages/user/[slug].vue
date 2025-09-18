<template>User Profile Page</template>

<script setup lang="ts">
	definePageMeta({
		path: "/u/:slug",
		authOnly: true,
	});
</script>

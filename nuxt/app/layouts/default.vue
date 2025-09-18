<template>
	<div class="flex min-h-screen flex-col">
		<TheHeader />

		<TheMain class="pt-14">
			<slot />
		</TheMain>
	</div>
</template>

<script lang="ts" setup>
	import TheHeader from "~/components/app-shells/TheHeader.vue";
	import TheMain from "~/components/app-shells/TheMain.vue";
</script>

<template>
	<div class="flex min-h-screen flex-col">
		<TheMain class="flex items-center justify-center py-8">
			<div class="w-full max-w-md">
				<img src="~/assets/icons/brand-logo.svg" class="mx-auto mb-8 h-8 w-fit" />

				<slot />
			</div>
		</TheMain>
	</div>
</template>

<script lang="ts" setup>
	import TheMain from "~/components/app-shells/TheMain.vue";
</script>

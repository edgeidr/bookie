<template>
	<header class="bg-surface-0 fixed inset-x-0 shadow duration-200">
		<div class="container mx-auto">
			<nav class="flex items-center justify-between gap-8 py-4 duration-200">
				<NuxtLink :to="{ name: 'index' }">
					<img src="~/assets/icons/brand-logo.svg" class="h-5" />
				</NuxtLink>

				<ul class="flex items-center gap-8">
					<li v-for="(link, index) in navLinks" :key="index">
						<NuxtLink
							:to="link.to"
							active-class="underline underline-offset-4"
							:external="link.external"
							:target="link.external ? '_blank' : undefined">
							{{ link.label }}
						</NuxtLink>
					</li>

					<li>
						<Button class="p-0!" @click="profileMenu?.toggle" variant="text" rounded>
							<Avatar :label="userInitials" shape="circle" />
						</Button>

						<Menu ref="profileMenu" :model="profileMenuItems" popup>
							<template #item="{ item, label, props }">
								<component :is="item.route ? NuxtLink : 'div'" :to="item.route" v-bind="props.action">
									<Icon v-if="item.icon" v-bind="props.icon" :name="item.icon" />
									<span v-bind="props.label">{{ label }}</span>
								</component>
							</template>
						</Menu>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
	import { NuxtLink } from "#components";
	import { StorageSerializers } from "@vueuse/core";

	const { t } = useI18n();
	const route = useRoute();
	const profileMenu = ref();
	const user = useLocalStorage<User>("user", null, { serializer: StorageSerializers.object });
	const navLinks = [
		{ to: { name: "index" }, label: t("header.nav.home") },
		{ to: { name: "about" }, label: t("header.nav.about") },
		{ to: "https://helpdesk.boldrtech.com/", label: t("header.nav.support"), external: true },
	];
	const { execute: signOut } = await useCustomFetch("/auth/sign-out", {
		immediate: false,
		watch: false,
		method: "POST",
		onResponse: () => {
			user.value = null;
			navigateTo({ name: "login" });
		},
	});
	const profileMenuItems = ref([
		{
			label: "My Profile",
			route: { name: "user-slug", params: { slug: computed(() => user.value?.slug || "user") } },
			icon: "mdi:account-outline",
		},
		{
			label: "Account Settings",
			route: { name: "account-settings" },
			icon: "mdi:account-cog-outline",
		},
		{
			label: "Help Center",
			route: { name: "help" },
			icon: "mdi:help-circle-outline",
		},
		{
			label: "Logout",
			icon: "mdi:logout",
			command: () => signOut(),
		},
	]);

	const userInitials = computed(() => user.value?.email?.charAt(0).toUpperCase() || "A");
</script>

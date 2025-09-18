<template>
	<header :class="['fixed inset-x-0 duration-200', { 'bg-surface-0 shadow': !isAtTop }]">
		<div class="container mx-auto">
			<nav :class="['flex items-center justify-between gap-8 duration-200', isAtTop ? 'py-8' : 'py-4']">
				<NuxtLink :to="{ name: 'index' }">
					<img src="~/assets/icons/brand-logo.svg" class="h-8" />
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
	import { StorageSerializers, useWindowScroll } from "@vueuse/core";

	const { t } = useI18n();
	const { y } = useWindowScroll();
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

			if (route.meta.authOnly) navigateTo({ name: "index" });
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

	const isAtTop = computed(() => y.value <= 50);
	const userInitials = computed(() => user.value.email.charAt(0).toUpperCase());
</script>

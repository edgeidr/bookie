<template>
	<NuxtLayout>
		<NuxtPage />

		<Toast />
	</NuxtLayout>
</template>

<script setup lang="ts">
	import { useOneTap, type CredentialResponse } from "vue3-google-signin";
	import { StorageSerializers } from "@vueuse/core";

	const { t } = useI18n();
	const toast = useToast();
	const route = useRoute();
	const user = useLocalStorage<User>("user", null, { serializer: StorageSerializers.object });
	const googleSignInForm = ref({
		credential: "",
	});

	if (!user.value) {
		try {
			const { data, error } = await useCustomFetch<{ user: User }>("/auth/me", {
				method: "GET",
			});

			if (!error.value && data.value) {
				user.value = data.value.user;
			}
		} catch (error) {
			console.error(error);
		}
	}

	const { execute: getCurrentUser } = await useCustomFetch<{ user: User }>("/auth/me", {
		method: "GET",
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { user: userData } = response._data as { user: User };
			user.value = userData;

			if (route.meta.guestOnly) navigateTo({ name: "index" });
		},
	});

	const { execute: googleSignIn } = await useCustomFetch("/auth/google", {
		immediate: false,
		watch: false,
		method: "POST",
		body: googleSignInForm,
		onResponse: ({ response }) => {
			if (!response.ok) return;

			const { user: userData } = response._data as { user: User };
			user.value = userData;

			if (route.meta.guestOnly) navigateTo({ name: "index" });
		},
	});

	const { isReady: isOneTapReady, login: promptGoogleSignIn } = useOneTap({
		disableAutomaticPrompt: true,
		onSuccess: (response: CredentialResponse) => {
			if (!response.credential) {
				toast.add({
					summary: t("apiStatus.error"),
					detail: t("messages.tryAgain"),
					severity: "error",
					life: useRuntimeConfig().public.toastLife,
				});

				return;
			}

			googleSignInForm.value.credential = response.credential;
			googleSignIn();
		},
		onError: () => console.error("Error with One Tap Login"),
	});

	if (!user.value) getCurrentUser();

	watch(isOneTapReady, (isReady) => {
		if (isReady && !user.value) promptGoogleSignIn();
	});
</script>

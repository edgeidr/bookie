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
	const isLoggedIn = useCookie("isLoggedIn");
	const googleSignInForm = ref({
		credential: "",
	});

	const { execute: getCurrentUser } = await useCustomFetch<{ user: User }>("/auth/me", {
		immediate: false,
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

	if (isLoggedIn.value && !user.value) getCurrentUser();

	watch(isOneTapReady, (isReady) => {
		if (isReady && !isLoggedIn.value && !user.value) promptGoogleSignIn();
	});

	watch(isLoggedIn, (loggedIn) => {
		if (!loggedIn) user.value = null;
	});

	watch(user, () => {
		if (!user.value) navigateTo({ name: "login" });
	});
</script>

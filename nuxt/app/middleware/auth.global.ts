export default defineNuxtRouteMiddleware(async (to, from) => {
	const user = useLocalStorage<User>("user", null);

	if (user.value && to.meta.guestOnly) {
		return navigateTo({ name: "index" });
	}

	if (!user.value && !to.meta.guestOnly) {
		return navigateTo({ name: "login" });
	}
});

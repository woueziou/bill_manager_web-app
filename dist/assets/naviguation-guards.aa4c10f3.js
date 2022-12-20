import { d as definePlugin, a as useUserSession, S as START_LOCATION_NORMALIZED } from "./index.2c4f64fa.js";
import { u as useNotyf } from "./useNotyf.057d9f71.js";
var naviguationGuards = definePlugin(({ router, api, pinia }) => {
  router.beforeEach(async (to, from) => {
    const userSession = useUserSession(pinia);
    const notyf = useNotyf();
    if (from === START_LOCATION_NORMALIZED && userSession.isLoggedIn) {
      try {
        const { data: user } = await api.get("/api/users/me");
        userSession.setUser(user);
        notyf.success(`Welcome back, ${user.name}`);
      } catch (err) {
        userSession.logoutUser();
        notyf.error("Your session is invalid");
        if (to.meta.requiresAuth) {
          return {
            name: "auth",
            query: { redirect: to.fullPath }
          };
        }
      }
    } else if (to.meta.requiresAuth && !userSession.isLoggedIn) {
      notyf.error({
        message: "Sorry, you should loggin to access this section (anything will work)",
        duration: 7e3
      });
      return {
        name: "auth",
        query: { redirect: to.fullPath }
      };
    }
  });
});
export { naviguationGuards as default };

import { A as defineComponent, B as ref, X as useDarkmode, aj as useRouter, O as useRoute, a as useUserSession, Q as useHead, s as resolveComponent, o as openBlock, k as createElementBlock, l as createBaseVNode, Y as withKeys, G as unref, v as createVNode, w as withCtx, y as withModifiers, a1 as createStaticVNode, q as createTextVNode, a0 as __unplugin_components_0, R as _sfc_main$4 } from "./index.2c4f64fa.js";
import { _ as __unplugin_components_2, a as _sfc_main$3 } from "./VControl.725fb454.js";
import { s as sleep, _ as _sfc_main$1, a as _sfc_main$2, b as _imports_0, c as _imports_1 } from "./sleep.6f083af3.js";
import { u as useNotyf } from "./useNotyf.057d9f71.js";
const _hoisted_1 = { class: "auth-wrapper-inner columns is-gapless" };
const _hoisted_2 = /* @__PURE__ */ createStaticVNode('<div class="column login-column is-8 h-hidden-mobile h-hidden-tablet-p hero-banner"><div class="hero login-hero is-fullheight is-app-grey"><div class="hero-body"><div class="columns"><div class="column is-10 is-offset-1"><img class="light-image has-light-shadow has-light-border" src="' + _imports_0 + '" alt=""><img class="dark-image has-light-shadow" src="' + _imports_1 + '" alt=""></div></div></div><div class="hero-footer"><p class="has-text-centered"></p></div></div></div>', 1);
const _hoisted_3 = { class: "column is-4" };
const _hoisted_4 = { class: "hero is-fullheight is-white" };
const _hoisted_5 = { class: "hero-heading" };
const _hoisted_6 = ["checked"];
const _hoisted_7 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_8 = { class: "auth-logo" };
const _hoisted_9 = { class: "hero-body" };
const _hoisted_10 = { class: "container" };
const _hoisted_11 = { class: "columns" };
const _hoisted_12 = { class: "column is-12" };
const _hoisted_13 = { class: "auth-content" };
const _hoisted_14 = /* @__PURE__ */ createBaseVNode("h2", null, "Welcome Back.", -1);
const _hoisted_15 = /* @__PURE__ */ createBaseVNode("p", null, "Please sign in to your account", -1);
const _hoisted_16 = /* @__PURE__ */ createTextVNode(" I do not have an account yet ");
const _hoisted_17 = { class: "auth-form-wrapper" };
const _hoisted_18 = ["onSubmit"];
const _hoisted_19 = { class: "login-form" };
const _hoisted_20 = { class: "login" };
const _hoisted_21 = /* @__PURE__ */ createTextVNode(" Sign In ");
const _hoisted_22 = /* @__PURE__ */ createBaseVNode("div", { class: "forgot-link has-text-centered" }, [
  /* @__PURE__ */ createBaseVNode("a", null, "Forgot Password?")
], -1);
const _sfc_main = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const isLoading = ref(false);
    const darkmode = useDarkmode();
    const router = useRouter();
    const route = useRoute();
    const notif = useNotyf();
    const userSession = useUserSession();
    const redirect = route.query.redirect;
    const handleLogin = async () => {
      if (!isLoading.value) {
        isLoading.value = true;
        await sleep(2e3);
        userSession.setToken("logged-in");
        notif.dismissAll();
        notif.success("Welcome back, Erik Kovalsky");
        if (redirect) {
          router.push(redirect);
        } else {
          router.push({
            name: "app"
          });
        }
        isLoading.value = false;
      }
    };
    useHead({
      title: "Auth Login - Vuero"
    });
    return (_ctx, _cache) => {
      const _component_AnimatedLogo = __unplugin_components_0;
      const _component_RouterLink = resolveComponent("RouterLink");
      const _component_VInput = _sfc_main$1;
      const _component_VControl = __unplugin_components_2;
      const _component_VField = _sfc_main$2;
      const _component_VCheckbox = _sfc_main$3;
      const _component_VButton = _sfc_main$4;
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _hoisted_2,
        createBaseVNode("div", _hoisted_3, [
          createBaseVNode("div", _hoisted_4, [
            createBaseVNode("div", _hoisted_5, [
              createBaseVNode("label", {
                class: "dark-mode ml-auto",
                tabindex: "0",
                onKeydown: _cache[1] || (_cache[1] = withKeys(withModifiers((e) => e.target.click(), ["prevent"]), ["space"]))
              }, [
                createBaseVNode("input", {
                  type: "checkbox",
                  checked: !unref(darkmode).isDark,
                  onChange: _cache[0] || (_cache[0] = (...args) => unref(darkmode).onChange && unref(darkmode).onChange(...args))
                }, null, 40, _hoisted_6),
                _hoisted_7
              ], 32),
              createBaseVNode("div", _hoisted_8, [
                createVNode(_component_RouterLink, { to: { name: "index" } }, {
                  default: withCtx(() => [
                    createVNode(_component_AnimatedLogo, {
                      width: "36px",
                      height: "36px"
                    })
                  ]),
                  _: 1
                })
              ])
            ]),
            createBaseVNode("div", _hoisted_9, [
              createBaseVNode("div", _hoisted_10, [
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("div", _hoisted_12, [
                    createBaseVNode("div", _hoisted_13, [
                      _hoisted_14,
                      _hoisted_15,
                      createVNode(_component_RouterLink, { to: { name: "auth-signup-2" } }, {
                        default: withCtx(() => [
                          _hoisted_16
                        ]),
                        _: 1
                      })
                    ]),
                    createBaseVNode("div", _hoisted_17, [
                      createBaseVNode("form", {
                        onSubmit: withModifiers(handleLogin, ["prevent"])
                      }, [
                        createBaseVNode("div", _hoisted_19, [
                          createVNode(_component_VField, null, {
                            default: withCtx(() => [
                              createVNode(_component_VControl, { icon: "feather:user" }, {
                                default: withCtx(() => [
                                  createVNode(_component_VInput, {
                                    type: "text",
                                    placeholder: "Username",
                                    autocomplete: "username"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_VField, null, {
                            default: withCtx(() => [
                              createVNode(_component_VControl, { icon: "feather:lock" }, {
                                default: withCtx(() => [
                                  createVNode(_component_VInput, {
                                    type: "password",
                                    placeholder: "Password",
                                    autocomplete: "current-password"
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_VField, null, {
                            default: withCtx(() => [
                              createVNode(_component_VControl, { class: "setting-item" }, {
                                default: withCtx(() => [
                                  createVNode(_component_VCheckbox, {
                                    label: "Remember me",
                                    paddingless: ""
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createBaseVNode("div", _hoisted_20, [
                            createVNode(_component_VButton, {
                              loading: isLoading.value,
                              color: "primary",
                              type: "submit",
                              bold: "",
                              fullwidth: "",
                              raised: ""
                            }, {
                              default: withCtx(() => [
                                _hoisted_21
                              ]),
                              _: 1
                            }, 8, ["loading"])
                          ]),
                          _hoisted_22
                        ])
                      ], 40, _hoisted_18)
                    ])
                  ])
                ])
              ])
            ])
          ])
        ])
      ]);
    };
  }
});
export { _sfc_main as default };

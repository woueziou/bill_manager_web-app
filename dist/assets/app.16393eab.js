import { u as useViewWrapper, _ as _sfc_main$h, a as useDropdown } from "./VDropdown.047f96fc.js";
import { A as defineComponent, o as openBlock, k as createElementBlock, j as renderSlot, m as normalizeClass, G as unref, V as _export_sfc, W as defineStore, u as useStorage, X as useDarkmode, P as useI18n, f as computed, l as createBaseVNode, Y as withKeys, y as withModifiers, E as watch, t as toDisplayString, Z as withDirectives, $ as vModelRadio, I as isRef, s as resolveComponent, v as createVNode, w as withCtx, q as createTextVNode, a0 as __unplugin_components_0$1, O as useRoute, B as ref, h, T as Transition, p as createCommentVNode, F as Fragment, i as createBlock, R as _sfc_main$g, a1 as createStaticVNode, a2 as watchPostEffect, a3 as resolveDynamicComponent } from "./index.2c4f64fa.js";
import { b as block0 } from "./route-block.b5bad31b.js";
var VViewWrapper_vue_vue_type_style_index_0_lang = "";
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  props: {
    topNav: { type: Boolean },
    full: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const viewWrapper = useViewWrapper();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["view-wrapper", [
          props.topNav && "has-top-nav",
          props.full && "view-wrapper-full",
          unref(viewWrapper).isPushed && "is-pushed-full",
          unref(viewWrapper).isPushedBlock && "is-pushed-block"
        ]])
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 2);
    };
  }
});
var VPageContentWrapper_vue_vue_type_style_index_0_lang = "";
const _sfc_main$e = {};
const _hoisted_1$c = { class: "page-content-wrapper" };
function _sfc_render$3(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$c, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
var __unplugin_components_11 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$3]]);
var VPageContent_vue_vue_type_style_index_0_lang = "";
const _sfc_main$d = {};
const _hoisted_1$b = { class: "page-content" };
function _sfc_render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1$b, [
    renderSlot(_ctx.$slots, "default")
  ]);
}
var __unplugin_components_10 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$2]]);
const usePanels = defineStore("panels", () => {
  const active = useStorage("active-panel", "none");
  function setActive(panelId) {
    active.value = panelId;
  }
  function close() {
    active.value = "none";
  }
  return {
    active,
    setActive,
    close
  };
});
const _hoisted_1$a = { class: "toolbar ml-auto" };
const _hoisted_2$a = { class: "toolbar-link" };
const _hoisted_3$a = ["checked"];
const _hoisted_4$9 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_5$8 = ["src"];
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const darkmode = useDarkmode();
    const { locale } = useI18n();
    const panels = usePanels();
    const localFlagSrc = computed(() => {
      switch (locale.value) {
        case "fr":
          return "/images/icons/flags/france.svg";
        case "es":
          return "/images/icons/flags/spain.svg";
        case "es-MX":
          return "/images/icons/flags/mexico.svg";
        case "de":
          return "/images/icons/flags/germany.svg";
        case "zh-CN":
          return "/images/icons/flags/china.svg";
        case "en":
        default:
          return "/images/icons/flags/united-states-of-america.svg";
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$a, [
        createBaseVNode("div", _hoisted_2$a, [
          createBaseVNode("label", {
            tabindex: "0",
            class: "dark-mode ml-auto",
            onKeydown: _cache[1] || (_cache[1] = withKeys(withModifiers((e) => e.target.click(), ["prevent"]), ["space"]))
          }, [
            createBaseVNode("input", {
              type: "checkbox",
              checked: !unref(darkmode).isDark,
              onChange: _cache[0] || (_cache[0] = (...args) => unref(darkmode).onChange && unref(darkmode).onChange(...args))
            }, null, 40, _hoisted_3$a),
            _hoisted_4$9
          ], 32)
        ]),
        createBaseVNode("a", {
          tabindex: "0",
          class: "toolbar-link right-panel-trigger",
          onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => unref(panels).setActive("languages"), ["prevent"]), ["space"])),
          onClick: _cache[3] || (_cache[3] = ($event) => unref(panels).setActive("languages"))
        }, [
          createBaseVNode("img", {
            src: unref(localFlagSrc),
            alt: ""
          }, null, 8, _hoisted_5$8)
        ], 32),
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
});
var _imports_0$1 = "/images/icons/flags/united-states-of-america.svg";
var _imports_1$1 = "/images/icons/flags/france.svg";
var _imports_2$1 = "/images/icons/flags/spain.svg";
var _imports_3$1 = "/images/icons/flags/germany.svg";
var _imports_4 = "/images/icons/flags/mexico.svg";
var _imports_5 = "/images/icons/flags/china.svg";
var _imports_6 = "/assets/languages.7b1df35e.svg";
var _imports_7 = "/assets/languages-dark.e1954b48.svg";
var LanguagesPanel_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$9 = { class: "right-panel" };
const _hoisted_2$9 = { class: "right-panel-head" };
const _hoisted_3$9 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify",
  "data-icon": "feather:chevron-right"
}, null, -1);
const _hoisted_4$8 = [
  _hoisted_3$9
];
const _hoisted_5$7 = { class: "right-panel-body has-slimscroll" };
const _hoisted_6$6 = { class: "languages-boxes" };
const _hoisted_7$6 = { class: "language-box" };
const _hoisted_8$6 = { class: "language-option" };
const _hoisted_9$3 = /* @__PURE__ */ createBaseVNode("div", { class: "language-option-inner" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_0$1,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("div", { class: "indicator" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:check"
    })
  ])
], -1);
const _hoisted_10$3 = { class: "language-box" };
const _hoisted_11$3 = { class: "language-option" };
const _hoisted_12$3 = /* @__PURE__ */ createBaseVNode("div", { class: "language-option-inner" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_1$1,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("div", { class: "indicator" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:check"
    })
  ])
], -1);
const _hoisted_13$2 = { class: "language-box" };
const _hoisted_14$1 = { class: "language-option" };
const _hoisted_15$1 = /* @__PURE__ */ createBaseVNode("div", { class: "language-option-inner" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_2$1,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("div", { class: "indicator" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:check"
    })
  ])
], -1);
const _hoisted_16$1 = { class: "language-box" };
const _hoisted_17$1 = { class: "language-option" };
const _hoisted_18$1 = /* @__PURE__ */ createBaseVNode("div", { class: "language-option-inner" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_3$1,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("div", { class: "indicator" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:check"
    })
  ])
], -1);
const _hoisted_19$1 = { class: "language-box" };
const _hoisted_20 = { class: "language-option" };
const _hoisted_21 = /* @__PURE__ */ createBaseVNode("div", { class: "language-option-inner" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_4,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("div", { class: "indicator" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:check"
    })
  ])
], -1);
const _hoisted_22 = { class: "language-box" };
const _hoisted_23 = { class: "language-option" };
const _hoisted_24 = /* @__PURE__ */ createBaseVNode("div", { class: "language-option-inner" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    src: _imports_5,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("div", { class: "indicator" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:check"
    })
  ])
], -1);
const _hoisted_25 = /* @__PURE__ */ createBaseVNode("div", { class: "img-wrap has-text-centered" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    class: "light-image",
    src: _imports_6,
    alt: ""
  }),
  /* @__PURE__ */ createBaseVNode("img", {
    class: "dark-image",
    src: _imports_7,
    alt: ""
  })
], -1);
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const panels = usePanels();
    const { locale, t } = useI18n();
    const defaultLocale = useStorage("locale", (navigator == null ? void 0 : navigator.language) || "en");
    watch(locale, () => {
      defaultLocale.value = locale.value;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        id: "languages-panel",
        class: normalizeClass([[unref(panels).active === "languages" && "is-active"], "right-panel-wrapper is-languages"])
      }, [
        createBaseVNode("div", {
          class: "panel-overlay",
          tabindex: "0",
          onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers(($event) => unref(panels).close(), ["prevent"]), ["space"])),
          onClick: _cache[1] || (_cache[1] = ($event) => unref(panels).close())
        }, null, 32),
        createBaseVNode("div", _hoisted_1$9, [
          createBaseVNode("div", _hoisted_2$9, [
            createBaseVNode("h3", null, toDisplayString(unref(t)("select-language")), 1),
            createBaseVNode("a", {
              class: "close-panel",
              tabindex: "0",
              onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => unref(panels).close(), ["prevent"]), ["space"])),
              onClick: _cache[3] || (_cache[3] = ($event) => unref(panels).close())
            }, _hoisted_4$8, 32)
          ]),
          createBaseVNode("div", _hoisted_5$7, [
            createBaseVNode("div", _hoisted_6$6, [
              createBaseVNode("div", _hoisted_7$6, [
                createBaseVNode("div", _hoisted_8$6, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => isRef(locale) ? locale.value = $event : null),
                    type: "radio",
                    name: "language_selection",
                    value: "en",
                    checked: ""
                  }, null, 512), [
                    [vModelRadio, unref(locale)]
                  ]),
                  _hoisted_9$3
                ])
              ]),
              createBaseVNode("div", _hoisted_10$3, [
                createBaseVNode("div", _hoisted_11$3, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => isRef(locale) ? locale.value = $event : null),
                    type: "radio",
                    name: "language_selection",
                    value: "fr"
                  }, null, 512), [
                    [vModelRadio, unref(locale)]
                  ]),
                  _hoisted_12$3
                ])
              ]),
              createBaseVNode("div", _hoisted_13$2, [
                createBaseVNode("div", _hoisted_14$1, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => isRef(locale) ? locale.value = $event : null),
                    type: "radio",
                    name: "language_selection",
                    value: "es"
                  }, null, 512), [
                    [vModelRadio, unref(locale)]
                  ]),
                  _hoisted_15$1
                ])
              ]),
              createBaseVNode("div", _hoisted_16$1, [
                createBaseVNode("div", _hoisted_17$1, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => isRef(locale) ? locale.value = $event : null),
                    type: "radio",
                    name: "language_selection",
                    value: "de"
                  }, null, 512), [
                    [vModelRadio, unref(locale)]
                  ]),
                  _hoisted_18$1
                ])
              ]),
              createBaseVNode("div", _hoisted_19$1, [
                createBaseVNode("div", _hoisted_20, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => isRef(locale) ? locale.value = $event : null),
                    type: "radio",
                    name: "language_selection",
                    value: "es-MX"
                  }, null, 512), [
                    [vModelRadio, unref(locale)]
                  ]),
                  _hoisted_21
                ])
              ]),
              createBaseVNode("div", _hoisted_22, [
                createBaseVNode("div", _hoisted_23, [
                  withDirectives(createBaseVNode("input", {
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => isRef(locale) ? locale.value = $event : null),
                    type: "radio",
                    name: "language_selection",
                    value: "zh-CN"
                  }, null, 512), [
                    [vModelRadio, unref(locale)]
                  ]),
                  _hoisted_24
                ])
              ])
            ]),
            _hoisted_25
          ])
        ])
      ], 2);
    };
  }
});
var DashboardsSubsidebar_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$8 = { class: "sidebar-panel is-generic" };
const _hoisted_2$8 = { class: "subpanel-header" };
const _hoisted_3$8 = /* @__PURE__ */ createBaseVNode("h3", { class: "no-mb" }, "Dashboards", -1);
const _hoisted_4$7 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify",
  "data-icon": "feather:x"
}, null, -1);
const _hoisted_5$6 = [
  _hoisted_4$7
];
const _hoisted_6$5 = {
  class: "inner",
  "data-simplebar": ""
};
const _hoisted_7$5 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-home pr-2"
}, null, -1);
const _hoisted_8$5 = /* @__PURE__ */ createTextVNode(" Home ");
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  emits: ["close"],
  setup(__props, { emit }) {
    return (_ctx, _cache) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", _hoisted_1$8, [
        createBaseVNode("div", _hoisted_2$8, [
          _hoisted_3$8,
          createBaseVNode("div", {
            class: "panel-close",
            tabindex: "0",
            onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers(($event) => emit("close"), ["prevent"]), ["space"])),
            onClick: _cache[1] || (_cache[1] = ($event) => emit("close"))
          }, _hoisted_5$6, 32)
        ]),
        createBaseVNode("div", _hoisted_6$5, [
          createBaseVNode("ul", null, [
            createBaseVNode("li", null, [
              createVNode(_component_RouterLink, { to: { name: "app" } }, {
                default: withCtx(() => [
                  _hoisted_7$5,
                  _hoisted_8$5
                ]),
                _: 1
              })
            ])
          ])
        ])
      ]);
    };
  }
});
var Sidebar_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$7 = { class: "sidebar-brand" };
const _hoisted_2$7 = { class: "sidebar-inner" };
const _hoisted_3$7 = /* @__PURE__ */ createBaseVNode("div", { class: "naver" }, null, -1);
const _hoisted_4$6 = { class: "icon-menu has-slimscroll" };
const _hoisted_5$5 = { class: "bottom-menu" };
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  props: {
    theme: { default: "default" },
    isOpen: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const themeClasses = computed(() => {
      switch (props.theme) {
        case "color":
          return "is-colored";
        case "labels":
          return "has-labels";
        case "labels-hover":
          return "has-labels has-hover-labels";
        case "float":
          return !props.isOpen ? "is-float" : "is-float is-bordered";
        case "curved":
          return !props.isOpen ? "is-curved" : "";
        case "color-curved":
          return !props.isOpen ? "is-colored is-curved" : "is-colored";
        default:
          return "";
      }
    });
    return (_ctx, _cache) => {
      const _component_AnimatedLogo = __unplugin_components_0$1;
      const _component_RouterLink = resolveComponent("RouterLink");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["main-sidebar", [unref(themeClasses)]])
      }, [
        createBaseVNode("div", _hoisted_1$7, [
          createVNode(_component_RouterLink, { to: { name: "index" } }, {
            default: withCtx(() => [
              createVNode(_component_AnimatedLogo, { width: "36px" })
            ]),
            _: 1
          })
        ]),
        createBaseVNode("div", _hoisted_2$7, [
          _hoisted_3$7,
          createBaseVNode("ul", _hoisted_4$6, [
            renderSlot(_ctx.$slots, "links")
          ]),
          createBaseVNode("ul", _hoisted_5$5, [
            renderSlot(_ctx.$slots, "bottom-links")
          ])
        ])
      ], 2);
    };
  }
});
var VCollapseLinks_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$8 = defineComponent({
  props: {
    open: {
      type: [Boolean, String],
      default: void 0
    },
    collapseId: {
      type: String,
      default: void 0
    }
  },
  emits: ["update:open"],
  setup(props, { slots, emit }) {
    var _a, _b;
    const route = useRoute();
    const hasNestedLinkActive = ref(false);
    const slotContent = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) != null ? _b : [];
    const currentRoute = route.name;
    slotContent.forEach((child) => {
      var _a2, _b2;
      if (((_b2 = (_a2 = child.props) == null ? void 0 : _a2.to) == null ? void 0 : _b2.name) && currentRoute === child.props.to.name) {
        hasNestedLinkActive.value = true;
      }
    });
    const isOpen = ref(Boolean(hasNestedLinkActive.value || typeof props.collapseId === "string" && props.open === props.collapseId || typeof props.collapseId === "undefined" && props.open === true));
    function toggle() {
      if (typeof props.collapseId === "string") {
        if (props.collapseId === props.open) {
          emit("update:open");
        } else {
          emit("update:open", props.collapseId);
        }
      } else {
        isOpen.value = !isOpen.value;
      }
    }
    watch(() => props.open, (val) => {
      isOpen.value = Boolean(typeof props.collapseId === "string" && unref(val) === props.collapseId || typeof props.collapseId === "undefined" && unref(val) === true);
    });
    return () => {
      var _a2, _b2, _c;
      const header = (_a2 = slots.header) == null ? void 0 : _a2.call(slots);
      const slotContent2 = (_c = (_b2 = slots.default) == null ? void 0 : _b2.call(slots)) != null ? _c : [];
      const links = slotContent2.map((child) => h("li", {}, child));
      const parentLink = h("a", {
        tabindex: 0,
        class: "parent-link",
        onClick: (e) => {
          e.preventDefault();
          toggle();
        },
        onKeydown(e) {
          if (e.code === "Space") {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }
        }
      }, header);
      const collapseWrap = h("div", { class: "collapse-wrap" }, parentLink);
      const content = isOpen.value ? h("ul", {}, links) : void 0;
      return h("li", {
        class: ["collapse-links has-children", isOpen.value && "active"]
      }, [
        collapseWrap,
        h(Transition, {
          name: "collapse-links-transition",
          mode: "out-in",
          class: "collapse-content"
        }, {
          default() {
            return content;
          }
        })
      ]);
    };
  }
});
var __unplugin_components_0 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-b7b8ae54"]]);
const _sfc_main$7 = {};
const _hoisted_1$6 = { class: "mobile-subsidebar" };
const _hoisted_2$6 = { class: "inner" };
const _hoisted_3$6 = /* @__PURE__ */ createBaseVNode("div", { class: "sidebar-title" }, [
  /* @__PURE__ */ createBaseVNode("h3", null, "Dashboards")
], -1);
const _hoisted_4$5 = {
  class: "submenu",
  "data-simplebar": ""
};
const _hoisted_5$4 = /* @__PURE__ */ createTextVNode(" Personal ");
const _hoisted_6$4 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify",
  "data-icon": "feather:chevron-right"
}, null, -1);
const _hoisted_7$4 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "lnil lnil-home"
}, null, -1);
const _hoisted_8$4 = /* @__PURE__ */ createBaseVNode("span", null, "Home", -1);
function _sfc_render$1(_ctx, _cache) {
  const _component_RouterLink = resolveComponent("RouterLink");
  const _component_VCollapseLinks = __unplugin_components_0;
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    createBaseVNode("div", _hoisted_2$6, [
      _hoisted_3$6,
      createBaseVNode("ul", _hoisted_4$5, [
        createVNode(_component_VCollapseLinks, null, {
          header: withCtx(() => [
            _hoisted_5$4,
            _hoisted_6$4
          ]),
          default: withCtx(() => [
            createVNode(_component_RouterLink, {
              to: { name: "app" },
              class: "is-submenu"
            }, {
              default: withCtx(() => [
                _hoisted_7$4,
                _hoisted_8$4
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ])
    ])
  ]);
}
var __unplugin_components_5 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$1]]);
var MobileSidebar_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$5 = { class: "inner" };
const _hoisted_2$5 = { class: "icon-side-menu" };
const _hoisted_3$5 = /* @__PURE__ */ createBaseVNode("li", null, [
  /* @__PURE__ */ createBaseVNode("a", {
    "aria-label": "Back to homepage",
    href: "/"
  }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:activity"
    })
  ])
], -1);
const _hoisted_4$4 = { class: "bottom-icon-side-menu" };
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["toggle"],
  setup(__props, { emit }) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          class: normalizeClass([[props.isOpen && "is-active"], "mobile-main-sidebar"])
        }, [
          createBaseVNode("div", _hoisted_1$5, [
            createBaseVNode("ul", _hoisted_2$5, [
              renderSlot(_ctx.$slots, "links", {}, () => [
                _hoisted_3$5
              ])
            ]),
            createBaseVNode("ul", _hoisted_4$4, [
              renderSlot(_ctx.$slots, "bottom-links")
            ])
          ])
        ], 2),
        props.isOpen ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "mobile-overlay",
          tabindex: "0",
          onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers(($event) => emit("toggle"), ["prevent"]), ["space"])),
          onClick: _cache[1] || (_cache[1] = ($event) => emit("toggle"))
        }, null, 32)) : createCommentVNode("", true)
      ], 64);
    };
  }
});
var MobileNavbar_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$4 = {
  class: "navbar mobile-navbar is-hidden-desktop is-hidden-tablet",
  "aria-label": "main navigation"
};
const _hoisted_2$4 = { class: "container" };
const _hoisted_3$4 = { class: "navbar-brand" };
const _hoisted_4$3 = { class: "brand-start" };
const _hoisted_5$3 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_6$3 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_7$3 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _hoisted_8$3 = [
  _hoisted_5$3,
  _hoisted_6$3,
  _hoisted_7$3
];
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  props: {
    isOpen: { type: Boolean }
  },
  emits: ["toggle"],
  setup(__props, { emit }) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("nav", _hoisted_1$4, [
        createBaseVNode("div", _hoisted_2$4, [
          createBaseVNode("div", _hoisted_3$4, [
            createBaseVNode("div", _hoisted_4$3, [
              createBaseVNode("div", {
                class: normalizeClass(["navbar-burger", [props.isOpen && "is-active"]]),
                tabindex: "0",
                onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers(($event) => emit("toggle"), ["prevent"]), ["space"])),
                onClick: _cache[1] || (_cache[1] = ($event) => emit("toggle"))
              }, _hoisted_8$3, 34)
            ]),
            renderSlot(_ctx.$slots, "brand")
          ])
        ])
      ]);
    };
  }
});
function onceImageErrored(event, size) {
  const target = event.target;
  target.src = `https://via.placeholder.com/${size}`;
}
var VAvatar_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$3 = ["src"];
const _hoisted_2$3 = ["src"];
const _hoisted_3$3 = ["src"];
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  props: {
    picture: { default: void 0 },
    pictureDark: { default: void 0 },
    placeholder: { default: "https://via.placeholder.com/50x50" },
    badge: { default: void 0 },
    initials: { default: "?" },
    size: { default: void 0 },
    color: { default: void 0 },
    dotColor: { default: void 0 },
    squared: { type: Boolean },
    dot: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["v-avatar", [
          __props.size && `is-${props.size}`,
          __props.dot && "has-dot",
          __props.dotColor && `dot-${props.dotColor}`,
          __props.squared && __props.dot && "has-dot-squared"
        ]])
      }, [
        renderSlot(_ctx.$slots, "avatar", {}, () => [
          props.picture ? (openBlock(), createElementBlock("img", {
            key: 0,
            class: normalizeClass(["avatar", [props.squared && "is-squared", props.pictureDark && "light-image"]]),
            src: props.picture,
            alt: "",
            onErrorOnce: _cache[0] || (_cache[0] = (event) => unref(onceImageErrored)(event, "150x150"))
          }, null, 42, _hoisted_1$3)) : (openBlock(), createElementBlock("span", {
            key: 1,
            class: normalizeClass(["avatar is-fake", [props.squared && "is-squared", props.color && `is-${props.color}`]])
          }, [
            createBaseVNode("span", null, toDisplayString(props.initials), 1)
          ], 2)),
          props.picture && props.pictureDark ? (openBlock(), createElementBlock("img", {
            key: 2,
            class: normalizeClass(["avatar dark-image", [props.squared && "is-squared"]]),
            src: props.pictureDark,
            alt: "",
            onErrorOnce: _cache[1] || (_cache[1] = (event) => unref(onceImageErrored)(event, "150x150"))
          }, null, 42, _hoisted_2$3)) : createCommentVNode("", true)
        ]),
        renderSlot(_ctx.$slots, "badge", {}, () => [
          props.badge ? (openBlock(), createElementBlock("img", {
            key: 0,
            class: "badge",
            src: props.badge,
            alt: "",
            onErrorOnce: _cache[2] || (_cache[2] = (event) => unref(onceImageErrored)(event, "150x150"))
          }, null, 40, _hoisted_3$3)) : createCommentVNode("", true)
        ])
      ], 2);
    };
  }
});
const _sfc_main$3 = {};
const _hoisted_1$2 = ["onKeydown", "onClick"];
const _hoisted_2$2 = { class: "dropdown-head" };
const _hoisted_3$2 = /* @__PURE__ */ createBaseVNode("div", { class: "meta" }, [
  /* @__PURE__ */ createBaseVNode("span", null, "Erik Kovalsky"),
  /* @__PURE__ */ createBaseVNode("span", null, "Product Manager")
], -1);
const _hoisted_4$2 = /* @__PURE__ */ createBaseVNode("a", {
  href: "#",
  role: "menuitem",
  class: "dropdown-item is-media"
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "icon" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "lnil lnil-user-alt"
    })
  ]),
  /* @__PURE__ */ createBaseVNode("div", { class: "meta" }, [
    /* @__PURE__ */ createBaseVNode("span", null, "Profile"),
    /* @__PURE__ */ createBaseVNode("span", null, "View your profile")
  ])
], -1);
const _hoisted_5$2 = /* @__PURE__ */ createBaseVNode("hr", { class: "dropdown-divider" }, null, -1);
const _hoisted_6$2 = /* @__PURE__ */ createBaseVNode("a", {
  href: "#",
  role: "menuitem",
  class: "dropdown-item is-media"
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "icon" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "lnil lnil-briefcase"
    })
  ]),
  /* @__PURE__ */ createBaseVNode("div", { class: "meta" }, [
    /* @__PURE__ */ createBaseVNode("span", null, "Projects"),
    /* @__PURE__ */ createBaseVNode("span", null, "All my projects")
  ])
], -1);
const _hoisted_7$2 = /* @__PURE__ */ createBaseVNode("a", {
  href: "#",
  role: "menuitem",
  class: "dropdown-item is-media"
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "icon" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "lnil lnil-users-alt"
    })
  ]),
  /* @__PURE__ */ createBaseVNode("div", { class: "meta" }, [
    /* @__PURE__ */ createBaseVNode("span", null, "Team"),
    /* @__PURE__ */ createBaseVNode("span", null, "Manage your team")
  ])
], -1);
const _hoisted_8$2 = /* @__PURE__ */ createBaseVNode("hr", { class: "dropdown-divider" }, null, -1);
const _hoisted_9$2 = /* @__PURE__ */ createBaseVNode("a", {
  href: "#",
  role: "menuitem",
  class: "dropdown-item is-media"
}, [
  /* @__PURE__ */ createBaseVNode("div", { class: "icon" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "lnil lnil-cog"
    })
  ]),
  /* @__PURE__ */ createBaseVNode("div", { class: "meta" }, [
    /* @__PURE__ */ createBaseVNode("span", null, "Settings"),
    /* @__PURE__ */ createBaseVNode("span", null, "Account settings")
  ])
], -1);
const _hoisted_10$2 = /* @__PURE__ */ createBaseVNode("hr", { class: "dropdown-divider" }, null, -1);
const _hoisted_11$2 = { class: "dropdown-item is-button" };
const _hoisted_12$2 = /* @__PURE__ */ createTextVNode(" Logout ");
function _sfc_render(_ctx, _cache) {
  const _component_VAvatar = _sfc_main$4;
  const _component_VButton = _sfc_main$g;
  const _component_VDropdown = _sfc_main$h;
  return openBlock(), createBlock(_component_VDropdown, {
    right: "",
    spaced: "",
    class: "user-dropdown profile-dropdown"
  }, {
    button: withCtx(({ toggle }) => [
      createBaseVNode("a", {
        tabindex: "0",
        class: "is-trigger dropdown-trigger",
        "aria-haspopup": "true",
        onKeydown: withKeys(withModifiers(toggle, ["prevent"]), ["space"]),
        onClick: toggle
      }, [
        createVNode(_component_VAvatar, { picture: "/images/avatars/svg/vuero-1.svg" })
      ], 40, _hoisted_1$2)
    ]),
    content: withCtx(() => [
      createBaseVNode("div", _hoisted_2$2, [
        createVNode(_component_VAvatar, {
          size: "large",
          picture: "/images/avatars/svg/vuero-1.svg"
        }),
        _hoisted_3$2
      ]),
      _hoisted_4$2,
      _hoisted_5$2,
      _hoisted_6$2,
      _hoisted_7$2,
      _hoisted_8$2,
      _hoisted_9$2,
      _hoisted_10$2,
      createBaseVNode("div", _hoisted_11$2, [
        createVNode(_component_VButton, {
          class: "logout-button",
          icon: "feather:log-out",
          color: "primary",
          role: "menuitem",
          raised: "",
          fullwidth: ""
        }, {
          default: withCtx(() => [
            _hoisted_12$2
          ]),
          _: 1
        })
      ])
    ]),
    _: 1
  });
}
var __unplugin_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render]]);
var _imports_0 = "/images/avatars/svg/vuero-4.svg";
var _imports_1 = "/images/avatars/svg/vuero-2.svg";
var _imports_2 = "/images/avatars/svg/vuero-5.svg";
var _imports_3 = "/images/avatars/svg/vuero-9.svg";
const _hoisted_1$1 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify",
  "data-icon": "feather:bell"
}, null, -1);
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("span", { class: "new-indicator pulsate" }, null, -1);
const _hoisted_3$1 = [
  _hoisted_1$1,
  _hoisted_2$1
];
const _hoisted_4$1 = { class: "navbar-dropdown is-boxed is-right" };
const _hoisted_5$1 = /* @__PURE__ */ createStaticVNode('<div class="heading"><div class="heading-left"><h6 class="heading-title">Notifications</h6></div><div class="heading-right"><a class="notification-link" href="#">See all</a></div></div>', 1);
const _hoisted_6$1 = { class: "inner has-slimscroll" };
const _hoisted_7$1 = { class: "notification-list" };
const _hoisted_8$1 = { class: "notification-item" };
const _hoisted_9$1 = { class: "img-left" };
const _hoisted_10$1 = /* @__PURE__ */ createBaseVNode("div", { class: "user-content" }, [
  /* @__PURE__ */ createBaseVNode("p", { class: "user-info" }, [
    /* @__PURE__ */ createBaseVNode("span", { class: "name" }, "Alice C."),
    /* @__PURE__ */ createTextVNode(" left a comment. ")
  ]),
  /* @__PURE__ */ createBaseVNode("p", { class: "time" }, "1 hour ago")
], -1);
const _hoisted_11$1 = { class: "notification-item" };
const _hoisted_12$1 = { class: "img-left" };
const _hoisted_13$1 = /* @__PURE__ */ createBaseVNode("div", { class: "user-content" }, [
  /* @__PURE__ */ createBaseVNode("p", { class: "user-info" }, [
    /* @__PURE__ */ createBaseVNode("span", { class: "name" }, "Joshua S."),
    /* @__PURE__ */ createTextVNode(" uploaded a file. ")
  ]),
  /* @__PURE__ */ createBaseVNode("p", { class: "time" }, "2 hours ago")
], -1);
const _hoisted_14 = { class: "notification-item" };
const _hoisted_15 = { class: "img-left" };
const _hoisted_16 = /* @__PURE__ */ createBaseVNode("div", { class: "user-content" }, [
  /* @__PURE__ */ createBaseVNode("p", { class: "user-info" }, [
    /* @__PURE__ */ createBaseVNode("span", { class: "name" }, "Tara S."),
    /* @__PURE__ */ createTextVNode(" sent you a message. ")
  ]),
  /* @__PURE__ */ createBaseVNode("p", { class: "time" }, "2 hours ago")
], -1);
const _hoisted_17 = { class: "notification-item" };
const _hoisted_18 = { class: "img-left" };
const _hoisted_19 = /* @__PURE__ */ createBaseVNode("div", { class: "user-content" }, [
  /* @__PURE__ */ createBaseVNode("p", { class: "user-info" }, [
    /* @__PURE__ */ createBaseVNode("span", { class: "name" }, "Melany W."),
    /* @__PURE__ */ createTextVNode(" left a comment. ")
  ]),
  /* @__PURE__ */ createBaseVNode("p", { class: "time" }, "3 hours ago")
], -1);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const dropdownElement = ref();
    const dropdown = useDropdown(dropdownElement);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "dropdownElement",
        ref: dropdownElement,
        class: "navbar-item has-dropdown is-notification is-hidden-tablet is-hidden-desktop"
      }, [
        createBaseVNode("a", {
          class: "navbar-link is-arrowless",
          tabindex: "0",
          onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers((...args) => unref(dropdown).toggle && unref(dropdown).toggle(...args), ["prevent"]), ["space"])),
          onClick: _cache[1] || (_cache[1] = (...args) => unref(dropdown).toggle && unref(dropdown).toggle(...args))
        }, _hoisted_3$1, 32),
        createBaseVNode("div", _hoisted_4$1, [
          _hoisted_5$1,
          createBaseVNode("div", _hoisted_6$1, [
            createBaseVNode("ul", _hoisted_7$1, [
              createBaseVNode("li", null, [
                createBaseVNode("a", _hoisted_8$1, [
                  createBaseVNode("div", _hoisted_9$1, [
                    createBaseVNode("img", {
                      class: "user-photo",
                      alt: "",
                      src: _imports_0,
                      onErrorOnce: _cache[2] || (_cache[2] = (event) => unref(onceImageErrored)(event, "150x150"))
                    }, null, 32)
                  ]),
                  _hoisted_10$1
                ])
              ]),
              createBaseVNode("li", null, [
                createBaseVNode("a", _hoisted_11$1, [
                  createBaseVNode("div", _hoisted_12$1, [
                    createBaseVNode("img", {
                      class: "user-photo",
                      alt: "",
                      src: _imports_1,
                      onErrorOnce: _cache[3] || (_cache[3] = (event) => unref(onceImageErrored)(event, "150x150"))
                    }, null, 32)
                  ]),
                  _hoisted_13$1
                ])
              ]),
              createBaseVNode("li", null, [
                createBaseVNode("a", _hoisted_14, [
                  createBaseVNode("div", _hoisted_15, [
                    createBaseVNode("img", {
                      class: "user-photo",
                      alt: "",
                      src: _imports_2,
                      onErrorOnce: _cache[4] || (_cache[4] = (event) => unref(onceImageErrored)(event, "150x150"))
                    }, null, 32)
                  ]),
                  _hoisted_16
                ])
              ]),
              createBaseVNode("li", null, [
                createBaseVNode("a", _hoisted_17, [
                  createBaseVNode("div", _hoisted_18, [
                    createBaseVNode("img", {
                      class: "user-photo",
                      alt: "",
                      src: _imports_3,
                      onErrorOnce: _cache[5] || (_cache[5] = (event) => unref(onceImageErrored)(event, "150x150"))
                    }, null, 32)
                  ]),
                  _hoisted_19
                ])
              ])
            ])
          ])
        ])
      ], 512);
    };
  }
});
const _hoisted_1 = { class: "sidebar-layout" };
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("div", { class: "app-overlay" }, null, -1);
const _hoisted_3 = { class: "brand-end" };
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify",
  "data-icon": "feather:home"
}, null, -1);
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("li", null, [
  /* @__PURE__ */ createBaseVNode("a", { href: "#" }, [
    /* @__PURE__ */ createBaseVNode("i", {
      "aria-hidden": "true",
      class: "iconify",
      "data-icon": "feather:settings"
    })
  ])
], -1);
const _hoisted_6 = /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  class: "iconify sidebar-svg",
  "data-icon": "feather:home"
}, null, -1);
const _hoisted_7 = [
  _hoisted_6
];
const _hoisted_8 = { class: "page-title has-text-centered" };
const _hoisted_9 = { class: "menu-toggle has-chevron" };
const _hoisted_10 = /* @__PURE__ */ createBaseVNode("span", { class: "rotate" }, [
  /* @__PURE__ */ createBaseVNode("i", {
    "aria-hidden": "true",
    class: "icon-line-top"
  }),
  /* @__PURE__ */ createBaseVNode("i", {
    "aria-hidden": "true",
    class: "icon-line-center"
  }),
  /* @__PURE__ */ createBaseVNode("i", {
    "aria-hidden": "true",
    class: "icon-line-bottom"
  })
], -1);
const _hoisted_11 = [
  _hoisted_10
];
const _hoisted_12 = { class: "title-wrap" };
const _hoisted_13 = { class: "title is-4" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  props: {
    theme: { default: "default" },
    defaultSidebar: { default: "dashboard" },
    closeOnChange: { type: Boolean },
    openOnMounted: { type: Boolean },
    nowrap: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const viewWrapper = useViewWrapper();
    const route = useRoute();
    const isMobileSidebarOpen = ref(false);
    const isDesktopSidebarOpen = ref(props.openOnMounted);
    const activeMobileSubsidebar = ref(props.defaultSidebar);
    function switchSidebar(id) {
      if (id === activeMobileSubsidebar.value) {
        isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value;
      } else {
        isDesktopSidebarOpen.value = true;
        activeMobileSubsidebar.value = id;
      }
    }
    watchPostEffect(() => {
      var _a;
      viewWrapper.setPushed((_a = isDesktopSidebarOpen.value) != null ? _a : false);
    });
    watch(() => route.fullPath, () => {
      isMobileSidebarOpen.value = false;
      if (props.closeOnChange && isDesktopSidebarOpen.value) {
        isDesktopSidebarOpen.value = false;
      }
    });
    return (_ctx, _cache) => {
      const _component_AnimatedLogo = __unplugin_components_0$1;
      const _component_RouterLink = resolveComponent("RouterLink");
      const _component_NotificationsMobileDropdown = _sfc_main$2;
      const _component_UserProfileDropdown = __unplugin_components_2;
      const _component_MobileNavbar = _sfc_main$5;
      const _component_MobileSidebar = _sfc_main$6;
      const _component_DashboardsMobileSubsidebar = __unplugin_components_5;
      const _component_Sidebar = _sfc_main$9;
      const _component_DashboardsSubsidebar = _sfc_main$a;
      const _component_LanguagesPanel = _sfc_main$b;
      const _component_Toolbar = _sfc_main$c;
      const _component_VPageContent = __unplugin_components_10;
      const _component_VPageContentWrapper = __unplugin_components_11;
      const _component_VViewWrapper = _sfc_main$f;
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _hoisted_2,
        createVNode(_component_MobileNavbar, {
          "is-open": isMobileSidebarOpen.value,
          onToggle: _cache[0] || (_cache[0] = ($event) => isMobileSidebarOpen.value = !isMobileSidebarOpen.value)
        }, {
          brand: withCtx(() => [
            createVNode(_component_RouterLink, {
              to: { name: "index" },
              class: "navbar-item is-brand"
            }, {
              default: withCtx(() => [
                createVNode(_component_AnimatedLogo, {
                  width: "38px",
                  height: "38px"
                })
              ]),
              _: 1
            }),
            createBaseVNode("div", _hoisted_3, [
              createVNode(_component_NotificationsMobileDropdown),
              createVNode(_component_UserProfileDropdown)
            ])
          ]),
          _: 1
        }, 8, ["is-open"]),
        createVNode(_component_MobileSidebar, {
          "is-open": isMobileSidebarOpen.value,
          onToggle: _cache[1] || (_cache[1] = ($event) => isMobileSidebarOpen.value = !isMobileSidebarOpen.value)
        }, {
          links: withCtx(() => [
            createBaseVNode("li", null, [
              createVNode(_component_RouterLink, { to: { name: "app" } }, {
                default: withCtx(() => [
                  _hoisted_4
                ]),
                _: 1
              })
            ])
          ]),
          "bottom-links": withCtx(() => [
            _hoisted_5
          ]),
          _: 1
        }, 8, ["is-open"]),
        createVNode(Transition, { name: "slide-x" }, {
          default: withCtx(() => [
            isMobileSidebarOpen.value && activeMobileSubsidebar.value === "dashboard" ? (openBlock(), createBlock(_component_DashboardsMobileSubsidebar, { key: 0 })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(_component_Sidebar, {
          theme: props.theme,
          "is-open": isDesktopSidebarOpen.value
        }, {
          links: withCtx(() => [
            createBaseVNode("li", null, [
              createBaseVNode("a", {
                class: normalizeClass([activeMobileSubsidebar.value === "dashboard" && "is-active"]),
                "data-content": "Dashboards",
                tabindex: "0",
                onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers(($event) => switchSidebar("dashboard"), ["prevent"]), ["space"])),
                onClick: _cache[3] || (_cache[3] = ($event) => switchSidebar("dashboard"))
              }, _hoisted_7, 34)
            ])
          ]),
          _: 1
        }, 8, ["theme", "is-open"]),
        createVNode(Transition, { name: "slide-x" }, {
          default: withCtx(() => [
            isDesktopSidebarOpen.value && activeMobileSubsidebar.value === "dashboard" ? (openBlock(), createBlock(_component_DashboardsSubsidebar, {
              key: 0,
              onClose: _cache[4] || (_cache[4] = ($event) => isDesktopSidebarOpen.value = false)
            })) : createCommentVNode("", true)
          ]),
          _: 1
        }),
        createVNode(_component_LanguagesPanel),
        createVNode(_component_VViewWrapper, null, {
          default: withCtx(() => [
            createVNode(_component_VPageContentWrapper, null, {
              default: withCtx(() => [
                props.nowrap ? renderSlot(_ctx.$slots, "default", { key: 0 }) : (openBlock(), createBlock(_component_VPageContent, {
                  key: 1,
                  class: "is-relative"
                }, {
                  default: withCtx(() => [
                    createBaseVNode("div", _hoisted_8, [
                      createBaseVNode("div", {
                        class: "vuero-hamburger nav-trigger push-resize",
                        tabindex: "0",
                        onKeydown: _cache[5] || (_cache[5] = withKeys(withModifiers(($event) => isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value, ["prevent"]), ["space"])),
                        onClick: _cache[6] || (_cache[6] = ($event) => isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value)
                      }, [
                        createBaseVNode("span", _hoisted_9, [
                          createBaseVNode("span", {
                            class: normalizeClass([[isDesktopSidebarOpen.value && "active"], "icon-box-toggle"])
                          }, _hoisted_11, 2)
                        ])
                      ], 32),
                      createBaseVNode("div", _hoisted_12, [
                        createBaseVNode("h1", _hoisted_13, toDisplayString(unref(viewWrapper).pageTitle), 1)
                      ]),
                      createVNode(_component_Toolbar, { class: "desktop-toolbar" })
                    ]),
                    renderSlot(_ctx.$slots, "default")
                  ]),
                  _: 3
                }))
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]);
    };
  }
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  setup(__props) {
    const route = useRoute();
    return (_ctx, _cache) => {
      const _component_RouterView = resolveComponent("RouterView");
      const _component_AppLayout = _sfc_main$1;
      return openBlock(), createBlock(_component_AppLayout, null, {
        default: withCtx(() => [
          createVNode(_component_RouterView, null, {
            default: withCtx(({ Component }) => [
              createVNode(Transition, {
                name: "fade-fast",
                mode: "out-in"
              }, {
                default: withCtx(() => [
                  (openBlock(), createBlock(resolveDynamicComponent(Component), {
                    key: unref(route).fullPath
                  }))
                ]),
                _: 2
              }, 1024)
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
if (typeof block0 === "function")
  block0(_sfc_main);
export { _sfc_main as default };

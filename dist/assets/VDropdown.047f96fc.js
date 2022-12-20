var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { W as defineStore, B as ref, A as defineComponent, f as computed, o as openBlock, k as createElementBlock, G as unref, m as normalizeClass, r as reactive, a4 as onClickOutside, a5 as watchEffect, j as renderSlot, Y as withKeys, y as withModifiers, v as createVNode, t as toDisplayString, p as createCommentVNode, l as createBaseVNode, i as createBlock, a6 as normalizeProps, a7 as guardReactiveProps } from "./index.2c4f64fa.js";
const useViewWrapper = defineStore("viewWrapper", () => {
  const isPushed = ref(false);
  const isPushedBlock = ref(false);
  const pageTitle = ref("Welcome");
  function setPushed(value) {
    isPushed.value = value;
  }
  function setPushedBlock(value) {
    isPushedBlock.value = value;
  }
  function setPageTitle(value) {
    pageTitle.value = value;
  }
  return {
    isPushed,
    isPushedBlock,
    pageTitle,
    setPushed,
    setPushedBlock,
    setPageTitle
  };
});
const _hoisted_1$1 = ["data-icon"];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  props: {
    icon: null
  },
  setup(__props) {
    const props = __props;
    const isIconify = computed(() => {
      return props.icon && props.icon.indexOf(":") !== -1;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", {
        key: props.icon
      }, [
        unref(isIconify) ? (openBlock(), createElementBlock("i", {
          key: 0,
          "aria-hidden": "true",
          class: "iconify",
          "data-icon": props.icon
        }, null, 8, _hoisted_1$1)) : (openBlock(), createElementBlock("i", {
          key: 1,
          "aria-hidden": "true",
          class: normalizeClass(props.icon)
        }, null, 2))
      ]);
    };
  }
});
function useDropdown(container) {
  const isOpen = ref(false);
  onClickOutside(container, () => {
    isOpen.value = false;
  });
  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };
  const toggle = () => {
    isOpen.value = !isOpen.value;
  };
  watchEffect(() => {
    if (!container.value) {
      return;
    }
    if (isOpen.value) {
      container.value.classList.add("is-active");
    } else {
      container.value.classList.remove("is-active");
    }
  });
  return reactive({
    isOpen,
    open,
    close,
    toggle
  });
}
var VDropdown_vue_vue_type_style_index_0_lang = "";
const _hoisted_1 = { key: 0 };
const _hoisted_2 = {
  class: "dropdown-menu",
  role: "menu"
};
const _hoisted_3 = { class: "dropdown-content" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  props: {
    title: { default: void 0 },
    color: { default: void 0 },
    icon: { default: void 0 },
    up: { type: Boolean },
    right: { type: Boolean },
    modern: { type: Boolean },
    spaced: { type: Boolean }
  },
  setup(__props, { expose }) {
    const props = __props;
    const dropdownElement = ref();
    const dropdown = useDropdown(dropdownElement);
    expose(__spreadValues({}, dropdown));
    return (_ctx, _cache) => {
      const _component_VIcon = _sfc_main$1;
      return openBlock(), createElementBlock("div", {
        ref_key: "dropdownElement",
        ref: dropdownElement,
        class: normalizeClass([[
          props.right && "is-right",
          props.up && "is-up",
          props.icon && "is-dots",
          props.modern && "is-modern",
          props.spaced && "is-spaced"
        ], "dropdown"])
      }, [
        renderSlot(_ctx.$slots, "button", normalizeProps(guardReactiveProps(unref(dropdown))), () => [
          props.icon ? (openBlock(), createElementBlock("a", {
            key: 0,
            tabindex: "0",
            class: "is-trigger dropdown-trigger",
            "aria-label": "View more actions",
            onKeydown: _cache[0] || (_cache[0] = withKeys(withModifiers((...args) => unref(dropdown).toggle && unref(dropdown).toggle(...args), ["prevent"]), ["space"])),
            onClick: _cache[1] || (_cache[1] = (...args) => unref(dropdown).toggle && unref(dropdown).toggle(...args))
          }, [
            createVNode(_component_VIcon, {
              icon: props.icon
            }, null, 8, ["icon"])
          ], 32)) : (openBlock(), createElementBlock("a", {
            key: 1,
            tabindex: "0",
            class: normalizeClass(["is-trigger button dropdown-trigger", [props.color && `is-${props.color}`]]),
            onKeydown: _cache[2] || (_cache[2] = withKeys(withModifiers((...args) => unref(dropdown).toggle && unref(dropdown).toggle(...args), ["prevent"]), ["space"])),
            onClick: _cache[3] || (_cache[3] = (...args) => unref(dropdown).toggle && unref(dropdown).toggle(...args))
          }, [
            props.title ? (openBlock(), createElementBlock("span", _hoisted_1, toDisplayString(props.title), 1)) : createCommentVNode("", true),
            createBaseVNode("span", {
              class: normalizeClass([!props.modern && "base-caret", props.modern && "base-caret"])
            }, [
              !unref(dropdown).isOpen ? (openBlock(), createBlock(_component_VIcon, {
                key: 0,
                icon: "fa:angle-down"
              })) : (openBlock(), createBlock(_component_VIcon, {
                key: 1,
                icon: "fa:angle-up"
              }))
            ], 2)
          ], 34))
        ]),
        createBaseVNode("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            renderSlot(_ctx.$slots, "content", normalizeProps(guardReactiveProps(unref(dropdown))))
          ])
        ])
      ], 2);
    };
  }
});
export { _sfc_main as _, useDropdown as a, useViewWrapper as u };

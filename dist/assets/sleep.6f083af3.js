import { u as useVFieldContext, b as _sfc_main$2 } from "./VControl.725fb454.js";
import { A as defineComponent, r as reactive, ak as useSlots, f as computed, o as openBlock, k as createElementBlock, G as unref, F as Fragment, l as createBaseVNode, j as renderSlot, v as createVNode, w as withCtx, q as createTextVNode, t as toDisplayString, a6 as normalizeProps, a7 as guardReactiveProps, z as mergeProps, m as normalizeClass, B as ref, E as watch, Z as withDirectives, al as vModelText } from "./index.2c4f64fa.js";
const _hoisted_1$1 = { class: "field-label is-normal" };
const _hoisted_2 = { class: "field-body" };
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  props: {
    id: { default: void 0 },
    label: { default: void 0 },
    addons: { type: Boolean },
    textaddon: { type: Boolean },
    grouped: { type: Boolean },
    multiline: { type: Boolean },
    horizontal: { type: Boolean },
    subcontrol: { type: Boolean },
    raw: { type: Boolean }
  },
  setup(__props, { expose }) {
    const props = __props;
    const vFieldContext = reactive(useVFieldContext({ id: props.id, inherit: !props.subcontrol }));
    const slots = useSlots();
    const hasLabel = computed(() => {
      var _a;
      return Boolean(((_a = slots == null ? void 0 : slots.label) == null ? void 0 : _a.call(slots)) || props.label);
    });
    const classes = computed(() => {
      if (props.raw)
        return [];
      return [
        "field",
        props.addons && "has-addons",
        props.textaddon && "has-textarea-addon",
        props.grouped && "is-grouped",
        props.grouped && props.multiline && "is-grouped-multiline",
        props.horizontal && "is-horizontal"
      ];
    });
    expose(vFieldContext);
    return (_ctx, _cache) => {
      const _component_VLabel = _sfc_main$2;
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(classes))
      }, [
        unref(hasLabel) && props.horizontal ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          createBaseVNode("div", _hoisted_1$1, [
            renderSlot(_ctx.$slots, "label", normalizeProps(guardReactiveProps(unref(vFieldContext))), () => [
              createVNode(_component_VLabel, null, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(props.label), 1)
                ]),
                _: 1
              })
            ])
          ]),
          createBaseVNode("div", _hoisted_2, [
            renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(unref(vFieldContext))))
          ])
        ], 64)) : unref(hasLabel) ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          renderSlot(_ctx.$slots, "label", normalizeProps(guardReactiveProps(unref(vFieldContext))), () => [
            createVNode(_component_VLabel, null, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(props.label), 1)
              ]),
              _: 1
            })
          ]),
          renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(unref(vFieldContext))))
        ], 64)) : renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 2 }, unref(vFieldContext))))
      ], 2);
    };
  }
});
const _hoisted_1 = ["id", "name", "true-value", "false-value"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  props: {
    raw: { type: Boolean },
    modelValue: { default: "" },
    trueValue: { type: Boolean, default: true },
    falseValue: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: emits }) {
    var _a, _b;
    const props = __props;
    const vFieldContext = reactive(useVFieldContext({
      create: false,
      help: "VInput"
    }));
    const value = ref((_b = (_a = vFieldContext.field) == null ? void 0 : _a.value) != null ? _b : props.modelValue);
    watch(value, () => {
      emits("update:modelValue", value.value);
    });
    watch(() => props.modelValue, () => {
      value.value = props.modelValue;
    });
    const classes = computed(() => {
      if (props.raw)
        return [];
      return ["input"];
    });
    return (_ctx, _cache) => {
      return withDirectives((openBlock(), createElementBlock("input", {
        id: unref(vFieldContext).id,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
        class: normalizeClass(unref(classes)),
        name: unref(vFieldContext).id,
        "true-value": props.trueValue,
        "false-value": props.falseValue,
        onChange: _cache[1] || (_cache[1] = (...args) => {
          var _a2, _b2;
          return ((_a2 = unref(vFieldContext).field) == null ? void 0 : _a2.handleChange) && ((_b2 = unref(vFieldContext).field) == null ? void 0 : _b2.handleChange(...args));
        }),
        onBlur: _cache[2] || (_cache[2] = (...args) => {
          var _a2, _b2;
          return ((_a2 = unref(vFieldContext).field) == null ? void 0 : _a2.handleBlur) && ((_b2 = unref(vFieldContext).field) == null ? void 0 : _b2.handleBlur(...args));
        })
      }, null, 42, _hoisted_1)), [
        [vModelText, value.value]
      ]);
    };
  }
});
var _imports_0 = "/assets/vuero-banking-light.ffde3acf.webp";
var _imports_1 = "/assets/vuero-banking-dark.4fa5877a.webp";
function sleep(time = 1e3) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
export { _sfc_main as _, _sfc_main$1 as a, _imports_0 as b, _imports_1 as c, sleep as s };

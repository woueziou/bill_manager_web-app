import { A as defineComponent, a9 as toRef, f as computed, E as watch, a3 as resolveDynamicComponent, h, B as ref, r as reactive, G as unref, D as nextTick, I as isRef, aa as warn$1, C as onMounted, ab as provide, a5 as watchEffect, ac as inject, ad as onBeforeUnmount, ae as markRaw, af as readonly, K as getCurrentInstance, o as openBlock, k as createElementBlock, j as renderSlot, a6 as normalizeProps, a7 as guardReactiveProps, m as normalizeClass, Y as withKeys, y as withModifiers, i as createBlock, w as withCtx, Z as withDirectives, ag as vModelCheckbox, l as createBaseVNode, z as mergeProps, q as createTextVNode, t as toDisplayString, V as _export_sfc, F as Fragment, p as createCommentVNode, ah as pushScopeId, ai as popScopeId } from "./index.2c4f64fa.js";
/**
  * vee-validate v4.5.11
  * (c) 2022 Abdelrahman Awad
  * @license MIT
  */
function isCallable(fn) {
  return typeof fn === "function";
}
function isNullOrUndefined(value) {
  return value === null || value === void 0;
}
const isObject$1 = (obj) => obj !== null && !!obj && typeof obj === "object" && !Array.isArray(obj);
function isIndex(value) {
  return Number(value) >= 0;
}
function toNumber(value) {
  const n = parseFloat(value);
  return isNaN(n) ? value : n;
}
const RULES = {};
function resolveRule(id) {
  return RULES[id];
}
const FormContextKey = Symbol("vee-validate-form");
const FieldContextKey = Symbol("vee-validate-field-instance");
const IS_ABSENT = Symbol("Default empty value");
function isLocator(value) {
  return isCallable(value) && !!value.__locatorRef;
}
function isHTMLTag(tag) {
  return ["input", "textarea", "select"].includes(tag);
}
function isFileInputNode(tag, attrs) {
  return isHTMLTag(tag) && attrs.type === "file";
}
function isYupValidator(value) {
  return !!value && isCallable(value.validate);
}
function hasCheckedAttr(type) {
  return type === "checkbox" || type === "radio";
}
function isContainerValue(value) {
  return isObject$1(value) || Array.isArray(value);
}
function isEmptyContainer(value) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return isObject$1(value) && Object.keys(value).length === 0;
}
function isNotNestedPath(path) {
  return /^\[.+\]$/i.test(path);
}
function isNativeMultiSelect(el) {
  return isNativeSelect(el) && el.multiple;
}
function isNativeSelect(el) {
  return el.tagName === "SELECT";
}
function isNativeMultiSelectNode(tag, attrs) {
  const hasTruthyBindingValue = ![false, null, void 0, 0].includes(attrs.multiple) && !Number.isNaN(attrs.multiple);
  return tag === "select" && "multiple" in attrs && hasTruthyBindingValue;
}
function shouldHaveValueBinding(tag, attrs) {
  return isNativeMultiSelectNode(tag, attrs) || isFileInputNode(tag, attrs);
}
function isFormSubmitEvent(evt) {
  return isEvent(evt) && evt.target && "submit" in evt.target;
}
function isEvent(evt) {
  if (!evt) {
    return false;
  }
  if (typeof Event !== "undefined" && isCallable(Event) && evt instanceof Event) {
    return true;
  }
  if (evt && evt.srcElement) {
    return true;
  }
  return false;
}
function isPropPresent(obj, prop) {
  return prop in obj && obj[prop] !== IS_ABSENT;
}
function cleanupNonNestedPath(path) {
  if (isNotNestedPath(path)) {
    return path.replace(/\[|\]/gi, "");
  }
  return path;
}
function getFromPath(object, path, fallback) {
  if (!object) {
    return fallback;
  }
  if (isNotNestedPath(path)) {
    return object[cleanupNonNestedPath(path)];
  }
  const resolvedValue = (path || "").split(/\.|\[(\d+)\]/).filter(Boolean).reduce((acc, propKey) => {
    if (isContainerValue(acc) && propKey in acc) {
      return acc[propKey];
    }
    return fallback;
  }, object);
  return resolvedValue;
}
function setInPath(object, path, value) {
  if (isNotNestedPath(path)) {
    object[cleanupNonNestedPath(path)] = value;
    return;
  }
  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc = object;
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      acc[keys[i]] = value;
      return;
    }
    if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
      acc[keys[i]] = isIndex(keys[i + 1]) ? [] : {};
    }
    acc = acc[keys[i]];
  }
}
function unset(object, key) {
  if (Array.isArray(object) && isIndex(key)) {
    object.splice(Number(key), 1);
    return;
  }
  if (isObject$1(object)) {
    delete object[key];
  }
}
function unsetPath(object, path) {
  if (isNotNestedPath(path)) {
    delete object[cleanupNonNestedPath(path)];
    return;
  }
  const keys = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let acc = object;
  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      unset(acc, keys[i]);
      break;
    }
    if (!(keys[i] in acc) || isNullOrUndefined(acc[keys[i]])) {
      break;
    }
    acc = acc[keys[i]];
  }
  const pathValues = keys.map((_, idx) => {
    return getFromPath(object, keys.slice(0, idx).join("."));
  });
  for (let i = pathValues.length - 1; i >= 0; i--) {
    if (!isEmptyContainer(pathValues[i])) {
      continue;
    }
    if (i === 0) {
      unset(object, keys[0]);
      continue;
    }
    unset(pathValues[i - 1], keys[i - 1]);
  }
}
function keysOf(record) {
  return Object.keys(record);
}
function injectWithSelf(symbol, def = void 0) {
  const vm = getCurrentInstance();
  return (vm === null || vm === void 0 ? void 0 : vm.provides[symbol]) || inject(symbol, def);
}
function warn(message) {
  warn$1(`[vee-validate]: ${message}`);
}
function resolveNextCheckboxValue(currentValue, checkedValue, uncheckedValue) {
  if (Array.isArray(currentValue)) {
    const newVal = [...currentValue];
    const idx = newVal.indexOf(checkedValue);
    idx >= 0 ? newVal.splice(idx, 1) : newVal.push(checkedValue);
    return newVal;
  }
  return currentValue === checkedValue ? uncheckedValue : checkedValue;
}
function debounceAsync(inner, ms = 0) {
  let timer = null;
  let resolves = [];
  return function(...args) {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      const result = inner(...args);
      resolves.forEach((r) => r(result));
      resolves = [];
    }, ms);
    return new Promise((resolve) => resolves.push(resolve));
  };
}
const normalizeChildren = (tag, context, slotProps) => {
  if (!context.slots.default) {
    return context.slots.default;
  }
  if (typeof tag === "string" || !tag) {
    return context.slots.default(slotProps());
  }
  return {
    default: () => {
      var _a, _b;
      return (_b = (_a = context.slots).default) === null || _b === void 0 ? void 0 : _b.call(_a, slotProps());
    }
  };
};
function getBoundValue(el) {
  if (hasValueBinding(el)) {
    return el._value;
  }
  return void 0;
}
function hasValueBinding(el) {
  return "_value" in el;
}
function normalizeEventValue(value) {
  if (!isEvent(value)) {
    return value;
  }
  const input = value.target;
  if (hasCheckedAttr(input.type) && hasValueBinding(input)) {
    return getBoundValue(input);
  }
  if (input.type === "file" && input.files) {
    return Array.from(input.files);
  }
  if (isNativeMultiSelect(input)) {
    return Array.from(input.options).filter((opt) => opt.selected && !opt.disabled).map(getBoundValue);
  }
  if (isNativeSelect(input)) {
    const selectedOption = Array.from(input.options).find((opt) => opt.selected);
    return selectedOption ? getBoundValue(selectedOption) : input.value;
  }
  return input.value;
}
function normalizeRules(rules) {
  const acc = {};
  Object.defineProperty(acc, "_$$isNormalized", {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });
  if (!rules) {
    return acc;
  }
  if (isObject$1(rules) && rules._$$isNormalized) {
    return rules;
  }
  if (isObject$1(rules)) {
    return Object.keys(rules).reduce((prev, curr) => {
      const params = normalizeParams(rules[curr]);
      if (rules[curr] !== false) {
        prev[curr] = buildParams(params);
      }
      return prev;
    }, acc);
  }
  if (typeof rules !== "string") {
    return acc;
  }
  return rules.split("|").reduce((prev, rule) => {
    const parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev;
    }
    prev[parsedRule.name] = buildParams(parsedRule.params);
    return prev;
  }, acc);
}
function normalizeParams(params) {
  if (params === true) {
    return [];
  }
  if (Array.isArray(params)) {
    return params;
  }
  if (isObject$1(params)) {
    return params;
  }
  return [params];
}
function buildParams(provided) {
  const mapValueToLocator = (value) => {
    if (typeof value === "string" && value[0] === "@") {
      return createLocator(value.slice(1));
    }
    return value;
  };
  if (Array.isArray(provided)) {
    return provided.map(mapValueToLocator);
  }
  if (provided instanceof RegExp) {
    return [provided];
  }
  return Object.keys(provided).reduce((prev, key) => {
    prev[key] = mapValueToLocator(provided[key]);
    return prev;
  }, {});
}
const parseRule = (rule) => {
  let params = [];
  const name = rule.split(":")[0];
  if (rule.includes(":")) {
    params = rule.split(":").slice(1).join(":").split(",");
  }
  return { name, params };
};
function createLocator(value) {
  const locator = (crossTable) => {
    const val = getFromPath(crossTable, value) || crossTable[value];
    return val;
  };
  locator.__locatorRef = value;
  return locator;
}
function extractLocators(params) {
  if (Array.isArray(params)) {
    return params.filter(isLocator);
  }
  return keysOf(params).filter((key) => isLocator(params[key])).map((key) => params[key]);
}
const DEFAULT_CONFIG = {
  generateMessage: ({ field }) => `${field} is not valid.`,
  bails: true,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true
};
let currentConfig = Object.assign({}, DEFAULT_CONFIG);
const getConfig = () => currentConfig;
async function validate(value, rules, options = {}) {
  const shouldBail = options === null || options === void 0 ? void 0 : options.bails;
  const field = {
    name: (options === null || options === void 0 ? void 0 : options.name) || "{field}",
    rules,
    bails: shouldBail !== null && shouldBail !== void 0 ? shouldBail : true,
    formData: (options === null || options === void 0 ? void 0 : options.values) || {}
  };
  const result = await _validate(field, value);
  const errors = result.errors;
  return {
    errors,
    valid: !errors.length
  };
}
async function _validate(field, value) {
  if (isYupValidator(field.rules)) {
    return validateFieldWithYup(value, field.rules, { bails: field.bails });
  }
  if (isCallable(field.rules) || Array.isArray(field.rules)) {
    const ctx = {
      field: field.name,
      form: field.formData,
      value
    };
    const pipeline = Array.isArray(field.rules) ? field.rules : [field.rules];
    const length2 = pipeline.length;
    const errors2 = [];
    for (let i = 0; i < length2; i++) {
      const rule = pipeline[i];
      const result = await rule(value, ctx);
      const isValid = typeof result !== "string" && result;
      if (isValid) {
        continue;
      }
      const message = typeof result === "string" ? result : _generateFieldError(ctx);
      errors2.push(message);
      if (field.bails) {
        return {
          errors: errors2
        };
      }
    }
    return {
      errors: errors2
    };
  }
  const normalizedContext = Object.assign(Object.assign({}, field), { rules: normalizeRules(field.rules) });
  const errors = [];
  const rulesKeys = Object.keys(normalizedContext.rules);
  const length = rulesKeys.length;
  for (let i = 0; i < length; i++) {
    const rule = rulesKeys[i];
    const result = await _test(normalizedContext, value, {
      name: rule,
      params: normalizedContext.rules[rule]
    });
    if (result.error) {
      errors.push(result.error);
      if (field.bails) {
        return {
          errors
        };
      }
    }
  }
  return {
    errors
  };
}
async function validateFieldWithYup(value, validator, opts) {
  var _a;
  const errors = await validator.validate(value, {
    abortEarly: (_a = opts.bails) !== null && _a !== void 0 ? _a : true
  }).then(() => []).catch((err) => {
    if (err.name === "ValidationError") {
      return err.errors;
    }
    throw err;
  });
  return {
    errors
  };
}
async function _test(field, value, rule) {
  const validator = resolveRule(rule.name);
  if (!validator) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }
  const params = fillTargetValues(rule.params, field.formData);
  const ctx = {
    field: field.name,
    value,
    form: field.formData,
    rule: Object.assign(Object.assign({}, rule), { params })
  };
  const result = await validator(value, params, ctx);
  if (typeof result === "string") {
    return {
      error: result
    };
  }
  return {
    error: result ? void 0 : _generateFieldError(ctx)
  };
}
function _generateFieldError(fieldCtx) {
  const message = getConfig().generateMessage;
  if (!message) {
    return "Field is invalid";
  }
  return message(fieldCtx);
}
function fillTargetValues(params, crossTable) {
  const normalize = (value) => {
    if (isLocator(value)) {
      return value(crossTable);
    }
    return value;
  };
  if (Array.isArray(params)) {
    return params.map(normalize);
  }
  return Object.keys(params).reduce((acc, param) => {
    acc[param] = normalize(params[param]);
    return acc;
  }, {});
}
async function validateYupSchema(schema, values) {
  const errorObjects = await schema.validate(values, { abortEarly: false }).then(() => []).catch((err) => {
    if (err.name !== "ValidationError") {
      throw err;
    }
    return err.inner || [];
  });
  const results = {};
  const errors = {};
  for (const error of errorObjects) {
    const messages = error.errors;
    results[error.path] = { valid: !messages.length, errors: messages };
    if (messages.length) {
      errors[error.path] = messages[0];
    }
  }
  return {
    valid: !errorObjects.length,
    results,
    errors
  };
}
async function validateObjectSchema(schema, values, opts) {
  const paths = keysOf(schema);
  const validations = paths.map(async (path) => {
    var _a, _b, _c;
    const fieldResult = await validate(getFromPath(values, path), schema[path], {
      name: ((_a = opts === null || opts === void 0 ? void 0 : opts.names) === null || _a === void 0 ? void 0 : _a[path]) || path,
      values,
      bails: (_c = (_b = opts === null || opts === void 0 ? void 0 : opts.bailsMap) === null || _b === void 0 ? void 0 : _b[path]) !== null && _c !== void 0 ? _c : true
    });
    return Object.assign(Object.assign({}, fieldResult), { path });
  });
  let isAllValid = true;
  const validationResults = await Promise.all(validations);
  const results = {};
  const errors = {};
  for (const result of validationResults) {
    results[result.path] = {
      valid: result.valid,
      errors: result.errors
    };
    if (!result.valid) {
      isAllValid = false;
      errors[result.path] = result.errors[0];
    }
  }
  return {
    valid: isAllValid,
    results,
    errors
  };
}
function set(obj, key, val) {
  if (typeof val.value === "object")
    val.value = klona(val.value);
  if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === "__proto__") {
    Object.defineProperty(obj, key, val);
  } else
    obj[key] = val.value;
}
function klona(x) {
  if (typeof x !== "object")
    return x;
  var i = 0, k, list, tmp, str = Object.prototype.toString.call(x);
  if (str === "[object Object]") {
    tmp = Object.create(x.__proto__ || null);
  } else if (str === "[object Array]") {
    tmp = Array(x.length);
  } else if (str === "[object Set]") {
    tmp = /* @__PURE__ */ new Set();
    x.forEach(function(val) {
      tmp.add(klona(val));
    });
  } else if (str === "[object Map]") {
    tmp = /* @__PURE__ */ new Map();
    x.forEach(function(val, key) {
      tmp.set(klona(key), klona(val));
    });
  } else if (str === "[object Date]") {
    tmp = new Date(+x);
  } else if (str === "[object RegExp]") {
    tmp = new RegExp(x.source, x.flags);
  } else if (str === "[object DataView]") {
    tmp = new x.constructor(klona(x.buffer));
  } else if (str === "[object ArrayBuffer]") {
    tmp = x.slice(0);
  } else if (str.slice(-6) === "Array]") {
    tmp = new x.constructor(x);
  }
  if (tmp) {
    for (list = Object.getOwnPropertySymbols(x); i < list.length; i++) {
      set(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
    }
    for (i = 0, list = Object.getOwnPropertyNames(x); i < list.length; i++) {
      if (Object.hasOwnProperty.call(tmp, k = list[i]) && tmp[k] === x[k])
        continue;
      set(tmp, k, Object.getOwnPropertyDescriptor(x, k));
    }
  }
  return tmp || x;
}
var es6 = function equal(a, b) {
  if (a === b)
    return true;
  if (a && b && typeof a == "object" && typeof b == "object") {
    if (a.constructor !== b.constructor)
      return false;
    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (!equal(a[i], b[i]))
          return false;
      return true;
    }
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size)
        return false;
      for (i of a.entries())
        if (!b.has(i[0]))
          return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0])))
          return false;
      return true;
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size)
        return false;
      for (i of a.entries())
        if (!b.has(i[0]))
          return false;
      return true;
    }
    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length)
        return false;
      for (i = length; i-- !== 0; )
        if (a[i] !== b[i])
          return false;
      return true;
    }
    if (a.constructor === RegExp)
      return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf)
      return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString)
      return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length)
      return false;
    for (i = length; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
        return false;
    for (i = length; i-- !== 0; ) {
      var key = keys[i];
      if (!equal(a[key], b[key]))
        return false;
    }
    return true;
  }
  return a !== a && b !== b;
};
let ID_COUNTER = 0;
function useFieldState(path, init) {
  const { value, initialValue, setInitialValue } = _useFieldValue(path, init.modelValue, !init.standalone);
  const { errorMessage, errors, setErrors } = _useFieldErrors(path, !init.standalone);
  const meta = _useFieldMeta(value, initialValue, errors);
  const id = ID_COUNTER >= Number.MAX_SAFE_INTEGER ? 0 : ++ID_COUNTER;
  function setState(state) {
    var _a;
    if ("value" in state) {
      value.value = state.value;
    }
    if ("errors" in state) {
      setErrors(state.errors);
    }
    if ("touched" in state) {
      meta.touched = (_a = state.touched) !== null && _a !== void 0 ? _a : meta.touched;
    }
    if ("initialValue" in state) {
      setInitialValue(state.initialValue);
    }
  }
  return {
    id,
    path,
    value,
    initialValue,
    meta,
    errors,
    errorMessage,
    setState
  };
}
function _useFieldValue(path, modelValue, shouldInjectForm) {
  const form = shouldInjectForm ? injectWithSelf(FormContextKey, void 0) : void 0;
  const modelRef = ref(unref(modelValue));
  function resolveInitialValue2() {
    if (!form) {
      return unref(modelRef);
    }
    return getFromPath(form.meta.value.initialValues, unref(path), unref(modelRef));
  }
  function setInitialValue(value2) {
    if (!form) {
      modelRef.value = value2;
      return;
    }
    form.setFieldInitialValue(unref(path), value2);
  }
  const initialValue = computed(resolveInitialValue2);
  if (!form) {
    const value2 = ref(resolveInitialValue2());
    return {
      value: value2,
      initialValue,
      setInitialValue
    };
  }
  const currentValue = modelValue ? unref(modelValue) : getFromPath(form.values, unref(path), unref(initialValue));
  form.stageInitialValue(unref(path), currentValue);
  const value = computed({
    get() {
      return getFromPath(form.values, unref(path));
    },
    set(newVal) {
      form.setFieldValue(unref(path), newVal);
    }
  });
  return {
    value,
    initialValue,
    setInitialValue
  };
}
function _useFieldMeta(currentValue, initialValue, errors) {
  const meta = reactive({
    touched: false,
    pending: false,
    valid: true,
    validated: !!unref(errors).length,
    initialValue: computed(() => unref(initialValue)),
    dirty: computed(() => {
      return !es6(unref(currentValue), unref(initialValue));
    })
  });
  watch(errors, (value) => {
    meta.valid = !value.length;
  }, {
    immediate: true,
    flush: "sync"
  });
  return meta;
}
function _useFieldErrors(path, shouldInjectForm) {
  const form = shouldInjectForm ? injectWithSelf(FormContextKey, void 0) : void 0;
  function normalizeErrors(messages) {
    if (!messages) {
      return [];
    }
    return Array.isArray(messages) ? messages : [messages];
  }
  if (!form) {
    const errors2 = ref([]);
    return {
      errors: errors2,
      errorMessage: computed(() => errors2.value[0]),
      setErrors: (messages) => {
        errors2.value = normalizeErrors(messages);
      }
    };
  }
  const errors = computed(() => form.errorBag.value[unref(path)] || []);
  return {
    errors,
    errorMessage: computed(() => errors.value[0]),
    setErrors: (messages) => {
      form.setFieldErrorBag(unref(path), normalizeErrors(messages));
    }
  };
}
function useField(name, rules, opts) {
  if (hasCheckedAttr(opts === null || opts === void 0 ? void 0 : opts.type)) {
    return useCheckboxField(name, rules, opts);
  }
  return _useField(name, rules, opts);
}
function _useField(name, rules, opts) {
  const { initialValue: modelValue, validateOnMount, bails, type, checkedValue, label, validateOnValueUpdate, uncheckedValue, standalone } = normalizeOptions(unref(name), opts);
  const form = !standalone ? injectWithSelf(FormContextKey) : void 0;
  let markedForRemoval = false;
  const { id, value, initialValue, meta, setState, errors, errorMessage } = useFieldState(name, {
    modelValue,
    standalone
  });
  const handleBlur = () => {
    meta.touched = true;
  };
  const normalizedRules = computed(() => {
    let rulesValue = unref(rules);
    const schema = unref(form === null || form === void 0 ? void 0 : form.schema);
    if (schema && !isYupValidator(schema)) {
      rulesValue = extractRuleFromSchema(schema, unref(name)) || rulesValue;
    }
    if (isYupValidator(rulesValue) || isCallable(rulesValue) || Array.isArray(rulesValue)) {
      return rulesValue;
    }
    return normalizeRules(rulesValue);
  });
  async function validateCurrentValue(mode) {
    var _a, _b;
    if (form === null || form === void 0 ? void 0 : form.validateSchema) {
      return (_a = (await form.validateSchema(mode)).results[unref(name)]) !== null && _a !== void 0 ? _a : { valid: true, errors: [] };
    }
    return validate(value.value, normalizedRules.value, {
      name: unref(label) || unref(name),
      values: (_b = form === null || form === void 0 ? void 0 : form.values) !== null && _b !== void 0 ? _b : {},
      bails
    });
  }
  async function validateWithStateMutation() {
    meta.pending = true;
    meta.validated = true;
    const result = await validateCurrentValue("validated-only");
    if (markedForRemoval) {
      result.valid = true;
      result.errors = [];
    }
    setState({ errors: result.errors });
    meta.pending = false;
    return result;
  }
  async function validateValidStateOnly() {
    const result = await validateCurrentValue("silent");
    if (markedForRemoval) {
      result.valid = true;
    }
    meta.valid = result.valid;
    return result;
  }
  function validate$1(opts2) {
    if (!(opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) || (opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) === "force") {
      return validateWithStateMutation();
    }
    if ((opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) === "validated-only") {
      return validateWithStateMutation();
    }
    return validateValidStateOnly();
  }
  const handleChange = (e, shouldValidate = true) => {
    const newValue = normalizeEventValue(e);
    value.value = newValue;
    if (!validateOnValueUpdate && shouldValidate) {
      validateWithStateMutation();
    }
  };
  onMounted(() => {
    if (validateOnMount) {
      return validateWithStateMutation();
    }
    if (!form || !form.validateSchema) {
      validateValidStateOnly();
    }
  });
  function setTouched(isTouched) {
    meta.touched = isTouched;
  }
  let unwatchValue;
  function watchValue() {
    unwatchValue = watch(value, validateOnValueUpdate ? validateWithStateMutation : validateValidStateOnly, {
      deep: true
    });
  }
  watchValue();
  function resetField(state) {
    var _a;
    unwatchValue === null || unwatchValue === void 0 ? void 0 : unwatchValue();
    const newValue = state && "value" in state ? state.value : initialValue.value;
    setState({
      value: klona(newValue),
      initialValue: klona(newValue),
      touched: (_a = state === null || state === void 0 ? void 0 : state.touched) !== null && _a !== void 0 ? _a : false,
      errors: (state === null || state === void 0 ? void 0 : state.errors) || []
    });
    meta.pending = false;
    meta.validated = false;
    validateValidStateOnly();
    nextTick(() => {
      watchValue();
    });
  }
  function setValue(newValue) {
    value.value = newValue;
  }
  function setErrors(errors2) {
    setState({ errors: Array.isArray(errors2) ? errors2 : [errors2] });
  }
  const field = {
    id,
    name,
    label,
    value,
    meta,
    errors,
    errorMessage,
    type,
    checkedValue,
    uncheckedValue,
    bails,
    resetField,
    handleReset: () => resetField(),
    validate: validate$1,
    handleChange,
    handleBlur,
    setState,
    setTouched,
    setErrors,
    setValue
  };
  provide(FieldContextKey, field);
  if (isRef(rules) && typeof unref(rules) !== "function") {
    watch(rules, (value2, oldValue) => {
      if (es6(value2, oldValue)) {
        return;
      }
      meta.validated ? validateWithStateMutation() : validateValidStateOnly();
    }, {
      deep: true
    });
  }
  if (!form) {
    return field;
  }
  form.register(field);
  onBeforeUnmount(() => {
    markedForRemoval = true;
    form.unregister(field);
  });
  const dependencies = computed(() => {
    const rulesVal = normalizedRules.value;
    if (!rulesVal || isCallable(rulesVal) || isYupValidator(rulesVal) || Array.isArray(rulesVal)) {
      return {};
    }
    return Object.keys(rulesVal).reduce((acc, rule) => {
      const deps = extractLocators(rulesVal[rule]).map((dep) => dep.__locatorRef).reduce((depAcc, depName) => {
        const depValue = getFromPath(form.values, depName) || form.values[depName];
        if (depValue !== void 0) {
          depAcc[depName] = depValue;
        }
        return depAcc;
      }, {});
      Object.assign(acc, deps);
      return acc;
    }, {});
  });
  watch(dependencies, (deps, oldDeps) => {
    if (!Object.keys(deps).length) {
      return;
    }
    const shouldValidate = !es6(deps, oldDeps);
    if (shouldValidate) {
      meta.validated ? validateWithStateMutation() : validateValidStateOnly();
    }
  });
  return field;
}
function normalizeOptions(name, opts) {
  const defaults = () => ({
    initialValue: void 0,
    validateOnMount: false,
    bails: true,
    rules: "",
    label: name,
    validateOnValueUpdate: true,
    standalone: false
  });
  if (!opts) {
    return defaults();
  }
  const checkedValue = "valueProp" in opts ? opts.valueProp : opts.checkedValue;
  return Object.assign(Object.assign(Object.assign({}, defaults()), opts || {}), { checkedValue });
}
function extractRuleFromSchema(schema, fieldName) {
  if (!schema) {
    return void 0;
  }
  return schema[fieldName];
}
function useCheckboxField(name, rules, opts) {
  const form = !(opts === null || opts === void 0 ? void 0 : opts.standalone) ? injectWithSelf(FormContextKey) : void 0;
  const checkedValue = opts === null || opts === void 0 ? void 0 : opts.checkedValue;
  const uncheckedValue = opts === null || opts === void 0 ? void 0 : opts.uncheckedValue;
  function patchCheckboxApi(field) {
    const handleChange = field.handleChange;
    const checked = computed(() => {
      const currentValue = unref(field.value);
      const checkedVal = unref(checkedValue);
      return Array.isArray(currentValue) ? currentValue.includes(checkedVal) : checkedVal === currentValue;
    });
    function handleCheckboxChange(e, shouldValidate = true) {
      var _a, _b;
      if (checked.value === ((_b = (_a = e) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.checked)) {
        return;
      }
      let newValue = normalizeEventValue(e);
      if (!form) {
        newValue = resolveNextCheckboxValue(unref(field.value), unref(checkedValue), unref(uncheckedValue));
      }
      handleChange(newValue, shouldValidate);
    }
    onBeforeUnmount(() => {
      if (checked.value) {
        handleCheckboxChange(unref(checkedValue), false);
      }
    });
    return Object.assign(Object.assign({}, field), {
      checked,
      checkedValue,
      uncheckedValue,
      handleChange: handleCheckboxChange
    });
  }
  return patchCheckboxApi(_useField(name, rules, opts));
}
defineComponent({
  name: "Field",
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object],
      default: void 0
    },
    name: {
      type: String,
      required: true
    },
    rules: {
      type: [Object, String, Function],
      default: void 0
    },
    validateOnMount: {
      type: Boolean,
      default: false
    },
    validateOnBlur: {
      type: Boolean,
      default: void 0
    },
    validateOnChange: {
      type: Boolean,
      default: void 0
    },
    validateOnInput: {
      type: Boolean,
      default: void 0
    },
    validateOnModelUpdate: {
      type: Boolean,
      default: void 0
    },
    bails: {
      type: Boolean,
      default: () => getConfig().bails
    },
    label: {
      type: String,
      default: void 0
    },
    uncheckedValue: {
      type: null,
      default: void 0
    },
    modelValue: {
      type: null,
      default: IS_ABSENT
    },
    modelModifiers: {
      type: null,
      default: () => ({})
    },
    "onUpdate:modelValue": {
      type: null,
      default: void 0
    },
    standalone: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const rules = toRef(props, "rules");
    const name = toRef(props, "name");
    const label = toRef(props, "label");
    const uncheckedValue = toRef(props, "uncheckedValue");
    const hasModelEvents = isPropPresent(props, "onUpdate:modelValue");
    const { errors, value, errorMessage, validate: validateField, handleChange, handleBlur, setTouched, resetField, handleReset, meta, checked, setErrors } = useField(name, rules, {
      validateOnMount: props.validateOnMount,
      bails: props.bails,
      standalone: props.standalone,
      type: ctx.attrs.type,
      initialValue: resolveInitialValue(props, ctx),
      checkedValue: ctx.attrs.value,
      uncheckedValue,
      label,
      validateOnValueUpdate: false
    });
    const onChangeHandler = hasModelEvents ? function handleChangeWithModel(e, shouldValidate = true) {
      handleChange(e, shouldValidate);
      ctx.emit("update:modelValue", value.value);
    } : handleChange;
    const handleInput = (e) => {
      if (!hasCheckedAttr(ctx.attrs.type)) {
        value.value = normalizeEventValue(e);
      }
    };
    const onInputHandler = hasModelEvents ? function handleInputWithModel(e) {
      handleInput(e);
      ctx.emit("update:modelValue", value.value);
    } : handleInput;
    const fieldProps = computed(() => {
      const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = resolveValidationTriggers(props);
      const baseOnBlur = [handleBlur, ctx.attrs.onBlur, validateOnBlur ? validateField : void 0].filter(Boolean);
      const baseOnInput = [(e) => onChangeHandler(e, validateOnInput), ctx.attrs.onInput].filter(Boolean);
      const baseOnChange = [(e) => onChangeHandler(e, validateOnChange), ctx.attrs.onChange].filter(Boolean);
      const attrs = {
        name: props.name,
        onBlur: baseOnBlur,
        onInput: baseOnInput,
        onChange: baseOnChange
      };
      attrs["onUpdate:modelValue"] = (e) => onChangeHandler(e, validateOnModelUpdate);
      if (hasCheckedAttr(ctx.attrs.type) && checked) {
        attrs.checked = checked.value;
      } else {
        attrs.value = value.value;
      }
      const tag = resolveTag(props, ctx);
      if (shouldHaveValueBinding(tag, ctx.attrs)) {
        delete attrs.value;
      }
      return attrs;
    });
    const modelValue = toRef(props, "modelValue");
    watch(modelValue, (newModelValue) => {
      if (newModelValue === IS_ABSENT && value.value === void 0) {
        return;
      }
      if (newModelValue !== applyModifiers(value.value, props.modelModifiers)) {
        value.value = newModelValue === IS_ABSENT ? void 0 : newModelValue;
        validateField();
      }
    });
    function slotProps() {
      return {
        field: fieldProps.value,
        value: value.value,
        meta,
        errors: errors.value,
        errorMessage: errorMessage.value,
        validate: validateField,
        resetField,
        handleChange: onChangeHandler,
        handleInput: onInputHandler,
        handleReset,
        handleBlur,
        setTouched,
        setErrors
      };
    }
    ctx.expose({
      setErrors,
      setTouched,
      reset: resetField,
      validate: validateField,
      handleChange
    });
    return () => {
      const tag = resolveDynamicComponent(resolveTag(props, ctx));
      const children = normalizeChildren(tag, ctx, slotProps);
      if (tag) {
        return h(tag, Object.assign(Object.assign({}, ctx.attrs), fieldProps.value), children);
      }
      return children;
    };
  }
});
function resolveTag(props, ctx) {
  let tag = props.as || "";
  if (!props.as && !ctx.slots.default) {
    tag = "input";
  }
  return tag;
}
function resolveValidationTriggers(props) {
  var _a, _b, _c, _d;
  const { validateOnInput, validateOnChange, validateOnBlur, validateOnModelUpdate } = getConfig();
  return {
    validateOnInput: (_a = props.validateOnInput) !== null && _a !== void 0 ? _a : validateOnInput,
    validateOnChange: (_b = props.validateOnChange) !== null && _b !== void 0 ? _b : validateOnChange,
    validateOnBlur: (_c = props.validateOnBlur) !== null && _c !== void 0 ? _c : validateOnBlur,
    validateOnModelUpdate: (_d = props.validateOnModelUpdate) !== null && _d !== void 0 ? _d : validateOnModelUpdate
  };
}
function applyModifiers(value, modifiers) {
  if (modifiers.number) {
    return toNumber(value);
  }
  return value;
}
function resolveInitialValue(props, ctx) {
  if (!hasCheckedAttr(ctx.attrs.type)) {
    return isPropPresent(props, "modelValue") ? props.modelValue : ctx.attrs.value;
  }
  return isPropPresent(props, "modelValue") ? props.modelValue : void 0;
}
let FORM_COUNTER = 0;
function useForm(opts) {
  const formId = FORM_COUNTER++;
  let RESET_LOCK = false;
  const fieldsByPath = ref({});
  const isSubmitting = ref(false);
  const submitCount = ref(0);
  const fieldArraysLookup = {};
  const formValues = reactive(klona(unref(opts === null || opts === void 0 ? void 0 : opts.initialValues) || {}));
  const { errorBag, setErrorBag, setFieldErrorBag } = useErrorBag(opts === null || opts === void 0 ? void 0 : opts.initialErrors);
  const errors = computed(() => {
    return keysOf(errorBag.value).reduce((acc, key) => {
      const bag = errorBag.value[key];
      if (bag && bag.length) {
        acc[key] = bag[0];
      }
      return acc;
    }, {});
  });
  function getFirstFieldAtPath(path) {
    const fieldOrGroup = fieldsByPath.value[path];
    return Array.isArray(fieldOrGroup) ? fieldOrGroup[0] : fieldOrGroup;
  }
  function fieldExists(path) {
    return !!fieldsByPath.value[path];
  }
  const fieldNames = computed(() => {
    return keysOf(fieldsByPath.value).reduce((names, path) => {
      const field = getFirstFieldAtPath(path);
      if (field) {
        names[path] = unref(field.label || field.name) || "";
      }
      return names;
    }, {});
  });
  const fieldBailsMap = computed(() => {
    return keysOf(fieldsByPath.value).reduce((map, path) => {
      var _a;
      const field = getFirstFieldAtPath(path);
      if (field) {
        map[path] = (_a = field.bails) !== null && _a !== void 0 ? _a : true;
      }
      return map;
    }, {});
  });
  const initialErrors = Object.assign({}, (opts === null || opts === void 0 ? void 0 : opts.initialErrors) || {});
  const { initialValues, originalInitialValues, setInitialValues } = useFormInitialValues(fieldsByPath, formValues, opts === null || opts === void 0 ? void 0 : opts.initialValues);
  const meta = useFormMeta(fieldsByPath, formValues, initialValues, errors);
  const schema = opts === null || opts === void 0 ? void 0 : opts.validationSchema;
  const formCtx = {
    formId,
    fieldsByPath,
    values: formValues,
    errorBag,
    errors,
    schema,
    submitCount,
    meta,
    isSubmitting,
    fieldArraysLookup,
    validateSchema: unref(schema) ? validateSchema : void 0,
    validate: validate2,
    register: registerField,
    unregister: unregisterField,
    setFieldErrorBag,
    validateField,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    setFieldTouched,
    setTouched,
    resetForm,
    handleSubmit,
    stageInitialValue,
    unsetInitialValue,
    setFieldInitialValue
  };
  function isFieldGroup(fieldOrGroup) {
    return Array.isArray(fieldOrGroup);
  }
  function applyFieldMutation(fieldOrGroup, mutation) {
    if (Array.isArray(fieldOrGroup)) {
      return fieldOrGroup.forEach(mutation);
    }
    return mutation(fieldOrGroup);
  }
  function mutateAllFields(mutation) {
    Object.values(fieldsByPath.value).forEach((field) => {
      if (!field) {
        return;
      }
      applyFieldMutation(field, mutation);
    });
  }
  function setFieldError(field, message) {
    setFieldErrorBag(field, message);
  }
  function setErrors(fields) {
    setErrorBag(fields);
  }
  function setFieldValue(field, value, { force } = { force: false }) {
    var _a;
    const fieldInstance = fieldsByPath.value[field];
    const clonedValue = klona(value);
    if (!fieldInstance) {
      setInPath(formValues, field, clonedValue);
      return;
    }
    if (isFieldGroup(fieldInstance) && ((_a = fieldInstance[0]) === null || _a === void 0 ? void 0 : _a.type) === "checkbox" && !Array.isArray(value)) {
      const newValue2 = klona(resolveNextCheckboxValue(getFromPath(formValues, field) || [], value, void 0));
      setInPath(formValues, field, newValue2);
      return;
    }
    let newValue = value;
    if (!isFieldGroup(fieldInstance) && fieldInstance.type === "checkbox" && !force && !RESET_LOCK) {
      newValue = klona(resolveNextCheckboxValue(getFromPath(formValues, field), value, unref(fieldInstance.uncheckedValue)));
    }
    setInPath(formValues, field, newValue);
  }
  function setValues(fields) {
    keysOf(formValues).forEach((key) => {
      delete formValues[key];
    });
    keysOf(fields).forEach((path) => {
      setFieldValue(path, fields[path]);
    });
    Object.values(fieldArraysLookup).forEach((f) => f && f.reset());
  }
  function setFieldTouched(field, isTouched) {
    const fieldInstance = fieldsByPath.value[field];
    if (fieldInstance) {
      applyFieldMutation(fieldInstance, (f) => f.setTouched(isTouched));
    }
  }
  function setTouched(fields) {
    keysOf(fields).forEach((field) => {
      setFieldTouched(field, !!fields[field]);
    });
  }
  function resetForm(state) {
    RESET_LOCK = true;
    if (state === null || state === void 0 ? void 0 : state.values) {
      setInitialValues(state.values);
      setValues(state === null || state === void 0 ? void 0 : state.values);
    } else {
      setInitialValues(originalInitialValues.value);
      setValues(originalInitialValues.value);
    }
    mutateAllFields((f) => f.resetField());
    if (state === null || state === void 0 ? void 0 : state.touched) {
      setTouched(state.touched);
    }
    setErrors((state === null || state === void 0 ? void 0 : state.errors) || {});
    submitCount.value = (state === null || state === void 0 ? void 0 : state.submitCount) || 0;
    nextTick(() => {
      RESET_LOCK = false;
    });
  }
  function insertFieldAtPath(field, path) {
    const rawField = markRaw(field);
    const fieldPath = path;
    if (!fieldsByPath.value[fieldPath]) {
      fieldsByPath.value[fieldPath] = rawField;
      return;
    }
    const fieldAtPath = fieldsByPath.value[fieldPath];
    if (fieldAtPath && !Array.isArray(fieldAtPath)) {
      fieldsByPath.value[fieldPath] = [fieldAtPath];
    }
    fieldsByPath.value[fieldPath] = [...fieldsByPath.value[fieldPath], rawField];
  }
  function removeFieldFromPath(field, path) {
    const fieldPath = path;
    const fieldAtPath = fieldsByPath.value[fieldPath];
    if (!fieldAtPath) {
      return;
    }
    if (!isFieldGroup(fieldAtPath) && field.id === fieldAtPath.id) {
      delete fieldsByPath.value[fieldPath];
      return;
    }
    if (isFieldGroup(fieldAtPath)) {
      const idx = fieldAtPath.findIndex((f) => f.id === field.id);
      if (idx === -1) {
        return;
      }
      fieldAtPath.splice(idx, 1);
      if (fieldAtPath.length === 1) {
        fieldsByPath.value[fieldPath] = fieldAtPath[0];
        return;
      }
      if (!fieldAtPath.length) {
        delete fieldsByPath.value[fieldPath];
      }
    }
  }
  function registerField(field) {
    const fieldPath = unref(field.name);
    insertFieldAtPath(field, fieldPath);
    if (isRef(field.name)) {
      watch(field.name, async (newPath, oldPath) => {
        await nextTick();
        removeFieldFromPath(field, oldPath);
        insertFieldAtPath(field, newPath);
        if (errors.value[oldPath] || errors.value[newPath]) {
          setFieldError(oldPath, void 0);
          validateField(newPath);
        }
        await nextTick();
        if (!fieldExists(oldPath)) {
          unsetPath(formValues, oldPath);
        }
      });
    }
    const initialErrorMessage = unref(field.errorMessage);
    if (initialErrorMessage && (initialErrors === null || initialErrors === void 0 ? void 0 : initialErrors[fieldPath]) !== initialErrorMessage) {
      validateField(fieldPath);
    }
    delete initialErrors[fieldPath];
  }
  function unregisterField(field) {
    const fieldName = unref(field.name);
    removeFieldFromPath(field, fieldName);
    nextTick(() => {
      if (!fieldExists(fieldName)) {
        setFieldError(fieldName, void 0);
        unsetPath(formValues, fieldName);
      }
    });
  }
  async function validate2(opts2) {
    mutateAllFields((f) => f.meta.validated = true);
    if (formCtx.validateSchema) {
      return formCtx.validateSchema((opts2 === null || opts2 === void 0 ? void 0 : opts2.mode) || "force");
    }
    const validations = await Promise.all(Object.values(fieldsByPath.value).map((field) => {
      const fieldInstance = Array.isArray(field) ? field[0] : field;
      if (!fieldInstance) {
        return Promise.resolve({ key: "", valid: true, errors: [] });
      }
      return fieldInstance.validate(opts2).then((result) => {
        return {
          key: unref(fieldInstance.name),
          valid: result.valid,
          errors: result.errors
        };
      });
    }));
    const results = {};
    const errors2 = {};
    for (const validation of validations) {
      results[validation.key] = {
        valid: validation.valid,
        errors: validation.errors
      };
      if (validation.errors.length) {
        errors2[validation.key] = validation.errors[0];
      }
    }
    return {
      valid: validations.every((r) => r.valid),
      results,
      errors: errors2
    };
  }
  async function validateField(field) {
    const fieldInstance = fieldsByPath.value[field];
    if (!fieldInstance) {
      warn$1(`field with name ${field} was not found`);
      return Promise.resolve({ errors: [], valid: true });
    }
    if (Array.isArray(fieldInstance)) {
      return fieldInstance.map((f) => f.validate())[0];
    }
    return fieldInstance.validate();
  }
  function handleSubmit(fn, onValidationError) {
    return function submissionHandler(e) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }
      setTouched(keysOf(fieldsByPath.value).reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {}));
      isSubmitting.value = true;
      submitCount.value++;
      return validate2().then((result) => {
        if (result.valid && typeof fn === "function") {
          return fn(klona(formValues), {
            evt: e,
            setErrors,
            setFieldError,
            setTouched,
            setFieldTouched,
            setValues,
            setFieldValue,
            resetForm
          });
        }
        if (!result.valid && typeof onValidationError === "function") {
          onValidationError({
            values: klona(formValues),
            evt: e,
            errors: result.errors,
            results: result.results
          });
        }
      }).then((returnVal) => {
        isSubmitting.value = false;
        return returnVal;
      }, (err) => {
        isSubmitting.value = false;
        throw err;
      });
    };
  }
  function setFieldInitialValue(path, value) {
    setInPath(initialValues.value, path, klona(value));
  }
  function unsetInitialValue(path) {
    unsetPath(initialValues.value, path);
  }
  function stageInitialValue(path, value) {
    setInPath(formValues, path, value);
    setFieldInitialValue(path, value);
  }
  async function _validateSchema() {
    const schemaValue = unref(schema);
    if (!schemaValue) {
      return { valid: true, results: {}, errors: {} };
    }
    const formResult = isYupValidator(schemaValue) ? await validateYupSchema(schemaValue, formValues) : await validateObjectSchema(schemaValue, formValues, {
      names: fieldNames.value,
      bailsMap: fieldBailsMap.value
    });
    return formResult;
  }
  const debouncedSchemaValidation = debounceAsync(_validateSchema, 5);
  async function validateSchema(mode) {
    const formResult = await debouncedSchemaValidation();
    const fieldsById = formCtx.fieldsByPath.value || {};
    const currentErrorsPaths = keysOf(formCtx.errorBag.value);
    const paths = [
      .../* @__PURE__ */ new Set([...keysOf(formResult.results), ...keysOf(fieldsById), ...currentErrorsPaths])
    ];
    return paths.reduce((validation, path) => {
      const field = fieldsById[path];
      const messages = (formResult.results[path] || { errors: [] }).errors;
      const fieldResult = {
        errors: messages,
        valid: !messages.length
      };
      validation.results[path] = fieldResult;
      if (!fieldResult.valid) {
        validation.errors[path] = fieldResult.errors[0];
      }
      if (!field) {
        setFieldError(path, messages);
        return validation;
      }
      applyFieldMutation(field, (f) => f.meta.valid = fieldResult.valid);
      if (mode === "silent") {
        return validation;
      }
      const wasValidated = Array.isArray(field) ? field.some((f) => f.meta.validated) : field.meta.validated;
      if (mode === "validated-only" && !wasValidated) {
        return validation;
      }
      applyFieldMutation(field, (f) => f.setState({ errors: fieldResult.errors }));
      return validation;
    }, { valid: formResult.valid, results: {}, errors: {} });
  }
  const submitForm = handleSubmit((_, { evt }) => {
    if (isFormSubmitEvent(evt)) {
      evt.target.submit();
    }
  });
  onMounted(() => {
    if (opts === null || opts === void 0 ? void 0 : opts.initialErrors) {
      setErrors(opts.initialErrors);
    }
    if (opts === null || opts === void 0 ? void 0 : opts.initialTouched) {
      setTouched(opts.initialTouched);
    }
    if (opts === null || opts === void 0 ? void 0 : opts.validateOnMount) {
      validate2();
      return;
    }
    if (formCtx.validateSchema) {
      formCtx.validateSchema("silent");
    }
  });
  if (isRef(schema)) {
    watch(schema, () => {
      var _a;
      (_a = formCtx.validateSchema) === null || _a === void 0 ? void 0 : _a.call(formCtx, "validated-only");
    });
  }
  provide(FormContextKey, formCtx);
  return {
    errors,
    meta,
    values: formValues,
    isSubmitting,
    submitCount,
    validate: validate2,
    validateField,
    handleReset: () => resetForm(),
    resetForm,
    handleSubmit,
    submitForm,
    setFieldError,
    setErrors,
    setFieldValue,
    setValues,
    setFieldTouched,
    setTouched
  };
}
function useFormMeta(fieldsByPath, currentValues, initialValues, errors) {
  const MERGE_STRATEGIES = {
    touched: "some",
    pending: "some",
    valid: "every"
  };
  const isDirty = computed(() => {
    return !es6(currentValues, unref(initialValues));
  });
  function calculateFlags() {
    const fields = Object.values(fieldsByPath.value).flat(1).filter(Boolean);
    return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields[mergeMethod]((field) => field.meta[flag]);
      return acc;
    }, {});
  }
  const flags = reactive(calculateFlags());
  watchEffect(() => {
    const value = calculateFlags();
    flags.touched = value.touched;
    flags.valid = value.valid;
    flags.pending = value.pending;
  });
  return computed(() => {
    return Object.assign(Object.assign({ initialValues: unref(initialValues) }, flags), { valid: flags.valid && !keysOf(errors.value).length, dirty: isDirty.value });
  });
}
function useFormInitialValues(fields, formValues, providedValues) {
  const initialValues = ref(klona(unref(providedValues)) || {});
  const originalInitialValues = ref(klona(unref(providedValues)) || {});
  function setInitialValues(values, updateFields = false) {
    initialValues.value = klona(values);
    originalInitialValues.value = klona(values);
    if (!updateFields) {
      return;
    }
    keysOf(fields.value).forEach((fieldPath) => {
      const field = fields.value[fieldPath];
      const wasTouched = Array.isArray(field) ? field.some((f) => f.meta.touched) : field === null || field === void 0 ? void 0 : field.meta.touched;
      if (!field || wasTouched) {
        return;
      }
      const newValue = getFromPath(initialValues.value, fieldPath);
      setInPath(formValues, fieldPath, klona(newValue));
    });
  }
  if (isRef(providedValues)) {
    watch(providedValues, (value) => {
      setInitialValues(value, true);
    }, {
      deep: true
    });
  }
  return {
    initialValues,
    originalInitialValues,
    setInitialValues
  };
}
function useErrorBag(initialErrors) {
  const errorBag = ref({});
  function normalizeErrorItem(message) {
    return Array.isArray(message) ? message : message ? [message] : [];
  }
  function setFieldErrorBag(field, message) {
    if (!message) {
      delete errorBag.value[field];
      return;
    }
    errorBag.value[field] = normalizeErrorItem(message);
  }
  function setErrorBag(fields) {
    errorBag.value = keysOf(fields).reduce((acc, key) => {
      const message = fields[key];
      if (message) {
        acc[key] = normalizeErrorItem(message);
      }
      return acc;
    }, {});
  }
  if (initialErrors) {
    setErrorBag(initialErrors);
  }
  return {
    errorBag,
    setErrorBag,
    setFieldErrorBag
  };
}
defineComponent({
  name: "Form",
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: "form"
    },
    validationSchema: {
      type: Object,
      default: void 0
    },
    initialValues: {
      type: Object,
      default: void 0
    },
    initialErrors: {
      type: Object,
      default: void 0
    },
    initialTouched: {
      type: Object,
      default: void 0
    },
    validateOnMount: {
      type: Boolean,
      default: false
    },
    onSubmit: {
      type: Function,
      default: void 0
    },
    onInvalidSubmit: {
      type: Function,
      default: void 0
    }
  },
  setup(props, ctx) {
    const initialValues = toRef(props, "initialValues");
    const validationSchema = toRef(props, "validationSchema");
    const { errors, values, meta, isSubmitting, submitCount, validate: validate2, validateField, handleReset, resetForm, handleSubmit, submitForm, setErrors, setFieldError, setFieldValue, setValues, setFieldTouched, setTouched } = useForm({
      validationSchema: validationSchema.value ? validationSchema : void 0,
      initialValues,
      initialErrors: props.initialErrors,
      initialTouched: props.initialTouched,
      validateOnMount: props.validateOnMount
    });
    const onSubmit = props.onSubmit ? handleSubmit(props.onSubmit, props.onInvalidSubmit) : submitForm;
    function handleFormReset(e) {
      if (isEvent(e)) {
        e.preventDefault();
      }
      handleReset();
      if (typeof ctx.attrs.onReset === "function") {
        ctx.attrs.onReset();
      }
    }
    function handleScopedSlotSubmit(evt, onSubmit2) {
      const onSuccess = typeof evt === "function" && !onSubmit2 ? evt : onSubmit2;
      return handleSubmit(onSuccess, props.onInvalidSubmit)(evt);
    }
    function slotProps() {
      return {
        meta: meta.value,
        errors: errors.value,
        values,
        isSubmitting: isSubmitting.value,
        submitCount: submitCount.value,
        validate: validate2,
        validateField,
        handleSubmit: handleScopedSlotSubmit,
        handleReset,
        submitForm,
        setErrors,
        setFieldError,
        setFieldValue,
        setValues,
        setFieldTouched,
        setTouched,
        resetForm
      };
    }
    ctx.expose({
      setFieldError,
      setErrors,
      setFieldValue,
      setValues,
      setFieldTouched,
      setTouched,
      resetForm,
      validate: validate2,
      validateField
    });
    return function renderForm() {
      const tag = props.as === "form" ? props.as : resolveDynamicComponent(props.as);
      const children = normalizeChildren(tag, ctx, slotProps);
      if (!props.as) {
        return children;
      }
      const formAttrs = props.as === "form" ? {
        novalidate: true
      } : {};
      return h(tag, Object.assign(Object.assign(Object.assign({}, formAttrs), ctx.attrs), { onSubmit, onReset: handleFormReset }), children);
    };
  }
});
let FIELD_ARRAY_COUNTER = 0;
function useFieldArray(arrayPath) {
  const id = FIELD_ARRAY_COUNTER++;
  const form = injectWithSelf(FormContextKey, void 0);
  const fields = ref([]);
  const noOp = () => {
  };
  const noOpApi = {
    fields: readonly(fields),
    remove: noOp,
    push: noOp,
    swap: noOp,
    insert: noOp,
    update: noOp,
    replace: noOp,
    prepend: noOp
  };
  if (!form) {
    warn("FieldArray requires being a child of `<Form/>` or `useForm` being called before it. Array fields may not work correctly");
    return noOpApi;
  }
  if (!unref(arrayPath)) {
    warn("FieldArray requires a field path to be provided, did you forget to pass the `name` prop?");
    return noOpApi;
  }
  let entryCounter = 0;
  function initFields() {
    const currentValues = getFromPath(form === null || form === void 0 ? void 0 : form.values, unref(arrayPath), []);
    fields.value = currentValues.map(createEntry);
    updateEntryFlags();
  }
  initFields();
  function updateEntryFlags() {
    const fieldsLength = fields.value.length;
    for (let i = 0; i < fieldsLength; i++) {
      const entry = fields.value[i];
      entry.isFirst = i === 0;
      entry.isLast = i === fieldsLength - 1;
    }
  }
  function createEntry(value) {
    const key = entryCounter++;
    const entry = {
      key,
      value: computed(() => {
        const currentValues = getFromPath(form === null || form === void 0 ? void 0 : form.values, unref(arrayPath), []);
        const idx = fields.value.findIndex((e) => e.key === key);
        return idx === -1 ? value : currentValues[idx];
      }),
      isFirst: false,
      isLast: false
    };
    return entry;
  }
  function remove(idx) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!pathValue || !Array.isArray(pathValue)) {
      return;
    }
    const newValue = [...pathValue];
    newValue.splice(idx, 1);
    form === null || form === void 0 ? void 0 : form.unsetInitialValue(pathName + `[${idx}]`);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value.splice(idx, 1);
    updateEntryFlags();
  }
  function push(value) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }
    const newValue = [...normalizedPathValue];
    newValue.push(value);
    form === null || form === void 0 ? void 0 : form.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value.push(createEntry(value));
    updateEntryFlags();
  }
  function swap(indexA, indexB) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!Array.isArray(pathValue) || !(indexA in pathValue) || !(indexB in pathValue)) {
      return;
    }
    const newValue = [...pathValue];
    const newFields = [...fields.value];
    const temp = newValue[indexA];
    newValue[indexA] = newValue[indexB];
    newValue[indexB] = temp;
    const tempEntry = newFields[indexA];
    newFields[indexA] = newFields[indexB];
    newFields[indexB] = tempEntry;
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }
  function insert(idx, value) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length < idx) {
      return;
    }
    const newValue = [...pathValue];
    const newFields = [...fields.value];
    newValue.splice(idx, 0, value);
    newFields.splice(idx, 0, createEntry(value));
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value = newFields;
    updateEntryFlags();
  }
  function replace(arr) {
    const pathName = unref(arrayPath);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, arr);
    initFields();
  }
  function update(idx, value) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    if (!Array.isArray(pathValue) || pathValue.length - 1 < idx) {
      return;
    }
    form === null || form === void 0 ? void 0 : form.setFieldValue(`${pathName}[${idx}]`, value);
  }
  function prepend(value) {
    const pathName = unref(arrayPath);
    const pathValue = getFromPath(form === null || form === void 0 ? void 0 : form.values, pathName);
    const normalizedPathValue = isNullOrUndefined(pathValue) ? [] : pathValue;
    if (!Array.isArray(normalizedPathValue)) {
      return;
    }
    const newValue = [value, ...normalizedPathValue];
    form === null || form === void 0 ? void 0 : form.stageInitialValue(pathName + `[${newValue.length - 1}]`, value);
    form === null || form === void 0 ? void 0 : form.setFieldValue(pathName, newValue);
    fields.value.unshift(createEntry(value));
    updateEntryFlags();
  }
  form.fieldArraysLookup[id] = {
    reset: initFields
  };
  onBeforeUnmount(() => {
    delete form.fieldArraysLookup[id];
  });
  return {
    fields: readonly(fields),
    remove,
    push,
    swap,
    insert,
    update,
    replace,
    prepend
  };
}
defineComponent({
  name: "FieldArray",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const { push, remove, swap, insert, replace, update, prepend, fields } = useFieldArray(toRef(props, "name"));
    function slotProps() {
      return {
        fields: fields.value,
        push,
        remove,
        swap,
        insert,
        update,
        replace,
        prepend
      };
    }
    ctx.expose({
      push,
      remove,
      swap,
      insert,
      update,
      replace,
      prepend
    });
    return () => {
      const children = normalizeChildren(void 0, ctx, slotProps);
      return children;
    };
  }
});
defineComponent({
  name: "ErrorMessage",
  props: {
    as: {
      type: String,
      default: void 0
    },
    name: {
      type: String,
      required: true
    }
  },
  setup(props, ctx) {
    const form = inject(FormContextKey, void 0);
    const message = computed(() => {
      return form === null || form === void 0 ? void 0 : form.errors.value[props.name];
    });
    function slotProps() {
      return {
        message: message.value
      };
    }
    return () => {
      if (!message.value) {
        return void 0;
      }
      const tag = props.as ? resolveDynamicComponent(props.as) : props.as;
      const children = normalizeChildren(tag, ctx, slotProps);
      const attrs = Object.assign({ role: "alert" }, ctx.attrs);
      if (!tag && (Array.isArray(children) || !children) && (children === null || children === void 0 ? void 0 : children.length)) {
        return children;
      }
      if ((Array.isArray(children) || !children) && !(children === null || children === void 0 ? void 0 : children.length)) {
        return h(tag || "span", attrs, message.value);
      }
      return h(tag, attrs, children);
    };
  }
});
function isObject(val) {
  return val !== null && typeof val === "object";
}
function _defu(baseObj, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObj, {}, namespace, merger);
  }
  const obj = Object.assign({}, defaults);
  for (const key in baseObj) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const val = baseObj[key];
    if (val === null || val === void 0) {
      continue;
    }
    if (merger && merger(obj, key, val, namespace)) {
      continue;
    }
    if (Array.isArray(val) && Array.isArray(obj[key])) {
      obj[key] = val.concat(obj[key]);
    } else if (isObject(val) && isObject(obj[key])) {
      obj[key] = _defu(val, obj[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
    } else {
      obj[key] = val;
    }
  }
  return obj;
}
function createDefu(merger) {
  return (...args) => args.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defu = createDefu();
const useVFieldSymbolContext = Symbol();
let fieldId = 0;
function createVFieldContext(id) {
  const _id = unref(id);
  const $id = ref(id != null ? id : `v-field-${++fieldId}`);
  const field = ref();
  if (_id) {
    field.value = useField(_id);
  }
  const vFieldContext = {
    id: $id,
    field
  };
  provide(useVFieldSymbolContext, vFieldContext);
  return vFieldContext;
}
function useVFieldContext(options = {}) {
  const _options = defu(options, {
    create: true,
    inherit: true
  });
  if (unref(_options.inherit)) {
    const vFieldContext = inject(useVFieldSymbolContext, void 0);
    if (vFieldContext) {
      return vFieldContext;
    }
  }
  const _help = unref(_options.help) ? unref(_options.help) + ": " : "";
  if (!unref(_options.create)) {
    throw new Error(`${_help}useVFieldContext (create = false) must be used inside a VField component`);
  }
  return createVFieldContext(_options.id);
}
const _hoisted_1$2 = ["for", "onKeydown"];
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  props: {
    raw: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const vFieldContext = reactive(useVFieldContext({
      create: false,
      help: "VLabel"
    }));
    const classes = computed(() => {
      if (props.raw)
        return [];
      return ["label"];
    });
    const onEnter = () => {
      var _a;
      if (vFieldContext.id) {
        (_a = document.getElementById(vFieldContext.id)) == null ? void 0 : _a.click();
      }
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("label", {
        class: normalizeClass(unref(classes)),
        for: unref(vFieldContext).id,
        onKeydown: withKeys(withModifiers(onEnter, ["prevent"]), ["enter"])
      }, [
        renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(unref(vFieldContext))))
      ], 42, _hoisted_1$2);
    };
  }
});
var VCheckbox_vue_vue_type_style_index_0_lang = "";
const _hoisted_1$1 = ["id", "true-value", "false-value"];
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("span", null, null, -1);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  props: {
    raw: { type: Boolean },
    label: { default: void 0 },
    color: { default: void 0 },
    trueValue: { type: [String, Number, Boolean], default: true },
    falseValue: { type: [String, Number, Boolean], default: false },
    modelValue: { default: false },
    circle: { type: Boolean, default: false },
    solid: { type: Boolean, default: false },
    paddingless: { type: Boolean, default: false },
    wrapperClass: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: emits }) {
    var _a, _b;
    const props = __props;
    const vFieldContext = reactive(useVFieldContext());
    const $value = ref((_b = (_a = vFieldContext.field) == null ? void 0 : _a.value) != null ? _b : props.modelValue);
    const classes = computed(() => {
      if (props.raw)
        return [props.wrapperClass];
      return [
        "checkbox",
        props.wrapperClass,
        props.solid ? "is-solid" : "is-outlined",
        props.circle && "is-circle",
        props.color && `is-${props.color}`,
        props.paddingless && "is-paddingless"
      ];
    });
    watch($value, () => {
      emits("update:modelValue", $value.value);
    });
    watch(() => props.modelValue, () => {
      $value.value = props.modelValue;
    });
    return (_ctx, _cache) => {
      const _component_VLabel = _sfc_main$2;
      return openBlock(), createBlock(_component_VLabel, {
        raw: "",
        class: normalizeClass(unref(classes))
      }, {
        default: withCtx(() => [
          withDirectives(createBaseVNode("input", mergeProps({
            id: unref(vFieldContext).id,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $value.value = $event)
          }, _ctx.$attrs, {
            "true-value": props.trueValue,
            "false-value": props.falseValue,
            type: "checkbox"
          }), null, 16, _hoisted_1$1), [
            [vModelCheckbox, $value.value]
          ]),
          _hoisted_2$1,
          renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(unref(vFieldContext))), () => [
            createTextVNode(toDisplayString(props.label), 1)
          ])
        ]),
        _: 3
      }, 8, ["class"]);
    };
  }
});
var VControl_vue_vue_type_style_index_0_scoped_true_lang = "";
const _withScopeId = (n) => (pushScopeId("data-v-1d995955"), n = n(), popScopeId(), n);
const _hoisted_1 = ["data-icon"];
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  "data-icon": "feather:check",
  class: "iconify"
}, null, -1));
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("i", {
  "aria-hidden": "true",
  "data-icon": "feather:x",
  class: "iconify"
}, null, -1));
const _hoisted_4 = [
  _hoisted_3
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  props: {
    id: {
      type: String,
      default: void 0
    },
    icon: {
      type: String,
      default: void 0
    },
    isValid: {
      type: Boolean,
      default: void 0
    },
    hasError: {
      type: Boolean,
      default: void 0
    },
    loading: {
      type: Boolean,
      default: void 0
    },
    expanded: {
      type: Boolean,
      default: void 0
    },
    fullwidth: {
      type: Boolean,
      default: void 0
    },
    textaddon: {
      type: Boolean,
      default: void 0
    },
    nogrow: {
      type: Boolean,
      default: void 0
    },
    subcontrol: {
      type: Boolean,
      default: void 0
    },
    raw: {
      type: Boolean,
      default: void 0
    }
  },
  setup(__props) {
    const props = __props;
    const isIconify = computed(() => {
      return props.icon && props.icon.indexOf(":") !== -1;
    });
    const vFieldContext = reactive(useVFieldContext({
      id: props.id,
      inherit: !props.subcontrol
    }));
    const isValid = computed(() => props.isValid);
    const hasError = computed(() => {
      var _a, _b;
      return (vFieldContext == null ? void 0 : vFieldContext.field) ? Boolean((_b = (_a = vFieldContext == null ? void 0 : vFieldContext.field) == null ? void 0 : _a.errorMessage) == null ? void 0 : _b.value) : props.hasError;
    });
    const controlClasees = computed(() => {
      if (props.raw)
        return [];
      return [
        "control",
        props.icon && "has-icon",
        props.loading && "is-loading",
        props.expanded && "is-expanded",
        props.fullwidth && "is-fullwidth",
        props.nogrow && "is-nogrow",
        props.textaddon && "is-textarea-addon",
        isValid.value && "has-validation has-success",
        hasError.value && "has-validation has-error",
        props.subcontrol && "subcontrol"
      ];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(unref(controlClasees))
      }, [
        renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps(unref(vFieldContext))), void 0, true),
        props.icon ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
          unref(isIconify) ? (openBlock(), createBlock(_sfc_main$2, {
            key: 0,
            class: "form-icon"
          }, {
            default: withCtx(() => [
              createBaseVNode("i", {
                "aria-hidden": "true",
                "data-icon": props.icon,
                class: "iconify"
              }, null, 8, _hoisted_1)
            ]),
            _: 1
          })) : (openBlock(), createBlock(_sfc_main$2, {
            key: 1,
            class: "form-icon"
          }, {
            default: withCtx(() => [
              createBaseVNode("i", {
                "aria-hidden": "true",
                class: normalizeClass(props.icon)
              }, null, 2)
            ]),
            _: 1
          }))
        ], 64)) : createCommentVNode("", true),
        unref(isValid) ? (openBlock(), createBlock(_sfc_main$2, {
          key: 1,
          class: "validation-icon is-success"
        }, {
          default: withCtx(() => [
            _hoisted_2
          ]),
          _: 1
        })) : unref(hasError) ? (openBlock(), createElementBlock("a", {
          key: 2,
          class: "validation-icon is-error",
          onClick: _cache[0] || (_cache[0] = withModifiers(() => {
            var _a, _b;
            return (_b = (_a = unref(vFieldContext).field) == null ? void 0 : _a.resetField) == null ? void 0 : _b.call(_a);
          }, ["prevent"])),
          onKeyup: _cache[1] || (_cache[1] = withKeys(withModifiers(() => {
            var _a, _b;
            return (_b = (_a = unref(vFieldContext).field) == null ? void 0 : _a.resetField) == null ? void 0 : _b.call(_a);
          }, ["prevent"]), ["enter"]))
        }, _hoisted_4, 32)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "extra", normalizeProps(guardReactiveProps(unref(vFieldContext))), void 0, true)
      ], 2);
    };
  }
});
var __unplugin_components_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1d995955"]]);
export { __unplugin_components_2 as _, _sfc_main$1 as a, _sfc_main$2 as b, useForm as c, useVFieldContext as u };

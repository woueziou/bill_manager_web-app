var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b2) => {
  for (var prop in b2 || (b2 = {}))
    if (__hasOwnProp.call(b2, prop))
      __defNormalProp(a, prop, b2[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b2)) {
      if (__propIsEnum.call(b2, prop))
        __defNormalProp(a, prop, b2[prop]);
    }
  return a;
};
import { am as toRefs, B as ref, f as computed, E as watch, D as nextTick, o as openBlock, i as createBlock, p as createCommentVNode, z as mergeProps, y as withModifiers, F as Fragment, x as renderList, v as createVNode, t as toDisplayString, j as renderSlot, q as createTextVNode } from "./index.2c4f64fa.js";
function b(e) {
  return [null, void 0, false].indexOf(e) !== -1;
}
function h(e) {
  var u = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
  return u ? String(e).toLowerCase().trim() : String(e).normalize("NFD").replace(/(?:[\^`\xA8\xAF\xB4\xB7\xB8\u02B0-\u034E\u0350-\u0357\u035D-\u0362\u0374\u0375\u037A\u0384\u0385\u0483-\u0487\u0559\u0591-\u05A1\u05A3-\u05BD\u05BF\u05C1\u05C2\u05C4\u064B-\u0652\u0657\u0658\u06DF\u06E0\u06E5\u06E6\u06EA-\u06EC\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F5\u0818\u0819\u08E3-\u08FE\u093C\u094D\u0951-\u0954\u0971\u09BC\u09CD\u0A3C\u0A4D\u0ABC\u0ACD\u0AFD-\u0AFF\u0B3C\u0B4D\u0B55\u0BCD\u0C4D\u0CBC\u0CCD\u0D3B\u0D3C\u0D4D\u0DCA\u0E47-\u0E4C\u0E4E\u0EBA\u0EC8-\u0ECC\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F82-\u0F84\u0F86\u0F87\u0FC6\u1037\u1039\u103A\u1063\u1064\u1069-\u106D\u1087-\u108D\u108F\u109A\u109B\u135D-\u135F\u17C9-\u17D3\u17DD\u1939-\u193B\u1A75-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B34\u1B44\u1B6B-\u1B73\u1BAA\u1BAB\u1C36\u1C37\u1C78-\u1C7D\u1CD0-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1D2C-\u1D6A\u1DC4-\u1DCF\u1DF5-\u1DF9\u1DFD-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2CEF-\u2CF1\u2E2F\u302A-\u302F\u3099-\u309C\u30FC\uA66F\uA67C\uA67D\uA67F\uA69C\uA69D\uA6F0\uA6F1\uA700-\uA721\uA788-\uA78A\uA7F8\uA7F9\uA8C4\uA8E0-\uA8F1\uA92B-\uA92E\uA953\uA9B3\uA9C0\uA9E5\uAA7B-\uAA7D\uAABF-\uAAC2\uAAF6\uAB5B-\uAB5F\uAB69-\uAB6B\uABEC\uABED\uFB1E\uFE20-\uFE2F\uFF3E\uFF40\uFF70\uFF9E\uFF9F\uFFE3]|\uD800\uDEE0|\uD802[\uDEE5\uDEE6]|\uD803[\uDD22-\uDD27\uDF46-\uDF50]|\uD804[\uDCB9\uDCBA\uDD33\uDD34\uDD73\uDDC0\uDDCA-\uDDCC\uDE35\uDE36\uDEE9\uDEEA\uDF3C\uDF4D\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC42\uDC46\uDCC2\uDCC3\uDDBF\uDDC0\uDE3F\uDEB6\uDEB7\uDF2B]|\uD806[\uDC39\uDC3A\uDD3D\uDD3E\uDD43\uDDE0\uDE34\uDE47\uDE99]|\uD807[\uDC3F\uDD42\uDD44\uDD45\uDD97]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF9F\uDFF0\uDFF1]|\uD834[\uDD67-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD]|\uD838[\uDD30-\uDD36\uDEEC-\uDEEF]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD46\uDD48-\uDD4A])/g, "").toLowerCase().trim();
}
function m(e) {
  return (m = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e2) {
    return typeof e2;
  } : function(e2) {
    return e2 && typeof Symbol == "function" && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
  })(e);
}
function D(e, u) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    u && (l = l.filter(function(u2) {
      return Object.getOwnPropertyDescriptor(e, u2).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function y(e) {
  for (var u = 1; u < arguments.length; u++) {
    var t = arguments[u] != null ? arguments[u] : {};
    u % 2 ? D(Object(t), true).forEach(function(u2) {
      O(e, u2, t[u2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : D(Object(t)).forEach(function(u2) {
      Object.defineProperty(e, u2, Object.getOwnPropertyDescriptor(t, u2));
    });
  }
  return e;
}
function O(e, u, t) {
  return u in e ? Object.defineProperty(e, u, { value: t, enumerable: true, configurable: true, writable: true }) : e[u] = t, e;
}
function F(a, n, r) {
  var i = toRefs(a), o = i.options, s = i.mode, c = i.trackBy, v = i.limit, p = i.hideSelected, d = i.createTag, f = i.createOption, g = i.label, D2 = i.appendNewTag, F2 = i.appendNewOption, C2 = i.multipleLabel, A2 = i.object, S2 = i.loading, E2 = i.delay, B2 = i.resolveOnLoad, L2 = i.minChars, P2 = i.filterResults, k2 = i.clearOnSearch, w = i.clearOnSelect, q = i.valueProp, x = i.canDeselect, j = i.max, T = i.strict, I = i.closeOnSelect, _ = i.groups, V = (i.groupLabel, i.groupOptions), R = i.groupHideEmpty, M = i.groupSelect, $ = r.iv, H = r.ev, N = r.search, G = r.clearSearch, K = r.update, U = r.pointer, W = r.clearPointer, z = r.blur, J = r.focus, Q = r.deactivate, X = ref([]), Y = ref([]), Z = ref(false), ee = computed(function() {
    return d.value || f.value || false;
  }), ue = computed(function() {
    return D2.value !== void 0 ? D2.value : F2.value === void 0 || F2.value;
  }), te = computed(function() {
    if (_.value) {
      var e = Y.value || [], u = [];
      return e.forEach(function(e2) {
        ke(e2[V.value]).forEach(function(t2) {
          u.push(Object.assign({}, t2, e2.disabled ? { disabled: true } : {}));
        });
      }), u;
    }
    var t = ke(Y.value || []);
    return X.value.length && (t = t.concat(X.value)), t;
  }), le = computed(function() {
    return _.value ? Le((Y.value || []).map(function(e) {
      var u, t = ke(e[V.value]);
      return y(y({}, e), {}, (O(u = { group: true }, V.value, Pe(t, false).map(function(u2) {
        return Object.assign({}, u2, e.disabled ? { disabled: true } : {});
      })), O(u, "__VISIBLE__", Pe(t).map(function(u2) {
        return Object.assign({}, u2, e.disabled ? { disabled: true } : {});
      })), u));
    })) : [];
  }), ae = computed(function() {
    var e = te.value;
    return se.value.length && (e = se.value.concat(e)), e = Pe(e), v.value > 0 && (e = e.slice(0, v.value)), e;
  }), ne = computed(function() {
    switch (s.value) {
      case "single":
        return !b($.value[q.value]);
      case "multiple":
      case "tags":
        return !b($.value) && $.value.length > 0;
    }
  }), re = computed(function() {
    return C2 !== void 0 && C2.value !== void 0 ? C2.value($.value) : $.value && $.value.length > 1 ? "".concat($.value.length, " options selected") : "1 option selected";
  }), ie = computed(function() {
    return !te.value.length && !Z.value && !se.value.length;
  }), oe = computed(function() {
    return te.value.length > 0 && ae.value.length == 0 && (N.value && _.value || !_.value);
  }), se = computed(function() {
    var e;
    return ee.value !== false && N.value ? Se(N.value) !== -1 ? [] : [(e = {}, O(e, q.value, N.value), O(e, g.value, N.value), O(e, ce.value, N.value), e)] : [];
  }), ce = computed(function() {
    return c.value || g.value;
  }), ve = computed(function() {
    switch (s.value) {
      case "single":
        return null;
      case "multiple":
      case "tags":
        return [];
    }
  }), pe = computed(function() {
    return S2.value || Z.value;
  }), de = function(e) {
    switch (m(e) !== "object" && (e = Ae(e)), s.value) {
      case "single":
        K(e);
        break;
      case "multiple":
      case "tags":
        K($.value.concat(e));
    }
    n.emit("select", ge(e), e);
  }, fe = function(e) {
    switch (m(e) !== "object" && (e = Ae(e)), s.value) {
      case "single":
        he();
        break;
      case "tags":
      case "multiple":
        K(Array.isArray(e) ? $.value.filter(function(u) {
          return e.map(function(e2) {
            return e2[q.value];
          }).indexOf(u[q.value]) === -1;
        }) : $.value.filter(function(u) {
          return u[q.value] != e[q.value];
        }));
    }
    n.emit("deselect", ge(e), e);
  }, ge = function(e) {
    return A2.value ? e : e[q.value];
  }, be = function(e) {
    fe(e);
  }, he = function() {
    n.emit("clear"), K(ve.value);
  }, me = function(e) {
    if (e.group !== void 0)
      return s.value !== "single" && (Ce(e[V.value]) && e[V.value].length);
    switch (s.value) {
      case "single":
        return !b($.value) && $.value[q.value] == e[q.value];
      case "tags":
      case "multiple":
        return !b($.value) && $.value.map(function(e2) {
          return e2[q.value];
        }).indexOf(e[q.value]) !== -1;
    }
  }, De = function(e) {
    return e.disabled === true;
  }, ye = function() {
    return !(j === void 0 || j.value === -1 || !ne.value && j.value > 0) && $.value.length >= j.value;
  }, Oe = function(e) {
    Ae(e[q.value]) === void 0 && ee.value && (n.emit("tag", e[q.value]), n.emit("option", e[q.value]), ue.value && Be(e), G());
  }, Fe = function(e) {
    return e.find(function(e2) {
      return !me(e2) && !e2.disabled;
    }) === void 0;
  }, Ce = function(e) {
    return e.find(function(e2) {
      return !me(e2);
    }) === void 0;
  }, Ae = function(e) {
    return te.value[te.value.map(function(e2) {
      return String(e2[q.value]);
    }).indexOf(String(e))];
  }, Se = function(e) {
    return te.value.map(function(e2) {
      return e2[ce.value];
    }).indexOf(e);
  }, Ee = function(e) {
    return ["tags", "multiple"].indexOf(s.value) !== -1 && p.value && me(e);
  }, Be = function(e) {
    X.value.push(e);
  }, Le = function(e) {
    return R.value ? e.filter(function(e2) {
      return N.value ? e2.__VISIBLE__.length : e2[V.value].length;
    }) : e.filter(function(e2) {
      return !N.value || e2.__VISIBLE__.length;
    });
  }, Pe = function(e) {
    var u = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1], t = e;
    return N.value && P2.value && (t = t.filter(function(e2) {
      return h(e2[ce.value], T.value).indexOf(h(N.value, T.value)) !== -1;
    })), p.value && u && (t = t.filter(function(e2) {
      return !Ee(e2);
    })), t;
  }, ke = function(e) {
    var u, t = e;
    return u = t, Object.prototype.toString.call(u) === "[object Object]" && (t = Object.keys(t).map(function(e2) {
      var u2, l = t[e2];
      return O(u2 = {}, q.value, e2), O(u2, ce.value, l), O(u2, g.value, l), u2;
    })), t = t.map(function(e2) {
      var u2;
      return m(e2) === "object" ? e2 : (O(u2 = {}, q.value, e2), O(u2, ce.value, e2), O(u2, g.value, e2), u2);
    });
  }, we = function() {
    b(H.value) || ($.value = xe(H.value));
  }, qe = function(e) {
    Z.value = true, o.value(N.value).then(function(u) {
      Y.value = u, typeof e == "function" && e(u), Z.value = false;
    });
  }, xe = function(e) {
    return b(e) ? s.value === "single" ? {} : [] : A2.value ? e : s.value === "single" ? Ae(e) || {} : e.filter(function(e2) {
      return !!Ae(e2);
    }).map(function(e2) {
      return Ae(e2);
    });
  };
  if (s.value !== "single" && !b(H.value) && !Array.isArray(H.value))
    throw new Error('v-model must be an array when using "'.concat(s.value, '" mode'));
  return o && typeof o.value == "function" ? B2.value ? qe(we) : A2.value == 1 && we() : (Y.value = o.value, we()), E2.value > -1 && watch(N, function(e) {
    e.length < L2.value || (Z.value = true, k2.value && (Y.value = []), setTimeout(function() {
      e == N.value && o.value(N.value).then(function(u) {
        e != N.value && N.value || (Y.value = u, U.value = ae.value.filter(function(e2) {
          return e2.disabled !== true;
        })[0] || null, Z.value = false);
      });
    }, E2.value));
  }, { flush: "sync" }), watch(H, function(e) {
    var u, t, l;
    if (b(e))
      $.value = xe(e);
    else
      switch (s.value) {
        case "single":
          (A2.value ? e[q.value] != $.value[q.value] : e != $.value[q.value]) && ($.value = xe(e));
          break;
        case "multiple":
        case "tags":
          u = A2.value ? e.map(function(e2) {
            return e2[q.value];
          }) : e, t = $.value.map(function(e2) {
            return e2[q.value];
          }), l = t.slice().sort(), u.length === t.length && u.slice().sort().every(function(e2, u2) {
            return e2 === l[u2];
          }) || ($.value = xe(e));
      }
  }, { deep: true }), typeof a.options != "function" && watch(o, function(e, u) {
    Y.value = a.options, Object.keys($.value).length || we(), function() {
      if (ne.value)
        if (s.value === "single") {
          var e2 = Ae($.value[q.value])[g.value];
          $.value[g.value] = e2, A2.value && (H.value[g.value] = e2);
        } else
          $.value.forEach(function(e3, u2) {
            var t = Ae($.value[u2][q.value])[g.value];
            $.value[u2][g.value] = t, A2.value && (H.value[u2][g.value] = t);
          });
    }();
  }), { fo: ae, filteredOptions: ae, hasSelected: ne, multipleLabelText: re, eo: te, extendedOptions: te, fg: le, filteredGroups: le, noOptions: ie, noResults: oe, resolving: Z, busy: pe, select: de, deselect: fe, remove: be, selectAll: function() {
    s.value !== "single" && de(ae.value);
  }, clear: he, isSelected: me, isDisabled: De, isMax: ye, getOption: Ae, handleOptionClick: function(e) {
    if (!De(e)) {
      switch (s.value) {
        case "single":
          if (me(e))
            return void (x.value && fe(e));
          Oe(e), z(), de(e);
          break;
        case "multiple":
          if (me(e))
            return void fe(e);
          if (ye())
            return;
          Oe(e), de(e), w.value && G(), p.value && W(), I.value && z();
          break;
        case "tags":
          if (me(e))
            return void fe(e);
          if (ye())
            return;
          Oe(e), w.value && G(), de(e), p.value && W(), I.value && z();
      }
      I.value ? Q() : J();
    }
  }, handleGroupClick: function(e) {
    if (!De(e) && s.value !== "single" && M.value) {
      switch (s.value) {
        case "multiple":
        case "tags":
          Fe(e[V.value]) ? fe(e[V.value]) : de(e[V.value].filter(function(e2) {
            return $.value.map(function(e3) {
              return e3[q.value];
            }).indexOf(e2[q.value]) === -1;
          }).filter(function(e2) {
            return !e2.disabled;
          }).filter(function(e2, u) {
            return $.value.length + 1 + u <= j.value || j.value === -1;
          }));
      }
      I.value && Q();
    }
  }, handleTagRemove: function(e, u) {
    u.button === 0 ? be(e) : u.preventDefault();
  }, refreshOptions: function(e) {
    qe(e);
  }, resolveOptions: qe };
}
function C(e) {
  return function(e2) {
    if (Array.isArray(e2))
      return A(e2);
  }(e) || function(e2) {
    if (typeof Symbol != "undefined" && Symbol.iterator in Object(e2))
      return Array.from(e2);
  }(e) || function(e2, u) {
    if (!e2)
      return;
    if (typeof e2 == "string")
      return A(e2, u);
    var t = Object.prototype.toString.call(e2).slice(8, -1);
    t === "Object" && e2.constructor && (t = e2.constructor.name);
    if (t === "Map" || t === "Set")
      return Array.from(e2);
    if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
      return A(e2, u);
  }(e) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function A(e, u) {
  (u == null || u > e.length) && (u = e.length);
  for (var t = 0, l = new Array(u); t < u; t++)
    l[t] = e[t];
  return l;
}
function S(e) {
  return function(e2) {
    if (Array.isArray(e2))
      return E(e2);
  }(e) || function(e2) {
    if (typeof Symbol != "undefined" && Symbol.iterator in Object(e2))
      return Array.from(e2);
  }(e) || function(e2, u) {
    if (!e2)
      return;
    if (typeof e2 == "string")
      return E(e2, u);
    var t = Object.prototype.toString.call(e2).slice(8, -1);
    t === "Object" && e2.constructor && (t = e2.constructor.name);
    if (t === "Map" || t === "Set")
      return Array.from(e2);
    if (t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))
      return E(e2, u);
  }(e) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function E(e, u) {
  (u == null || u > e.length) && (u = e.length);
  for (var t = 0, l = new Array(u); t < u; t++)
    l[t] = e[t];
  return l;
}
function B(e, u) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var l = Object.getOwnPropertySymbols(e);
    u && (l = l.filter(function(u2) {
      return Object.getOwnPropertyDescriptor(e, u2).enumerable;
    })), t.push.apply(t, l);
  }
  return t;
}
function L(e, u, t) {
  return u in e ? Object.defineProperty(e, u, { value: t, enumerable: true, configurable: true, writable: true }) : e[u] = t, e;
}
function P(u, l, a) {
  var n = toRefs(u), r = n.classes, i = n.disabled, o = n.openDirection, s = n.showOptions, c = a.isOpen, v = a.isPointed, p = a.isSelected, d = a.isDisabled, f = a.isActive, g = a.canPointGroups, b2 = a.resolving, h2 = a.fo, m2 = computed(function() {
    return function(e) {
      for (var u2 = 1; u2 < arguments.length; u2++) {
        var t = arguments[u2] != null ? arguments[u2] : {};
        u2 % 2 ? B(Object(t), true).forEach(function(u3) {
          L(e, u3, t[u3]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : B(Object(t)).forEach(function(u3) {
          Object.defineProperty(e, u3, Object.getOwnPropertyDescriptor(t, u3));
        });
      }
      return e;
    }({ container: "multiselect", containerDisabled: "is-disabled", containerOpen: "is-open", containerOpenTop: "is-open-top", containerActive: "is-active", singleLabel: "multiselect-single-label", singleLabelText: "multiselect-single-label-text", multipleLabel: "multiselect-multiple-label", search: "multiselect-search", tags: "multiselect-tags", tag: "multiselect-tag", tagDisabled: "is-disabled", tagRemove: "multiselect-tag-remove", tagRemoveIcon: "multiselect-tag-remove-icon", tagsSearchWrapper: "multiselect-tags-search-wrapper", tagsSearch: "multiselect-tags-search", tagsSearchCopy: "multiselect-tags-search-copy", placeholder: "multiselect-placeholder", caret: "multiselect-caret", caretOpen: "is-open", clear: "multiselect-clear", clearIcon: "multiselect-clear-icon", spinner: "multiselect-spinner", dropdown: "multiselect-dropdown", dropdownTop: "is-top", dropdownHidden: "is-hidden", options: "multiselect-options", optionsTop: "is-top", group: "multiselect-group", groupLabel: "multiselect-group-label", groupLabelPointable: "is-pointable", groupLabelPointed: "is-pointed", groupLabelSelected: "is-selected", groupLabelDisabled: "is-disabled", groupLabelSelectedPointed: "is-selected is-pointed", groupLabelSelectedDisabled: "is-selected is-disabled", groupOptions: "multiselect-group-options", option: "multiselect-option", optionPointed: "is-pointed", optionSelected: "is-selected", optionDisabled: "is-disabled", optionSelectedPointed: "is-selected is-pointed", optionSelectedDisabled: "is-selected is-disabled", noOptions: "multiselect-no-options", noResults: "multiselect-no-results", fakeInput: "multiselect-fake-input", spacer: "multiselect-spacer" }, r.value);
  }), D2 = computed(function() {
    return !!(c.value && s.value && (!b2.value || b2.value && h2.value.length));
  });
  return { classList: computed(function() {
    var e = m2.value;
    return { container: [e.container].concat(i.value ? e.containerDisabled : []).concat(D2.value && o.value === "top" ? e.containerOpenTop : []).concat(D2.value && o.value !== "top" ? e.containerOpen : []).concat(f.value ? e.containerActive : []), spacer: e.spacer, singleLabel: e.singleLabel, singleLabelText: e.singleLabelText, multipleLabel: e.multipleLabel, search: e.search, tags: e.tags, tag: [e.tag].concat(i.value ? e.tagDisabled : []), tagRemove: e.tagRemove, tagRemoveIcon: e.tagRemoveIcon, tagsSearchWrapper: e.tagsSearchWrapper, tagsSearch: e.tagsSearch, tagsSearchCopy: e.tagsSearchCopy, placeholder: e.placeholder, caret: [e.caret].concat(c.value ? e.caretOpen : []), clear: e.clear, clearIcon: e.clearIcon, spinner: e.spinner, dropdown: [e.dropdown].concat(o.value === "top" ? e.dropdownTop : []).concat(c.value && s.value && D2.value ? [] : e.dropdownHidden), options: [e.options].concat(o.value === "top" ? e.optionsTop : []), group: e.group, groupLabel: function(u2) {
      var t = [e.groupLabel];
      return v(u2) ? t.push(p(u2) ? e.groupLabelSelectedPointed : e.groupLabelPointed) : p(u2) && g.value ? t.push(d(u2) ? e.groupLabelSelectedDisabled : e.groupLabelSelected) : d(u2) && t.push(e.groupLabelDisabled), g.value && t.push(e.groupLabelPointable), t;
    }, groupOptions: e.groupOptions, option: function(u2, t) {
      var l2 = [e.option];
      return v(u2) ? l2.push(p(u2) ? e.optionSelectedPointed : e.optionPointed) : p(u2) ? l2.push(d(u2) ? e.optionSelectedDisabled : e.optionSelected) : (d(u2) || t && d(t)) && l2.push(e.optionDisabled), l2;
    }, noOptions: e.noOptions, noResults: e.noResults, fakeInput: e.fakeInput };
  }), showDropdown: D2 };
}
var k = { name: "Multiselect", emits: ["open", "close", "select", "deselect", "input", "search-change", "tag", "option", "update:modelValue", "change", "clear"], props: { value: { required: false }, modelValue: { required: false }, options: { type: [Array, Object, Function], required: false, default: () => [] }, id: { type: [String, Number], required: false }, name: { type: [String, Number], required: false, default: "multiselect" }, disabled: { type: Boolean, required: false, default: false }, label: { type: String, required: false, default: "label" }, trackBy: { type: String, required: false, default: void 0 }, valueProp: { type: String, required: false, default: "value" }, placeholder: { type: String, required: false, default: null }, mode: { type: String, required: false, default: "single" }, searchable: { type: Boolean, required: false, default: false }, limit: { type: Number, required: false, default: -1 }, hideSelected: { type: Boolean, required: false, default: true }, createTag: { type: Boolean, required: false, default: void 0 }, createOption: { type: Boolean, required: false, default: void 0 }, appendNewTag: { type: Boolean, required: false, default: void 0 }, appendNewOption: { type: Boolean, required: false, default: void 0 }, addTagOn: { type: Array, required: false, default: void 0 }, addOptionOn: { type: Array, required: false, default: void 0 }, caret: { type: Boolean, required: false, default: true }, loading: { type: Boolean, required: false, default: false }, noOptionsText: { type: String, required: false, default: "The list is empty" }, noResultsText: { type: String, required: false, default: "No results found" }, multipleLabel: { type: Function, required: false }, object: { type: Boolean, required: false, default: false }, delay: { type: Number, required: false, default: -1 }, minChars: { type: Number, required: false, default: 0 }, resolveOnLoad: { type: Boolean, required: false, default: true }, filterResults: { type: Boolean, required: false, default: true }, clearOnSearch: { type: Boolean, required: false, default: false }, clearOnSelect: { type: Boolean, required: false, default: true }, canDeselect: { type: Boolean, required: false, default: true }, canClear: { type: Boolean, required: false, default: true }, max: { type: Number, required: false, default: -1 }, showOptions: { type: Boolean, required: false, default: true }, required: { type: Boolean, required: false, default: false }, openDirection: { type: String, required: false, default: "bottom" }, nativeSupport: { type: Boolean, required: false, default: false }, classes: { type: Object, required: false, default: () => ({}) }, strict: { type: Boolean, required: false, default: true }, closeOnSelect: { type: Boolean, required: false, default: true }, autocomplete: { type: String, required: false }, groups: { type: Boolean, required: false, default: false }, groupLabel: { type: String, required: false, default: "label" }, groupOptions: { type: String, required: false, default: "options" }, groupHideEmpty: { type: Boolean, required: false, default: false }, groupSelect: { type: Boolean, required: false, default: true }, inputType: { type: String, required: false, default: "text" }, attrs: { required: false, type: [Object], default: () => ({}) } }, setup(n, r) {
  const i = function(l, a) {
    var n2 = toRefs(l), r2 = n2.value, i2 = n2.modelValue, o2 = n2.mode, s2 = n2.valueProp, c2 = ref(o2.value !== "single" ? [] : {}), v2 = a.expose !== void 0 ? i2 : r2, p2 = computed(function() {
      return o2.value === "single" ? c2.value[s2.value] : c2.value.map(function(e) {
        return e[s2.value];
      });
    }), d2 = computed(function() {
      return o2.value !== "single" ? c2.value.map(function(e) {
        return e[s2.value];
      }).join(",") : c2.value[s2.value];
    });
    return { iv: c2, internalValue: c2, ev: v2, externalValue: v2, textValue: d2, plainValue: p2 };
  }(n, r), o = function(t, l, a) {
    var n2 = toRefs(t), r2 = n2.groupSelect, i2 = n2.mode, o2 = n2.groups, s2 = ref(null), c2 = function(e) {
      e === void 0 || e !== null && e.disabled || o2.value && e && e.group && (i2.value === "single" || !r2.value) || (s2.value = e);
    };
    return { pointer: s2, setPointer: c2, clearPointer: function() {
      c2(null);
    } };
  }(n), s = function(t, l, a) {
    var n2 = toRefs(t).disabled, r2 = ref(false);
    return { isOpen: r2, open: function() {
      r2.value || n2.value || (r2.value = true, l.emit("open"));
    }, close: function() {
      r2.value && (r2.value = false, l.emit("close"));
    } };
  }(n, r), c = function(e, t, a) {
    var n2 = ref(null), r2 = ref(null);
    return watch(n2, function(e2) {
      t.emit("search-change", e2);
    }), { search: n2, input: r2, clearSearch: function() {
      n2.value = "";
    }, handleSearchInput: function(e2) {
      n2.value = e2.target.value;
    }, handlePaste: function(e2) {
      t.emit("paste", e2);
    } };
  }(0, r), v = function(u, t, l) {
    var a = toRefs(u), n2 = a.object, r2 = a.valueProp, i2 = a.mode, o2 = l.iv, s2 = function(e) {
      return n2.value || b(e) ? e : Array.isArray(e) ? e.map(function(e2) {
        return e2[r2.value];
      }) : e[r2.value];
    }, c2 = function(e) {
      return b(e) ? i2.value === "single" ? {} : [] : e;
    };
    return { update: function(e) {
      o2.value = c2(e);
      var u2 = s2(e);
      t.emit("change", u2), t.emit("input", u2), t.emit("update:modelValue", u2);
    } };
  }(n, r, { iv: i.iv }), p = function(l, a, n2) {
    var r2 = toRefs(l), i2 = r2.searchable, o2 = r2.disabled, s2 = n2.input, c2 = n2.open, v2 = n2.close, p2 = n2.clearSearch, d2 = ref(null), f2 = ref(false), g2 = computed(function() {
      return i2.value || o2.value ? -1 : 0;
    }), b2 = function() {
      i2.value && s2.value.blur(), d2.value.blur();
    }, h3 = function() {
      i2.value && !o2.value && s2.value.focus();
    }, m2 = function() {
      f2.value = false, setTimeout(function() {
        f2.value || (v2(), p2());
      }, 1);
    };
    return { multiselect: d2, tabindex: g2, isActive: f2, blur: b2, focus: h3, handleFocus: function() {
      h3();
    }, activate: function() {
      o2.value || (f2.value = true, c2());
    }, deactivate: m2, handleCaretClick: function() {
      m2(), b2();
    } };
  }(n, 0, { input: c.input, open: s.open, close: s.close, clearSearch: c.clearSearch }), d = F(n, r, { ev: i.ev, iv: i.iv, search: c.search, clearSearch: c.clearSearch, update: v.update, pointer: o.pointer, clearPointer: o.clearPointer, blur: p.blur, focus: p.focus, deactivate: p.deactivate }), f = function(u, n2, r2) {
    var i2 = toRefs(u), o2 = i2.valueProp, s2 = i2.showOptions, c2 = i2.searchable, v2 = i2.groupLabel, p2 = i2.groups, d2 = i2.mode, f2 = i2.groupSelect, g2 = r2.fo, b2 = r2.fg, h3 = r2.handleOptionClick, m2 = r2.handleGroupClick, D2 = r2.search, y2 = r2.pointer, O2 = r2.setPointer, F2 = r2.clearPointer, A2 = r2.multiselect, S2 = computed(function() {
      return g2.value.filter(function(e) {
        return !e.disabled;
      });
    }), E2 = computed(function() {
      return b2.value.filter(function(e) {
        return !e.disabled;
      });
    }), B2 = computed(function() {
      return d2.value !== "single" && f2.value;
    }), L2 = computed(function() {
      return y2.value && y2.value.group;
    }), P2 = computed(function() {
      return R(y2.value);
    }), k2 = computed(function() {
      var e = L2.value ? y2.value : R(y2.value), u2 = E2.value.map(function(e2) {
        return e2[v2.value];
      }).indexOf(e[v2.value]), t = E2.value[u2 - 1];
      return t === void 0 && (t = q.value), t;
    }), w = computed(function() {
      var e = E2.value.map(function(e2) {
        return e2.label;
      }).indexOf(L2.value ? y2.value[v2.value] : R(y2.value)[v2.value]) + 1;
      return E2.value.length <= e && (e = 0), E2.value[e];
    }), q = computed(function() {
      return C(E2.value).slice(-1)[0];
    }), x = computed(function() {
      return y2.value.__VISIBLE__.filter(function(e) {
        return !e.disabled;
      })[0];
    }), j = computed(function() {
      var e = P2.value.__VISIBLE__.filter(function(e2) {
        return !e2.disabled;
      });
      return e[e.map(function(e2) {
        return e2[o2.value];
      }).indexOf(y2.value[o2.value]) - 1];
    }), T = computed(function() {
      var e = R(y2.value).__VISIBLE__.filter(function(e2) {
        return !e2.disabled;
      });
      return e[e.map(function(e2) {
        return e2[o2.value];
      }).indexOf(y2.value[o2.value]) + 1];
    }), I = computed(function() {
      return C(k2.value.__VISIBLE__.filter(function(e) {
        return !e.disabled;
      })).slice(-1)[0];
    }), _ = computed(function() {
      return C(q.value.__VISIBLE__.filter(function(e) {
        return !e.disabled;
      })).slice(-1)[0];
    }), V = function() {
      O2(S2.value[0] || null);
    }, R = function(e) {
      return E2.value.find(function(u2) {
        return u2.__VISIBLE__.map(function(e2) {
          return e2[o2.value];
        }).indexOf(e[o2.value]) !== -1;
      });
    }, M = function() {
      var e = A2.value.querySelector("[data-pointed]");
      if (e) {
        var u2 = e.parentElement.parentElement;
        p2.value && (u2 = L2.value ? e.parentElement.parentElement.parentElement : e.parentElement.parentElement.parentElement.parentElement), e.offsetTop + e.offsetHeight > u2.clientHeight + u2.scrollTop && (u2.scrollTop = e.offsetTop + e.offsetHeight - u2.clientHeight), e.offsetTop < u2.scrollTop && (u2.scrollTop = e.offsetTop);
      }
    };
    return watch(D2, function(e) {
      c2.value && (e.length && s2.value ? V() : F2());
    }), { pointer: y2, canPointGroups: B2, isPointed: function(e) {
      return !(!y2.value || !(!e.group && y2.value[o2.value] == e[o2.value] || e.group !== void 0 && y2.value[v2.value] == e[v2.value])) || void 0;
    }, setPointerFirst: V, selectPointer: function() {
      y2.value && y2.value.disabled !== true && (L2.value ? m2(y2.value) : h3(y2.value));
    }, forwardPointer: function() {
      if (y2.value === null)
        O2((p2.value && B2.value ? E2.value[0] : S2.value[0]) || null);
      else if (p2.value && B2.value) {
        var e = L2.value ? x.value : T.value;
        e === void 0 && (e = w.value), O2(e || null);
      } else {
        var u2 = S2.value.map(function(e2) {
          return e2[o2.value];
        }).indexOf(y2.value[o2.value]) + 1;
        S2.value.length <= u2 && (u2 = 0), O2(S2.value[u2] || null);
      }
      nextTick(function() {
        M();
      });
    }, backwardPointer: function() {
      if (y2.value === null) {
        var e = S2.value[S2.value.length - 1];
        p2.value && B2.value && (e = _.value) === void 0 && (e = q.value), O2(e || null);
      } else if (p2.value && B2.value) {
        var u2 = L2.value ? I.value : j.value;
        u2 === void 0 && (u2 = L2.value ? k2.value : P2.value), O2(u2 || null);
      } else {
        var t = S2.value.map(function(e2) {
          return e2[o2.value];
        }).indexOf(y2.value[o2.value]) - 1;
        t < 0 && (t = S2.value.length - 1), O2(S2.value[t] || null);
      }
      nextTick(function() {
        M();
      });
    } };
  }(n, 0, { fo: d.fo, fg: d.fg, handleOptionClick: d.handleOptionClick, handleGroupClick: d.handleGroupClick, search: c.search, pointer: o.pointer, setPointer: o.setPointer, clearPointer: o.clearPointer, multiselect: p.multiselect }), g = function(u, l, a) {
    var n2 = toRefs(u), r2 = n2.mode, i2 = n2.addTagOn, o2 = n2.openDirection, s2 = n2.searchable, c2 = n2.showOptions, v2 = n2.valueProp, p2 = n2.groups, d2 = n2.addOptionOn, f2 = n2.createTag, g2 = n2.createOption, b2 = a.iv, h3 = a.update, m2 = a.search, D2 = a.setPointer, y2 = a.selectPointer, O2 = a.backwardPointer, F2 = a.forwardPointer, C2 = a.blur, A2 = a.fo, E2 = computed(function() {
      return f2.value || g2.value || false;
    }), B2 = computed(function() {
      return i2.value !== void 0 ? i2.value : d2.value !== void 0 ? d2.value : ["enter"];
    }), L2 = function() {
      r2.value === "tags" && !c2.value && E2.value && s2.value && !p2.value && D2(A2.value[A2.value.map(function(e) {
        return e[v2.value];
      }).indexOf(m2.value)]);
    };
    return { handleKeydown: function(e) {
      switch (e.key) {
        case "Backspace":
          if (r2.value === "single")
            return;
          if (s2.value && [null, ""].indexOf(m2.value) === -1)
            return;
          if (b2.value.length === 0)
            return;
          h3(S(b2.value).slice(0, -1));
          break;
        case "Enter":
          if (e.preventDefault(), B2.value.indexOf("enter") === -1 && E2.value)
            return;
          L2(), y2();
          break;
        case " ":
          if (!E2.value && !s2.value)
            return e.preventDefault(), L2(), void y2();
          if (!E2.value)
            return false;
          if (B2.value.indexOf("space") === -1 && E2.value)
            return;
          e.preventDefault(), L2(), y2();
          break;
        case "Tab":
        case ";":
        case ",":
          if (B2.value.indexOf(e.key.toLowerCase()) === -1 || !E2.value)
            return;
          L2(), y2(), e.preventDefault();
          break;
        case "Escape":
          C2();
          break;
        case "ArrowUp":
          if (e.preventDefault(), !c2.value)
            return;
          o2.value === "top" ? F2() : O2();
          break;
        case "ArrowDown":
          if (e.preventDefault(), !c2.value)
            return;
          o2.value === "top" ? O2() : F2();
      }
    }, preparePointer: L2 };
  }(n, 0, { iv: i.iv, update: v.update, search: c.search, setPointer: o.setPointer, selectPointer: f.selectPointer, backwardPointer: f.backwardPointer, forwardPointer: f.forwardPointer, blur: p.blur, fo: d.fo }), h2 = P(n, 0, { isOpen: s.isOpen, isPointed: f.isPointed, canPointGroups: f.canPointGroups, isSelected: d.isSelected, isDisabled: d.isDisabled, isActive: p.isActive, resolving: d.resolving, fo: d.fo });
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues(__spreadValues({}, i), s), p), o), v), c), d), f), g), h2);
} };
k.render = function(e, u, t, l, a, b2) {
  return openBlock(), createBlock("div", { ref: "multiselect", tabindex: e.tabindex, class: e.classList.container, id: t.id, onFocusin: u[7] || (u[7] = (...u2) => e.activate && e.activate(...u2)), onFocusout: u[8] || (u[8] = (...u2) => e.deactivate && e.deactivate(...u2)), onKeydown: u[9] || (u[9] = (...u2) => e.handleKeydown && e.handleKeydown(...u2)), onFocus: u[10] || (u[10] = (...u2) => e.handleFocus && e.handleFocus(...u2)) }, [createCommentVNode(" Search "), t.mode !== "tags" && t.searchable && !t.disabled ? (openBlock(), createBlock("input", mergeProps({ key: 0, type: t.inputType, modelValue: e.search, value: e.search, class: e.classList.search, autocomplete: t.autocomplete }, t.attrs, { onInput: u[1] || (u[1] = (...u2) => e.handleSearchInput && e.handleSearchInput(...u2)), onPaste: u[2] || (u[2] = withModifiers((...u2) => e.handlePaste && e.handlePaste(...u2), ["stop"])), ref: "input" }), null, 16, ["type", "modelValue", "value", "autocomplete"])) : createCommentVNode("v-if", true), createCommentVNode(" Tags (with search) "), t.mode == "tags" ? (openBlock(), createBlock("div", { key: 1, class: e.classList.tags }, [(openBlock(true), createBlock(Fragment, null, renderList(e.iv, (u2, l2, a2) => renderSlot(e.$slots, "tag", { option: u2, handleTagRemove: e.handleTagRemove, disabled: t.disabled }, () => [(openBlock(), createBlock("span", { class: e.classList.tag, key: a2 }, [createTextVNode(toDisplayString(u2[t.label]) + " ", 1), t.disabled ? createCommentVNode("v-if", true) : (openBlock(), createBlock("span", { key: 0, class: e.classList.tagRemove, onClick: (t2) => e.handleTagRemove(u2, t2) }, [createVNode("span", { class: e.classList.tagRemoveIcon }, null, 2)], 10, ["onClick"]))], 2))])), 256)), createVNode("div", { class: e.classList.tagsSearchWrapper }, [createCommentVNode(" Used for measuring search width "), createVNode("span", { class: e.classList.tagsSearchCopy }, toDisplayString(e.search), 3), createCommentVNode(" Actual search input "), t.searchable && !t.disabled ? (openBlock(), createBlock("input", mergeProps({ key: 0, type: t.inputType, modelValue: e.search, value: e.search, class: e.classList.tagsSearch, autocomplete: t.autocomplete }, t.attrs, { onInput: u[3] || (u[3] = (...u2) => e.handleSearchInput && e.handleSearchInput(...u2)), onPaste: u[4] || (u[4] = withModifiers((...u2) => e.handlePaste && e.handlePaste(...u2), ["stop"])), ref: "input" }), null, 16, ["type", "modelValue", "value", "autocomplete"])) : createCommentVNode("v-if", true)], 2)], 2)) : createCommentVNode("v-if", true), createCommentVNode(" Single label "), t.mode == "single" && e.hasSelected && !e.search && e.iv ? renderSlot(e.$slots, "singlelabel", { key: 2, value: e.iv }, () => [createVNode("div", { class: e.classList.singleLabel }, [createVNode("span", { class: e.classList.singleLabelText }, toDisplayString(e.iv[t.label]), 3)], 2)]) : createCommentVNode("v-if", true), createCommentVNode(" Multiple label "), t.mode == "multiple" && e.hasSelected && !e.search ? renderSlot(e.$slots, "multiplelabel", { key: 3, values: e.iv }, () => [createVNode("div", { class: e.classList.multipleLabel }, toDisplayString(e.multipleLabelText), 3)]) : createCommentVNode("v-if", true), createCommentVNode(" Placeholder "), !t.placeholder || e.hasSelected || e.search ? createCommentVNode("v-if", true) : renderSlot(e.$slots, "placeholder", { key: 4 }, () => [createVNode("div", { class: e.classList.placeholder }, toDisplayString(t.placeholder), 3)]), createCommentVNode(" Spinner "), e.busy && e.isActive ? renderSlot(e.$slots, "spinner", { key: 5 }, () => [createVNode("span", { class: e.classList.spinner }, null, 2)]) : createCommentVNode("v-if", true), createCommentVNode(" Clear "), e.hasSelected && !t.disabled && t.canClear && !e.busy ? renderSlot(e.$slots, "clear", { key: 6, clear: e.clear }, () => [createVNode("span", { class: e.classList.clear, onMousedown: u[5] || (u[5] = (...u2) => e.clear && e.clear(...u2)) }, [createVNode("span", { class: e.classList.clearIcon }, null, 2)], 34)]) : createCommentVNode("v-if", true), createCommentVNode(" Caret "), t.caret && t.showOptions ? renderSlot(e.$slots, "caret", { key: 7 }, () => [createVNode("span", { class: e.classList.caret, onClick: u[6] || (u[6] = (...u2) => e.handleCaretClick && e.handleCaretClick(...u2)) }, null, 2)]) : createCommentVNode("v-if", true), createCommentVNode(" Options "), createVNode("div", { class: e.classList.dropdown, tabindex: "-1" }, [renderSlot(e.$slots, "beforelist", { options: e.fo }), createVNode("ul", { class: e.classList.options }, [t.groups ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(e.fg, (u2, l2, a2) => (openBlock(), createBlock("li", { class: e.classList.group, key: a2 }, [createVNode("div", { class: e.classList.groupLabel(u2), "data-pointed": e.isPointed(u2), onMouseenter: (t2) => e.setPointer(u2), onClick: (t2) => e.handleGroupClick(u2) }, [renderSlot(e.$slots, "grouplabel", { group: u2 }, () => [createVNode("span", null, toDisplayString(u2[t.groupLabel]), 1)])], 42, ["data-pointed", "onMouseenter", "onClick"]), createVNode("ul", { class: e.classList.groupOptions }, [(openBlock(true), createBlock(Fragment, null, renderList(u2.__VISIBLE__, (l3, a3, i) => (openBlock(), createBlock("li", { class: e.classList.option(l3, u2), key: i, "data-pointed": e.isPointed(l3), onMouseenter: (u3) => e.setPointer(l3), onClick: (u3) => e.handleOptionClick(l3) }, [renderSlot(e.$slots, "option", { option: l3, search: e.search }, () => [createVNode("span", null, toDisplayString(l3[t.label]), 1)])], 42, ["data-pointed", "onMouseenter", "onClick"]))), 128))], 2)], 2))), 128)) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(e.fo, (u2, l2, a2) => (openBlock(), createBlock("li", { class: e.classList.option(u2), key: a2, "data-pointed": e.isPointed(u2), onMouseenter: (t2) => e.setPointer(u2), onClick: (t2) => e.handleOptionClick(u2) }, [renderSlot(e.$slots, "option", { option: u2, search: e.search }, () => [createVNode("span", null, toDisplayString(u2[t.label]), 1)])], 42, ["data-pointed", "onMouseenter", "onClick"]))), 128))], 2), e.noOptions ? renderSlot(e.$slots, "nooptions", { key: 0 }, () => [createVNode("div", { class: e.classList.noOptions, innerHTML: t.noOptionsText }, null, 10, ["innerHTML"])]) : createCommentVNode("v-if", true), e.noResults ? renderSlot(e.$slots, "noresults", { key: 1 }, () => [createVNode("div", { class: e.classList.noResults, innerHTML: t.noResultsText }, null, 10, ["innerHTML"])]) : createCommentVNode("v-if", true), renderSlot(e.$slots, "afterlist", { options: e.fo })], 2), createCommentVNode(" Hacky input element to show HTML5 required warning "), t.required ? (openBlock(), createBlock("input", { key: 8, class: e.classList.fakeInput, tabindex: "-1", value: e.textValue, required: "" }, null, 10, ["value"])) : createCommentVNode("v-if", true), createCommentVNode(" Native input support "), t.nativeSupport ? (openBlock(), createBlock(Fragment, { key: 9 }, [t.mode == "single" ? (openBlock(), createBlock("input", { key: 0, type: "hidden", name: t.name, value: e.plainValue !== void 0 ? e.plainValue : "" }, null, 8, ["name", "value"])) : (openBlock(true), createBlock(Fragment, { key: 1 }, renderList(e.plainValue, (e2, u2) => (openBlock(), createBlock("input", { type: "hidden", name: `${t.name}[]`, value: e2, key: u2 }, null, 8, ["name", "value"]))), 128))], 64)) : createCommentVNode("v-if", true), createCommentVNode(" Create height for empty input "), createVNode("div", { class: e.classList.spacer }, null, 2)], 42, ["tabindex", "id"]);
}, k.__file = "src/Multiselect.vue";
export { k as default };

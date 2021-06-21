//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  name: "VueSimpleAutocomplete",
  props: {
    items: {
      type: Array,
      required: false,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isLoadingMessage: {
      type: String,
      default: "Carregando resultados..."
    },
    noResultsMessage: {
      type: String,
      default: "Nenhum resultado encontrado"
    },
    getDisplayValue: {
      type: Function,
      default: item => item
    },
    selectedItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    minLength: {
      type: Number,
      default: 1
    },
    placeholder: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      results: [],
      search: this.getDisplayValue(this.selectedItem),
      arrowCounter: 0,
      isFocused: false,
      startedTyping: false
    };
  },

  watch: {
    selectedItem: function (newValue, oldValue) {
      if (newValue != oldValue && !newValue) {
        this.search = this.getDisplayValue(newValue);
      }

      if (newValue && typeof newValue == "object" && Object.keys(newValue).length > 0 || Array.isArray(newValue)) {
        this.search = this.getDisplayValue(newValue);
        return;
      }

      if (typeof newValue != "object" && !Array.isArray(newValue) && newValue !== oldValue) {
        this.search = this.getDisplayValue(newValue);
      }
    }
  },
  methods: {
    onChange() {
      // Let's warn the parent that a change was made
      if (this.search.length < this.minLength) {
        this.$emit("change", "");
      } else {
        this.$emit("change", this.search);
      }

      this.startedTyping = true; //indica que usuario comecou a digitar

      this.isFocused = true;
    },

    setResult(result) {
      this.search = this.getDisplayValue(result);
      this.isFocused = false;
      this.arrowCounter = -1;
      this.startedTyping = false; //usuario terminou de digitar

      this.$emit("value-selected", result);
    },

    onArrowDown() {
      if (this.arrowCounter < this.items.length - 1) {
        this.arrowCounter++;
      }
    },

    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter--;
      }
    },

    onEnter(event) {
      event.preventDefault();

      if (this.arrowCounter > -1) {
        this.setResult(this.items[this.arrowCounter]);
      }

      this.startedTyping = false; //usuario terminou de digitar

      this.isFocused = false;
      this.arrowCounter = -1;
    },

    onFocus() {
      this.isFocused = true;
    },

    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isFocused = false;
        this.arrowCounter = -1;

        if (this.items.length === 0 && this.startedTyping) {
          this.search = "";
        }
      }
    }

  },
  computed: {
    isOpen() {
      return (this.isLoading || this.items && this.items.length > 0 || this.items && this.items.length == 0 && this.search.length >= this.minLength && !this.isLoading) && this.isFocused && this.startedTyping;
    }

  },

  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },

  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  }

};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "autocomplete"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: _vm.search,
      expression: "search"
    }],
    attrs: {
      "type": "text",
      "placeholder": _vm.placeholder
    },
    domProps: {
      "value": _vm.search
    },
    on: {
      "input": [function ($event) {
        if ($event.target.composing) {
          return;
        }

        _vm.search = $event.target.value;
      }, _vm.onChange],
      "keydown": [function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
          return null;
        }

        return _vm.onArrowDown($event);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
          return null;
        }

        return _vm.onArrowUp($event);
      }, function ($event) {
        if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
          return null;
        }

        return _vm.onEnter($event);
      }],
      "focus": _vm.onFocus
    }
  }), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.isOpen,
      expression: "isOpen"
    }],
    staticClass: "autocomplete-results",
    attrs: {
      "id": "autocomplete-results"
    }
  }, [_vm.isLoading ? _c('li', {
    staticClass: "loading"
  }, [_vm._v("\n      " + _vm._s(_vm.isLoadingMessage) + "\n    ")]) : _vm._l(_vm.items, function (item, i) {
    return _c('li', {
      key: i,
      staticClass: "autocomplete-result",
      class: {
        'is-active': i === _vm.arrowCounter
      },
      on: {
        "click": function ($event) {
          return _vm.setResult(item);
        }
      }
    }, [_vm._v("\n      " + _vm._s(_vm.getDisplayValue(item)) + "\n    ")]);
  }), _vm._v(" "), _vm.items && _vm.items.length == 0 && _vm.search.length >= _vm.minLength && !_vm.isLoading ? _c('li', [_vm._v("\n      " + _vm._s(_vm.noResultsMessage) + "\n    ")]) : _vm._e()], 2)]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-0e129b92_0", {
    source: ".autocomplete[data-v-0e129b92]{position:relative;width:100%}.autocomplete input[data-v-0e129b92]{width:97%;height:1.5rem}.autocomplete-results[data-v-0e129b92]{padding:0;margin:0;border:1px solid #eee;height:120px;overflow:auto;width:100%;position:absolute;background-color:#fff;z-index:8;box-shadow:#000 0 .1rem .3rem}.autocomplete li[data-v-0e129b92]{padding:0 .5rem}.autocomplete-result[data-v-0e129b92]{list-style:none;text-align:left;padding:4px 2px;cursor:pointer}.autocomplete-result.is-active[data-v-0e129b92],.autocomplete-result[data-v-0e129b92]:hover{background-color:#4aae9b;color:#fff}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-0e129b92";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = __vue_component__; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('VueSimpleAutocomplete', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export default entry_esm;

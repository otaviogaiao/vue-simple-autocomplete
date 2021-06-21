<template>
  <div class="autocomplete">
    <input
      type="text"
      @input="onChange"
      v-model="search"
      @keydown.down="onArrowDown"
      @keydown.up="onArrowUp"
      @keydown.enter="onEnter"
      @focus="onFocus"
      :placeholder="placeholder"
    />
    <ul id="autocomplete-results" v-show="isOpen" class="autocomplete-results">
      <li class="loading" v-if="isLoading">
        {{ isLoadingMessage }}
      </li>
      <li
        v-else
        v-for="(item, i) in items"
        :key="i"
        @click="setResult(item)"
        class="autocomplete-result"
        :class="{ 'is-active': i === arrowCounter }"
      >
        {{ getDisplayValue(item) }}
      </li>
      <li
        v-if="
          items && items.length == 0 && search.length >= minLength && !isLoading
        "
      >
        {{ noResultsMessage }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "VueSimpleAutocomplete",
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isLoadingMessage: {
      type: String,
      default: "Carregando resultados...",
    },
    noResultsMessage: {
      type: String,
      default: "Nenhum resultado encontrado",
    },
    getDisplayValue: {
      type: Function,
      default: (item) => item,
    },
    selectedItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    minLength: {
      type: Number,
      default: 1,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      results: [],
      search: this.getDisplayValue(this.selectedItem),
      arrowCounter: 0,
      isFocused: false,
      startedTyping: false,
    };
  },
  watch: {
    selectedItem: function(newValue, oldValue) {
      if (
        (typeof newValue == "object" && Object.keys(newValue).length > 0) ||
        Array.isArray(newValue)
      ) {
        this.search = this.getDisplayValue(newValue);
        return;
      }

      if (
        typeof newValue != "object" &&
        !Array.isArray(newValue) &&
        newValue !== oldValue
      ) {
        this.search = this.getDisplayValue(newValue);
      }
    },
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
    },
  },
  computed: {
    isOpen() {
      return (
        (this.isLoading ||
          (this.items && this.items.length > 0) ||
          (this.items &&
            this.items.length == 0 &&
            this.search.length >= this.minLength &&
            !this.isLoading)) &&
        this.isFocused &&
        this.startedTyping
      );
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  destroyed() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.autocomplete {
  position: relative;
  width: 100%;
}

.autocomplete input {
  width: 97%;
  height: 1.5rem;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  overflow: auto;
  width: 100%;
  position: absolute;
  background-color: white;
  z-index: 8;
  box-shadow: black 0 0.1rem 0.3rem;
}

.autocomplete li {
  padding: 0 0.5rem;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>

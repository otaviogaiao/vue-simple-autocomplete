# Vue Simple Autocomplete

Compatible with Vue 2.x

## Installation

`yarn add vue-simple-autocomplete`

## Use

This component is used as a base to create your own autocomplete. For example, If I need to create an autocomplete for `originProcesso`, I would create my component `originProcessoAutocomplete`, like this:

```
<template>
  <div>
    <VueSimpleAutocomplete
      :items="originsProcess"
      :selected-item="originProcesso"
      @change="searchOrigins"
      @value-selected="onOriginSelected"
      :is-loading="loadingOrigins"
      :get-display-value="displayOrigin"
      :min-length="2"
      placeholder="Type to search"
    ></VueSimpleAutocomplete>
  </div>
</template>

<script>
import originProcessApi from "../../services/api/originProcessApi";
import VueSimpleAutocomplete from "vue-simple-autocomplete";

export default {
  name: "originProcessoAutocomplete",
  components: {
    VueSimpleAutocomplete,
  },
  model: {
    prop: "originProcesso",
    event: "change",
  },
  props: {
    originProcesso: Object,
  },
  data() {
    return {
      originsProcess: [],
      loadingOrigins: false,
    };
  },
  created() {
    this.originProcessApi = new originProcessApi();
  },
  methods: {
    async searchOrigins(name) {
      try {
        this.originsProcess = [];
        this.$emit("change", {});

        if (name == null || name.length === 0) {
          return;
        }
        this.loadingOrigins = true;
        this.originsProcess = await this.originProcessApi.getOriginProcessAutocomplete(
          name
        );
        this.loadingOrigins = false;
      } catch (err) {
        this.loadingOrigins = false;
      }
    },
    onOriginSelected(origin) {
      this.$emit("change", origin);
    },
    displayOrigin(origin) {
      if (origin && origin !== "" && origin.name) {
        return origin.name;
      }

      return "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
```

## Props

- items: Array of items to display on the list showed by the autocomplete. Usually the result of an api query. Default is `[]`.

- isLoading: Boolean value indicating if a search is being made. When this value is true, the autocomplete will show the message provided with `isLoadingMessage`. Default is `false`.

- isLoadingMessage: String value showed when isLoading is true. Default is `Carregando resultados...`.

- noResultsMessage: String value showed when items is empty. Default is `Nenhum resultado encontrado`.

- getDisplayValue: Function that receives the selected item from `items`. It should return a string value that will be showed on the input in the autocomplete. Default is `(item) => item`.

- selectedItem: The selectedItem from `items`. Default is `{}`.

- minLength: Number indicating the minimum number of characters for the autocomplete to start a search. Default is `1`.

- placeholder: Placeholder string for the input in the autocomplete.

## Events

- change: event triggered when an input of the minLength specified is provided. It receives the value of the input.

- value-selected: event triggered when a value is selected in the autocomplete. It receives the value selected.

## License

MIT License
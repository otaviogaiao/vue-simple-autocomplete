<script>
import Vue from "vue";
import ExampleAutocomplete from "./ExampleAutocomplete.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    ExampleAutocomplete,
  },
  data() {
    return {
      country: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.country = {
        id: 1,
        name: "Brazil",
      };
    }, 2000);
  },
  methods: {
    clear() {
      this.country = null;
    },
  },
});
</script>

<template>
  <div id="app">
    <h1>Autocomplete</h1>
    <ExampleAutocomplete v-model="country" />
    <button @click="clear">Clear</button>
  </div>
</template>

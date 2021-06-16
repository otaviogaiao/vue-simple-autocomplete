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
});
</script>

<template>
  <div id="app">
    <h1>Autocomplete</h1>
    <ExampleAutocomplete v-model="country" />
  </div>
</template>

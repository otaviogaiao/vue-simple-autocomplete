<script>
import Vue from 'vue';
import VueSimpleAutocomplete from '@/vue-simple-autocomplete.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueSimpleAutocomplete
  }
});
</script>

<template>
  <div id="app">
    <vue-simple-autocomplete />
  </div>
</template>

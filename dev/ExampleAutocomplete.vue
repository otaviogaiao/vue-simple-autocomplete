<template>
  <div>
    <VueSimpleAutocomplete
      :items="countries"
      :selected-item="country"
      @change="searchCountry"
      @value-selected="onCountrySelected"
      :is-loading="loadingCountries"
      :get-display-value="displayCountry"
      :min-length="2"
      placeholder="Type to search"
    />

    <div>
      <h2>Value selected</h2>
      {{ country || "None" }}
    </div>
  </div>
</template>

<script>
import VueSimpleAutocomplete from "@/vue-simple-autocomplete.vue";

export default {
  name: "ExampleAutocomplete",
  model: {
    prop: "country",
    event: "change",
  },
  props: {
    country: Object,
  },
  components: {
    VueSimpleAutocomplete,
  },
  data() {
    return {
      countries: [],
      loadingCountries: false,
    };
  },
  methods: {
    async searchCountry(name) {
      try {
        this.countries = [];
        this.$emit("change", {});

        if (name == null || name.length === 0) {
          return;
        }

        this.loadingCountries = true;
        setTimeout(() => {
          this.countries = data.filter((d) => d.name.includes(name));

          this.loadingCountries = false;
        }, 1500);
      } catch (err) {
        console.log(err);
        this.loadingCountries = false;
      }
    },
    onCountrySelected(country) {
      this.$emit("change", { ...country });
    },
    displayCountry(country) {
      if (country && country != "" && country.name) {
        return country.name;
      }

      return "";
    },
  },
};

const data = [
  {
    id: 1,
    name: "Brazil",
  },
  {
    id: 2,
    name: "Argentine",
  },
  {
    id: 3,
    name: "Bolivia",
  },
  {
    id: 4,
    name: "China",
  },
  {
    id: 5,
    name: "United States",
  },
  {
    id: 6,
    name: "Portugal",
  },
  {
    id: 7,
    name: "South Africa",
  },
  {
    id: 8,
    name: "Chile",
  },
];
</script>

<script setup lang="ts">
import type { FiltersInterface, FilterUpdate, Category } from "@/interfaces";

defineProps<{
  filters: FiltersInterface;
  nbrOfProducts: number;
}>();

const emit = defineEmits<{
  (e: "updateFilter", FilterUpdate: FilterUpdate): void;
}>();
</script>

<template>
  <div class="p-20 d-flex flex-column">
    <section class="p-10">
      <h3 class="mb-10">Rechercher par titre</h3>
      <input
        :value="filters.search"
        @input="
          emit('updateFilter', {
            search: ($event.target as HTMLInputElement).value,
          })
        "
        type="text"
        placeholder="rechercher"
      />
    </section>

    <section class="p-20">
      <h3>trier par prix</h3>
      <div
        class="mb-5"
        v-for="priceRange of ([[0, 55], [60, 100]] as [number, number][])"
        :key="priceRange[0] + ''"
      >
        <input
          @input="emit('updateFilter', { priceRange })"
          :checked="filters.priceRange[0] === priceRange[0]"
          type="radio"
          name="priceRange"
          :id="priceRange[0] + ' '"
        />
        <label :for="priceRange[0].toString()">
          {{
            priceRange[0] === 0
              ? "Tous les prix"
              : priceRange[0] === 150
              ? "Plus de 2000€"
              : `Entre ${priceRange[0]}€ et ${priceRange[1]}€`
          }}
        </label>
      </div>
    </section>
    <section class="mb-20 flex-fill">
      <h3 class="mb-10">trier par category</h3>
      <p
        class="category"
        :class="{ selected: filters.category === category }"
        v-for="category in (['all' , 'a', 'robe' , 'manteaux'] as Category[])"
        :key="category"
        @click="emit('updateFilter', { category })"
      >
        {{ category }}
      </p>
    </section>
    <small class="mb-5">
      Nombre de résultats:
      <strong>{{ nbrOfProducts }}</strong>
    </small>
    <button class="btn btn-danger" @click="emit('updateFilter', {})">
      Supprimer les filtres
    </button>
  </div>
</template>

<style lang="scss" scoped>
.category {
  font-size: 14px;
  line-height: 18px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
.selected {
  font-weight: bold;
  text-decoration: underline;
}
</style>

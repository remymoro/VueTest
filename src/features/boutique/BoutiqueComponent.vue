<script setup lang="ts">
import { reactive, watchEffect, watch, toRef, provide } from "vue";
import { computed } from "vue";
import { DEFAULT_FILTERS } from "../boutique/data/filters";
import CartComponent from "./components/Cart/CartComponent.vue";
import ShopComponent from "./components/Shop/ShopComponent.vue";
import type {
  ProductInterface,
  ProductCartInterface,
  FiltersInterface,
  FilterUpdate,
} from "@/interfaces";
import { fetchProducts } from "@/shared/service/product.service";
import { pageKey } from "../../shared/injectionKeys/pageKey";

const state = reactive<{
  products: ProductInterface[];
  cart: ProductCartInterface[];
  filters: FiltersInterface;
  page: number;
  isLoading: boolean;
  moreResults: boolean;
}>({
  products: [],
  cart: [],
  filters: { ...DEFAULT_FILTERS },
  page: 1,
  isLoading: true,
  moreResults: true,
});

provide(pageKey, toRef(state, "page"));

watch(state.filters, () => {
  state.page = 1;
  state.products = [];
});

watchEffect(async () => {
  state.isLoading = true;
  const products = await fetchProducts(state.filters, state.page);
  if (Array.isArray(products)) {
    state.products = [...state.products, ...products];
    if (products.length < 5) {
      state.moreResults = false;
    }
  } else {
    state.products = [...state.products, products];
  }
  state.isLoading = false;
});

function addProductToCart(productId: string): void {
  const product = state.products.find((product) => product._id === productId); //
  if (product) {
    const productInCart = state.cart.find(
      (product) => product._id === productId
    );
    if (productInCart) {
      productInCart.quantity++;
    } else {
      state.cart.push({ ...product, quantity: 1 });
    }
  }
}

function removeProductFromCart(productId: string): void {
  const productFromCart = state.cart.find(
    (product) => product._id === productId
  );

  if (productFromCart) {
    if (productFromCart.quantity === 1) {
      state.cart = state.cart.filter((product) => product._id !== productId);
    } else {
      productFromCart.quantity--;
    }
  }
}

function updateFilter(filterUpdate: FilterUpdate) {
  if (filterUpdate.search !== undefined) {
    state.filters.search = filterUpdate.search;
  } else if (filterUpdate.priceRange) {
    state.filters.priceRange = filterUpdate.priceRange;
  } else if (filterUpdate.category) {
    state.filters.category = filterUpdate.category;
  } else {
    state.filters = { ...DEFAULT_FILTERS };
  }
}

const filteredProducts = computed(() => {
  return state.products.filter((product) => {
    if (
      product.title
        .toLocaleLowerCase()
        .startsWith(state.filters.search.toLocaleLowerCase()) &&
      product.price >= state.filters.priceRange[0] &&
      product.price <= state.filters.priceRange[1] &&
      (product.category === state.filters.category ||
        state.filters.category === "all")
    ) {
      return true;
    } else {
      return false;
    }
  });
});
</script>

<template>
  <div class="d-flex flex-column">
    <ShopComponent
      @update-filter="updateFilter"
      :products="filteredProducts"
      :filters="state.filters"
      @inc-page="state.page++"
      @add-product-to-cart="addProductToCart"
      :more-results="state.moreResults"
      class="shop"
    />
    <CartComponent
      class="cart"
      @remove-product-from-cart="removeProductFromCart"
      :cart="state.cart"
    />
  </div>
</template>

<style scoped lang="scss"></style>

<script setup lang="ts">
import type { ProductCartInterface } from "@/interfaces";
import TheCartComponent from "./TheCartComponent.vue";

defineProps<{
  cart: ProductCartInterface[];
}>();

const emit = defineEmits<{
  (e: "removeProductFromCart", productId: string): void;
}>();
</script>

<template>
  <div class="d-flex flex-column">
    <TheCartComponent
      @remove-product-from-cart="emit('removeProductFromCart', $event)"
      v-for="product of cart"
      :product="product"
      :key="product._id"
    />
  </div>
</template>

<style lang="scss" scoped></style>

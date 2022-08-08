<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import { onMounted, ref } from "vue";

const firstInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  firstInput.value?.focus();
});

const required = { required_error: "Veuillez renseigner ce champ" };

const validationSchema = toFormValidator(
  z.object({
    title: z
      .string(required)
      .min(1, { message: "Le titre doit faire au moins 1 caractère" })
      .max(20, { message: "Le titre ne doit faire moins 20 caractères " }),
    image: z.string(required),
    price: z
      .number(required)
      .min(0, { message: "le prix doit être superieur à 0 " })
      .max(500, "le prix doit être inferieur à 500 euro"),
    description: z
      .string(required)
      .min(10, { message: "La description doit faire au moins 10 caratère" })
      .max(50, { message: "La description ne dois pas dépasser 50 caractère" }),
    category: z.string(required),
  })
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema,
});

const title = useField("title");
const image = useField("image");
const price = useField("price");
const description = useField<string>("description");
const category = useField("category");

const trySubmit = handleSubmit(async (formValues, { resetForm }) => {
  try {
    await fetch("https://restapi.fr/api/vue3testboutique", {
      method: "POST",
      body: JSON.stringify(formValues),
      headers: {
        "Content-Type": "application/json",
      },
    });
    resetForm();

    firstInput.value?.focus();
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <div class="card">
    <h3 class="mb-10">Ajouter un titre</h3>
    <form @submit="trySubmit">
      <div class="d-flex flex-column mb-20">
        <label class="mb-5">*Titre</label>
        <input ref="firstInput" v-model="title.value.value" type="text" />
        <small class="form-error" v-if="title.errorMessage.value">{{
          title.errorMessage.value
        }}</small>
      </div>
      <div class="d-flex flex-column mb-20">
        <label class="mb-5">*Image</label>
        <input v-model="image.value.value" type="text" />
        <small class="form-error" v-if="image.errorMessage.value">{{
          image.errorMessage.value
        }}</small>
      </div>
      <div class="d-flex flex-column mb-20">
        <label class="mb-5">*Price</label>
        <input v-model="price.value.value" type="number" />
        <small class="form-error" v-if="price.errorMessage.value">{{
          price.errorMessage.value
        }}</small>
      </div>
      <div class="d-flex flex-column mb-20">
        <label class="mb-5">*Description</label>
        <textarea v-model="description.value.value"></textarea>
        <small class="form-error" v-if="description.errorMessage.value">{{
          description.errorMessage.value
        }}</small>
      </div>

      <div class="d-flex flex-column mb-20">
        <label class="mb-5">*Catégorie</label>
        <select v-model="category.value.value">
          <option value disabled>Choisissez une catégorie</option>
          <option value="a">a</option>
          <option value="robe">robe</option>
          <option value="manteaux">manteaux</option>
        </select>
        <small class="form-error" v-if="category.errorMessage.value">{{
          category.errorMessage.value
        }}</small>
      </div>
      <button class="btn btn-primary" :disabled="isSubmitting">
        Sauvegarder
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.card {
  width: 100%;
  max-width: 500px;
}
</style>

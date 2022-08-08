<script setup lang="ts">
import { reactive, type Component as C } from "vue";
import TheHeader from "./components/HeaderComponent.vue";
import TheFooter from "./components/FooterComponent.vue";
import Boutique from "./features/boutique/BoutiqueComponent.vue";
import Admin from "./features/admin/AdminComponent.vue";
import type { Page } from "./interfaces";
// import { seed40Articles, seed } from "./data/seeds";

const state = reactive<{
  page: Page;
}>({
  page: "Boutique",
});

const pages: { [s: string]: C } = {
  Boutique,
  Admin,
};

function navigate(page: Page) {
  state.page = page;
}

// seed("vue3testboutique");

// seed40Articles("vue3testboutique");
</script>

<template>
  <div class="app-container">
    <TheHeader @navigate="navigate" :page="state.page" class="header b1" />
    <div class="app-content">
      <Suspense>
        <Component :is="pages[state.page]" />
      </Suspense>
    </div>
    <TheFooter class="footer" />
  </div>
</template>

<style lang="scss">
@import "./assets/scss/base.scss";
@import "./assets/scss/debug.scss";

.app-container {
  display: grid;
  grid-template-areas: "header " "app-content " " footer";
  grid-template-rows: 48px auto 48px;
  height: 100vh;
}

.header {
  grid-area: header;
}

.app-content {
  grid-area: app-content;
}

.footer {
  grid-area: footer;
}
</style>

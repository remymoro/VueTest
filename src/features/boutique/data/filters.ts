import type { FiltersInterface } from "@/interfaces";

export const DEFAULT_FILTERS: FiltersInterface = {
  search: "",
  priceRange: [0, 1000],
  category: "all",
};

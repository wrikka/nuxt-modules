export function useProductSearchUtils(categories) {
  const getFilterLabel = (key, value) => {
    switch (key) {
      case "search":
        return `\u0E04\u0E49\u0E19\u0E2B\u0E32: ${value}`;
      case "categoryId":
        const category = categories.find((c) => c.id === Number(value));
        return `\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48: ${category?.name || value}`;
      case "minPrice":
        return `\u0E23\u0E32\u0E04\u0E32\u0E15\u0E48\u0E33\u0E2A\u0E38\u0E14: ${value}`;
      case "maxPrice":
        return `\u0E23\u0E32\u0E04\u0E32\u0E2A\u0E39\u0E07\u0E2A\u0E38\u0E14: ${value}`;
      case "status":
        return `\u0E2A\u0E16\u0E32\u0E19\u0E30: ${value}`;
      case "stockStatus":
        const stockLabels = {
          in_stock: "\u0E21\u0E35\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32",
          low_stock: "\u0E2A\u0E15\u0E47\u0E2D\u0E01\u0E15\u0E48\u0E33",
          out_of_stock: "\u0E2B\u0E21\u0E14\u0E2A\u0E15\u0E47\u0E2D\u0E01"
        };
        return `\u0E2A\u0E15\u0E47\u0E2D\u0E01: ${stockLabels[value] || value}`;
      default:
        return `${key}: ${value}`;
    }
  };
  return {
    getFilterLabel
  };
}

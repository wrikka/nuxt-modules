export const usePromotionUtils = () => {
  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E39\u0E48";
      case "inactive":
        return "\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38";
      case "scheduled":
        return "\u0E08\u0E31\u0E14\u0E01\u0E33\u0E2B\u0E19\u0E14";
      default:
        return status;
    }
  };
  const getTypeText = (type) => {
    switch (type) {
      case "percentage":
        return "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14 %";
      case "fixed":
        return "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14\u0E04\u0E07\u0E17\u0E35\u0E48";
      case "buy_x_get_y":
        return "\u0E0B\u0E37\u0E49\u0E2D X \u0E41\u0E16\u0E21 Y";
      case "free_shipping":
        return "\u0E2A\u0E48\u0E07\u0E1F\u0E23\u0E35";
      case "bundle":
        return "\u0E41\u0E1E\u0E47\u0E04\u0E40\u0E01\u0E08";
      default:
        return type;
    }
  };
  const formatDiscount = (promotion) => {
    switch (promotion.type) {
      case "percentage":
        return `${promotion.discountValue}%`;
      case "fixed":
        return `\u0E3F${promotion.discountValue}`;
      case "buy_x_get_y":
        return "\u0E0B\u0E37\u0E49\u0E2D X \u0E41\u0E16\u0E21 Y";
      case "free_shipping":
        return "\u0E2A\u0E48\u0E07\u0E1F\u0E23\u0E35";
      case "bundle":
        return "\u0E41\u0E1E\u0E47\u0E04\u0E40\u0E01\u0E08";
      default:
        return "-";
    }
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("th-TH");
  };
  const getDiscountLabel = (type) => {
    switch (type) {
      case "percentage":
        return "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14 (%)";
      case "fixed":
        return "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14 (\u0E1A\u0E32\u0E17)";
      case "buy_x_get_y":
        return "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E0B\u0E37\u0E49\u0E2D";
      case "free_shipping":
        return "\u0E04\u0E48\u0E32\u0E2A\u0E48\u0E07\u0E1F\u0E23\u0E35";
      case "bundle":
        return "\u0E23\u0E32\u0E04\u0E32\u0E41\u0E1E\u0E47\u0E04\u0E40\u0E01\u0E08";
      default:
        return "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14";
    }
  };
  const getDiscountPlaceholder = (type) => {
    switch (type) {
      case "percentage":
        return "10";
      case "fixed":
        return "100";
      case "buy_x_get_y":
        return "2";
      case "free_shipping":
        return "0";
      case "bundle":
        return "500";
      default:
        return "0";
    }
  };
  return {
    getStatusClass,
    getStatusText,
    getTypeText,
    formatDiscount,
    formatDate,
    getDiscountLabel,
    getDiscountPlaceholder
  };
};

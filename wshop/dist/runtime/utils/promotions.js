export const getPromotionTypeLabel = (type) => {
  switch (type) {
    case "percentage":
      return "\u0E2A\u0E48\u0E27\u0E19\u0E25\u0E14\u0E40\u0E1B\u0E2D\u0E23\u0E4C\u0E40\u0E0B\u0E47\u0E19\u0E15\u0E4C";
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
export const getPromotionTypeColor = (type) => {
  switch (type) {
    case "percentage":
      return "bg-blue-100 text-blue-800";
    case "fixed":
      return "bg-green-100 text-green-800";
    case "buy_x_get_y":
      return "bg-purple-100 text-purple-800";
    case "free_shipping":
      return "bg-yellow-100 text-yellow-800";
    case "bundle":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
export const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
export const getStatusLabel = (status) => {
  switch (status) {
    case "active":
      return "\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E2D\u0E22\u0E39\u0E48";
    case "scheduled":
      return "\u0E23\u0E2D\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23";
    case "inactive":
      return "\u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38";
    default:
      return status;
  }
};

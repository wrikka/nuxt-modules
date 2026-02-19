export const useStockAlertUtils = () => {
  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case "low_stock":
        return "lucide:trending-down";
      case "out_of_stock":
        return "lucide:x";
      case "overstock":
        return "lucide:trending-up";
      default:
        return "lucide:alert-triangle";
    }
  };
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  const getSeverityLabel = (severity) => {
    switch (severity) {
      case "critical":
        return "\u0E27\u0E34\u0E01\u0E24\u0E15";
      case "high":
        return "\u0E2A\u0E39\u0E07";
      case "medium":
        return "\u0E1B\u0E32\u0E19\u0E01\u0E25\u0E32\u0E07";
      case "low":
        return "\u0E15\u0E48\u0E33";
      default:
        return "\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B";
    }
  };
  const formatTime = (date) => {
    const now = /* @__PURE__ */ new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 6e4);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} \u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
    if (hours > 0) return `${hours} \u0E0A\u0E31\u0E48\u0E27\u0E42\u0E21\u0E07\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
    if (minutes > 0) return `${minutes} \u0E19\u0E32\u0E17\u0E35\u0E17\u0E35\u0E48\u0E41\u0E25\u0E49\u0E27`;
    return "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E2A\u0E31\u0E01\u0E04\u0E23\u0E39\u0E48";
  };
  const getAlertStats = (alerts) => {
    const unreadAlerts = alerts.filter((alert) => !alert.isRead);
    return {
      total: alerts.length,
      unread: unreadAlerts.length,
      critical: alerts.filter((a) => a.severity === "critical").length,
      high: alerts.filter((a) => a.severity === "high").length,
      medium: alerts.filter((a) => a.severity === "medium").length,
      low: alerts.filter((a) => a.severity === "low").length
    };
  };
  const getUnreadAlerts = (alerts) => alerts.filter((alert) => !alert.isRead);
  return {
    getAlertIcon,
    getSeverityColor,
    getSeverityLabel,
    formatTime,
    getAlertStats,
    getUnreadAlerts
  };
};

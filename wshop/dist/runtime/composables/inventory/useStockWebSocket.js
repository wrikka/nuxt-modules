import { ref } from "vue";
export function useStockWebSocket(stockAlerts, stockMovements, stockTransfers, stockAdjustments) {
  const socket = ref(null);
  const initializeWebSocket = () => {
    if (process.client) {
      socket.value = new WebSocket("ws://localhost:3001/stock");
      socket.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleRealtimeUpdate(data);
      };
      socket.value.onopen = () => {
        console.log("Stock WebSocket connected");
      };
      socket.value.onerror = (error) => {
        console.error("Stock WebSocket error:", error);
      };
      socket.value.onclose = () => {
        console.log("Stock WebSocket disconnected");
        setTimeout(initializeWebSocket, 3e3);
      };
    }
  };
  const handleRealtimeUpdate = (data) => {
    switch (data.type) {
      case "stock_alert":
        stockAlerts.value.unshift(data.payload);
        break;
      case "stock_movement":
        stockMovements.value.unshift(data.payload);
        break;
      case "stock_transfer":
        const transferIndex = stockTransfers.value.findIndex(
          (t) => t.id === data.payload.id
        );
        if (transferIndex !== -1) {
          stockTransfers.value[transferIndex] = data.payload;
        } else {
          stockTransfers.value.unshift(data.payload);
        }
        break;
      case "stock_adjustment":
        stockAdjustments.value.unshift(data.payload);
        break;
    }
  };
  return {
    initializeWebSocket,
    socket
  };
}

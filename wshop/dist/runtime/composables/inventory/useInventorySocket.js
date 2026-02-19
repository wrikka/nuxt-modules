import { io } from "socket.io-client";
import { ref } from "vue";
export function useInventorySocket(inventory, stockMovements, stockAlerts) {
  const socket = ref(null);
  const connect = () => {
    if (socket.value) socket.value.disconnect();
    socket.value = io("/inventory", { transports: ["websocket"] });
    socket.value.on("connect", () => console.log("Connected to inventory WebSocket"));
    socket.value.on("inventory_update", (data) => {
      const index = inventory.value.findIndex((item) => item.id === data.id);
      if (index !== -1) {
        inventory.value[index] = data;
      } else {
        inventory.value.push(data);
      }
    });
    socket.value.on("stock_movement", (data) => {
      stockMovements.value.unshift(data);
    });
    socket.value.on("stock_alert", (data) => {
      stockAlerts.value.unshift(data);
    });
    socket.value.on("disconnect", () => console.log("Disconnected from inventory WebSocket"));
  };
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };
  return {
    connect,
    disconnect
  };
}

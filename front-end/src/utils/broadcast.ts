export const userChannel = new BroadcastChannel("user-sync");
export const productChannel = new BroadcastChannel("product-sync");
export const orderChannel = new BroadcastChannel("order-sync");

export const broadcastUserChange = () => {
  userChannel.postMessage("refresh-user-table");
};

export const broadcastProductChange = () => {
  productChannel.postMessage("refresh-product-table");
};

export const broadcastOrderChange = () => {
  orderChannel.postMessage("refresh-order-table");
};
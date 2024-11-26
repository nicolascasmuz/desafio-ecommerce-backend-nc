import { Order } from "lib/models/order";

async function createNewOrder(body, productID, userID) {
  const { orderData, orderID } = await Order.createNewOrder({
    aditional_info: body,
    productID,
    userID,
  });

  return { orderData, orderID };
}

export { createNewOrder };

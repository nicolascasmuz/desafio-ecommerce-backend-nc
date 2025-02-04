import { Order } from "lib/models/order";
import { createSingleProductPreference } from "lib/mercadopago";

async function createNewOrder(options, productID, userID) {
  const preference = await createSingleProductPreference(options);

  const newOrderData = {
    preference,
    productID,
    userID,
    status: "pending",
  };

  const { orderData, orderID } = await Order.createNewOrder(newOrderData);

  return { preference, orderData, orderID };
}

async function updateOrder(external_reference, status) {
  const updatedOrder = await Order.updateOrder(external_reference, status);

  return updatedOrder;
}

export { createNewOrder, updateOrder };

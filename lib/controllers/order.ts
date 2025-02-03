import { Order } from "lib/models/order";
import { createSingleProductPreference } from "lib/mercadopago";

async function createNewOrder(options, productID, userID) {
  const preference = await createSingleProductPreference(options);

  const { orderData, orderID } = await Order.createNewOrder({
    preference,
    productID,
    userID,
  });

  return { preference, orderData, orderID };
}

export { createNewOrder };

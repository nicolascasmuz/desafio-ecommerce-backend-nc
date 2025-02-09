import { Order } from "lib/models/order";
import { createSingleProductPreference } from "lib/mercadopago";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

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

async function getOrders(req) {
  const token = parseBearerToken(req);
  const decodedToken: any = decode(token);

  const orders = await Order.getOrders(decodedToken.userID);

  return orders;
}

async function getOrderByID(external_reference) {
  const order = await Order.getOrderByID(external_reference);

  return order;
}

export { createNewOrder, updateOrder, getOrders, getOrderByID };

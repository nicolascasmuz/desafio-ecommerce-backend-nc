import { Order } from "lib/models/order";

async function createNewOrder(productInfo, productID, userID) {
  const aditional_info = {
    items: [
      {
        id: productInfo.objectID,
        title: productInfo.name,
        description: "",
        quantity: 1,
        currency_id: "ARS",
        unit_price: productInfo.price,
      },
    ],
    payer: {
      userID,
    },
    back_urls: {
      success: "https://test.com/success",
      pending: "https://test.com/pending",
      failure: "https://test.com/failure",
    },
    external_reference: productID,
    notification_url:
      "https://webhook.site/645e0b34-3f0d-4f3b-814e-72d2134ebe6f",
  };

  const { orderData, orderID } = await Order.createNewOrder({
    aditional_info,
    productID,
    userID,
  });

  return { aditional_info, orderData, orderID };
}

export { createNewOrder };

import { Order } from "lib/models/order";

async function createNewOrder(productInfo, productID, userID) {
  const aditional_info = {
    items: [
      {
        id: productInfo.objectID,
        title: productInfo.name,
        description: "",
        picture_url: productInfo.pic,
        category_id: "",
        quantity: 1,
        currency_id: "ARS",
        unit_price: productInfo.price,
        stock: productInfo.stock,
        brand: productInfo.marca,
      },
    ],
    back_urls: {
      success: "https://test.com/success",
      pending: "https://test.com/pending",
      failure: "https://test.com/failure",
    },
    external_reference: "1643827245",
    notification_url:
      "https://webhook.site/dc6c5ca9-253c-4cde-a967-fc1991154b62",
  };

  const { orderData, orderID } = await Order.createNewOrder({
    aditional_info,
    productID,
    userID,
  });

  return { aditional_info, orderData, orderID };
}

export { createNewOrder };

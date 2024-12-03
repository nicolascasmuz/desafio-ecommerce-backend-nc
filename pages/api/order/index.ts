import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares";
import { productsIndex } from "lib/algolia";
import { createPreference } from "lib/mercadopago";
import { createNewOrder } from "lib/controllers/order";
import { handler } from "lib/controllers/user";

let querySchema = yup.object({
  productID: yup.string().required(),
});

let bodySchema = yup.object({
  items: yup.array(),
});

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
    } catch (e) {
      res.status(422).send({ field: "query", message: e });
    }

    try {
      await bodySchema.validate(req.body);
    } catch (e) {
      res.status(422).send({ field: "body", message: e });
    }

    const { productID } = req.query;
    const { userID } = await authMiddleware(req, res, handler);

    try {
      const foundProduct = await productsIndex.getObject(productID.toString());
      const { aditional_info, orderData, orderID } = await createNewOrder(
        foundProduct,
        productID,
        userID
      );
      const preference = await createPreference(aditional_info);

      res
        .status(200)
        .json({ init_point: preference.init_point, orderData, orderID });
    } catch (error) {
      res.status(400).json({ message: "product not found" });
    }
  },
});

import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares";
import { productsIndex } from "lib/algolia";
import { createPreference } from "lib/mercadopago";
import { createNewOrder } from "lib/controllers/order";
import { handler } from "lib/controllers/user";
import Cors from "cors";

let querySchema = yup.object({
  productID: yup.string().required(),
});

let bodySchema = yup.object({
  items: yup.array(),
});

const cors = Cors({
  methods: ["GET", "POST", "PATCH", "OPTIONS", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function corsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  await methods({
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
        const foundProduct = await productsIndex.getObject(
          productID.toString()
        );
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
        res.status(400).json({ error, message: "product not found" });
      }
    },
  })(req, res);
}

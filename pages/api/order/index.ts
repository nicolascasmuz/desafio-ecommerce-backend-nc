import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { User } from "lib/models/user";
import methods from "micro-method-router";
import { createNewOrder } from "lib/controllers/orders";
import { createPreference } from "lib/mercadopago";
import * as yup from "yup";

let querySchema = yup.object({
  productID: yup.number().required(),
});

let bodySchema = yup.object({
  items: yup.array().required(),
});

async function handler(token) {
  const user = new User(token.userID);
  await user.pull();

  return { userData: user.data, userID: token.userID };
}

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

    const newOrder = await createNewOrder(req.body, productID, userID);
    const preference = await createPreference(req.body);

    res.status(200).json({ init_point: preference.init_point, newOrder });
  },
});

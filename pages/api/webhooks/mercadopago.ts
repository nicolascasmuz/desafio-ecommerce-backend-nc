import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import {
  getMerchantOrder,
  getPayment,
  createPreference,
} from "lib/mercadopago";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { id, topic } = req.query;

    if (topic == "merchant_order") {
      const auth = getMerchantOrder(id);
      res.send({ auth });
    }
    if (topic == "payment") {
      const auth = getPayment(id);
      res.send({ auth });
    }
  },
  async post(req: NextApiRequest, res: NextApiResponse) {
    const auth = await createPreference(req.body);
    res.send({ auth });
  },
});

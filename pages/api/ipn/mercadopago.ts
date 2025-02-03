import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getPaymentById } from "lib/mercadopago";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const data = await getPaymentById(req.query.id);
    res.send({ data });
  },
});

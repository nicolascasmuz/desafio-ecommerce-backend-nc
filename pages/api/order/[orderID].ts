import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getOrderByID } from "lib/controllers/order";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { orderID } = req.query;

    const order = await getOrderByID(orderID);
    res.status(200).json(order);
  },
});

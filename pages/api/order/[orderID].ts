import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { deleteOrder, getOrderByID } from "lib/controllers/order";
import Cors from "cors";

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
    async get(req: NextApiRequest, res: NextApiResponse) {
      const { orderID } = req.query;

      const order = await getOrderByID(orderID);
      res.status(200).json(order);
    },
    async delete(req: NextApiRequest, res: NextApiResponse) {
      const { orderID } = req.query;

      const deletedOrder = await deleteOrder(orderID);
      res.status(200).json(deletedOrder);
    },
  })(req, res);
}

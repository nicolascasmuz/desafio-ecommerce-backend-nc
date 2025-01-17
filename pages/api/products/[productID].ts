import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { productsIndex } from "lib/algolia-nicos";
import Cors from "cors";

let querySchema = yup.object({
  productID: yup.string().required(),
});

const emailSchema = yup.object({
  email: yup.string().required(),
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
    async get(req: NextApiRequest, res: NextApiResponse) {
      try {
        await querySchema.validate(req.query);
      } catch (e) {
        res.status(422).send({ field: "query", message: e });
      }

      const { productID } = req.query;

      try {
        const foundProduct = await productsIndex.getObject(
          productID.toString()
        );
        res.status(200).json(foundProduct);
      } catch (error) {
        res.status(400).json({ message: "product not found" });
      }
    },
  })(req, res);
}

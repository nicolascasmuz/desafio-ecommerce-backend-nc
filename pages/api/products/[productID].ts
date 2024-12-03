import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { productsIndex } from "lib/algolia";

let querySchema = yup.object({
  productID: yup.string().required(),
});

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    try {
      await querySchema.validate(req.query);
    } catch (e) {
      res.status(422).send({ field: "query", message: e });
    }

    const { productID } = req.query;

    try {
      const foundProduct = await productsIndex.getObject(productID.toString());
      res.status(200).json(foundProduct);
    } catch (error) {
      res.status(400).json({ message: "product not found" });
    }
  },
});

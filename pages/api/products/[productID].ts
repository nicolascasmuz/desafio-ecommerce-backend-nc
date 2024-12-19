import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { productsIndex } from "lib/algolia";

let querySchema = yup.object({
  productID: yup.string().required(),
});

// Configuración del middleware CORS
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir solicitudes de cualquier origen
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"); // Métodos permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Encabezados permitidos
}

export default async function handlerWithCors(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(res);

  // Manejo de preflight requests (solicitudes OPTIONS)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

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

/* import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares";
import { handler, updateData } from "lib/controllers/user";

const emailSchema = yup.object({
  email: yup.string().required(),
});

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

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
      const { userData } = await authMiddleware(req, res, handler);
      res.status(200).json(userData);
    },
    async patch(req: NextApiRequest, res: NextApiResponse) {
      try {
        await emailSchema.validate(req.body);
      } catch (e) {
        res.status(422).send({ field: "email", message: e });
        return;
      }

      const newData = await updateData(req.body);
      res.status(200).json(newData.userData);
    },
  })(req, res);
} */

///

import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares";
import { handler, updateData } from "lib/controllers/user";
import Cors from "cors";

const emailSchema = yup.object({
  email: yup.string().required(),
});

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ["GET", "POST", "PATCH", "OPTIONS", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
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
  // Run the middleware
  await runMiddleware(req, res, cors);

  // Rest of the API logic
  await methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
      const { userData } = await authMiddleware(req, res, handler);
      res.status(200).json(userData);
    },
    async patch(req: NextApiRequest, res: NextApiResponse) {
      try {
        await emailSchema.validate(req.body);
      } catch (e) {
        res.status(422).send({ field: "email", message: e });
        return;
      }

      const newData = await updateData(req.body);
      res.status(200).json(newData.userData);
    },
  })(req, res);
}

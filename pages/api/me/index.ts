import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares";
import { handler, updateData } from "lib/controllers/user";
import Cors from "cors";

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

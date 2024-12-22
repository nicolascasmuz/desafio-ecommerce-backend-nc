import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { findByEmailAndCode } from "lib/controllers/auth";
import Cors from "cors";

let emailSchema = yup.object({
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
    async post(req: NextApiRequest, res: NextApiResponse) {
      try {
        await emailSchema.validate(req.body);
      } catch (e) {
        res.status(422).send({ field: "email", message: e });
      }

      const { email, code } = req.body;

      const token = await findByEmailAndCode(email, code);

      try {
        if (token) {
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: "incorrect data" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
    },
  })(req, res);
}

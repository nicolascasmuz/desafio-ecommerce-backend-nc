import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { findOrCreateAuth } from "lib/controllers/auth";

let emailSchema = yup.object({
  email: yup.string().required(),
});

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      await emailSchema.validate(req.body);
    } catch (e) {
      res.status(422).send({ field: "email", message: e });
    }

    const user = await findOrCreateAuth(req.body);

    try {
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  },
});

import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares";
import { handler, updateData } from "lib/controllers/user";

let emailSchema = yup.object({
  email: yup.string().required(),
});

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { userData } = await authMiddleware(req, res, handler);
    res.status(200).json(userData);
  },
  async patch(req: NextApiRequest, res: NextApiResponse) {
    try {
      await emailSchema.validate(req.body);
    } catch (e) {
      res.status(422).send({ field: "email", message: e });
    }

    const newData = await updateData(req.body);

    res.status(200).json(newData.userData);
  },
});

import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { updateAddress } from "lib/controllers/user";

let emailSchema = yup.object({
  email: yup.string().required(),
});

export default methods({
  async patch(req: NextApiRequest, res: NextApiResponse) {
    try {
      await emailSchema.validate(req.body);
    } catch (e) {
      res.status(422).send({ field: "email", message: e });
    }

    const newData = await updateAddress(req.body);

    res.status(200).json(newData.address);
  },
});

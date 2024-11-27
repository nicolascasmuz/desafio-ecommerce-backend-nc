import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { updateAddress } from "lib/controllers/user";

export default methods({
  async patch(req: NextApiRequest, res: NextApiResponse) {
    const newData = await updateAddress(req.body);

    res.status(200).json(newData.address);
  },
});

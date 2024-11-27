import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { handler, updateData } from "lib/controllers/user";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    authMiddleware(req, res, handler);
  },
  async patch(req: NextApiRequest, res: NextApiResponse) {
    const newData = await updateData(req.body);

    res.status(200).json(newData.userData);
  },
});

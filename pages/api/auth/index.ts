import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findOrCreateAuth } from "lib/controllers/auth";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const user = await findOrCreateAuth(req.body);

    try {
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  },
});

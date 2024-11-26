import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { User } from "lib/models/user";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    async function handler(token) {
      const user = new User(token.userID);
      await user.pull();

      res.status(200).json(user.data);
    }

    authMiddleware(req, res, handler);
  },
});

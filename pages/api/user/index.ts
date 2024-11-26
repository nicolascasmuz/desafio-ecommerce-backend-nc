import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { User } from "lib/models/user";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { userID } = req.body;

    const user = new User(userID);
    await user.pull();

    if (user.data) {
      res.status(200).json(user.data);
    } else {
      res.status(400).json({ message: "incorrect data" });
    }
  },
});

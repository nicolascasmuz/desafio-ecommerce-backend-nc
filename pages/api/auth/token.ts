import type { NextApiRequest, NextApiResponse } from "next";
import { Auth } from "lib/models/auth";
import { generate } from "lib/jwt";
import { isBefore } from "date-fns";
import methods from "micro-method-router";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { userID } = req.body;

    var token = generate({ userID });
    res.status(200).json({ token });
  },
  async post(req: NextApiRequest, res: NextApiResponse) {
    const { email, code } = req.body;

    const token = await Auth.findByEmailAndCode(email, code);

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
});

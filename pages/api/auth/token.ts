import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { findByEmailAndCode } from "lib/controllers/auth";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
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
});

import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { Auth } from "lib/models/auth";
import { findOrCreateAuth, sendCode } from "lib/controllers/auth";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { authID } = req.body;

    const auth = new Auth(authID);
    await auth.pull();

    try {
      if (auth.data) {
        res.status(200).json(auth.data);
      } else {
        res.status(401).json({ message: "incorrect data" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async post(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.body;

    const user = await findOrCreateAuth(email);

    try {
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  async put(req: NextApiRequest, res: NextApiResponse) {
    const { email } = req.body;

    const auth = await sendCode(email);

    try {
      if (auth) {
        res.status(200).json(auth);
      } else {
        res.status(401).json({ message: "incorrect data" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  },
});

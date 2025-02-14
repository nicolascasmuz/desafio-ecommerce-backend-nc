import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { resend } from "lib/resend";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST", "PATCH", "OPTIONS", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function corsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  await methods({
    async post(req: NextApiRequest, res: NextApiResponse) {
      const { name, email, message } = req.body;

      const msg = {
        from: "onboarding@resend.dev",
        to: "nicolascasmuz@gmail.com",
        subject: `Tienes una consulta de ${name}`,
        html: `<h4>${message}</h4><p>Email: ${email}</p>`,
      };

      resend.emails.send(msg);

      try {
        res.status(200).json({ msg });
      } catch {
        res.status(401).json({ error: true });
      }
    },
  })(req, res);
}

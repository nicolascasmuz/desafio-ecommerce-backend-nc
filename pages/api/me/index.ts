import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import * as yup from "yup";
import { authMiddleware } from "lib/middlewares";
import { handler, updateData } from "lib/controllers/user";

// Configuración de schema de validación
const emailSchema = yup.object({
  email: yup.string().required(),
});

// Configuración del middleware CORS
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir solicitudes de cualquier origen
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, OPTIONS"); // Métodos permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Encabezados permitidos
}

export default async function handlerWithCors(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCorsHeaders(res);

  // Manejo de preflight requests (solicitudes OPTIONS)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  await methods({
    async get(req: NextApiRequest, res: NextApiResponse) {
      const { userData } = await authMiddleware(req, res, handler);
      res.status(200).json(userData);
    },
    async patch(req: NextApiRequest, res: NextApiResponse) {
      try {
        await emailSchema.validate(req.body);
      } catch (e) {
        res.status(422).send({ field: "email", message: e });
        return;
      }

      const newData = await updateData(req.body);
      res.status(200).json(newData.userData);
    },
  })(req, res);
}

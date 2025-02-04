import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getPaymentById } from "lib/mercadopago";
import { updateOrder } from "lib/controllers/order";

export default methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    const payload = req.body;

    if (payload.type === "payment") {
      const mpPayment = await getPaymentById(payload.data.id);

      if (mpPayment.status === "approved") {
        const newStatus = await updateOrder(
          mpPayment.external_reference,
          mpPayment.status
        );
        res.status(200).json(newStatus);
      }
    }
  },
});

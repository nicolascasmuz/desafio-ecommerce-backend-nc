import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { v4 as uuidv4 } from "uuid";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN,
});

const pref = new Preference(client);

type CreatePrefOptions = {
  name: string;
  description: string;
  objectID: string;
  price: number;
  userID: string;
};

export async function createSingleProductPreference(
  options: CreatePrefOptions
) {
  return pref.create({
    body: {
      items: [
        {
          id: options.objectID,
          title: options.name,
          description: options.description,
          quantity: 1,
          currency_id: "ARS",
          unit_price: options.price,
        },
      ],
      payer: {
        email: options.userID,
      },
      back_urls: {
        success: "https://test.com/success",
        failure: "https://test.com/failure",
        pending: "https://test.com/pending",
      },
      external_reference: uuidv4().slice(30),
      notification_url:
        "https://webhook.site/fce9186e-a231-425a-baf8-85e160ba3379",
    },
  });
}

export async function getPaymentById(id: string) {
  const payment = new Payment(client);
  return payment.get({ id });
}

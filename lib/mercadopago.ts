import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

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

// Recibimos data más generica en esta función
// para abstraer al resto del sistema
// de los detalles de mercado pago
// esto nos permitirá hacer cambios dentro de esta librería
// sin tener que modificar el resto del sistema

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
      // URL de redirección en los distintos casos
      back_urls: {
        success: "https://test.com/success",
        failure: "https://test.com/failure",
        pending: "https://test.com/pending",
      },
      // Esto puede ser el id o algún otro identificador
      // que te ayude a vincular este pago con el producto más adelante
      external_reference: options.objectID,
    },
  });
}

export async function getPaymentById(id: string) {
  const payment = new Payment(client);
  return payment.get({ id });
}

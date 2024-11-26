import { Auth } from "lib/models/auth";
import { User } from "lib/models/user";
import { addMinutes } from "date-fns";
import { resend } from "lib/resend";
import gen from "random-seed";

var seed = "auth-code";
var random = gen.create(seed);

async function findOrCreateAuth(email: string) {
  const cleanEmail = email.trim().toLocaleLowerCase();
  const splitEmail = email.split("@")[0];

  const auth = await Auth.findByEmail(cleanEmail);

  if (auth) {
    const code = random.intBetween(10000, 99999);
    const now = new Date();
    const twentyMinutesFromNow = addMinutes(now, 20);

    auth.data.code = code;
    auth.data.expired = twentyMinutesFromNow;
    await auth.push();

    const msg = {
      from: "onboarding@resend.dev",
      to: "nicolascasmuz@gmail.com",
      subject: `Bienvenido/a ${splitEmail}`,
      html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
    };

    resend.emails.send(msg);

    return auth.data;
  } else {
    const { userData, userID } = await User.createNewUser(cleanEmail);
    const newAuth = await Auth.createAuth(userData, userID);
    const auth = await Auth.findByEmail(newAuth.email);

    const code = random.intBetween(10000, 99999);
    const now = new Date();
    const twentyMinutesFromNow = addMinutes(now, 20);

    auth.data.code = code;
    auth.data.expired = twentyMinutesFromNow;
    await auth.push();

    const msg = {
      from: "onboarding@resend.dev",
      to: "nicolascasmuz@gmail.com",
      subject: `Bienvenido/a ${splitEmail}`,
      html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
    };

    resend.emails.send(msg);

    return auth.data;
  }
}

async function sendCode(email: string) {
  const auth = await Auth.findByEmail(email);
  const splitEmail = email.split("@")[0];

  if (auth) {
    const code = random.intBetween(10000, 99999);
    const now = new Date();
    const twentyMinutesFromNow = addMinutes(now, 20);

    auth.data.code = code;
    auth.data.expired = twentyMinutesFromNow;
    await auth.push();

    const msg = {
      from: "onboarding@resend.dev",
      to: "nicolascasmuz@gmail.com",
      subject: `Bienvenido/a ${splitEmail}`,
      html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
    };

    resend.emails.send(msg);

    return auth.data;
  } else {
    null;
  }
}

export { findOrCreateAuth, sendCode };

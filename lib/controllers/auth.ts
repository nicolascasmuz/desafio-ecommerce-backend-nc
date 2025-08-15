import { Auth } from "lib/models/auth";
import { User } from "lib/models/user";
import { addMinutes } from "date-fns";
import { resend } from "lib/resend";
import gen from "random-seed";

var seed = "auth-code";
var random = gen.create(seed);

async function findOrCreateAuth(body) {
  const { email } = body;

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

    /* const msg = {
      from: "Nico's Instruments <onboarding@resend.dev>",
      to: email,
      subject: `Bienvenido/a ${splitEmail}`,
      html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
    };

    resend.emails.send(msg); */

    try {
      const data = await resend.emails.send({
        from: "Nico's Instruments <onboarding@resend.dev>",
        to: email,
        subject: `Bienvenido/a ${splitEmail}`,
        html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    return auth.data;
  } else {
    body.userData.nickname = splitEmail;
    const { userEmail, userID } = await User.createNewUser(body);
    const newAuth = await Auth.createAuth(userEmail, userID);
    const auth = await Auth.findByEmail(newAuth.email);

    const code = random.intBetween(10000, 99999);
    const now = new Date();
    const twentyMinutesFromNow = addMinutes(now, 20);

    auth.data.code = code;
    auth.data.expired = twentyMinutesFromNow;
    await auth.push();

    /* const msg = {
      from: "Nico's Instruments <onboarding@resend.dev>",
      to: email,
      subject: `Bienvenido/a ${splitEmail}`,
      html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
    };

    resend.emails.send(msg); */

    try {
      const data = await resend.emails.send({
        from: "Nico's Instruments <onboarding@resend.dev>",
        to: email,
        subject: `Bienvenido/a ${splitEmail}`,
        html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    return auth.data;
  }
}

async function findByEmailAndCode(email: string, code: number) {
  const token = await Auth.findByEmailAndCode(email, code);

  return token;
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

    /* const msg = {
      from: "Nico's Instruments <onboarding@resend.dev>",
      to: email,
      subject: `Bienvenido/a ${splitEmail}`,
      html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
    };

    resend.emails.send(msg); */

    try {
      const data = await resend.emails.send({
        from: "Nico's Instruments <onboarding@resend.dev>",
        to: email,
        subject: `Bienvenido/a ${splitEmail}`,
        html: `<p>Este es tu código de acceso, tienes 20 minutos para usarlo</p><h3>${code}</h3>`,
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    return auth.data;
  } else {
    null;
  }
}

export { findOrCreateAuth, findByEmailAndCode, sendCode };

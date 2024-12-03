import { expect, test } from "vitest";
import { generate, decode } from "./jwt";

test("jwt encode/decode", () => {
  const token = { email: "nicocasmuz@fastmail.com" };
  const encodedToken = generate(token);
  const decodedToken: any = decode(encodedToken);
  delete decodedToken.iat;

  expect(decodedToken).toStrictEqual(token);
});

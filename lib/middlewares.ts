import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";

function authMiddleware(req: NextApiRequest, res: NextApiResponse, callback) {
  const token = parseBearerToken(req);
  if (!token) {
    res.status(401).json({ message: "no token" });
  }

  const decodedToken = decode(token);

  if (decodedToken) {
    const userData = callback(decodedToken);
    return userData;
  } else {
    return { message: "incorrect token" };
  }
}

export { authMiddleware };

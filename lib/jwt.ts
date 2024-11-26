import jwt from "jsonwebtoken";

function generate(obj) {
  return jwt.sign(obj, process.env.JWT_SECRET);
}

function decode(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error("incorrect token");
    return null;
  }
}

export { generate, decode };

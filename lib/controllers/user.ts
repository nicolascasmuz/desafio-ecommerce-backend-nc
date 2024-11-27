import { User } from "lib/models/user";

async function handler(decodedToken) {
  const user = new User(decodedToken.userID);
  await user.pull();

  return user.data;
}

async function updateData(body) {
  const newData = await User.updateUser(body);

  return newData;
}

async function updateAddress(body) {
  const newData = await User.updateAddress(body);

  return newData;
}

export { handler, updateData, updateAddress };

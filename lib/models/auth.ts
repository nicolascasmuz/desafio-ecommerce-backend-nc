import { firestore } from "lib/firestore";
import { isBefore } from "date-fns";
import { generate } from "lib/jwt";

const collection = firestore.collection("auths");

class Auth {
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id) {
    this.ref = collection.doc(id);
  }
  async pull() {
    const snap = await this.ref.get();
    this.data = snap.data();
  }
  async push() {
    this.ref.update(this.data);
  }
  static async findByEmail(email: string) {
    const result = await collection.where("email", "==", email).get();

    if (result.docs.length) {
      const firstDoc = result.docs[0];
      const newAuth = new Auth(firstDoc.id);
      newAuth.data = firstDoc.data();
      return newAuth;
    } else {
      null;
    }
  }
  static async createAuth(email, userID) {
    const newDoc = await collection.add({
      email,
      code: "",
      expired: "",
      userID,
    });
    const docData = await newDoc.get();
    const authData = docData.data();
    return authData;
  }
  static async findByEmailAndCode(email: string, code: number) {
    const auth = await Auth.findByEmail(email);

    let isBeforeRes;
    let token;

    if (auth) {
      const now = new Date();
      const then = auth.data.expired.toDate();
      const isBeforeResValue = isBefore(now, then);
      isBeforeRes = isBeforeResValue;
    }

    if (auth && auth.data.code == code && isBeforeRes) {
      const authData = auth.data;
      const userID = authData.userID;
      var tokenValue = generate({ userID });
      token = tokenValue;
    }

    return token;
  }
}

export { Auth };

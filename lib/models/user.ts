import { firestore } from "lib/firestore";

const collection = firestore.collection("users");

class User {
  ref: FirebaseFirestore.DocumentReference;
  data: FirebaseFirestore.DocumentData;
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
  static async createNewUser(email: string) {
    const newDoc = await collection.add({ email });
    const docData = await newDoc.get();
    const userData = docData.data();
    const userID = docData.id;
    return { userData, userID };
  }
}

export { User };

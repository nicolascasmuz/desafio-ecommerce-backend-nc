import { firestore } from "lib/firestore";

const collection = firestore.collection("orders");

class Order {
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
  static async createNewOrder(newOrderData) {
    const newDoc = await collection.add(newOrderData);
    const docData = await newDoc.get();
    const orderData = docData.data();
    const orderID = docData.id;

    return { orderData, orderID };
  }
  static async updateOrder(external_reference, status) {
    const result = await collection
      .where("preference.external_reference", "==", external_reference)
      .get();

    if (result.docs.length) {
      const firstDoc = result.docs[0];
      const docData = firstDoc.data();
      const docRef = firstDoc.ref;

      const updatedData = {
        preference: docData.preference,
        productID: docData.productID,
        status: status ? status : docData.status,
        userID: docData.userID,
      };

      await docRef.update(updatedData);
      const updatedDoc = await docRef.get();
      return updatedDoc.data();
    } else {
      return null;
    }
  }
  static async getOrders(userID) {
    const result = await collection.where("userID", "==", userID).get();

    if (result.docs.length) {
      const allDocs = result.docs;

      const orders = allDocs.map((d) => {
        const docData = d.data();
        return docData;
      });

      return orders;
    } else {
      return null;
    }
  }
}

export { Order };

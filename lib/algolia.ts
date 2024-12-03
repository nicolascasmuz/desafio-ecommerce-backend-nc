import algoliasearch from "algoliasearch";

const client = algoliasearch("4QTUK8NYPN", "a1e11ff84df83127ae6cbb5fcf7a8a55");
const productsIndex = client.initIndex("my-products");

export { productsIndex };

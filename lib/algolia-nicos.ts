import algoliasearch from "algoliasearch";

const client = algoliasearch("LKNOQGPD0P", "414c0e2f27c9ed9dbfcb5cfa1485440b");
const productsIndex = client.initIndex("nicos-catalogo");

export { productsIndex };

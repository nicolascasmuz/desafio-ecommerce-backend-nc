import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { productsIndex } from "lib/algolia";
import { getOffsetAndLimit } from "lib/requests";

export default methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { q } = req.query;

    const { limit, offset } = getOffsetAndLimit(req.query, 30, 20);
    const query = await productsIndex.search(q as string, {
      hitsPerPage: limit,
      offset,
      length: limit,
    });

    res.status(200).json({
      results: query.hits,
      pagination: { limit, offset, total: query.nbHits },
    });
  },
});

import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { productsIndex } from "lib/algolia";
import { getOffsetAndLimit } from "lib/requests";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST", "PATCH", "OPTIONS", "HEAD"],
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function corsHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  methods({
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
  })(req, res);
}

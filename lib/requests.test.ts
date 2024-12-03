import { expect, test } from "vitest";
import { getOffsetAndLimit } from "./requests";

test("request: get offset and limit", () => {
  const query = { limit: 100, offset: 258 };
  const expectedValues = { limit: 40, offset: 20 };
  const limitOffsetRes = getOffsetAndLimit(query, 40, 20);

  expect(expectedValues).toStrictEqual(limitOffsetRes);
});

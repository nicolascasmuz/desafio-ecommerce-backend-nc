function getOffsetAndLimit(query, maxLimit, maxOffset) {
  const queryLimit = parseInt(query.limit as string);
  const queryOffset = parseInt(query.offset as string);

  let limit;
  let offset;

  if (queryLimit <= maxLimit) {
    limit = queryLimit;
  } else {
    limit = maxLimit;
  }

  if (queryOffset <= maxOffset) {
    offset = queryOffset;
  } else {
    offset = maxOffset;
  }

  return { limit, offset };
}

export { getOffsetAndLimit };

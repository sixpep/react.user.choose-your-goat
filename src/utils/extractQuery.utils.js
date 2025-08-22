export function getTokenFromQuery(queryString) {
  if (!queryString.startsWith("?")) return false;

  const query = queryString.slice(1); // remove the leading '?'
  const pairs = query.split("&");
  const resultQuery = {};

  for (const element of pairs) {
    const [key, value] = element.split("=");
    resultQuery[decodeURIComponent(key)] = decodeURIComponent(value || "");
  }

  if (resultQuery.token) return resultQuery.token;
  else return false;
}

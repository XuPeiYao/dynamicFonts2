export function cors(...origins: string[]) {
  if (origins.length === 0) {
    origins = ['*'];
  }
  return (request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', origins.join(', '));
    next();
  };
}

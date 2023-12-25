export function runMiddleware(req, res, middlewareStack) {
  return middlewareStack.reduce((prev, curr) => {
    return prev.then(() => {
      return new Promise(async (resolve) => {
        await curr(req, res, resolve);
      });
    });
  }, Promise.resolve());
}

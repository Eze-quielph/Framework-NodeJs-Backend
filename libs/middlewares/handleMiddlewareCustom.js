module.exports = {
    //Recibimos el stack de middlewares, y los ejecutamos en orden
    runMiddleware: (req, res, stack)=> {
         return stack.reduce((prev, curr) => {
           return prev.then(() => {
             return new Promise(async (resolve) => {
               await curr(req, res, resolve);
             });
           });
         }, Promise.resolve());
    }
}
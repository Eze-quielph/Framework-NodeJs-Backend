
module.exports = {
    processMiddleware : (midd, req, res) => {
        //Si el Middleware no existe, le damos el true para seguir
        if(!midd) return new Promise((resolve) => resolve(true));
    
        return new Promise((resolve) => {
            //Ejecutamos el middleware de la request, y el callback que resuelve la promesa
            midd(req, res, ()=> {
                resolve(true);
            })
        })
    }


}
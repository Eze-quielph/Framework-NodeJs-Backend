module.exports = {
    // Lectura de body
    readBody: (req) => {
        return new Promise((resolve, reject) => {
            let body = '';

            //Recibir datos
            req.on('data', (chunk) => {
                body += "" + chunk;
            });

            //Terminar de recibir datos
            req.on('end', () => {
                resolve(body);
            });

            //Error
            req.on('error', (err) => {
                reject(err);
            });
        })
    }
} 
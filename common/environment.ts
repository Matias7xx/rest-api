//Exporta constantes e valores defaults para o servidor pegar
export const environment = {
    server: { port: process.env.SERVER_PORT || 3000 }, //Porta utilizada variavel de ambiente ou 3000
    db: { url: process.env.DB_URL || 'mongodb://localhost/meat-api' },

    //Numero de rounds do bcrypt
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }
}
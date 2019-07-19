//Exporta constantes e valores defaults para o servidor pegar
export const environment = {
    server: { port: process.env.SERVER_PORT || 3000 } //Porta utilizada variavel de ambiente ou 3000
}
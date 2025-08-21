import { config as configServer } from '../../server/src/config';
// Se mudar o port do servidor, ele vai mudar aqui também
// é importante para saber em que parte os Axios vão buscar os dados
// e onde o servidor vai estar a escuta

//!------------------------------------------------------------
// Configuração do lado cliente
/**
 * Porta em que o cliente irá rodar.
 * @constant {number}
 */
const port = 8080; // para trocar o porto do cliente, deve ser alterado no ficheiro webpack.config.js
                   // este número só está com referência para entrar no webpack.config.js
                   // e para saber de que port não está a ser usado

/**
 * Endereço do cliente.
 * @constant {string}
 */
const address = 'http://localhost:' + port;

//!------------------------------------------------------------

// como o webpack.config.js se preocupa com o porto do cliente
// logo predefinir um port aqui não faz sentido
// já que o único port que importa é o do servidor
// e o do cliente é definido no webpack.config.js.
// automaticamente o webpack.config.js vai usar o 8080

/**
 * Interface para a configuração do cliente e servidor.
 * @interface
 */
interface ConfigClientServer
{
    /** Endereço do servidor */
    serverAddress: string,
    /** Endereço do cliente */
    clientAddress: string,
    /** Porta do cliente */
    port: number,
    /** Porta do servidor */
    serverPort: number,
}

/**
 * Configuração do cliente e servidor.
 * @constant {ConfigClientServer}
 */
export const config: ConfigClientServer = {
    serverAddress: configServer.address,
    clientAddress: address,
    port: port,
    serverPort: configServer.port,
}

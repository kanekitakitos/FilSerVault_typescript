/**
 * Porta em que o servidor irá rodar
 * @constant {number}
 */
const portServer = 3000;

/**
 * Configurações do servidor
 * @constant {Object}
 * @property {number} port - Porta em que o servidor irá rodar
 * @property {string} address - Endereço do servidor
 */
export const config = {
    port: portServer,
    address: "http://localhost:" + portServer,
};

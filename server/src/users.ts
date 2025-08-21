import * as path from "path";
import { IMovie } from "./movies";
import { Iserie } from "./series";
import * as bcrypt from "bcrypt";
const Datastore = require("nedb");



/**
 * Interface que representa um utilizador no sistema
 * @interface
 */
export interface IUser
{
    username: string,
    password: string,
    favoriteMovies: IMovie[],
    favoriteSeries: Iserie[]
}




export class Worker
{
    private db: Nedb;

    /**
     * Construtor que inicializa a base de dados NeDB para os utilizadores
     * Configura o arquivo de banco de dados no diretório baseDeDados
     */
    constructor()
    {
        this.db = new Datastore(
        {
            filename: path.join(__dirname, "../baseDeDados/users.db"),
            autoload: true
        });
    }

    /**
     * Lista todos os utilizadores cadastrados
     * @returns {Promise<IUser[]>} Lista de utilizadores cadastrados
     * @throws {Error} Se houver erro na consulta
     */
    public listUsers(): Promise<IUser[]>
    {
        return new Promise((inResolve, inReject) =>
        {
            //Vai procurar todos os utilizadores, recebe dois argumentos
            this.db.find({},
                (inError: Error | null, inDocs: IUser[]) =>
                {
                    if (inError)
                        inReject(inError);
                    else
                        inResolve(inDocs);

                }
            );
        });
    }

    /**
     * Registra um novo utilizador no sistema.
     * @param {string} username - Nome do utilizador.
     * @param {string} password - Senha do utilizador.
     * @returns {Promise<IUser>} - Uma promessa que resolve com o utilizador registrado ou rejeita com um erro.
     */
    public register(username: string, password: string): Promise<IUser>
    {
        return new Promise(async (inResolve, inReject) =>
        {
            try
            {
                password = await bcrypt.hash(password, 10);
            }
            catch (inError)
            {
                inReject(inError);
            }

            const inUser: IUser = { username: username, password: password, favoriteMovies: [], favoriteSeries: [] };

            this.db.insert(inUser,
                (inError: Error | null, inNewDoc: IUser) =>
                {
                    if (inError)
                        inReject(inError);
                    else
                        inResolve(inNewDoc);
                }
            );
        });
    }

    /**
     * Adiciona um novo utilizador ao sistema
     * @param {string} username Nome do utilizador
     * @param {string} password Senha do utilizador
     * @returns {Promise<IUser>} utilizador criado
     * @throws {Error} Se houver erro na criação
     */
    public addUser(username: string, password: string): Promise<IUser>
    {
        return new Promise(async (inResolve, inReject) =>
        {
            try
            {
                password = await bcrypt.hash(password, 10);
            }
            catch (inError)
            {
                inReject(inError);
            }

            const inUser: IUser = { username: username, password: password, favoriteMovies: [], favoriteSeries: [] };

            this.db.insert(inUser,
                (inError: Error | null, inNewDoc: IUser) =>
                {
                    if (inError)
                        inReject(inError);
                    else
                        inResolve(inNewDoc);
                }
            );
        });
    }

    /**
     * Deleta um utilizador da base de dados
     * @param {string} inID ID do utilizador a ser removido
     * @returns {Promise<void>} Confirmação da remoção
     * @throws {Error} Se houver erro na remoção
     */
    public deleteUser(inID: string): Promise<void>
    {
        return new Promise((inResolve, inReject) =>
        {
            this.db.remove({ _id: inID },{},
                (inError: Error | null, inNumRemoved: number) =>
                {
                    if (inError)
                        inReject(inError);
                    else
                        inResolve();
                }
            );
        });
    }

   /**
     * Realiza o login do utilizador
     * @param {string} username Nome do utilizador
     * @param {string} password Senha do utilizador
     * @returns {Promise<{user: IUser, token: string}>} Dados do utilizador e token de autenticação
     * @throws {Error} Se as credenciais forem inválidas
     */
   public login(username: string, password: string): Promise<{user: IUser, token: string}>
   {
       return new Promise(async (inResolve, inReject) =>
       {
           try
           {
               const jwt = require('jsonwebtoken');// Importa o modulo jsonwebtoken para gerar o token (Mais eficiente)


               const user: IUser = await this.getUser(username);
               const match: boolean = await bcrypt.compare(password, user.password);

               if (match)
               {
                   const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
                   inResolve({user, token});
               }
               else
                   inReject(new Error("Invalid credentials."));

           }
           catch (inError)
           {
               inReject(inError);
           }
       });
    }

//~ ----------------------- METODOS AUXILIARES ------------------------------------------------------------------------------------------------------------

    /**
     * Busca um utilizador pelo nome
     * @param {string} inUsername Nome do utilizador
     * @returns {Promise<IUser | null>} utilizador encontrado ou null
     * @throws {Error} Se houver erro na busca
     */
    public getUserByUsername(inUsername: string): Promise<IUser | null> {
        return new Promise((inResolve, inReject) => {
            this.db.find({ username: inUsername }, (inError: Error | null, inDocs: IUser[]) => {
                if (inError) {
                    inReject(inError);
                } else if (inDocs.length === 0) {
                    inResolve(null); // Retorna null se o utilizador não existir
                } else {
                    inResolve(inDocs[0]);
                }
            });
        });
    }

    /**
     * Verifica se a senha corresponde ao hash
     * @param {string} inPassword Senha a verificar
     * @param {string} inHash Hash armazenado
     * @returns {Promise<boolean>} Resultado da verificação
     */
    public doesPasswordMatch(inPassword: string, inHash: string): Promise<boolean> {
        return bcrypt.compare(inPassword, inHash);
    }

    /**
     * Recupera um utilizador pelo nome de utilizador.
     * @param {string} inUsername - O nome do utilizador a ser recuperado.
     * @returns {Promise<IUser>} Uma promessa que resolve com o utilizador encontrado.
     * @throws {Error} Se o utilizador não for encontrado ou houver erro na busca.
     */
    public getUser(inUsername: string): Promise<IUser> {
        return new Promise((inResolve, inReject) => {
            this.db.find({ username: inUsername }, (inError: Error | null, inDocs: IUser[]) => {
                if (inError) {
                    inReject(inError);
                } else if (inDocs.length === 0) {
                    inReject(new Error("User not found."));
                } else {
                    inResolve(inDocs[0]);
                }
            });
        });
    }

    /**
     * Recupera um utilizador pelo ID
     * @param {string} inID ID do utilizador
     * @returns {Promise<IUser>} utilizador encontrado
     * @throws {Error} Se houver erro na busca ou se o utilizador não for encontrado
     */
    public getUserByID(inID: string): Promise<IUser> {
        return new Promise((inResolve, inReject) => {
            this.db.find({ _id: inID }, (inError: Error | null, inDocs: IUser[]) => {
                if (inError) {
                    inReject(inError);
                } else if (inDocs.length === 0) {
                    inReject(new Error("User not found."));
                } else {
                    inResolve(inDocs[0]);
                }
            });
        });
    }

    /**
     * Atualiza os filmes favoritos de um utilizador.
     * @param {string} inID ID do utilizador
     * @param {IMovie[]} inFavoriteMovies Lista de filmes favoritos
     * @returns {Promise<IUser>} utilizador atualizado
     * @throws {Error} Se houver erro na atualização
     */
    public updateFavoriteMovies(inID: string, inFavoriteMovies: IMovie[]): Promise<IUser> {
        return new Promise(async (inResolve, inReject) => {
            try {
                const user: IUser = await this.getUserByID(inID);
                user.favoriteMovies = inFavoriteMovies;

                this.db.update({ _id: inID }, { $set: { favoriteMovies: inFavoriteMovies } }, {}, (inError: Error | null, inNumReplaced: number) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(user);
                    }
                });
            } catch (inError) {
                inReject(inError);
            }
        });
    }

    /**
     * Atualiza as séries favoritas de um utilizador.
     * @param {string} inID ID do utilizador
     * @param {Iserie[]} inFavoriteSeries Lista de séries favoritas
     * @returns {Promise<IUser>} utilizador atualizado
     * @throws {Error} Se houver erro na atualização
     */
    public updateFavoriteSeries(inID: string, inFavoriteSeries: Iserie[]): Promise<IUser> {
        return new Promise(async (inResolve, inReject) => {
            try {
                const user: IUser = await this.getUserByID(inID);
                user.favoriteSeries = inFavoriteSeries;

                this.db.update({ _id: inID }, { $set: { favoriteSeries: inFavoriteSeries } }, {}, (inError: Error | null, inNumReplaced: number) => {
                    if (inError) {
                        inReject(inError);
                    } else {
                        inResolve(user);
                    }
                });
            } catch (inError) {
                inReject(inError);
            }
        });
    }
}
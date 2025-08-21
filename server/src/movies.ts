import * as path from "path";
import * as fs from "fs";
const Datastore = require("nedb");

export interface IMovie
{
    title :string ,
    year: number ,
    rating: number ,
    category: string ,
    director: string ,
    description: string,
    image: string
}

export class Worker
{
    private db: Nedb;

    /**
     * Construtor para inicializar a NeDB.
     */
    constructor()
    {
        this.db = new Datastore(
        {
            filename: path.join(__dirname, "../baseDeDados/movies.db"),
            autoload: true
        });
    }

    /**
     * Recupera uma lista de todos os filmes da base de dados.
     * @returns {Promise<IMovie[]>} - Uma promessa que resolve com a lista de filmes.
     */
    public listMovies(): Promise<IMovie[]>
    {
        return new Promise((inResolve, inReject) =>
        {
            this.db.find({},
                (inError: Error | null, inDocs: IMovie[]) =>
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
     * Adiciona um filme à lista de filmes.
     * @param {IMovie} inMovie - O filme a ser adicionado.
     * @returns {Promise<void>} - Uma promessa que resolve quando o filme é adicionado.
     */
    public addMovie(inMovie: IMovie): Promise<IMovie>
    {
        return new Promise((inResolve, inReject) =>
        {
            this.db.insert(inMovie,
                (inError: Error | null, inNewDoc: IMovie) =>
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
     * Deleta um filme da base de dados.
     * @param {string} inID - O ID do filme a ser deletado.
     * @returns {Promise<void>} - Uma promessa que resolve quando o filme é deletado.
     */
    public deleteMovie(inID: string): Promise<void>
    {
        return new Promise((inResolve, inReject) =>
        {
            this.db.remove({ _id: inID }, {},
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

//~ ----------------------- METODOS AUXILIARES ------------------------------------------------------------------------------------------------------------


    /**
     * Adiciona filmes a partir de um arquivo JSON para a base de dados.
     * @param {string} filePath - O caminho do arquivo JSON.
     * @returns {Promise<IMovie[]>} - Uma promessa que resolve com a lista de filmes adicionados.
     */
    public addMoviesFromFile(filePath: string): Promise<IMovie[]>
    {
        return new Promise((resolve, reject) =>
        {
            fs.readFile(filePath, 'utf8', (err, data) =>
            {
                if (err)
                {
                    reject(err);
                    return;
                }
                try
                {
                    const movies: IMovie[] = JSON.parse(data);
                    const promises = movies.map(movie => this.addMovie(movie));
                    Promise.all(promises).then(resolve).catch(reject);
                }
                catch (e)
                {
                    reject(e);
                }
            });
        });
    }
}


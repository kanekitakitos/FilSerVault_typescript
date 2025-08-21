import * as path from "path";
import * as fs from 'fs';
import { IMovie } from "./movies";
const Datastore = require("nedb");

/**
 * Interface que representa uma série, estendendo a interface IMovie
 * Pode incluir campos adicionais específicos para séries
 */
export interface Iserie extends IMovie {
    // pode ter mais campos nas series
}


export class Worker {
    private db: Nedb;

    /**
     * Construtor que inicializa a base de dados NeDB para séries
     * Configura o arquivo de banco de dados no diretório baseDeDados
     */
    constructor() {
        this.db = new Datastore(
        {
            filename: path.join(__dirname, "../baseDeDados/series.db"),
            autoload: true
        });
    }

    /**
     * Lista todas as séries armazenadas na base de dados
     * @returns {Promise<Iserie[]>} Promessa que resolve com um array de séries
     * @throws {Error} Se houver erro na consulta ao banco de dados
     */
    public listSeries(): Promise<Iserie[]>
    {
        return new Promise((inResolve, inReject) =>
        {
            this.db.find({},
                    (inError: Error | null, inDocs: Iserie[]) =>
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
     * Adiciona uma nova série à base de dados
     * @param {Iserie} inMovieShow Série a ser adicionada
     * @returns {Promise<Iserie>} Promessa que resolve com a série adicionada
     * @throws {Error} Se houver erro ao inserir a série
     */
    public addSerie(inMovieShow: Iserie): Promise<Iserie> {
        return new Promise((inResolve, inReject) =>
        {
            this.db.insert(inMovieShow,
                (inError: Error | null, inNewDoc: Iserie) =>
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
     * Remove uma série da base de dados
     * @param {string} inID ID da série a ser removida
     * @returns {Promise<void>} Promessa que resolve após a remoção
     * @throws {Error} Se houver erro ao remover a série
     */
    public deleteSerie(inID: string): Promise<void> {
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

//~ ----------------------- METODOS AUXILIARES ------------------------------------------------------------------------------------------------------------


    /**
     * Carrega e adiciona séries a partir de um arquivo JSON
     * @param {string} filePath Caminho do arquivo JSON contendo as séries
     * @returns {Promise<Iserie[]>} Promessa que resolve com as séries adicionadas
     * @throws {Error} Se houver erro na leitura do arquivo ou ao adicionar séries
     */
    public addSeriesFromFile(filePath: string): Promise<Iserie[]> {
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
                    const series: Iserie[] = JSON.parse(data);
                    const promises = series.map(serie => this.addSerie(serie));
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

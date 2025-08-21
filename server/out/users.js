"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const path = __importStar(require("path"));
const bcrypt = __importStar(require("bcrypt"));
const Datastore = require("nedb");
class Worker {
    //Construtor para inicializar a NeDB
    constructor() {
        this.db = new Datastore({
            filename: path.join(__dirname, "../baseDeDados/users.db"),
            autoload: true
        });
    }
    //Funcao que recupera uma lista de todos os utilizador da base de dados
    listUsers() {
        return new Promise((inResolve, inReject) => {
            //Vai procurar todos os utilizadores, recebe dois argumentos
            this.db.find({}, (inError, inDocs) => {
                if (inError)
                    inReject(inError);
                else
                    inResolve(inDocs);
            });
        });
    }
    //Funcao para resgistar um novo utilizador
    register(username, password) {
        return new Promise((inResolve, inReject) => __awaiter(this, void 0, void 0, function* () {
            try {
                password = yield bcrypt.hash(password, 10);
            }
            catch (inError) {
                inReject(inError);
            }
            const inUser = { username: username, password: password, favoriteMovies: [], favoriteSeries: [] };
            this.db.insert(inUser, (inError, inNewDoc) => {
                if (inError)
                    inReject(inError);
                else
                    inResolve(inNewDoc);
            });
        }));
    }
    //Funcao para deletar um utilizador da base de dados pelo ID
    deleteUser(inID) {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, (inError, inNumRemoved) => {
                if (inError)
                    inReject(inError);
                else
                    inResolve();
            });
        });
    }
    //Funcao para fazer o login do utilizador
    login(username, password) {
        return new Promise((inResolve, inReject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const jwt = require('jsonwebtoken'); // Importa o modulo jsonwebtoken para gerar o token (Mais eficiente)
                const user = yield this.getUser(username);
                const match = yield bcrypt.compare(password, user.password);
                if (match) {
                    const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
                    inResolve({ user, token });
                }
                else
                    inReject(new Error("Invalid credentials."));
            }
            catch (inError) {
                inReject(inError);
            }
        }));
    }
    //~ ----------------------- METODOS AUXILIARES ------------------------------------------------------------------------------------------------------------
    //Para eu poder mostrar erros no cliente, tenho de achar o username dado pelo cliente
    //Funcao para recuperar um utilizador pelo nome
    getUserByUsername(inUsername) {
        return new Promise((inResolve, inReject) => {
            this.db.find({ username: inUsername }, (inError, inDocs) => {
                if (inError) {
                    inReject(inError);
                }
                else if (inDocs.length === 0) {
                    inResolve(null); // Retorna null se o utilizador não existir
                }
                else {
                    inResolve(inDocs[0]);
                }
            });
        });
    }
    //Para poder mostrar no cliente que a pass está errada, tenho de verificar se a pass está correta
    //Funcao para verificar se a password está correta
    doesPasswordMatch(inPassword, inHash) {
        return bcrypt.compare(inPassword, inHash);
    }
    //Funcao que recupera um utilizador pelo nome
    getUser(inUsername) {
        return new Promise((inResolve, inReject) => {
            this.db.find({ username: inUsername }, (inError, inDocs) => {
                if (inError)
                    inReject(inError);
                else if (inDocs.length === 0)
                    inReject(new Error("User not found."));
                else
                    inResolve(inDocs[0]);
            });
        });
    }
    //Funcao que recupera um utilizador pelo ID
    getUserByID(inID) {
        return new Promise((inResolve, inReject) => {
            this.db.find({ _id: inID }, (inError, inDocs) => {
                if (inError)
                    inReject(inError);
                else if (inDocs.length === 0)
                    inReject(new Error("User not found."));
                else
                    inResolve(inDocs[0]);
            });
        });
    }
    //Funcao para atualizar a lista de filmes favoritos de um utilizador
    updateFavoriteMovies(inID, inFavoriteMovies) {
        return new Promise((inResolve, inReject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByID(inID);
                user.favoriteMovies = inFavoriteMovies;
                this.db.update({ _id: inID }, { $set: { favoriteMovies: inFavoriteMovies } }, {}, (inError, inNumReplaced) => {
                    if (inError)
                        inReject(inError);
                    else
                        inResolve(user);
                });
            }
            catch (inError) {
                inReject(inError);
            }
        }));
    }
    //Funcao para atualizar a lista de series favoritas de um utilizador
    updateFavoriteSeries(inID, inFavoriteseries) {
        return new Promise((inResolve, inReject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.getUserByID(inID);
                user.favoriteSeries = inFavoriteseries;
                this.db.update({ _id: inID }, { $set: { favoriteSeries: inFavoriteseries } }, {}, (inError, inNumReplaced) => {
                    if (inError)
                        inReject(inError);
                    else
                        inResolve(user);
                });
            }
            catch (inError) {
                inReject(inError);
            }
        }));
    }
}
exports.Worker = Worker;

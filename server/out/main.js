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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const Movies = __importStar(require("./movies"));
const Series = __importStar(require("./series"));
const Users = __importStar(require("./users"));
const config_1 = require("./config");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
/*Apenas deixa o cliente fazer requisicoes para o servidor */
// Esto configurará automáticamente los encabezados CORS
// necesarios para permitir solicitudes de origen cruzado.
// esto es importante proque si no el navegador bloquea las solicitudes
// piensa que es un ataque o algo malicioso
app.use(function (__inRequest, inResponse, inNext) {
    // configuracion de los encabezados CORS
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});
//~ ------------------------- GET ---------------------------------------------------------------------------------------------------------------------------------------------------------
//^ Rota para lidar com solicitações GET para "/series"
app.get("/series", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seriesWorker = new Series.Worker();
        const series = yield seriesWorker.listSeries();
        inResponse.json(series);
    }
    catch (inError) {
        inResponse.send("error get series");
    }
}));
//^ Rota para lidar com solicitações GET para "/users"
app.get("/users", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersWorker = new Users.Worker();
        const users = yield usersWorker.listUsers();
        inResponse.json(users);
    }
    catch (inError) {
        inResponse.send("error get users");
    }
}));
//^ Rota para lidar com solicitações GET para "/movies"
app.get("/movies", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moviesWorker = new Movies.Worker();
        const movies = yield moviesWorker.listMovies();
        inResponse.json(movies);
    }
    catch (inError) {
        inResponse.send("error get movies");
    }
}));
//! PARTE NOVA MIGUEL --------------------------------------------------------------------
//^ Rota para lidar com solicitações GET para "/movies/featured"
// Vai selecionar aleatoriamente 3 filmes para mostrar na página inicial
app.get("/movies/featured", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moviesWorker = new Movies.Worker();
        const movies = yield moviesWorker.listMovies();
        const featuredMovies = movies.sort(() => Math.random() - Math.random()).slice(0, 3);
        inResponse.json(featuredMovies);
    }
    catch (inError) {
        inResponse.send("error get featured movies");
    }
}));
//^ Rota para lidar com solicitações GET para "/series/featured"
// Vai selecionar aleatoriamente 3 series para mostrar na página inicial
app.get("/series/featured", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seriesWorker = new Series.Worker();
        const series = yield seriesWorker.listSeries();
        const featuredSeries = series.sort(() => Math.random() - Math.random()).slice(0, 3);
        inResponse.json(featuredSeries);
    }
    catch (inError) {
        inResponse.send("error get featured series");
    }
}));
//~ -------------------- DELETE ------------------------------------------------------------------------------------------------- DELETE --------------------------------------------------
//^ Rota para lidar com solicitações DELETE para "/users/:id"
app.delete("/users/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersWorker = new Users.Worker();
        yield usersWorker.deleteUser(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error delete user");
    }
}));
//^ Rota para lidar com solicitações DELETE para "/movies/:id"
app.delete("/movies/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moviesWorker = new Movies.Worker();
        yield moviesWorker.deleteMovie(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error delete movie");
    }
}));
//^ Rota para lidar com solicitações DELETE para "/series/:id"
app.delete("/series/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seriesWorker = new Series.Worker();
        yield seriesWorker.deleteSerie(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error delete serie");
    }
}));
//~ --------------- (1) POST -> series e movies --------------------------------------------------------------------------------------POST -> series e movies--------------------------------
//^ Rota para lidar com solicitações POST para "/series"
app.post("/series", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seriesWorker = new Series.Worker();
        const serie = yield seriesWorker.addSerie(inRequest.body);
        inResponse.json(serie);
    }
    catch (inError) {
        inResponse.send("error post series");
    }
}));
//^ Rota para lidar com solicitações POST para "/movies"
app.post("/movies", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moviesWorker = new Movies.Worker();
        const movie = yield moviesWorker.addMovie(inRequest.body);
        inResponse.json(movie);
    }
    catch (inError) {
        inResponse.send("error post movies");
    }
}));
//~ --------------- (2) POST-> USUARIO ROTAS ------------------------------------------------------------------------------------POST-> USUARIO ROTAS----------------------------------------
//^ Rota para lidar com solicitações POST para "/register"
app.post("/register", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersWorker = new Users.Worker();
        // Verifica se o utilizador já existe
        const userExists = yield usersWorker.getUserByUsername(inRequest.body.username);
        if (userExists) {
            return inResponse.status(409).json({ error: "User already exists" });
        }
        const user = yield usersWorker.register(inRequest.body.username, inRequest.body.password);
        inResponse.json(user);
    }
    catch (inError) {
        inResponse.send("error post register");
    }
}));
//^ Rota para fazer login
app.post("/login", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersWorker = new Users.Worker();
        // Verifica se o utilizador existe
        const userToCheck = yield usersWorker.getUserByUsername(inRequest.body.username);
        if (!userToCheck) {
            return inResponse.status(404).json({ error: "User does not exist" });
        }
        // Verifica se a password está correta
        const doesPasswordMatch = yield usersWorker.doesPasswordMatch(inRequest.body.password, userToCheck.password);
        if (!doesPasswordMatch) {
            return inResponse.status(401).json({ error: "Invalid password" });
        }
        // Chama o método `login` apenas após validar o utilizador e a password
        const { user, token } = yield usersWorker.login(userToCheck.username, inRequest.body.password);
        // Retorna o utilizador e o token
        return inResponse.status(200).json({ user, token });
    }
    catch (inError) {
        console.error("Error during login:", inError);
        return inResponse.status(500).json({ error: "An unexpected error occurred" });
    }
    /*
    try
    {
        const usersWorker: Users.Worker = new Users.Worker();
        const {user , token} = await usersWorker.login(inRequest.body.username, inRequest.body.password);
        inResponse.json({user, token});
    }
    catch (inError)
    {
        inResponse.send("error post login");
    }*/
}));
//^ Rota para lidar com solicitações POST para "/users/:id/favoriteMovies"
app.post("/users/:id/favoriteMovies", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersWorker = new Users.Worker();
        const user = yield usersWorker.updateFavoriteMovies(inRequest.params.id, inRequest.body.movies);
        inResponse.json(user);
    }
    catch (inError) {
        inResponse.send("error post favoriteMovies");
    }
}));
//^ Rota para lidar com solicitações POST para "/users/:id/favoriteSeries"
app.post("/users/:id/favoriteSeries", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersWorker = new Users.Worker();
        const user = yield usersWorker.updateFavoriteSeries(inRequest.params.id, inRequest.body.series);
        inResponse.json(user);
    }
    catch (inError) {
        inResponse.send("error post favoriteSeries");
    }
}));
//~ --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(config_1.config.port, () => { console.log("Server is listening on port ----> " + config_1.config.port); });
console.log("go to ---> " + config_1.config.address);

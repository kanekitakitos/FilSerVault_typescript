import path from 'path';
import express, { Express, NextFunction, Request, Response } from 'express';
import * as Movies from "./movies";
import { IMovie } from "./movies";
import * as Series from "./series";
import { Iserie } from "./series";
import * as Users from "./users";
import { IUser } from "./users";
import { config } from './config';

const app: Express = express();

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../../client/dist")));


/*Apenas deixa o cliente fazer requisicoes para o servidor */
// Esto configurará automáticamente los encabezados CORS
// necesarios para permitir solicitudes de origen cruzado.
// esto es importante proque si no el navegador bloquea las solicitudes
// piensa que es un ataque o algo malicioso
app.use ( function ( __inRequest : Request , inResponse : Response , inNext : NextFunction ) 
{
    // configuracion de los encabezados CORS
     inResponse.header("Access-Control-Allow-Origin", "*");

     inResponse.header("Access-Control-Allow-Methods",
     "GET,POST,DELETE,OPTIONS");

     inResponse.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept");

     inNext();
}) ;



//~ ------------------------- GET ---------------------------------------------------------------------------------------------------------------------------------------------------------

//^ Rota para lidar com solicitações GET para "/series"
app.get("/series", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const seriesWorker: Series.Worker = new Series.Worker();
        const series: Iserie[] = await seriesWorker.listSeries();
        inResponse.json(series);
    }
     catch (inError)
     {
        inResponse.send("error get series");
    }
});

//^ Rota para lidar com solicitações GET para "/users"
app.get("/users", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const usersWorker: Users.Worker = new Users.Worker();
        const users: IUser[] = await usersWorker.listUsers();
        inResponse.json(users);

    }
    catch (inError)
    {
        inResponse.send("error get users");
    }
});

//^ Rota para lidar com solicitações GET para "/movies"
app.get("/movies", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const moviesWorker: Movies.Worker = new Movies.Worker();
        const movies: IMovie[] = await moviesWorker.listMovies();
        inResponse.json(movies);

    }
    catch (inError)
    {
        inResponse.send("error get movies");
    }
});


//^ Rota para lidar com solicitações GET para "/movies/featured"
// Vai selecionar aleatoriamente 3 filmes para mostrar na página inicial
app.get("/movies/featured", async (inRequest: Request, inResponse: Response) =>
    {
        try
        {
            const moviesWorker: Movies.Worker = new Movies.Worker();
            const movies: IMovie[] = await moviesWorker.listMovies();
            const featuredMovies: IMovie[] = movies.sort(() => Math.random() - Math.random()).slice(0, 3);
            inResponse.json(featuredMovies);
        }
        catch (inError)
        {
            inResponse.send("error get featured movies");
        }
    });
    
    //^ Rota para lidar com solicitações GET para "/series/featured"
    // Vai selecionar aleatoriamente 3 series para mostrar na página inicial
    app.get("/series/featured", async (inRequest: Request, inResponse: Response) =>
    {
        try
        {
            const seriesWorker: Series.Worker = new Series.Worker();
            const series: Iserie[] = await seriesWorker.listSeries();
            const featuredSeries: Iserie[] = series.sort(() => Math.random() - Math.random()).slice(0, 3);
            inResponse.json(featuredSeries);
        }
        catch (inError)
        {
            inResponse.send("error get featured series");
        }
    });





//~ -------------------- DELETE ------------------------------------------------------------------------------------------------- DELETE --------------------------------------------------

//^ Rota para lidar com solicitações DELETE para "/users/:id"
app.delete("/users/:id", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const usersWorker: Users.Worker = new Users.Worker();
        await usersWorker.deleteUser(inRequest.params.id);
        inResponse.send("ok");
    } catch (inError) 
    {
        inResponse.send("error delete user");
    }
});

//^ Rota para lidar com solicitações DELETE para "/movies/:id"
app.delete("/movies/:id", async (inRequest: Request, inResponse: Response) =>
{
    try {
        const moviesWorker: Movies.Worker = new Movies.Worker();
        await moviesWorker.deleteMovie(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError)
    {
        inResponse.send("error delete movie");
    }
});

//^ Rota para lidar com solicitações DELETE para "/series/:id"
app.delete("/series/:id", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const seriesWorker: Series.Worker = new Series.Worker();
        await seriesWorker.deleteSerie(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError)
    {
        inResponse.send("error delete serie");
    }
});



//~ --------------- (1) POST -> series e movies --------------------------------------------------------------------------------------POST -> series e movies--------------------------------

//^ Rota para lidar com solicitações POST para "/series"
app.post("/series", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const seriesWorker: Series.Worker = new Series.Worker();
        const serie: Iserie = await seriesWorker.addSerie(inRequest.body);
        inResponse.json(serie);
    }
    catch (inError)
    {
        inResponse.send("error post series");
    }
});

//^ Rota para lidar com solicitações POST para "/movies"
app.post("/movies", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const moviesWorker: Movies.Worker = new Movies.Worker();
        const movie: IMovie = await moviesWorker.addMovie(inRequest.body);
        inResponse.json(movie);
    }
    catch (inError)
    {
        inResponse.send("error post movies");
    }
});



//~ --------------- (2) POST-> USUARIO ROTAS ------------------------------------------------------------------------------------POST-> USUARIO ROTAS----------------------------------------

//^ Rota para lidar com solicitações POST para "/register"
app.post("/register", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const usersWorker: Users.Worker = new Users.Worker();

        // Verifica se o utilizador já existe
        const userExists = await usersWorker.getUserByUsername(inRequest.body.username);
        if (userExists) {
            return inResponse.status(409).json({ error: "User already exists" });
        }

        const user: IUser = await usersWorker.register(inRequest.body.username, inRequest.body.password);
        inResponse.json(user);
    }
    catch (inError)
    {
        inResponse.send("error post register");
    }
});

//^ Rota para fazer login
app.post("/login", async (inRequest: Request, inResponse: Response) =>
{
    try {
        const usersWorker: Users.Worker = new Users.Worker();

        // Verifica se o utilizador existe
        const userToCheck = await usersWorker.getUserByUsername(inRequest.body.username);
        if (!userToCheck) {
            return inResponse.status(404).json({ error: "User does not exist" });
        }

        // Verifica se a password está correta
        const doesPasswordMatch = await usersWorker.doesPasswordMatch(inRequest.body.password, userToCheck.password);
        if (!doesPasswordMatch) {
            return inResponse.status(401).json({ error: "Invalid password" });
        }

        // Chama o método `login` apenas após validar o utilizador e a password
        const { user, token } = await usersWorker.login(userToCheck.username, inRequest.body.password);

        // Retorna o utilizador e o token
        return inResponse.status(200).json({ user, token });
    } catch (inError) {
        console.error("Error during login:", inError);
        return inResponse.status(500).json({ error: "An unexpected error occurred" });
    }

});

//^ Rota para lidar com solicitações POST para "/users/:id/favoriteMovies"
app.post("/users/:id/favoriteMovies", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const usersWorker: Users.Worker = new Users.Worker();
        const user: IUser = await usersWorker.updateFavoriteMovies(inRequest.params.id, inRequest.body.movies);
        inResponse.json(user);
    }
    catch (inError)
    {
        inResponse.send("error post favoriteMovies");
    }
});

//^ Rota para lidar com solicitações POST para "/users/:id/favoriteSeries"
app.post("/users/:id/favoriteSeries", async (inRequest: Request, inResponse: Response) =>
{
    try
    {
        const usersWorker: Users.Worker = new Users.Worker();
        const user: IUser = await usersWorker.updateFavoriteSeries(inRequest.params.id, inRequest.body.series);
        inResponse.json(user);
    }
    catch (inError)
    {
        inResponse.send("error post favoriteSeries");
    }
});


//~ --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.listen(config.port, () => { console.log("Server is listening on port ----> "+ config.port );console.log("go to ---> "+ config.address); });




import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"
import "../css/movies.css";
import "../css/movies-show-interface.css";
import axios from "axios";

// URL base da API
import { config } from "../config";



/**
 * Componente de listagem de filmes.
 * @component
 * @returns  O componente Movies.
 */
function Movies() {
	// Hook para navegacao
	const navigate = useNavigate();

	//Variaveis de estado usando o hook 'useState'
	const [movies, setMovies] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredMovies, setFilteredMovies] = useState([]);
	const [favoriteMovies, setFavoriteMovies] = useState([]);
	const [sortingMethod, setSortingMethod] = useState("ranking"); // Método de ordenação padrão

	//Recupera informacoes da sessao
	const sessionID = sessionStorage.getItem("sessionID");
	const user = JSON.parse(sessionStorage.getItem("user"));

	//Busca filmes na montagem do componente
	useEffect(() => {
		getMovies();
	}, []);

	//Atualiza filmes filtrados com base no termo de pesquisa e metodo de ordenação
	useEffect(() => {
		const filtrados = movies
			.filter((filme) =>
				filme.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => {
				if (sortingMethod === "ranking") {
					return b.rating - a.rating; //Ordena por ranking
				} else {
					return a.title.localeCompare(b.title); //Ordena alfabeticamente
				}
			});
		setFilteredMovies(filtrados);
	}, [searchTerm, movies, sortingMethod]);

	/**
     * Busca a lista de filmes do servidor.
     * @async
     * @function
     * @returns {Promise<void>}
     */
	useEffect(() => {
		if (user) {
			setFavoriteMovies(user.favoriteMovies);
		}
	}, []);

	/**
     * Busca a lista de filmes do servidor.
     * @async
     * @function
     * @returns {Promise<void>}
     */
	const getMovies = async () => {
		// Com axios
		try {
			const resposta = await axios.get(`${config.serverAddress}/movies`);
			setMovies(resposta.data);
		} catch (erro) {
			console.log(erro);
		}
	};

	/**
     * Adiciona filmes aos favoritos do usuário.
     * @async
     * @function
     * @param {Array} filmesParaAdicionar Lista de filmes a serem adicionados aos favoritos.
     * @returns {Promise<void>}
     */
	const addMovieToFavorites = async (filmesParaAdicionar) => {
		// Com axios
		try {
			const resposta = await axios.post(`${config.serverAddress}/users/${user._id}/favoriteMovies`, {
				movies: filmesParaAdicionar,
			});
			const usuarioAtualizado = resposta.data;
			sessionStorage.setItem("user", JSON.stringify(usuarioAtualizado));
			//Faça algo com o utilizador atualizado, por exemplo, atualize o estado ou acione uma nova busca
			console.log(usuarioAtualizado);
		} catch (erro) {
			console.error("Erro ao adicionar filme aos favoritos:", erro);
		}
	};

	/**
     * Lida com a adição ou remoção de filmes dos favoritos.
     * @param {Object} filme O filme a ser adicionado ou removido dos favoritos.
     */
	const handleAddToFavorites = (filme) => {
		const filmeJaNosFavoritos = favoriteMovies.some(
			(filmeFav) => filmeFav._id === filme._id
		);

		if (filmeJaNosFavoritos) {
			// Se o filme ja estiver nos favoritos, remova-o
			const favoritosAtualizados = favoriteMovies.filter(
				(filmeFav) => filmeFav._id !== filme._id
			);
			setFavoriteMovies(favoritosAtualizados);
			addMovieToFavorites(favoritosAtualizados);
		} else {
			// Se o filme nao estiver nos favoritos, adicione-o
			const favoritosAtualizados = [...favoriteMovies, filme];
			setFavoriteMovies(favoritosAtualizados);
			addMovieToFavorites(favoritosAtualizados);
		}
	};

	/**
     * Lida com a mudança do método de ordenação.
     * @param {React.ChangeEvent<HTMLSelectElement>} e Evento de mudança do select.
     */
	const handleSortChange = (e) => {
		setSortingMethod(e.target.value);
	};

	return (
		<div className="Parent">
			<Header />
			<div className="searchAndSort">
				{/* Search bar */}
				<div className="search-container">
					<div className="search-icon">
						<input className="input-field"
							type="text"
							placeholder="  Search by name..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>

				{/* Sorting dropdown */}
				<div style={{ paddingInline: "40px" }}>
					<label htmlFor="sort" className="sort-label">Sort by:</label>
					<select className="sort-select" id="sort" value={sortingMethod} onChange={handleSortChange}>
						<option value="ranking">Ranking</option>
						<option value="alphabetical">Alphabetical</option>
					</select>
				</div>
			</div>



			<div className="Container">
				{filteredMovies.map((movie) => (
					<div className="col-sm-6" key={movie._id}>
						<MovieCard
							movie={movie}
							handleAddToFavorites={handleAddToFavorites}
							favoriteMovies={favoriteMovies}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default Movies;

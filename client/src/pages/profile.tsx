import { useNavigate } from "react-router-dom";
import SerieCard from "../components/SerieCard";
import MovieCard from "../components/MovieCard";
import Header from "../components/Header"
import React, { useState, useEffect } from "react";
import "../css/movies.css";
import "../css/profile.css"
import axios from "axios";
import { config } from "../config";


/**
 * Componente de perfil do usuário.
 * @component
 * @returns {JSX.Element} O componente Profile.
 */
function Profile() {
	//Estados para armazenar listas de series e filmes favoritos
	const [series, setSeries] = useState([]);
	const [movies, setMovies] = useState([]);

	//Hook para navegacao
	const navigate = useNavigate();

	//Recupera informacoes da sessao
	const sessionID = sessionStorage.getItem('sessionID');
	const user = JSON.parse(sessionStorage.getItem('user'));

	// Efeito para carregar series favoritas do utilizador
	useEffect(() => {
		if (user) {
			setSeries(user.favoriteSeries);
		}
	}, []);

	// Efeito para carregar filmes favoritos do utilizador
	useEffect(() => {
		if (user) {
			setMovies(user.favoriteMovies);
		}
	}, []);

	/**
     * Função para adicionar séries aos favoritos do utilizador.
     * @async
     * @function
     * @param {Array} seriesToAdd Lista de séries a serem adicionadas aos favoritos.
     * @returns {Promise<void>}
     */
	const addSerieToFavorites = async (seriesToAdd) => {
		try {
			const response = await axios.post(`${config.serverAddress}/users/${user._id}/favoriteSeries`,
				{ series: seriesToAdd }
			);
			const updatedUser = response.data;
			sessionStorage.setItem('user', JSON.stringify(updatedUser));
			console.log(updatedUser);
		} catch (error) {
			console.error("Error adding series to favorites:", error);
		}
	};


	/**
     * Função para adicionar filmes aos favoritos do utilizador.
     * @async
     * @function
     * @param {Array} moviesToAdd Lista de filmes a serem adicionados aos favoritos.
     * @returns {Promise<void>}
     */
	const addMovieToFavorites = async (moviesToAdd) => 
	{
		try
		{
			const response = await axios.post(`${config.serverAddress}/users/${user._id}/favoriteMovies`,
				{ movies: moviesToAdd }
			);
			const updatedUser = response.data;
			sessionStorage.setItem('user', JSON.stringify(updatedUser));
			console.log(updatedUser);
		} catch (error) {
			console.error("Error adding movie to favorites:", error);
		}
	};

	/**
     * Lida com a adição ou remoção de filmes dos favoritos.
     * @param {Object} movie O filme a ser adicionado ou removido dos favoritos.
     */
	const handleAddMovieToFavorites = (movie) => {
		const isMovieInFavorites = movies.some((favMovie) => favMovie._id === movie._id);

		if (isMovieInFavorites) {
			// If the movie is already in favorites, remove it
			const updatedFavorites = movies.filter((favMovie) => favMovie._id !== movie._id);
			setMovies(updatedFavorites);
			addMovieToFavorites(updatedFavorites);
		} else {
			// If the movie is not in favorites, add it
			const updatedFavorites = [...movies, movie];
			setMovies(updatedFavorites);
			addMovieToFavorites(updatedFavorites);
		}
	};

	/**
     * Lida com a adição ou remoção de Series dos favoritos.
     * @param {Object} serie A serie a ser adicionado ou removido dos favoritos.
     */
	const handleAddSerieToFavorites = (serie) =>
	{
		const isSerieInFavorites = series.some((favSerie) => favSerie._id === serie._id);

		if (isSerieInFavorites)
		{
			// If the movie is already in favorites, remove it
			const updatedFavorites = series.filter((favSerie) => favSerie._id !== serie._id);
			setSeries(updatedFavorites);
			addSerieToFavorites(updatedFavorites);
		}
		else
		{
			// If the movie is not in favorites, add it
			const updatedFavorites = [...series, serie];
			setSeries(updatedFavorites);
			addSerieToFavorites(updatedFavorites);
		}
	};


	return (
		<div>
			<Header />
			<div className="profile-Text">
				<h1>Favorite Movies</h1>
			</div>
			<div className="Container">
				{movies.map((movie) => (
					<div className="col-sm-6" key={movie._id}>
						<MovieCard
							movie={movie}
							handleAddToFavorites={handleAddMovieToFavorites}
							favoriteMovies={movies}
						/>
					</div>
				))}
			</div>
			<div className="profile-Text">
				<h1>Favorite Series</h1>
			</div>
			<div className="Container">
				{series.map((serie) => (
					<div className="col-sm-6" key={serie._id}>
						<SerieCard serie={serie}
							handleAddToFavorites={handleAddSerieToFavorites}
							favoriteSeries={series}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default Profile;
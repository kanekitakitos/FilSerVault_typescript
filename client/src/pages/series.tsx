import React, { useState, useEffect } from "react";
import SerieCard from "../components/SerieCard";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"
import "../css/movies.css";
import "../css/movies-show-interface.css";
import axios from "axios";
import { config } from "../config";



/**
 * Componente de listagem de séries.
 * @component
 * @returns  O componente Series.
 */
function series() {
	const navigate = useNavigate();
	const [series, setSeries] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredSeries, setFilteredSeries] = useState([]);
	const [favoriteSeries, setFavoriteSeries] = useState([]);
	const [sortingMethod, setSortingMethod] = useState("ranking"); // Default sorting method
	const sessionID = sessionStorage.getItem('sessionID');
	const user = JSON.parse(sessionStorage.getItem('user'));

	//Busca series na montagem do componente
	useEffect(() => {
		getSeries();
	}, []);

	//Atualiza series filtradas com base no termo de pesquisa e metodo de ordenacao
	useEffect(() => {
		const filtradas = series
			.filter((serie) =>
				serie.title.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => {
				if (sortingMethod === "ranking") {
					return b.rating - a.rating;
				} else {
					return a.title.localeCompare(b.title);
				}
			});

		setFilteredSeries(filtradas);
	}, [searchTerm, series, sortingMethod]);

	//Carrega series favoritas do utilizador na carga da pagina
	useEffect(() => {
		if (user) {
			setFavoriteSeries(user.favoriteSeries);
		}
	}, []);

	/**
     * Função para buscar séries na API.
     * @async
     * @function
     * @returns {Promise<void>}
     */
	const getSeries = async () => {
		// Com axios
		try {
			const resposta = await axios.get(`${config.serverAddress}/series`);
			setSeries(resposta.data);
		}
		catch (erro) {
			console.log(erro);
		}
	}

	/**
     * Função para adicionar séries aos favoritos do utilizador.
     * @async
     * @function
     * @param {Array} seriesParaAdicionar Lista de séries a serem adicionadas aos favoritos.
     * @returns {Promise<void>}
     */
	const addSerieToFavorites = async (seriesParaAdicionar) => {
		// Com axios
		try {
			const resposta = await axios.post(`${config.serverAddress}/users/${user._id}/favoriteSeries`, { series: seriesParaAdicionar });
			const usuarioAtualizado = resposta.data;
			sessionStorage.setItem('user', JSON.stringify(usuarioAtualizado));
			console.log(usuarioAtualizado);
		} catch (erro) {
			console.error("Erro ao adicionar series aos favoritos:", erro);
		}
	};

	/**
     * Função para lidar com adição/remocao de séries dos favoritos.
     * @param {Object} serie A série a ser adicionada ou removida dos favoritos.
     */
	const handleAddToFavorites = (serie) => {
		const estaNaListaDeFavoritos = favoriteSeries.some((favSerie) => favSerie._id === serie._id);

		if (estaNaListaDeFavoritos) {
			//Se a serie de TV ja estiver nos favoritos, remova-a
			const favoritosAtualizados = favoriteSeries.filter((favSerie) => favSerie._id !== serie._id);
			setFavoriteSeries(favoritosAtualizados);
			addSerieToFavorites(favoritosAtualizados);
		} else {
			//Se a serie de TV nao estiver nos favoritos, adicione-a
			const favoritosAtualizados = [...favoriteSeries, serie];
			setFavoriteSeries(favoritosAtualizados);
			addSerieToFavorites(favoritosAtualizados);
		}
	};

	/**
     * Função para lidar com a mudança do método de ordenação.
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
				{filteredSeries.map((serie) => (
					<div className="col-sm-6" key={serie._id}>
						<SerieCard
							serie={serie}
							handleAddToFavorites={handleAddToFavorites}
							favoriteSeries={favoriteSeries}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default series;
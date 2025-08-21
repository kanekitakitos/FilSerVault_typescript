import React from "react";
import "../css/series.css"
import "../css/movies.css";


/**
 * Componente de cartão de série.
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.serie - Objeto da série a ser exibida.
 * @param {Function} props.handleAddToFavorites - Função para adicionar ou remover a série dos favoritos.
 * @param {Array} props.favoriteSeries - Lista de séries favoritas.
 * @returns O componente SerieCard.
 */
const SerieCard = ({ serie, handleAddToFavorites, favoriteSeries }) =>
{
    const isSerieInFavorites = Array.isArray(favoriteSeries) &&
        favoriteSeries.some((favSerie) => favSerie._id === serie._id);

    const sessionID = sessionStorage.getItem('sessionID');


    /**
     * Renderiza os botões de categorias.
     * @param {string} categories - String de categorias separadas por vírgula.
     * @returns {JSX.Element[]} Array de botões de categorias.
     */
    const renderCategories = (categories) =>
    {
        const categoryArray = categories.split(",");

        const categoryButtons = categoryArray.map((category, index) =>
        (
            <button key={index} className="transparent-button">
                {category.trim()}
            </button>
        ));

        return categoryButtons;
    };





    return (
        <div className="card">
            <div className="card-image">
                <img src={serie.image} />
            </div>

            <div className="card-body">
                <span className="card-title">{serie.title}</span>
                <p>
                    <span>{serie.year}</span>
                    <span>{serie.director}</span>
                </p>
                <p>
                    <span>{renderCategories(serie.category)}</span>
                </p>
                <span className="rating">{serie.rating + " ⭐"}</span>
                <p className="card-description">
                    {serie.description}
                </p>
                {/* Add to Favorites button */}

                {sessionID ?
                    <div>
                        <button
                            className={isSerieInFavorites ? 'onFavorites' : 'notOnFavorites'}
                            onClick={() => handleAddToFavorites(serie)}
                        >
                            {isSerieInFavorites ? "Remove from favorites ❌ " : "Add to favorites ⭐"}
                        </button>
                    </div> : <div></div>
                }
            </div>
        </div>
    );
}

export default SerieCard;
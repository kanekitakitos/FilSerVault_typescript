import React from "react"; //Usado para importar as ferramentas do REACT
import "../css/movies.css"; 



/**
 * Componente de cartão de filme.
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.movie - Objeto do filme a ser exibido.
 * @param {Function} props.handleAddToFavorites - Função para adicionar ou remover o filme dos favoritos.
 * @param {Array} props.favoriteMovies - Lista de filmes favoritos.
 * @returns O componente MovieCard.
 */
const MovieCard = ({ movie, handleAddToFavorites, favoriteMovies }) => {
    //Verifica se o filem esta na lista de favoritos
    const isMovieInFavorites = Array.isArray(favoriteMovies) && favoriteMovies.some(
        (favMovie) => favMovie._id === movie._id
    );

    const sessionID = sessionStorage.getItem('sessionID');

    /**
     * Renderiza os botões de categorias.
     * @param {string} categories - String de categorias separadas por vírgula.
     * @returns {JSX.Element[]} Array de botões de categorias.
     */
    const renderCategories = (categories) => {
        const categoryArray = categories.split(",");
    
        const categoryButtons = categoryArray.map((category,index) => (
          <button key={index} className="transparent-button">
            {category.trim()}
          </button>
        ));
    
        return categoryButtons;
    };

    return (
        <div className="card">
            <div className="card-image">
                <img src={movie.image} alt={`${movie.title} poster`} /> {/* Adiciona se a imagem demorar ou nao carregar, aparece o nome do filme */}
            </div>
            <div className="card-body">
                <span className="card-title">{movie.title}</span>
                <p>
                    <span>{movie.year}</span>
                    <span>{movie.director}</span>
                </p>
                <p>
                    <span> {renderCategories(movie.category)}</span>
                </p>
                <span className="rating">{movie.rating + " ⭐"}</span>
                <p className="card-description">
                    {movie.description}
                </p>
                {/* Add to Favorites button */}
                {/* <button className="favorites" onClick={() => handleAddToFavorites(movie)}> <--- ants era assim, agora tenho 2 variantes de estilo */}
                {sessionID ?
                    <div>
                        <button
                        className={isMovieInFavorites ? 'onFavorites' : 'notOnFavorites'}
                        onClick={() => handleAddToFavorites(movie)}
                        >
                            {isMovieInFavorites ? "Remove from favorites ❌ " : "Add to favorites ⭐"}
                        </button>
                    </div> :
                    <div></div>
                }
            </div>
        </div>
    );
}

export default MovieCard;
import React from "react";
import "../css/carousel.css";


/**
 * Componente de carrossel para exibir filmes e séries em destaque.
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.title - Título do carrossel.
 * @param {Array} props.movseries - Lista de filmes ou séries a serem exibidos.
 * @returns O componente Carousel.
 */
const Carousel = ({ title, movseries }) => {
    return (
        <div className="featured-movAndSer">
            <h2>{title}</h2>
            <div className="carousel">
                {movseries.map((movserie) => (
                    <div className="carousel-card" key={movserie._id}>
                        <img src={movserie.image} alt={movserie.title} />
                        <h3>{movserie.title}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Carousel;
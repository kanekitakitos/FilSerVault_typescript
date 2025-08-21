import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "../css/home.css";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import axios from 'axios';
import { config } from "../config";
import Message from "./message";

/**
 * Componente principal da página inicial.
 * @component
 * @returns O componente Home.
 */
function Home()
{
    // Recupera informações da sessão
    const sessionID = sessionStorage.getItem('sessionID');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate();

    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [featuredSeries, setFeaturedSeries] = useState([]);

    // Estado para mostrar a mensagem como overlay
    const [showMessage, setShowMessage] = useState(false);
    const [messageId, setMessageId] = useState<number | null>(null);

    // Fetch dos filmes e séries em destaque
    useEffect(() =>
	{
        getFeaturedItems();
    }, []);

    /**
     * Handle logout do estilo do header, em que defino a mensagem e o timer, e o que remove a sessão é a mensagem.
     */
    const handleLogout = () =>
	{
        setMessageId(3);
        setShowMessage(true);

        // Depois de 2.5 segundos, remove a mensagem
        setTimeout(() => {
            setShowMessage(false);
        }, 2500);
    };

    /**
     * Busca os filmes e séries em destaque do servidor.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    const getFeaturedItems = async () =>
	{
        try {
            const featuredMovies = await axios.get(`${config.serverAddress}/movies/featured`);
            const featuredSeries = await axios.get(`${config.serverAddress}/series/featured`);
            setFeaturedMovies(featuredMovies.data);
            setFeaturedSeries(featuredSeries.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="home">
            <div className="bground"></div>
            <Header />
            {/* Se showMessage for true, mostra a mensagem */}
            {showMessage && <Message id={messageId} />}
            <div className="content">
                <div className="welcome-text">
                    <h1>Welcome to the FilSerVault Favourite Manager!</h1>
                    <p>Here you can find information about movies and Series, and select your favorites!</p>
                </div>
                {sessionID ? (
                    <div>
                        <h2>Welcome, {user.username}!</h2>
                        <button onClick={() => navigate("/profile")}>Profile</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <h2>Login to save your favorite movies and Series!</h2>
                        <button onClick={() => navigate("/login")}>Login</button>
                        <button onClick={() => navigate("/register")}>Register</button>
                    </div>
                )}

                {/* Featured Movies - Carousel */}
                <Carousel title="Featured Movies" movseries={featuredMovies} />

                {/* Featured Series - Carousel */}
                <Carousel title="Featured Series" movseries={featuredSeries} />
            </div>
        </div>
    );
}

export default Home;
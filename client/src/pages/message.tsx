import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import "../css/message.css";





/**
 * Componente de mensagem que exibe uma mensagem temporária e redireciona para a página inicial.
 * @component
 * @param {Object} props - Propriedades do componente.
 * @param {number | null} props.id - ID da mensagem para determinar o título e a descrição.
 * @returns  O componente Message.
 */
function Message({ id }: { id: number | null }) {
    const navigate = useNavigate();
    const [typedMessage, setTypedMessage] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);



    /**
     * Obtém o título da mensagem com base no ID.
     * @returns {string} O título da mensagem.
     */
    const getTitle = () => {
        if (id === 1) return "Utilizador Registado!";
        if (id === 2) return "Login Efetuado!";
        if (id === 3) return "Sessão Terminada!";
        return "Informação";
    };


    /**
     * Obtém a descrição da mensagem com base no ID.
     * @returns {string} A descrição da mensagem.
     */
    const getDescription = () => {
        if (id === 1) return "Obrigado! Agora pode fazer login, ver filmes e séries e adicionar aos favoritos.";
        if (id === 2) return "Bem-vindo(a) de volta, " + JSON.parse(sessionStorage.getItem("user")).username + "!";
        if (id === 3) {
            logout();
            return "Obrigado por usar a nossa plataforma. Até à próxima!";
        }
        return "Algo correu mal, nao é suposto ver esta mensagem.";
    };

    /**
     * Realiza o logout do usuário, removendo os dados da sessão.
     */
    const logout = () => {
        sessionStorage.removeItem("sessionID");
        sessionStorage.removeItem("user");
    };

    useEffect(() => {
        const description = getDescription();
        const typingTimer = setInterval(() => {
            if (currentIndex < description.length) {
                setTypedMessage((prevTypedMessage) => prevTypedMessage + description[currentIndex]);
                setCurrentIndex((prevIndex) => prevIndex + 1);
            }
        }, 30); // Reduced interval for faster typing

        // Redirect to the home page after 2 seconds
        setTimeout(() => {
            clearInterval(typingTimer);
            navigate("/");
        }, 2500);

        // Cleanup interval on component unmount
        return () => clearInterval(typingTimer);
    }, [id, navigate, currentIndex]);

    return createPortal(
        <div className="message-overlay">
            <div className="message-box">
                <h1 className="message-title">{getTitle()}</h1>
                <p className="message-description">{typedMessage}</p>
            </div>
        </div>,
        document.body // para renderizar diretamente no body
    );
}

export default Message;

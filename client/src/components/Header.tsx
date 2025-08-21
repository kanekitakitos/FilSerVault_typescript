import React, { useState } from "react";
import "../css/header.css";
import Message from "../pages/message";


/**
 * Componente de cabeçalho que exibe links de navegação e gerencia o logout.
 * @component
 * @returns O componente Header.
 */
const Header = () =>
{
    const sessionID = sessionStorage.getItem('sessionID');
    // Estados para exibir mensagem como overlay
    const [showMessage, setShowMessage] = useState(false);
    const [messageId, setMessageId] = useState<number | null>(null);


    /**
     * Handle logout do usuário.
     */
    const handleLogout = () =>
    {
        setMessageId(3);
        setShowMessage(true);

        //Depois de 2.5 segundos, remove a mensagem
        setTimeout(() => {
            setShowMessage(false);
        }, 2500);
    };


    return (
        <div className="header">
             {/* Se showMessage for true, mostra a mensagem */}
            {showMessage && (<Message id={messageId} />)}
            <a href="#" className="logo">FilSerVault</a>
            <nav className="nav-links-header">
                <a href="/">Home</a>
                {sessionID ? (
                    <>
                        <a href="/profile">Profile</a>
                        <a onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</a>
                    </>
                ) : (
                    <>
                        <a href="/login">Login</a>
                        <a href="/register">Register</a>
                    </>
                )}
                <a href="/movies">Movies</a>
                <a href="/series">Series</a>
            </nav>
        </div>
    );
};


export default Header;
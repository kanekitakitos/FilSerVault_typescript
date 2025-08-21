import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import '../css/style_login_register.css';
import axios from 'axios';
import { config } from "../config";
//Para mostrar a mensagem em vez de ir para uma outra pagina, tenho de importar o componente Message
import Message from './message';

/**
 * Componente de login.
 * @component
 * @returns O componente Login.
 */
function Login()
{
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    // Estados para gerir o erro de user nao existe e password errada
    const [userError, setUserError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    //Estados para mostrar a message como overlay e para armazenar o id da mensagem
    const [showMessage, setShowMessage] = useState(false);
    const [messageId, setMessageId] = useState<number | null>(null);

    /**
     * Handle submit do formulário de login.
     * @param  {event} Evento de submit do formulário.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) =>
    {
        event.preventDefault();

        setUserError("");
        setPasswordError("");
        let hasError = false;

        try {
            const response = await axios.post(`${config.serverAddress}/login`, { 
                username: name,
                password: password,
            });

            if (response.status === 200) {
                const { user, token } = response.data;
                sessionStorage.setItem('sessionID', token);
                sessionStorage.setItem('user', JSON.stringify(user));
                //navigate("/message/2");
                setMessageId(2);
                setShowMessage(true);
            }
        }
        catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 404) {
                    setUserError("User does not exist");
                    hasError = true;
                } else if (status === 401) {
                    setPasswordError("Wrong password");
                    hasError = true;
                } else {
                    console.error("Error logging in:", error);
                }
            } else {
                console.error("Error logging in:", error);
            }
        }
    };

    return (
        <div>
            <Header />
            {/* Se showMessage for true, mostra a mensagem */}
            {showMessage && <Message id={messageId} />}
            <div className="reg-login-container">

                <div className="login-register-title-and-top-right-buttons">
                    <h1>Login</h1>
                    <div>
                        <button onClick={() => navigate("/")}>Home</button>
                        <button onClick={() => navigate("/register")}>Register</button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="user-box">
                        <label htmlFor="username">Username</label>
                        <input type="username" name="username"
                            id="username" value={name} onChange={(event) => {
                                setName(event.target.value)
                                setUserError("");
                            }} />
                        <p className="error-message">{userError}</p>
                    </div>

                    <div className="user-box">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password"
                            id="password" value={password} onChange={(event) => {
                                setPassword(event.target.value)
                                setPasswordError("");
                                }} />
                        <p className="error-message">{passwordError}</p>
                    </div>

                    <button><span></span>
                        <span></span>
                        <span></span>
                        <span></span>Login</button>
                </form>

                
            </div>

        </div>
    );
}

export default Login;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import '../css/style_login_register.css';
import axios from 'axios';
import { config } from "../config";
import Message from './message';



/**
 * Componente de registro de usuário.
 * @component
 * @returns O componente Register.
 */
function Register()
{
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // Estados para gerir os erros de cada campo
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    // Estados para exibir mensagem como overlay
    const [showMessage, setShowMessage] = useState(false);
    const [messageId, setMessageId] = useState<number | null>(null);


    /**
     * Handle submit do formulário de registro.
     * @param {React.FormEvent<HTMLFormElement>} event Evento de submit do formulário.
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasError = false;

        // Verifica se o username está vazio
        if (name.trim() === "") {
            setUsernameError("Username cannot be empty");
            hasError = true;
        } else {
            setUsernameError("");
        }

        // Verifica se a password está vazia
        if (password.trim() === "") {
            setPasswordError("Password cannot be empty");
            hasError = true;
        } else {
            setPasswordError("");
        }

        // Verifica se a confirmação da password está correta
        if (password !== confirmPassword) {
            setConfirmPasswordError("Password and confirm password do not match");
            hasError = true;
        } else {
            setConfirmPasswordError("");
        }

        // Se houver erros, interrompe o envio do formulário
        if (hasError) return;

        // Cria o objeto do utilizador
        const user = {
            username: name,
            password: password
        };

        // com axios
        try {
            const response = await axios.post(`${config.serverAddress}/register`, user, {
                headers: {
                    "Content-Type": "application/json"
                }
            });


            //Verifica se o registo foi bem sucedido
            if (response.status === 200) {
                setMessageId(1);
                setShowMessage(true);
            } else {
                //Se o resgisto falhar
                console.error('Registation failed');
            }
        }
        catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 409) {
                    setUsernameError("Username already exists");
                } else {
                    console.error("Error registering:", error);
                }
            } else {
                console.error("Error registering:", error);
            }
        }

    }

    return (
        <div>
            <Header />
            {showMessage && <Message id={messageId} />}
            <div className="reg-login-container">
                <div className="login-register-title-and-top-right-buttons">
                    <h1>Register</h1>
                    <div>
                        <button onClick={() => navigate("/")}>Home</button>
                        <button onClick={() => navigate("/login")}>Login</button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="user-box">
                        <label htmlFor="username">Username</label>
                        <input className="form-control" type="username" name="username"
                            id="username" value={name} onChange={(event) => {
                                setName(event.target.value) //cada vez que se escreve altera-se o estado para o valor que no final vai se submeter
                                setUsernameError("") //quando se escreve, o erro desaparece e so aparece quando se submete, caso esteja errado
                            }} />
                            {usernameError && <div className="error-message">{usernameError}</div>}
                    </div>

                    <div className="user-box">
                        <label htmlFor="password">Password</label>
                        <input className="form-control" type="password" name="password"
                            id="password" value={password} onChange={(event) => {
                                setPassword(event.target.value)
                                setPasswordError("")
                                setConfirmPasswordError("")    
                            }} />
                            {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                    <div className="user-box">
                        <label htmlFor="password">Password Confirmation</label>
                        <input className="form-control" type="password" name="confirmPassword"
                            id="confirmPassword" value={confirmPassword} onChange={(event) => {
                                setConfirmPassword(event.target.value)
                                setConfirmPasswordError("")
                                setPasswordError("")
                                }} />
                            {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
                    </div>

                    <button><span></span>
                        <span></span>
                        <span></span>
                        <span></span>Register</button>
                </form>


            </div>
        </div>
    )
}

export default Register
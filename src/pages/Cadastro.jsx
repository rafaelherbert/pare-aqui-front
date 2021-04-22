import { useState } from 'react';
import axios from 'axios';
import UserManager from '../UserManager.js';
import { Link } from 'react-router-dom';

export default function Cadastro () {

    const [userName, setUserName]       = useState("");
    const [userEmail, setUserEmail]     = useState("");
    const [pass, setPass]               = useState("");
    const [passConfirm, setPassConfirm] = useState("");
    const [error, setError]             = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pass !== passConfirm) {
            setError("As senhas não coincidem.");
            return;
        } else {
            const response = await axios.post("https://pare-aqui.herokuapp.com/usuario", {
                "email" : userEmail,
                "nome"  : userName,
                "senha" : pass
            });

            if (response.data.success) {
                UserManager.setUser(response.data.data);
                window.location.href = "/";
                return;
            } else {
                setError(response.data.message);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                {error}
                <div className="mb-3">
                    <label htmlFor="user" className="form-label">Email do usuário</label>
                    <input type="email" className="form-control" id="user" placeholder="name@example.com" onChange={(e) => {
                        setUserEmail(e.target.value);
                    }}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="user" className="form-label">Nome do usuário</label>
                    <input type="text" className="form-control" id="user" placeholder="name@example.com" onChange={(e) => {
                        setUserName(e.target.value);
                    }}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="pass" className="form-label">Senha</label>
                    <input type="password" className="form-control" id="pass" onChange={(e) => {
                        setPass(e.target.value);
                    }}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="pass" className="form-label">Confirmar Senha</label>
                    <input type="password" className="form-control" id="pass" onChange={(e) => {
                        setPassConfirm(e.target.value);
                    }}/>
                </div>
                
                <p>Já possui uma conta? <Link to="/login">Faça o Login!</Link></p>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </>
    );
};
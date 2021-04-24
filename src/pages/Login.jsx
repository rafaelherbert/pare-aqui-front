import { useState } from 'react';
import axios from 'axios';
import UserManager from '../UserManager.js';
import { Link } from 'react-router-dom';

export default function Login () {

    const [userEmail, setUserEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post("https://pare-aqui.herokuapp.com/usuario/login", {
            "email" : userEmail,
            "senha" : pass
        });

        if (response.data.success) {
            UserManager.setUser(response.data.data);
            window.location.href = "/home";
            return;
        } else {
            setError(response.data.message);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="user" className="form-label">Usuário</label>
                    <input type="email" className="form-control" id="user" placeholder="name@example.com" onChange={(e) => {
                        setUserEmail(e.target.value);
                    }}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="pass" className="form-label">Senha</label>
                    <input type="password" className="form-control" id="pass" onChange={(e) => {
                        setPass(e.target.value);
                    }}/>
                </div>
                <p>Ainda não tem uma conta? <Link to="/register">cadastre-se!</Link></p>

                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        </>
    );
};
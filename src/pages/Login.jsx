import UserManager from '../UserManager.js';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import api from 'api/index.js';
import Loading from 'components/Loading.jsx';
import ErrorAlert from 'components/ErrorAlert.jsx';

export default function Login() {

    const [userEmail, setUserEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const response = await api.post("/usuario/login", {
                "email": userEmail,
                "senha": pass
            });
            setLoading(false);
            if (response.data.success) {
                setError("");
                UserManager.setUser(response.data.data);
                window.location.href = "/home";
                return;
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setLoading(false);
            console.log(err);
            setError("Sistema temporariamente fora do ar, por favor tente novamente mais tarde!");
        }

    };

    const showPageContent = () => {
        if (loading) {
            return (
                <Loading />
            );
        } else {
            return (
                <>
                    <ErrorAlert errorMessage={error} />
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="user" className="form-label">Seu E-Mail</label>
                            <input type="email" required autoComplete="username" value={userEmail} className="form-control" id="user" placeholder="name@example.com" onChange={(e) => {
                                setUserEmail(e.target.value);
                            }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pass" className="form-label">Sua Senha</label>
                            <input type="password" autoComplete="current-password" value={pass} className="form-control" id="pass" onChange={(e) => {
                                setPass(e.target.value);
                            }} />
                        </div>
                        <p>Ainda não tem uma conta? <Link to="/register">cadastre-se!</Link></p>

                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </form>
                </>
            );
        }
    };

    return showPageContent();
};
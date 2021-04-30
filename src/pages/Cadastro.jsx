import React, { useState } from 'react';
import UserManager from '../UserManager.js';
import { Link } from 'react-router-dom';
import api from 'api/index.js';
import Loading from 'components/Loading.jsx';
import Alert from 'components/Alert.jsx';

export default function Cadastro() {

    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [pass, setPass] = useState("");
    const [passConfirm, setPassConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pass !== passConfirm) {
            setError("As senhas não coincidem.");
            return;
        } else {
            try {
                setLoading(true);

                const response = await api.post("/usuario", {
                    "email": userEmail,
                    "nome": userName,
                    "senha": pass
                });

                setLoading(false);

                if (response.data.success) {
                    setError("");
                    UserManager.setUser(response.data.data);
                    window.location.href = "/";
                    return;
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setLoading(false);
                console.log(err);
                setError("Sistema temporariamente fora do ar, por favor tente novamente mais tarde!");
            }

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
                    <form onSubmit={handleSubmit}>
                        <Alert message={error} />
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Seu E-Mail</label>
                            <input required type="email" className="form-control" value={userEmail} id="email" placeholder="name@example.com" onChange={(e) => {
                                setUserEmail(e.target.value);
                            }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Seu Nome</label>
                            <input required type="text" className="form-control" value={userName} autoComplete="username" id="nome" onChange={(e) => {
                                setUserName(e.target.value);
                            }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pass" className="form-label">Senha</label>
                            <input required type="password" autoComplete="new-password" value={pass} className="form-control" id="pass" onChange={(e) => {
                                setPass(e.target.value);
                            }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="passConfirm" className="form-label">Confirmar Senha</label>
                            <input type="password" autoComplete="new-password" className="form-control" value={passConfirm} id="passConfirm" onChange={(e) => {
                                setPassConfirm(e.target.value);
                            }} />
                        </div>

                        <p>Já possui uma conta? <Link to="/login">Faça o Login!</Link></p>
                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </form>
                </>
            );
        }
    };

    return showPageContent();
};
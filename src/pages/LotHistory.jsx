import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserManager from "../UserManager";

export default function LotHistory() {
    const [lots, setLots] = useState([]);

    const getLots = async () => {
        try {
            const user = UserManager.getUser();
            const res = await axios.get(`https://pare-aqui.herokuapp.com/vaga/agendamento/${user.id}`);
            const res2 = await axios.get(`https://pare-aqui.herokuapp.com/vaga/ocupacao/${user.id}`);
            const agendamento = res.data.data ? res.data.data : [];
            const ocupacao = res2.data.data ? res2.data.data : [];
            setLots([...agendamento, ...ocupacao]);
        } catch (error) {
            console.log("Error", error);
        }
    };

    useEffect(() => {
        getLots();
    }, []);

    return (
        <div>
            <div className="d-grid gap-2">
                <Link className="btn btn-primary" to="/">
                    Voltar
                </Link>
                <a
                    className="btn btn-primary"
                    data-bs-toggle="collapse"
                    href="#collapseExample"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                >
                    Exibir filtros
                </a>
            </div>
            {lots.length > 0 &&
                lots.map((lot, i) => {
                    const location = `${lot.rua},${lot.numero},${lot.cidade},${lot.estado},${lot.pais}`;
                    const src = `https://maps.google.com/maps?width=100%&amp;height=400&amp;hl=pt-br&amp;q=${location}&amp;ie=UTF8&amp;t=&amp;z=16&amp;iwloc=A&amp;output=embed"`;
                    const ifr = `<iframe width="100%" height="200" src="${src}" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`;
                    return (
                        <div className="card mt-4" key={i}>
                            <div dangerouslySetInnerHTML={{ __html: ifr }} />
                            <div className="card-body">
                                <p className="card-text">
                                    <div>
                                        {lot.rua}, {lot.numero} - {lot.bairro},{" "}
                                        {lot.estado}
                                    </div>
                                    <div>Tipo: {lot.vaga_tipo}</div>
                                    <div>Tamanho: {lot.vaga_tamanho}</div>
                                </p>
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => {
                                        console.log(lot.vaga_id);
                                    }}
                                >
                                    Agendar Vaga
                                </button>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

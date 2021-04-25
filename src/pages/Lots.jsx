import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UserManager from "../UserManager";

export default function Lots() {
    const [lots, setLots] = useState([]);
    const [typeFilter, setTypeFilter] = useState("");
    const [sizeFilter, setSizeFilter] = useState("");
    const [maxPrice, setMaxPrice] = useState(0);
    const [lotScheduleDate, setLotScheduleDate] = useState(null);
    const [lotScheduleIndex, setLotScheduleIndex] = useState(null);
    const [lotScheduleFeedback, setLotScheduleFeedback] = useState("");

    const getLots = async () => {
        try {
            const filters = [];

            if (maxPrice) filters.push(`menor_preco=0&maior_preco${maxPrice}`);
            if (typeFilter) filters.push(`tipos_escolhidos=${typeFilter}`);
            if (sizeFilter) filters.push(`tamanhos_escolhidos=${sizeFilter}`);

            const res = await axios.get(
                `https://pare-aqui.herokuapp.com/vaga?${encodeURI(
                    filters.join("&")
                )}`
            );
            setLots(res.data.data);
            console.log(
                `https://pare-aqui.herokuapp.com/vaga?${encodeURI(
                    filters.join("&")
                )}`
            );
        } catch (error) {
            console.log("Error", error);
        }
    };

    useEffect(() => {
        getLots();
        const myOffcanvas = document.getElementById("offcanvasRight");
        const listener = function (e) {
            setLotScheduleIndex(null);
            setLotScheduleDate(null);
            setLotScheduleFeedback("");
        };

        myOffcanvas.addEventListener("hide.bs.offcanvas", listener);
        return () => {
            myOffcanvas.removeEventListener("hide.bs.offcanvas", listener);
        };
    }, []);

    const scheduleLot = async (e) => {
        e.preventDefault();
        const user = UserManager.getUser();
        console.log(user, lotScheduleIndex, lotScheduleDate);
        try {
            const res = await axios.post(
                `https://pare-aqui.herokuapp.com/vaga/agendamento?`,
                {
                    vaga_id: lotScheduleIndex,
                    momento: `${lotScheduleDate} 00:00:00`,
                    usuario_id: user.id,
                }
            );

            if (res.data.success) {
                setLotScheduleFeedback("Vaga agendada com sucesso.");
            }
        } catch (error) {
            console.log("ERROR", error);
        }
    };

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
            <div className="collapse mt-3" id="collapseExample">
                <div className="card card-body">
                    <label htmlFor="customRange2" className="form-label">
                        Preço máximo:{" "}
                        {maxPrice === 0 ? "Ilimitado" : `R$ ${maxPrice}`}
                    </label>
                    <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="1000"
                        step="0.01"
                        value={maxPrice}
                        id="customRange2"
                        onChange={(e) => {
                            setMaxPrice(e.target.value);
                        }}
                    />

                    <label htmlFor="lotType" className="form-label mt-2">
                        Tipo de Vaga
                    </label>
                    <select
                        id="lotType"
                        className="form-select"
                        aria-label="Default select example"
                        multiple
                        onChange={(e) =>
                            setTypeFilter(
                                Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                ).join(",")
                            )
                        }
                    >
                        <option value="31">Padrão</option>
                        <option value="32">Fila</option>
                        <option value="33">Espinha de Peixe</option>
                    </select>

                    <label htmlFor="lotSize" className="form-label mt-3">
                        Tamanho da Vaga
                    </label>
                    <select
                        id="lotSize"
                        className="form-select"
                        aria-label="Default select example"
                        multiple
                        onChange={(e) =>
                            setSizeFilter(
                                Array.from(
                                    e.target.selectedOptions,
                                    (option) => option.value
                                ).join(",")
                            )
                        }
                    >
                        <option value="35">Moto</option>
                        <option value="36">Ônibus</option>
                        <option value="37">Veículo Pequeno</option>
                        <option value="38">Veículo Médio</option>
                        <option value="39">Veículo Grande</option>
                    </select>

                    <div
                        className="btn btn-primary mt-3"
                        onClick={() => getLots()}
                    >
                        Aplicar filtros
                    </div>
                </div>
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
                                    data-bs-toggle="offcanvas"
                                    data-bs-target="#offcanvasRight"
                                    aria-controls="offcanvasRight"
                                    onClick={() => {
                                        console.log(lot.vaga_id);
                                        setLotScheduleIndex(lot.vaga_id);
                                    }}
                                >
                                    Agendar Vaga
                                </button>
                            </div>
                        </div>
                    );
                })}

            <div
                className="offcanvas offcanvas-end"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="offcanvasRightLabel">Agendar Vaga</h5>
                    <button
                        type="button"
                        className="btn-close text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {
                        lotScheduleFeedback &&
                        <div className="alert alert-success">
                            {lotScheduleFeedback}
                        </div>
                    }
                    <form onSubmit={scheduleLot}>
                        <label htmlFor="customRange2" className="form-label">
                            Data do agendamento
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="customRange2"
                            onChange={(e) => {
                                setLotScheduleDate(e.target.value);
                            }}
                            required
                        />
                        <button type="submit" className="btn btn-primary mt-3">
                            Agendar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

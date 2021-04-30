import api from "api";
import Alert from "components/Alert";
import Loading from "components/Loading";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserManager from "../UserManager";

export default function Lots() {
    const [lots, setLots] = useState([]);
    const [typeFilter, setTypeFilter] = useState("");
    const [sizeFilter, setSizeFilter] = useState("");
    const [maxPrice, setMaxPrice] = useState(0);
    const [lotScheduleDate, setLotScheduleDate] = useState(null);
    const [lotScheduleIndex, setLotScheduleIndex] = useState(null);
    const [lotScheduleFeedback, setLotScheduleFeedback] = useState("");
    const [lotScheduleFeedbackType, setLotScheduleFeedbackType] = useState("danger");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const getLots = async () => {
        try {
            const filters = [];

            if (maxPrice) filters.push(`menor_preco=0&maior_preco${maxPrice}`);
            if (typeFilter) filters.push(`tipos_escolhidos=${typeFilter}`);
            if (sizeFilter) filters.push(`tamanhos_escolhidos=${sizeFilter}`);

            setLoading(true);
            const response = await api.get(`/vaga?${encodeURI(filters.join("&"))}`);
            setLoading(false);

            if (response.data.success) {
                setError("");
                setLots(response.data.data);
            } else {
                setError(response.data.message);
                setLots([]);
            }

        } catch (error) {
            setLoading(false);
            setError("Sistema temporariamente fora do ar, por favor tente novamente mais tarde!");
            console.log(error);
        }
    };

    useEffect(() => {
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
        try {
            const user = UserManager.getUser();

            setLoading(true);
            const res = await api.post(
                `/vaga/agendamento?`,
                {
                    vaga_id: lotScheduleIndex,
                    momento: `${lotScheduleDate}:00`,
                    usuario_id: user.id,
                }
            );
            setLoading(false);

            setLotScheduleFeedback(res.data.message);

            if (res.data.success) {
                setLotScheduleFeedbackType("success");
            } else {
                setLotScheduleFeedbackType("danger");
            }
        } catch (error) {
            setLoading(false);
            setError("Sistema temporariamente fora do ar, por favor tente novamente mais tarde!");
            console.log(error);
        }
    };

    const filterBox = () => {
        return (
            <div className="my-3" id="filtersBox">
                <div className="card card-body">
                    <h5 className="card-title">Filtros</h5>

                    <div className="row">
                        <div className="col-md-4 mt-3">
                            <label htmlFor="maxPrice" className="form-label">
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
                                id="maxPrice"
                                onChange={(e) => {
                                    setMaxPrice(parseFloat(e.target.value));
                                }}
                            />
                        </div>

                        <div className="col-md-4 mt-3">
                            <label htmlFor="lotType" className="form-label">
                                Tipo de Vaga
                            </label>
                            <select
                                id="lotType"
                                className="form-select"
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
                        </div>

                        <div className="col-md-4 mt-3">
                            <label htmlFor="lotSize" className="form-label">
                                Tamanho da Vaga
                            </label>
                            <select
                                id="lotSize"
                                className="form-select"
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
                        </div>
                    </div>

                    <button
                        className="btn btn-primary mt-3"
                        onClick={() => getLots()}
                        disabled={loading ? true : false}
                    >
                        Aplicar filtros
                    </button>
                </div>
            </div>
        );
    };

    const showLots = () => {
        if (loading) {
            return (
                <Loading />
            );
        } else {
            if (lots.length > 0) {
                return lots.map((lot, i) => {
                    const location = `${lot.rua},${lot.numero},${lot.cidade},${lot.estado},${lot.pais}`;
                    const src = `https://maps.google.com/maps?width=100%&amp;height=400&amp;hl=pt-br&amp;q=${location}&amp;ie=UTF8&amp;t=&amp;z=16&amp;iwloc=A&amp;output=embed"`;
                    const ifr = `<iframe width="100%" height="200" src="${src}" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>`;
                    return (
                        <div className="col-md-4">
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
                                        <div>Preço: R${lot.vaga_preco}</div>
                                        <button
                                            className="btn btn-primary mt-3"
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

                                    </p>
                                </div>
                            </div>
                        </div>

                    );
                });
            } else {
                return null;
            }
        }
    };

    const sideBarRightScheduler = () => {
        return (
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
                    <Alert message={lotScheduleFeedback} type={lotScheduleFeedbackType} />
                    <form onSubmit={scheduleLot}>
                        <label htmlFor="scheduleDate" className="form-label">
                            Data do agendamento
                        </label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="scheduleDate"
                            placeholder="YYYY-MM-DD HH:mm:SS"
                            onChange={(e) => {
                                setLotScheduleDate(e.target.value.replace("T", " "));
                            }}
                            required
                        />
                        <button type="submit" className="btn btn-primary mt-3">
                            Agendar
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    const showPageContent = () => {
        return (
            <>
                <div className="d-grid gap-2">
                    <Link className="btn btn-primary" to="/">
                        Voltar
                    </Link>
                </div>
                {filterBox()}
                <Alert message={error} />
                <div className="row">
                    {showLots()}
                </div>
                {sideBarRightScheduler()}
            </>
        );
    };

    return showPageContent();
}

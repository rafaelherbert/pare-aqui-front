import api from "api";
import Alert from "components/Alert";
import Loading from "components/Loading";
import React, { useEffect, useState } from "react";
import UserManager from "../UserManager";

export default function Lots() {
    const [lots, setLots] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);
    const [sizeFilter, setSizeFilter] = useState([]);
    const [maxPrice, setMaxPrice] = useState(0);
    const [lotScheduleDate, setLotScheduleDate] = useState("");
    const [lotScheduleIndex, setLotScheduleIndex] = useState(null);
    const [lotScheduleFeedback, setLotScheduleFeedback] = useState("");
    const [lotScheduleFeedbackType, setLotScheduleFeedbackType] = useState("danger");
    const [lotOnlyParking, setLotOnlyParking] = useState(false);
    const [lotWithoutAccidents, setLotWithoutAccidents] = useState(false);
    const [lotWithoutFlanelinha, setLotWithoutFlanelinha] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [maxPriceFilter, setMaxPriceFilter] = useState(100);
    const [typesFilter, setTypesFilter] = useState([]);
    const [sizesFilter, setSizesFilter] = useState([]);

    const populateFilters = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/utils/filtro-vagas`);
            if (response.data.success) {
                setMaxPriceFilter(response.data.data.precoMaximo);
                setTypesFilter(response.data.data.vagaTipos);
                setSizesFilter(response.data.data.vagaTamanhos);
                setLots(response.data.data);
            } else {
                setError(response.data.message);
                setMaxPriceFilter(100);
                setTypesFilter([]);
                setSizesFilter([]);
            }
            setLoading(false);
        } catch (error) {
            setMaxPriceFilter(100);
            setTypesFilter([]);
            setSizesFilter([]);
            setLoading(false);
            setError("Sistema temporariamente fora do ar, por favor tente novamente mais tarde!");
            console.log(error);
        }
    };

    const getLots = async () => {
        try {
            const filters = [];

            if (maxPrice) filters.push(`menor_preco=0&maior_preco=${maxPrice}`);
            if (typeFilter.length !== 0) filters.push(`tipos_escolhidos=${typeFilter.join(',')}`);
            if (sizeFilter.length !== 0) filters.push(`tamanhos_escolhidos=${sizeFilter.join(',')}`);
            if (lotOnlyParking) filters.push(`estacionamento=1`);
            if (lotWithoutAccidents) filters.push(`sem_acidentes=1`);
            if (lotWithoutFlanelinha) filters.push(`sem_flanelinha=1`);

            setLoading(true);
            const response = await api.get(`/vaga?${encodeURI(filters.join("&"))}`);

            if (response.data.success) {
                setError("");
                setLots(response.data.data);
            } else {
                setError(response.data.message);
                setLots([]);
            }

            setLoading(false);

        } catch (error) {
            setLots([]);
            setLoading(false);
            setError("Sistema temporariamente fora do ar, por favor tente novamente mais tarde!");
            console.log(error);
        }
    };

    useEffect(() => {
        populateFilters();

        const myOffcanvas = document.getElementById("offcanvasRight");
        const listener = function (e) {
            setLotScheduleIndex(null);
            setLotScheduleDate("");
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
                    momento: `${lotScheduleDate.replace('T', ' ')}:00`,
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
        if (!loading) {
            return (
                <div className="my-3" id="filtersBox">
                    <div className="card card-body">
                        <h5 className="card-title">Filtros</h5>

                        <div className="row">
                            <div className="col-md-4 mt-3">
                                <label htmlFor="maxPrice" className="form-label">
                                    Pre??o m??ximo:{" " + (maxPrice === 0 ? "Ilimitado" : `R$ ${maxPrice}`)}
                                </label>
                                <input
                                    type="range"
                                    className="form-range"
                                    min="0"
                                    max={maxPriceFilter}
                                    step="0.01"
                                    value={maxPrice}
                                    id="maxPrice"
                                    onChange={(e) => {
                                        setMaxPrice(parseFloat(e.target.value));
                                    }}
                                />
                                <label className="form-check-label" htmlFor="onlyPrivateParking">
                                    <input className="form-check-input" value="1" checked={lotOnlyParking ? true : false} type="checkbox" id="onlyPrivateParking" onChange={(e) => {
                                        setLotOnlyParking(e.target.checked);
                                    }} />&nbsp;Apenas Estacionamentos Privados
                                </label>
                                <label className="form-check-label d-none" htmlFor="withoutAccidents">
                                    <input className="form-check-input" value="1" checked={lotWithoutAccidents ? true : false} type="checkbox" id="withoutAccidents" onChange={(e) => {
                                        setLotWithoutAccidents(e.target.checked);
                                    }} />&nbsp;Sem Hist??rico de Acidentes
                                </label>
                                <label className="form-check-label d-none" htmlFor="withoutFlanelinhas">
                                    <input className="form-check-input" value="1" checked={lotWithoutFlanelinha ? true : false} type="checkbox" id="withoutFlanelinhas" onChange={(e) => {
                                        setLotWithoutFlanelinha(e.target.checked);
                                    }} />&nbsp;Sem Flanelinha
                                </label>
                            </div>

                            <div className="col-md-4 mt-3">
                                <label htmlFor="lotType" className="form-label">
                                    Tipo de Vaga
                                </label>
                                <select
                                    id="lotType"
                                    className="form-select"
                                    multiple
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(
                                            Array.from(
                                                e.target.selectedOptions,
                                                (option) => option.value
                                            )
                                        )
                                    }
                                >
                                    {typesFilter.map((type) => {
                                        return (
                                            <option value={type.id} key={type.id}>{type.tipo}</option>
                                        );
                                    })}
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
                                    value={sizeFilter}
                                    onChange={(e) =>
                                        setSizeFilter(
                                            Array.from(
                                                e.target.selectedOptions,
                                                (option) => option.value
                                            )
                                        )
                                    }
                                >
                                    {sizesFilter.map((size) => {
                                        return (
                                            <option value={size.id} key={size.id}>{size.tamanho}</option>
                                        );
                                    })}
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
        }
    };

    const showLots = () => {
        if (loading && lotScheduleDate === "") {
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
                        <div className="col-md-4" key={i}>
                            <div className="card mt-4">
                                <div dangerouslySetInnerHTML={{ __html: ifr }} />
                                <div className="card-body">
                                    <span>
                                        {lot.rua}, {lot.numero} - {lot.bairro},{" "}
                                        {lot.estado}
                                    </span>
                                    <div>Tipo: {lot.vaga_tipo}</div>
                                    <div>Tamanho: {lot.vaga_tamanho}</div>
                                    {lot.estacionamento !== 0 ? (
                                        <span className="badge bg-success">Estacionamento Privado</span>
                                    ) : (
                                        <span className="badge bg-danger">Vaga de Rua</span>
                                    )}
                                    <div>Pre??o: R${lot.vaga_preco}</div>
                                    <button
                                        className="btn btn-primary mt-3"
                                        type="button"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#offcanvasRight"
                                        aria-controls="offcanvasRight"
                                        onClick={() => {
                                            setLotScheduleIndex(lot.vaga_id);
                                        }}
                                    >
                                        Agendar Vaga
                                    </button>
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
                    {loading ? (
                        <Loading />
                    ) : (
                        <>
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
                                    value={lotScheduleDate}
                                    onChange={(e) => {
                                        setLotScheduleDate(e.target.value);
                                    }}
                                    required
                                />
                                <button type="submit" className="btn btn-primary mt-3">
                                    Agendar
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const showPageContent = () => {
        return (
            <>
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

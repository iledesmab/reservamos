import React, { useState } from 'react'
import { URL, API_KEY } from "../config.js";
import axios from 'axios';

export default function Wheatherdisplay() {

    const [nombreCiudad, setNombreCiudad] = useState("");
    const [loading, setLoading] = useState(false);
    const [ciudadNoEncontrada, setCiudadNoEncontrada] = useState(false);
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [weatherDays, setWeatherDays] = useState([]);
    const [chooseDay, setChooseDay] = useState([]);
    const [selectedDay, setSelectedDay] = useState(false);
    const days = [1, 2, 3, 4, 5, 6, 7];


    async function buscarCiudad() {
        setLoading(true);
        const request = await axios.get(`https://search.reservamos.mx/api/v2/places?q=${nombreCiudad}`);
        const ciudadBuscada = request.data.filter(ciudad => ciudad.result_type === "city");
        if (ciudadBuscada.length === 0) {
            setCiudadNoEncontrada(false);
        } else {
            setLon(parseFloat(ciudadBuscada[0].long));
            setLat(parseFloat(ciudadBuscada[0].lat));
            const request = await axios.get(`${URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            setWeatherDays(request.data.daily);
            setCiudadNoEncontrada(true);
        }
        setLoading(false);
    }

    const daySelected = (e) => {
        setChooseDay(weatherDays[e]);
        console.log(chooseDay)
        setSelectedDay(true);
    }



    return (
        <div className="display">
            {
                loading ? <h1>Cargando...</h1> :
                    <>
                        <div className="card form-container">
                            <input
                                placeholder="Nombre de Ciudad"
                                id="city"
                                type="text"
                                className="city-input"
                                value={nombreCiudad}
                                onChange={(e) => {
                                    setNombreCiudad(e.target.value);
                                    setSelectedDay(false);
                                }}>
                            </input>
                            <button className="btn btn-search" onClick={buscarCiudad}>Buscar</button>
                        </div>
                        <br></br>
                        <div className="center">
                            {
                                !ciudadNoEncontrada ? "Favor de escribir una solución válida"
                                    :
                                    <>
                                        <h2>Seleciona un día</h2>
                                        <ul>
                                            {days.map((day, i) => (
                                                <li key={i}>
                                                    <button onClick={(e) => daySelected(e.target.value)} value={i} className="btn btn-day">{day}</button>
                                                </li>
                                            ))}
                                        </ul>
                                        {
                                            selectedDay ? <div className="display-temp">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                Día
                                                            </th>
                                                            <th>
                                                                Tarde
                                                            </th>
                                                            <th>
                                                                Max
                                                            </th>
                                                            <th>
                                                                Min
                                                            </th>
                                                            <th>
                                                                Mañana
                                                            </th>
                                                            <th>
                                                                Noche
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span>{chooseDay.temp.day}</span>
                                                            </td>
                                                            <td>
                                                                <span>{chooseDay.temp.eve}</span>

                                                            </td>
                                                            <td>
                                                                {chooseDay.temp.max}
                                                            </td>
                                                            <td>
                                                                {chooseDay.temp.min}
                                                            </td>
                                                            <td>
                                                                {chooseDay.temp.morn}
                                                            </td>
                                                            <td>
                                                                {chooseDay.temp.night}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div> : <></>
                                        }
                                    </>
                            }


                        </div>
                    </>
            }
        </div >
    )
}

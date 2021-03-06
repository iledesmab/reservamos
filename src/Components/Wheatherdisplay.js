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
    const [humidity, setHumidity] = useState([]);
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
            console.log(request.data.daily);
            const Highesthumidity = humidity
            setCiudadNoEncontrada(true);

        }
        setLoading(false);
    };

    const daySelected = (e) => {
        setChooseDay(weatherDays[e]);
        setSelectedDay(true);
    };

    const searchHighestHum = () => {
        const humidity = {};
        for (let i = 0; i < weatherDays.length; i++) {
            humidity[i] = weatherDays[i].humidity;
            console.log(humidity)
        };
        return humidity;
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
                                !ciudadNoEncontrada ? "Favor de escribir una soluci??n v??lida"
                                    :
                                    <>
                                        <h2>Seleciona un d??a</h2>
                                        <ul>
                                            {days.map((day, i) => (
                                                <li key={i}>
                                                    <button onClick={(e) => daySelected(e.target.value)} value={i} className="btn btn-day">{day}</button>
                                                </li>
                                            ))}
                                        </ul>
                                        <ul>
                                            <button onClick={searchHighestHum}>Humedad</button>
                                        </ul>
                                        {
                                            selectedDay ? <div className="display-temp">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                D??a
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
                                                                Ma??ana
                                                            </th>
                                                            <th>
                                                                Noche
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                {chooseDay.temp.day}
                                                            </td>
                                                            <td>
                                                                {chooseDay.temp.eve}
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
                                                            <td>
                                                                { }
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

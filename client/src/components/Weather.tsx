import React, { useState, useEffect } from "react";
import "./Weather.css";

interface Weather {
  city: string;
  weather: string;
  temp: string;
}

function Weather() {
  const FREE_API_KEY = "6f0397ab75a1de8483690250196f61fd";

  const [weather, setWeather] = useState<Weather>({
    city: "",
    weather: "",
    temp: "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
  }, []);

  const onGeoOk = (position: GeolocationPosition) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const option = "units=metric";
    const url = `./weather?lat=${lat}&lon=${lng}&appid=${FREE_API_KEY}&${option}`;
    getWeather(url);
  };

  const onGeoError = () => {
    const option = "units=metric";
    const url = `./weather?q=Seoul,kr&APPID=${FREE_API_KEY}&${option}`;
    getWeather(url);
  };

  const getWeather = async (url: string) => {
    const response = await (await fetch(url)).json();
    setWeather({
      city: response.name,
      weather: response.weather[0].main,
      temp: `${String(Math.round(response.main.temp * 10) / 10)}°C`,
    });
  };

  return (
    <div className="Weather">
      <span>{`${weather.weather} `}</span>
      <span>{`${weather.temp} `}</span>
      <span>{weather.city}</span>
    </div>
  );
}

export default Weather;

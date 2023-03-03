import React, { useEffect, useState } from "react";
import "./Clock.css";

export default function Clock() {
  const [clock, setClock] = useState("00:00");

  const SetTime = () => {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    setClock(`${hours}:${minutes}`);
  };

  useEffect(() => {
    SetTime();
    setInterval(SetTime, 1000);
  }, []);

  return <h2 className="Clock">{clock}</h2>;
}

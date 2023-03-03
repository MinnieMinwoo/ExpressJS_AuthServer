import React, { useEffect, useState } from "react";
import "./Favorite.css";

function Favorite() {
  const [favorite, SetFavorite] = useState("");

  useEffect(() => {
    getFavorite();
  }, []);

  const getFavorite = async () => {
    const url = "./advice";
    const request = new Request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await (await fetch(request)).json();
    SetFavorite(result.slip.advice);
  };

  return (
    <div className="Favorite">
      <p>{favorite}</p>
    </div>
  );
}

export default Favorite;

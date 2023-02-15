import React, { useEffect, useState } from "react";
import Auth from "./Auth";

function App() {
  const [islogin, setIsLogin] = useState("false");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("./api")
      .then(async (response) => {
        console.log(response);
        const body = await response.json();
        console.log(body);
      })
      .catch((err) => console.log(err));
  });
  return (
    <div className="App">
      <Auth />
    </div>
  );
}

export default App;

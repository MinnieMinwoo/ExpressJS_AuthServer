import React, { useEffect, useState } from "react";
import Auth from "./Auth";

function App() {
  const [islogin, setIsLogin] = useState("false");
  const [email, setEmail] = useState("");

  return (
    <div className="App">
      <Auth />
    </div>
  );
}

export default App;

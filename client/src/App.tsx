import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("./api")
      .then(async (response) => {
        console.log(response);
        const body = await response.json();
        console.log(body);
      })
      .catch((err) => console.log(err));
  });
  return <div className="App">test</div>;
}

export default App;

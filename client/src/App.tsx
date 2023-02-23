import React, { useEffect, useState } from "react";
import { Token } from "./Token";
import Auth from "./Auth";
import Clock from "./Clock";

function App() {
  const [accessToken, setAccessToken] = useState<Token>(new Token(""));

  useEffect(() => {
    onRefreshToken();
  }, []);

  const onToDoSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    const url = "./api/submit/add";
    const request = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.get()}`,
      },
      body: JSON.stringify({
        data: "test123",
      }),
    });
    try {
      const result = await fetch(request);
      console.log(result);
    } catch (error) {
      if (!(error instanceof Error)) return;
      if (error.message === "No AccessToken" || error.message === "Invalid Token") {
      }
    }
  };

  const onRefreshToken = async (event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    const url = "./api/token";
    const request = new Request(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    try {
      const { accessToken } = (await (await fetch(request)).json()) as { accessToken: string };
      setAccessToken(new Token(accessToken));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <Clock />
      <Auth isToken={!!accessToken.get()} setToken={setAccessToken} />
      <section>
        <h1 hidden={!accessToken.get()}>Hello</h1>
        <form>
          <input type="text" placeholder="Write a To Do and press Enter" />
          <button onClick={onToDoSubmit}>Submit Test</button>
          <button onClick={onRefreshToken}>Refresh Test</button>
        </form>
      </section>
      <main>
        <div></div>
        <div></div>
      </main>
      <ul></ul>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Token } from "./Token";
import Auth from "./Auth";
import Clock from "./Clock";
import SetToDo from "./components/SetToDo";
import ToDoList from "./components/ToDoList";

interface ToDo {
  content: string;
  id: string;
}

function App() {
  const [accessToken, setAccessToken] = useState<Token>(new Token(""));
  const [list, setList] = useState<ToDo[]>([]);

  useEffect(() => {
    onRefreshToken();
  }, []);

  const onRefreshToken = async () => {
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
        <SetToDo accessToken={accessToken} refreshToken={onRefreshToken} setList={setList} />
      </section>
      <main>
        <div></div>
        <div></div>
      </main>
      <ToDoList accessToken={accessToken} list={list} setList={setList} />
    </div>
  );
}

export default App;

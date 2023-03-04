import React, { useEffect, useState } from "react";
import { Token } from "./Token";
import Auth from "./components/Auth";
import Clock from "./components/Clock";
import UserInfo from "./components/UserInfo";
import SetToDo from "./components/SetToDo";
import ToDoList from "./components/ToDoList";
import Favorite from "./components/Favorite";
import Weather from "./components/Weather";
import "./App.css";

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
        <div hidden={!accessToken.get()}>
          <UserInfo accessToken={accessToken} setAccessToken={setAccessToken} />
        </div>
        <SetToDo
          isHidden={!accessToken.get()}
          accessToken={accessToken}
          refreshToken={onRefreshToken}
          setList={setList}
        />
      </section>
      <main>
        <Favorite />
        <Weather />
      </main>
      <ToDoList accessToken={accessToken} list={list} setList={setList} />
    </div>
  );
}

export default App;

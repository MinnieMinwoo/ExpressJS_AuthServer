import React, { useState } from "react";
import { Token } from "../Token";
import "./SetToDo.css";

interface ToDo {
  content: string;
  id: string;
}

interface Props {
  isHidden: boolean;
  accessToken: Token;
  refreshToken: () => Promise<void>;
  setList: React.Dispatch<React.SetStateAction<ToDo[]>>;
}

function SetToDo({ isHidden, accessToken, refreshToken, setList }: Props) {
  const [value, setValue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };

  const onToDoSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (value === "") return;
    const url = "./api/todo";
    const request = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.get()}`,
      },
      body: JSON.stringify({
        data: value,
      }),
    });
    try {
      const todoData = (await (await fetch(request)).json()) as ToDo;
      setList((prev) => [...prev, todoData]);
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.log(error);
      if (error.message === "No AccessToken" || error.message === "Invalid Token") {
        try {
          await refreshToken();
          onToDoSubmit(event);
        } catch {
          console.log(error);
        }
      }
    } finally {
      setValue("");
    }
  };

  return (
    <form className="SetToDo" hidden={isHidden}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        maxLength={100}
        placeholder="Write a To Do and press Enter"
        required
      />
      <button onClick={onToDoSubmit}>Submit Test</button>
    </form>
  );
}

export default SetToDo;

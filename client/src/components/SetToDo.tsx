import React, { useState } from "react";
import { Token } from "../Token";

interface Props {
  accessToken: Token;
  refreshToken: () => Promise<void>;
}

function SetToDo({ accessToken, refreshToken }: Props) {
  const [value, setValue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };

  const onToDoSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
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
      const result = await fetch(request);
      console.log(result);
    } catch (error) {
      if (!(error instanceof Error)) return;
      if (error.message === "No AccessToken" || error.message === "Invalid Token") {
        try {
          await refreshToken();
          onToDoSubmit(event);
        } catch {
          console.log(error);
        }
      }
      console.log(error);
    }
  };

  return (
    <form>
      <input
        type="text"
        value={value}
        onChange={onChange}
        maxLength={100}
        placeholder="Write a To Do and press Enter"
      />
      <button onClick={onToDoSubmit}>Submit Test</button>
    </form>
  );
}

export default SetToDo;

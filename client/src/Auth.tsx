import React, { useState, useEffect } from "react";
import { Token } from "./Token";

interface Props {
  isToken: boolean;
  setToken: React.Dispatch<React.SetStateAction<Token>>;
}
export default function Auth({ isToken, setToken }: Props) {
  const [toggle, setToggle] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onClick = () => {
    setToggle((prev) => !prev);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = toggle ? "./api/signin" : "./api/signup";
    const request = new Request(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const { accessToken } = (await (await fetch(request)).json()) as { accessToken: string };
    setToken(new Token(accessToken));
  };

  return (
    <div hidden={isToken}>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          required
          placeholder="email"
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          required
          placeholder="password"
          autoComplete="off"
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={toggle ? "Sign In" : "Sign Up"} />
      </form>
      <button onClick={onClick}>{toggle ? "Sign Up" : "Sign In"}</button>
    </div>
  );
}

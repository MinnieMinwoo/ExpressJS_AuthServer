import React from "react";
import { Token } from "../Token";
import "./UserInfo.css";

interface Props {
  accessToken: Token;
  setAccessToken: React.Dispatch<React.SetStateAction<Token>>;
}

function SetNickName({ accessToken, setAccessToken }: Props) {
  const onClick = () => {
    setAccessToken(new Token(""));
  };

  return (
    <div className="SetNickName">
      <h1>Hello</h1>
      <button onClick={onClick}>logout</button>
    </div>
  );
}

export default SetNickName;

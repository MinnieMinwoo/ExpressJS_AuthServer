import React from "react";

const Auth = () => {
  const onSignUp = async () => {
    const email = "test123@testmail.com";
    const password = "test1234test1234test1234!";
    const request = new Request("./api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const result = (await (await fetch(request)).json()) as any;
    const { accessToken, refreshToken } = result;
    document.cookie = `accessToken=${accessToken}; httpOnly`;
    document.cookie = `refreshToken=${refreshToken}; httpOnly`;
  };

  const onLogin = () => {
    const email = "test123@testmail.com";
    const password = "test1234test1234test1234!";
  };

  return (
    <div>
      <button onClick={onSignUp}>Submit Test</button>
      <button onClick={onLogin}>Login Test</button>
    </div>
  );
};

export default Auth;

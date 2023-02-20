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
    console.log(result);
  };

  const onLogin = async () => {
    const email = "test123@testmail.com";
    const password = "test1234test1234test1234!";
    const request = new Request("./api/signin", {
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
    console.log(result);
  };

  const onRequest = async () => {
    const request = new Request("./api/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: "example",
      }),
    });
    console.log(request);
    const result = await fetch(request);
    console.log(result);
  };
  return (
    <div>
      <button onClick={onSignUp}>Submit Test</button>
      <button onClick={onLogin}>Login Test</button>
      <button onClick={onRequest}>Request Test</button>
    </div>
  );
};

export default Auth;

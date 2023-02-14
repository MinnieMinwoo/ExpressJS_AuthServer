import React from "react";

const Auth = () => {
  const onSubmit = async () => {
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
    const result = await fetch(request);
    console.log(result.json());
  };
  return (
    <div>
      <button onClick={onSubmit}>Submit Test</button>
    </div>
  );
};

export default Auth;

import * as dotenv from "dotenv";
import { randomBytes, pbkdf2 } from "crypto";
import express from "express";
import psql from "../psql";
import jwt, { Secret } from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config();
const router = express.Router();
router.use(express.json());
router.use(cookieParser());

interface UserData {
  email: string;
  password: string;
}

interface ExistUserData extends UserData {
  salt: string;
}

interface Token {
  user_id: string;
}
router.post("/signup", async (req, res) => {
  const { body } = req;

  if (!(body as UserData)?.email || !(body as UserData)?.password) {
    res.status(400).send({ message: "Invalid user data" });
    return;
  }

  const userData = body as UserData;

  const regExpEm =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  if (!regExpEm.test(body.email)) {
    res.status(400).send({ message: "Incorrect email" });
    return;
  }
  const regExpPw = /(?=.*\d{1,32})(?=.*[~`!@#$%\^&*()-+=]{1,32})(?=.*[a-zA-Z]{1,32}).{8,32}$/;
  if (!regExpPw.test(body.password)) {
    res.status(400).send({ message: "Incorrect password rule" });
    return;
  }

  const salt = randomBytes(32).toString("base64");
  pbkdf2(userData.password, salt, 445, 32, "sha512", async (err, key) => {
    const hashPassword = key.toString("base64");
    const query = `INSERT INTO userAccount (email, password, salt) VALUES ('${userData.email}', '${hashPassword}', '${salt}');`;
    try {
      await psql.query(query);
      const accessToken = jwt.sign(
        {
          user_id: userData.email,
        },
        process.env.AUTH_ACCESS_TOKEN as Secret,
        {
          expiresIn: "30m",
        }
      );
      const refreshToken = jwt.sign(
        {
          user_id: userData.email,
        },
        process.env.AUTH_REFRESH_TOKEN as Secret,
        {
          expiresIn: "7 days",
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      res.json({ accessToken });
    } catch (err) {
      console.log(err);
      if (
        (err as Error)?.message ===
        `duplicate key value violates unique constraint "useraccount_un"`
      ) {
        res.status(400).send({ message: "Duplicated email" });
      } else {
        res.status(502).send({ message: "DB server error" });
      }
    }
  });
});

router.post("/signin", async (req, res) => {
  console.log("signin request");
  const { body } = req;

  if (!(body as UserData)?.email || !(body as UserData)?.password) {
    res.status(400).send({ message: "Invalid user data" });
    return;
  }

  const userData = body as UserData;
  const queryExistData = `SELECT * FROM userAccount where email='${userData.email}'`;
  const { password, salt } = (await psql.query(queryExistData)).rows[0] as any as ExistUserData;
  pbkdf2(userData.password, salt, 445, 32, "sha512", async (err, key) => {
    const hashPassword = key.toString("base64");
    if (hashPassword === password) {
      const accessToken = jwt.sign(
        {
          user_id: userData.email,
        },
        process.env.AUTH_ACCESS_TOKEN as Secret,
        {
          expiresIn: "24h",
        }
      );
      const refreshToken = jwt.sign(
        {
          user_id: userData.email,
        },
        process.env.AUTH_REFRESH_TOKEN as Secret,
        {
          expiresIn: "180 days",
        }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      res.json({ accessToken });
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  });
});

router.get("/token", async (req, res) => {
  console.log("token request");
  const token = req.cookies.refreshToken;
  try {
    const decoded = jwt.verify(token, process.env.AUTH_REFRESH_TOKEN as Secret) as Token;
    const email = decoded.user_id;
    const queryExistData = `SELECT * FROM userAccount where email='${email}'`;
    //TODO: Email verification
    const accessToken = jwt.sign(
      {
        user_id: email,
      },
      process.env.AUTH_ACCESS_TOKEN as Secret,
      {
        expiresIn: "30m",
      }
    );
    res.json({ accessToken });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Invalid Token" });
  }
});

router.get("/todo", async (req, res) => {
  console.log("todo get request");
  let token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    res.status(401).send({ message: "No AccessToken" });
    return;
  }
  token = token.replace(/^Bearer\s+/, "");
  try {
    const decoded = jwt.verify(token, process.env.AUTH_ACCESS_TOKEN as Secret) as Token;
    const email = decoded.user_id;
    const query = `SELECT * FROM todoList where createby='${email}';`;
    const result = await psql.query(query);
    res.json({ todoList: result.rows });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Invalid Token" });
  }
});

router.post("/todo", async (req, res) => {
  console.log("todo post request");
  let token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    res.status(401).send({ message: "No AccessToken" });
    return;
  }
  token = token.replace(/^Bearer\s+/, "");
  try {
    const decoded = jwt.verify(token, process.env.AUTH_ACCESS_TOKEN as Secret) as Token;
    const email = decoded.user_id;
    const query = `INSERT INTO todoList (createby, content) VALUES ('${email}', '${req.body.data}');`;
    await psql.query(query);
    const idQuery = `SELECT * FROM todoList WHERE createby = '${email}' AND content='${req.body.data}';`;
    const result = (await psql.query(idQuery)).rows;
    res.json(result[result.length - 1]);
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Invalid Token" });
  }
});

router.delete("/todo", async (req, res) => {
  console.log("todo delete request");
  let token = req.headers.authorization;
  if (!token || typeof token !== "string") {
    res.status(401).send({ message: "No AccessToken" });
    return;
  }
  token = token.replace(/^Bearer\s+/, "");
  try {
    const decoded = jwt.verify(token, process.env.AUTH_ACCESS_TOKEN as Secret) as Token;
    const email = decoded.user_id;
    const query = `DELETE FROM todoList WHERE createby = '${email}' AND id='${req.body.todoID}';`;
    await psql.query(query);
    res.status(200).send({ message: "DELETE Complete" });
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Invalid Token or Invalid Data" });
  }
});

export default router;

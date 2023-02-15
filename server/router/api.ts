import { randomBytes, pbkdf2 } from "crypto";
import express from "express";
import psql from "../psql";
import jwt, { Secret } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const router = express.Router();
router.use(express.json());

type UserData = {
  email: string;
  password: string;
};

router.get("/", (req, res) => {
  console.log("get request");
  res.send({ test: "hi" });
});

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
    const query = `INSERT INTO userAccount VALUES ('${userData.email}', '${hashPassword}', '${salt}');`;
    try {
      await psql.query(query);
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
        process.env.AUTH_ACCESS_TOKEN as Secret,
        {
          expiresIn: "180 days",
        }
      );
      res.json({ accessToken, refreshToken });
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

export default router;

//회원가입 테스트: http://localhost:3001/api/signup\?email\=test123@testmail.com\&password\=123124098234

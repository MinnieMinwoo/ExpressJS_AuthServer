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
      psql.query(query);
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
  console.log(salt);
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
      res.cookie("accessToken", refreshToken, {
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });
      res.json({ accessToken, refreshToken });
    } else {
      res.status(400).send({ message: "Incorrect password" });
    }
  });
});

router.post("/request", async (req, res) => {
  console.log(req.cookies);
});

export default router;

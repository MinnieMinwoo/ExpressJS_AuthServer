import express from "express";
import router from "./router/api";

const app = express();

app.use("/api", router);

const port = 3001;
app.listen(port, () => console.log(`${port}`));

import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.use(router);

app.listen(4000, () => {
  console.log("Listening on 4000");
});

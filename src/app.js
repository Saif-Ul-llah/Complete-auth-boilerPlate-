const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { SlashReq } = require("./utils/SlashRequest");
const errorMiddleware = require("./middlewares/errorMiddleware");
const Routes = require("./routes/v1");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());;

/* ====== Slash Request ====== */
app.get("/", SlashReq);


/* ====== API Routes ====== */
app.use("/api", Routes);

/* ====== Not Found Routes ====== */
app.get("*", (req, res) => {
  return res.status(404).json({
    status: "failed",
    message: `Route ${req.originalUrl} not found.`,
    data: [],
  });
});

app.use(errorMiddleware);

module.exports = app;

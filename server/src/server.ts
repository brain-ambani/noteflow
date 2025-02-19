import express from "express";
import notesRouter from "./routes/notes.route";
import authRouter from "./routes/auth.route";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

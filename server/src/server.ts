import express from "express";
import notesRouter from "./routes/notesRoute";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";

require("dotenv").config();
const app = express();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" })); // Allow frontend requests

const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use("/api/v1/notes", notesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

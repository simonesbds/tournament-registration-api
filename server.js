import express from "express";
import { connectDB } from "./config/db.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Tournament Registration");
});

app.use("/api/tournaments", tournamentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
});

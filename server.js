import express from "express";
import { connectDB } from "./config/db.js";
import tournamentRoutes from "./routes/tournamentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Tournament Registration");
});

app.use("/api/tournaments", tournamentRoutes);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
});

import express from "express";
import {
  getTournaments,
  getTournamentById,
  createTournament,
} from "../controllers/tournamentController.js";

const router = express.Router();

router.get("/", getTournaments);
router.get("/:id", getTournamentById);
router.post("/", createTournament);

export default router;
